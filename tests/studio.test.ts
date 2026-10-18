import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {Studio} from '../tools/studio/engine.js';
import {EXAMPLES} from '../tools/studio/examples.js';
import {validatePlan,validateReport,readiness,type Report,type Job} from '../tools/studio/contracts.js';
import {createStudioServer} from '../tools/studio/server.js';
import {createReviewPacket,createWorkPacket} from '../tools/studio/handoff.js';
import {CONTENT_ENTRIES} from '../content/catalog.js';
import {EXPLOSION_EPISODE} from '../content/formal-logic/explosion/episode.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const report:Report={summary:'Test runner report, not an actual editorial review',findings:[],timing:{status:'unverified',note:'Test fixture; no timing evidence'}};
const provenance={reviewer:{name:'Fixture reviewer',kind:'external-agent' as const,tool:'controlled-test'},evidence:{reviewedAt:'2026-10-18T00:00:00Z',notes:'Protocol fixture only; no independent review occurred',artifactRefs:['fixture://studio.test']}};

test('content metadata migrates legacy plans without discarding edits and invalidates review revisions',()=>{
  const legacy:Record<string,unknown>={...structuredClone(EXAMPLES[0])};delete legacy.metadata;legacy.title='Human edited title';legacy.totalSeconds=900;
  const migrated=validatePlan(legacy);assert.equal(migrated.title,'Human edited title');assert.equal(migrated.metadata.format,'long');
  assert.equal(validatePlan({...legacy,goal:'A'.repeat(500)}).metadata.inScope[0].length,500);
  assert.throws(()=>validatePlan({...legacy,metadata:{format:'unknown'}}));
  const edited=structuredClone(migrated);edited.metadata.depth='deep';edited.metadata.purpose='practice';edited.metadata.topics=['Relations'];edited.metadata.outOfScope=['Set-theoretic foundations'];
  assert.deepEqual(validatePlan(edited).metadata,edited.metadata);
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-metadata-')),studio=new Studio(root,dir);
  try{const before=studio.topic('binary-relations');const next=structuredClone(before.plan);next.metadata=edited.metadata;const saved=studio.save(next,before.revision);assert.notEqual(saved.revision,before.revision);assert.equal(saved.plan.metadata.depth,'deep');}finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('video budgets are shared by format, ignore per-content overrides, persist and invalidate only affected format reviews',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-video-budget-')),studio=new Studio(root,dir);
 try{assert.deepEqual(studio.budgets(),{short:180,long:900});assert.ok(studio.list().every(t=>t.plan.totalSeconds===180));
  const original=studio.topic('monty-hall'),plan=structuredClone(original.plan);plan.metadata.format='long';plan.totalSeconds=7;const saved=studio.save(plan,original.revision);assert.equal(saved.plan.totalSeconds,900);
  const short=studio.topic('two-children'),revision=studio.budgetRevision();studio.setBudgets({short:180,long:1200},revision);assert.equal(studio.topic('two-children').revision,short.revision);assert.notEqual(studio.topic('monty-hall').revision,saved.revision);
  assert.throws(()=>studio.setBudgets({short:60,long:600},revision),/Conflict/);assert.throws(()=>studio.setBudgets({short:-1,long:900},studio.budgetRevision()));
  const copy={...studio.topic('two-children').plan,id:'another-observation',title:'Copied draft'};assert.equal(studio.create(copy).plan.totalSeconds,180);assert.throws(()=>studio.create(copy),/exists/);
  assert.throws(()=>studio.create({...copy,id:'unsupported-2'}),/소문자/);assert.throws(()=>validatePlan({...copy,domain:'1-invalid-domain'}),/domain/);
  studio.dispose();const restored=new Studio(root,dir);assert.deepEqual(restored.budgets(),{short:180,long:1200});assert.equal(restored.topic('another-observation').plan.title,'Copied draft');restored.dispose();
 }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('content creation counts the unique union of registered entries and private plans',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-content-limit-')),studio=new Studio(root,dir);
 try{
  const registered=CONTENT_ENTRIES.find(entry=>!EXAMPLES.some(plan=>plan.id===entry.page.slug));assert.ok(registered);
  const template=studio.topic('two-children').plan;
  assert.throws(()=>studio.create({...template,id:registered.page.slug,title:'Registered duplicate'}),/exists/);
  let created=0;
  for(let index=0;index<100;index++){
   const suffix='a'.repeat(Math.floor(index/26)+1)+String.fromCharCode(97+index%26);
   try{studio.create({...template,id:`private-${suffix}`,title:`Private ${suffix}`});created++;}catch(error){assert.match(error instanceof Error?error.message:String(error),/limit/);break;}
  }
  const registeredIds=new Set([...CONTENT_ENTRIES.map(entry=>entry.page.slug),EXPLOSION_EPISODE.id]);
  assert.equal(new Set([...registeredIds,...studio.list().map(topic=>topic.plan.id)]).size,100);
  assert.ok(created>0);
 }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('long-form plans export every review target without a runtime queue ceiling',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-long-plan-')),studio=new Studio(root,dir);
 try{const before=studio.topic('binary-relations'),plan=structuredClone(before.plan);plan.totalSeconds=9000;plan.metadata.format='long';plan.slides=Array.from({length:110},(_,i)=>({...plan.slides[0],id:'section-'+i}));studio.save(plan,before.revision);assert.equal(createReviewPacket(studio.topic(plan.id)).targets.length,111);assert.equal(studio.topic(plan.id).gate.ready,false);}finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('studio gate requires every current slide and whole-flow review, and unresolved feedback blocks it',()=>{
  const plan=EXAMPLES[0],jobs:Job[]=['overall',...plan.slides.map(s=>s.id)].map(target=>({id:target,topicId:plan.id,target,revision:'current',status:'completed',createdAt:'test',report}));
  assert.equal(readiness(plan,'current',jobs,[]).ready,true);assert.equal(readiness(plan,'changed',jobs,[]).ready,false);
  assert.equal(readiness(plan,'current',jobs.slice(1),[]).ready,false);
  assert.equal(readiness(plan,'current',jobs,[{id:'note',slideId:'question',text:'Unresolved',resolved:false,revision:'current'}]).ready,false);
  assert.equal(readiness({...plan,totalSeconds:1},'current',jobs,[]).ready,false);
  assert.throws(()=>validatePlan({...plan,slides:[{...plan.slides[0],seconds:NaN}]}));assert.throws(()=>validatePlan({...plan,policies:['core','private-topic-policy']}));
  assert.throws(()=>validatePlan({...plan,slides:[{...plan.slides[0],seconds:true}]}));
  assert.throws(()=>validatePlan({...plan,sources:[{...plan.sources[0],url:'https://'}]}));
  assert.throws(()=>validateReport({...report,findings:[{slideId:'absent',criterion:'test',severity:'blocker',evidence:'test',suggestion:'test'}]},plan));
  assert.equal(validateReport({...report,findings:[{slideId:'overall',criterion:'flow',severity:'warning',evidence:'Cross-slide issue',suggestion:'Adjust flow'}]},plan).findings[0].slideId,'overall');
});

test('external handoff packets bind work and independent review results to the saved revision',()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-handoff-')),studio=new Studio(root,dir);
  try{
    const topic=studio.topic('binary-relations');
    const work=createWorkPacket(topic,{directory:'/tmp/atlas-worktree',branch:'studio/binary-relations',route:'/knowledge/binary-relations/'});
    assert.equal(work.kind,'implementation');assert.equal(work.revision,topic.revision);assert.equal(work.workspace.directory,'/tmp/atlas-worktree');
    const review=createReviewPacket(topic);assert.equal(review.kind,'independent-review');assert.deepEqual(review.targets,['overall',...topic.plan.slides.map(slide=>slide.id)]);
    const reports=review.targets.map(target=>({target,report}));
    const result={protocol:review.protocol,topicId:topic.plan.id,revision:topic.revision,...provenance,reports};studio.importReviews(result);
    const imported=studio.topic(topic.plan.id);assert.equal(imported.gate.ready,true);assert.equal(imported.jobs[0].provenance?.origin,'user-supplied-import');assert.equal(imported.jobs[0].provenance?.reviewer.name,'Fixture reviewer');
    assert.throws(()=>studio.importReviews({...result,reviewer:undefined}),/object/i);
    assert.throws(()=>studio.importReviews({...result,revision:'stale'}),/revision/i);
    assert.throws(()=>studio.importReviews({...result,reports:reports.slice(1)}),/target/i);
  }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('failed review persistence cannot change live jobs or readiness',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-review-atomic-')),studio=new Studio(root,dir);
 try{
  const topic=studio.topic('binary-relations'),packet=createReviewPacket(topic),reports=packet.targets.map(target=>({target,report})),before=studio.topic(topic.plan.id);rmSync(dir,{recursive:true,force:true});writeFileSync(dir,'block persistence');
  assert.throws(()=>studio.importReviews({protocol:packet.protocol,topicId:topic.plan.id,revision:topic.revision,...provenance,reports}));const after=studio.topic(topic.plan.id);assert.deepEqual(after.jobs,before.jobs);assert.deepEqual(after.gate,before.gate);
 }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('studio persists edits, imported review history and feedback',()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-studio-')),studio=new Studio(root,dir);
  try{
    const before=studio.topic('binary-relations'),edited=structuredClone(before.plan);edited.slides[0].narration='Changed manuscript';studio.save(edited,before.revision);
    assert.throws(()=>studio.save(edited,before.revision),/Conflict/);
    studio.feedback('monty-hall','question','User feedback');studio.dispose();
    const restored=new Studio(root,dir);assert.equal(restored.topic('binary-relations').plan.slides[0].narration,'Changed manuscript');assert.equal(restored.topic('monty-hall').feedback[0].text,'User feedback');restored.dispose();
    assert.ok(readFileSync(path.join(dir,'state.json'),'utf8').includes('Changed manuscript'));
  }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('studio HTTP API rejects cross-origin writes, malformed plans and stale edits',async()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-studio-')),studio=new Studio(root,dir),server=createStudioServer(studio);
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  try{const before=studio.topic('two-children');
    const send=(body:unknown,origin=url)=>fetch(url+'/api/save',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
    assert.equal((await send({plan:before.plan,revision:before.revision},'http://foreign.invalid')).status,403);
    assert.equal((await send({plan:{id:'../../outside'},revision:before.revision})).status,400);
    assert.equal((await send({plan:before.plan,revision:'stale'})).status,409);
    assert.equal((await send({plan:before.plan,revision:before.revision})).status,200);
    assert.equal((await fetch(url+'/tools/studio/engine.ts')).status,404);
    assert.equal((await fetch(url+'/api/chats')).status,404);
    assert.equal((await fetch(url+'/api/chat-send',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,404);
  }finally{studio.dispose();await new Promise<void>(resolve=>server.close(()=>resolve()));rmSync(dir,{recursive:true,force:true});}
});
