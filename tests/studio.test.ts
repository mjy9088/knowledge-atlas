import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {Studio,type Reviewer} from '../tools/studio/engine.js';
import {EXAMPLES} from '../tools/studio/examples.js';
import {validatePlan,validateReport,readiness,type Report,type Job} from '../tools/studio/contracts.js';
import {createStudioServer} from '../tools/studio/server.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const report:Report={summary:'Test runner report, not an actual editorial review',findings:[],timing:{status:'unverified',note:'Test fixture; no timing evidence'}};
async function until(check:()=>boolean){for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,10));}throw Error('Timed out');}

test('content metadata migrates legacy plans without discarding edits and invalidates review revisions',()=>{
  const legacy:Record<string,unknown>={...structuredClone(EXAMPLES[0])};delete legacy.metadata;legacy.title='Human edited title';legacy.totalSeconds=900;
  const migrated=validatePlan(legacy);assert.equal(migrated.title,'Human edited title');assert.equal(migrated.metadata.format,'long');
  assert.equal(validatePlan({...legacy,goal:'A'.repeat(500)}).metadata.inScope[0].length,500);
  assert.throws(()=>validatePlan({...legacy,metadata:{format:'unknown'}}));
  const edited=structuredClone(migrated);edited.metadata.depth='deep';edited.metadata.purpose='practice';edited.metadata.topics=['Relations'];edited.metadata.outOfScope=['Set-theoretic foundations'];
  assert.deepEqual(validatePlan(edited).metadata,edited.metadata);
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-metadata-')),studio=new Studio(root,dir,async()=>report);
  try{const before=studio.topic('binary-relations');const next=structuredClone(before.plan);next.metadata=edited.metadata;const saved=studio.save(next,before.revision);assert.notEqual(saved.revision,before.revision);assert.equal(saved.plan.metadata.depth,'deep');}finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('video budgets are shared by format, ignore per-content overrides, persist and invalidate only affected format reviews',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-video-budget-')),studio=new Studio(root,dir,async()=>report);
 try{assert.deepEqual(studio.budgets(),{short:180,long:900});assert.ok(studio.list().every(t=>t.plan.totalSeconds===180));
  const original=studio.topic('monty-hall'),plan=structuredClone(original.plan);plan.metadata.format='long';plan.totalSeconds=7;const saved=studio.save(plan,original.revision);assert.equal(saved.plan.totalSeconds,900);
  const short=studio.topic('two-children'),revision=studio.budgetRevision();studio.setBudgets({short:180,long:1200},revision);assert.equal(studio.topic('two-children').revision,short.revision);assert.notEqual(studio.topic('monty-hall').revision,saved.revision);
  assert.throws(()=>studio.setBudgets({short:60,long:600},revision),/Conflict/);assert.throws(()=>studio.setBudgets({short:-1,long:900},studio.budgetRevision()));
  const copy={...studio.topic('two-children').plan,id:'another-observation',title:'Copied draft'};assert.equal(studio.create(copy).plan.totalSeconds,180);assert.throws(()=>studio.create(copy),/exists/);
  studio.dispose();const restored=new Studio(root,dir,async()=>report);assert.deepEqual(restored.budgets(),{short:180,long:1200});assert.equal(restored.topic('another-observation').plan.title,'Copied draft');restored.dispose();
 }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('long-form plans can request all slide reviews without the short queue ceiling',async()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-long-plan-')),studio=new Studio(root,dir,({signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('test cancellation')))));
 try{const before=studio.topic('binary-relations'),plan=structuredClone(before.plan);plan.totalSeconds=9000;plan.metadata.format='long';plan.slides=Array.from({length:110},(_,i)=>({...plan.slides[0],id:'section-'+i}));studio.save(plan,before.revision);assert.equal(studio.queue(plan.id,'all').length,111);assert.equal(studio.topic(plan.id).gate.ready,false);}finally{studio.dispose();await until(()=>!studio.list().some(t=>t.jobs.some(j=>j.status==='running')));rmSync(dir,{recursive:true,force:true});}
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

test('studio queues independent immutable jobs across topics, bounds concurrency and persists edits/history',async()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-studio-')),pending:Array<{resolve:(r:Report)=>void;prompt:string}>=[];let running=0,peak=0;
  const reviewer:Reviewer=({prompt})=>new Promise(resolve=>{running++;peak=Math.max(peak,running);pending.push({prompt,resolve:r=>{running--;resolve(r);}});});
  const studio=new Studio(root,dir,reviewer,2);
  try{
    studio.queue('binary-relations','question');studio.queue('monty-hall','overall');studio.queue('two-children','question');assert.equal(peak,2);
    const before=studio.topic('binary-relations'),edited=structuredClone(before.plan);edited.slides[0].narration='Changed manuscript';studio.save(edited,before.revision);
    assert.throws(()=>studio.save(edited,before.revision),/Conflict/);assert.ok(!pending[0].prompt.includes('Changed manuscript'));
    pending[0].resolve(report);await until(()=>pending.length===3);pending[1].resolve(report);pending[2].resolve(report);await until(()=>studio.list().flatMap(t=>t.jobs).every(j=>j.status==='completed'));
    assert.equal(studio.topic('binary-relations').gate.ready,false);assert.equal(peak,2);
    studio.feedback('monty-hall','question','User feedback');studio.dispose();
    const restored=new Studio(root,dir,async()=>report);assert.equal(restored.topic('binary-relations').plan.slides[0].narration,'Changed manuscript');assert.equal(restored.topic('monty-hall').feedback[0].text,'User feedback');restored.dispose();
    assert.ok(readFileSync(path.join(dir,'state.json'),'utf8').includes('Changed manuscript'));
  }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('failed and cancelled reviewers never become completed evidence; restarting does not replay pending jobs',async()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-studio-'));const reviewer:Reviewer=({signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('cancelled'))));
  const studio=new Studio(root,dir,reviewer,1);
  try{studio.queue('two-children','all');const t=studio.topic('two-children');studio.cancel(t.jobs[0].id);await until(()=>studio.topic('two-children').jobs[1].status==='running');studio.dispose();await until(()=>!studio.topic('two-children').jobs.some(j=>j.status==='running'));
    const restored=new Studio(root,dir,async()=>{throw Error('must not automatically run');});assert.ok(!restored.topic('two-children').jobs.some(j=>['queued','running'].includes(j.status)));assert.equal(restored.topic('two-children').gate.ready,false);restored.dispose();
  }finally{studio.dispose();rmSync(dir,{recursive:true,force:true});}
});

test('studio HTTP API rejects cross-origin writes, malformed plans and stale edits',async()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-studio-')),studio=new Studio(root,dir,async()=>report),server=createStudioServer(studio);
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  try{const before=studio.topic('two-children');
    const send=(body:unknown,origin=url)=>fetch(url+'/api/save',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
    assert.equal((await send({plan:before.plan,revision:before.revision},'http://foreign.invalid')).status,403);
    assert.equal((await send({plan:{id:'../../outside'},revision:before.revision})).status,400);
    assert.equal((await send({plan:before.plan,revision:'stale'})).status,409);
    assert.equal((await send({plan:before.plan,revision:before.revision})).status,200);
    assert.equal((await fetch(url+'/tools/studio/engine.ts')).status,404);
  }finally{studio.dispose();await new Promise<void>(resolve=>server.close(()=>resolve()));rmSync(dir,{recursive:true,force:true});}
});
