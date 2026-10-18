import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Production} from '../tools/studio/production.js';
import {EXAMPLES} from '../tools/studio/examples.js';
import {createWorkPacket} from '../tools/studio/handoff.js';
import {pathToFileURL} from 'node:url';

async function settled(p:Production){for(let i=0;i<200;i++){if(!p.list().some(w=>w.tasks.some(t=>t.status==='running')))return;await new Promise(r=>setTimeout(r,10));}throw Error('Timeout');}
test('isolated production preserves edited sources, snapshots successful output, rejects overlaps and retains prior build after failure',async()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'atlas-production-')),data=path.join(root,'artifacts/data');let fail=false,diagnostic=0;
 // Controlled process fixture exercises lifecycle, not a claim that the real repository build passed.
 const p=new Production(root,data,async(command,args,cwd,_input,signal,output)=>{
  if(command==='git'&&args[0]==='worktree'){
   const workspace=args[4];for(const dir of ['.git','content','knowledge','sources'])mkdirSync(path.join(workspace,dir),{recursive:true});
   writeFileSync(path.join(workspace,'content/catalog.ts'),'export const CONTENT_ENTRIES: ContentEntry[]=[];');writeFileSync(path.join(workspace,'sources/registry.json'),'[]');writeFileSync(path.join(workspace,'knowledge/concepts.json'),'[]');
  }else if(args.includes('scripts/build-site.ts')){if(fail)throw Error('Deliberate build failure');const file=path.join(cwd,'dist/knowledge/binary-relations');mkdirSync(file,{recursive:true});writeFileSync(path.join(file,'index.html'),'<p>Built fixture</p>');}
   if(command==='git')output(`changing diagnostic ${diagnostic++}\n`,'stderr');
   if(command==='git'&&args[0]==='diff'){const article=path.join(cwd,'content/mathematics/binary-relations/article.ko.json');output(readFileSync(article,'utf8'),'stdout');}
   else if(!(command==='git'&&args[0]==='ls-files'))output('fixture process output\n','stdout');
 });
 try{
  p.start(EXAMPLES[0],'r1','prepare');assert.throws(()=>p.start(EXAMPLES[0],'r1','prepare'),/already running/);await settled(p);
  const w=p.list()[0],article=path.join(w.directory,'content/mathematics/binary-relations/article.ko.json');assert.match(readFileSync(article,'utf8'),/needs-content-review/);
  writeFileSync(article,'Accepted human edit');assert.throws(()=>p.start(EXAMPLES[0],'r2','prepare'),/preserve edits/);assert.equal(readFileSync(article,'utf8'),'Accepted human edit');
   p.start(EXAMPLES[0],'r1','build');await settled(p);assert.equal(p.list()[0].tasks.at(-1)?.status,'completed');const build=p.list()[0].build!;assert.equal(build.revision,'unacknowledged');assert.match(await(await fetch(build.url!)).text(),/Built fixture/);
   assert.equal((await fetch(new URL('/production.json',build.url!))).status,404);
   const topic={plan:EXAMPLES[0],revision:'r2',jobs:[],feedback:[],gate:{ready:false,reasons:[],warnings:[]}},packet=createWorkPacket(topic,{directory:w.directory,branch:w.branch,route:w.route});
   await assert.rejects(()=>p.acknowledge(topic,{...packet.resultContract,revision:'stale',summary:'Stale result'}),/current handoff revision/);
   await assert.rejects(()=>p.acknowledge(topic,{...packet.resultContract,workspace:{...packet.resultContract.workspace,branch:'studio/wrong'},summary:'Wrong workspace'}),/workspace/);
   const acknowledged=await p.acknowledge(topic,{...packet.resultContract,summary:'Implemented outside Studio',checks:['fixture check']});assert.equal(acknowledged.revision,'r2');assert.match(acknowledged.sourceHash??'',/^[a-f0-9]{64}$/);
   p.start(EXAMPLES[0],'r2','build');await settled(p);assert.equal(p.list()[0].build?.revision,'r2');
   writeFileSync(article,'Changed after acknowledgement');
   p.start(EXAMPLES[0],'changed-plan-only','build');await settled(p);assert.equal(p.list()[0].build?.revision,'unacknowledged');
  const lastGoodId=p.list()[0].build?.id;
  fail=true;p.start(EXAMPLES[0],'r2','build');await settled(p);assert.equal(p.list()[0].tasks.at(-1)?.status,'failed');assert.equal(p.list()[0].build?.id,lastGoodId);
  p.dispose();const restored=new Production(root,data,async()=>{throw Error('Do not replay')});try{await restored.restore();assert.ok(restored.list()[0].build?.url);assert.equal(restored.list()[0].build?.id,lastGoodId);}finally{restored.dispose();}
 }finally{p.dispose();rmSync(root,{recursive:true,force:true});}
});
test('preparing an integrated topic preserves its canonical source instead of regenerating the manuscript',async()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'atlas-integrated-')),data=path.join(root,'artifacts/data');
 const original=JSON.stringify({id:'article:mathematics.binary-relations.ko',blocks:[{text:'Accepted canonical prose'}]});
 const p=new Production(root,data,async(command,args)=>{
  if(command==='git'&&args[0]==='worktree'){
   const workspace=args[4],base=path.join(workspace,'content/mathematics/binary-relations');mkdirSync(base,{recursive:true});mkdirSync(path.join(workspace,'.git'));
   writeFileSync(path.join(workspace,'content/catalog.ts'),"export const CONTENT_ENTRIES=[{directory:'mathematics/binary-relations'}];");writeFileSync(path.join(base,'article.ko.json'),original);writeFileSync(path.join(base,'page.ts'),'Accepted page module');
  }
 });
 try{p.start(EXAMPLES[0],'integrated','prepare');await settled(p);const w=p.list()[0];assert.equal(w.tasks[0].status,'completed');assert.match(w.tasks[0].log,/Existing registered topic/);assert.equal(readFileSync(path.join(w.directory,'content/mathematics/binary-relations/article.ko.json'),'utf8'),original);assert.equal(readFileSync(path.join(w.directory,'content/mathematics/binary-relations/page.ts'),'utf8'),'Accepted page module');}
 finally{p.dispose();rmSync(root,{recursive:true,force:true});}
});

test('external acknowledgement holds the production lease and cancellation cannot record a completed fingerprint',async()=>{
 for(const stop of ['cancel','dispose','persist-failure'] as const){
  const root=mkdtempSync(path.join(os.tmpdir(),`atlas-ack-${stop}-`)),data=path.join(root,'artifacts/data'),directory=path.join(root,'artifacts/studio-workspaces/binary-relations-token');mkdirSync(path.join(directory,'.git'),{recursive:true});mkdirSync(data,{recursive:true});
  writeFileSync(path.join(data,'production.json'),JSON.stringify([{id:'binary-relations',directory,branch:'studio/binary-relations-token',seedRevision:'seed',route:'/knowledge/binary-relations/',tasks:[]}]))
  let markEntered=()=>{},unblock=()=>{};const entered=new Promise<void>(resolve=>{markEntered=resolve;}),blocked=new Promise<void>(resolve=>{unblock=resolve;});
  const p=new Production(root,data,async(command,args,_cwd,_input,signal,output)=>{
   if(command==='git'&&args[0]==='rev-parse'){markEntered();await new Promise<void>((resolve,reject)=>{const abort=()=>reject(Error('fingerprint aborted'));signal.addEventListener('abort',abort,{once:true});void blocked.then(()=>{signal.removeEventListener('abort',abort);resolve();});});output('fixture-head','stdout');}
  });
  const topic={plan:EXAMPLES[0],revision:'ack-revision',jobs:[],feedback:[],gate:{ready:false,reasons:[]}},packet=createWorkPacket(topic,{directory,branch:'studio/binary-relations-token',route:'/knowledge/binary-relations/'}),ack=p.acknowledge(topic,{...packet.resultContract,summary:'External fixture completed'});
  try{
   await entered;const task=p.list()[0].tasks.at(-1);assert.equal(task?.status,'running');assert.throws(()=>p.start(EXAMPLES[0],'other','build'),/already running/);await assert.rejects(()=>p.acknowledge(topic,{...packet.resultContract,summary:'Concurrent acknowledgement'}),/already running/);
   if(stop==='cancel'){assert.ok(task);p.cancel(task.id);}else if(stop==='dispose')p.dispose();else{rmSync(data,{recursive:true,force:true});writeFileSync(data,'block persistence');unblock();}
   if(stop==='persist-failure'){await assert.rejects(ack);assert.notEqual(p.list()[0].tasks.at(-1)?.status,'completed');assert.equal(p.list()[0].tasks.at(-1)?.sourceHash,undefined);}
   else{await assert.rejects(ack,/fingerprint aborted/);assert.equal(p.list()[0].tasks.at(-1)?.status,'interrupted');assert.equal(p.list()[0].tasks.at(-1)?.sourceHash,undefined);}
  }finally{unblock();p.dispose();rmSync(root,{recursive:true,force:true});}
 }
});

test('cancellation after the final fingerprint command cannot acknowledge empty untracked sources',async()=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'atlas-ack-final-cancel-')),data=path.join(root,'artifacts/data'),directory=path.join(root,'artifacts/studio-workspaces/binary-relations-token');
  mkdirSync(path.join(directory,'.git'),{recursive:true});mkdirSync(data,{recursive:true});
  writeFileSync(path.join(data,'production.json'),JSON.stringify([{id:'binary-relations',directory,branch:'studio/binary-relations-token',seedRevision:'seed',route:'/knowledge/binary-relations/',tasks:[]}]));
  const p:Production=new Production(root,data,async(_command,args)=>{
    if(args[0]==='ls-files'){
      const task=p.list()[0]?.tasks.at(-1);assert.ok(task);p.cancel(task.id);
    }
  });
  const topic={plan:EXAMPLES[0],revision:'current',jobs:[],feedback:[],gate:{ready:false,reasons:[]}},packet=createWorkPacket(topic,{directory,branch:'studio/binary-relations-token',route:'/knowledge/binary-relations/'});
  try{
    await assert.rejects(p.acknowledge(topic,{...packet.resultContract,summary:'Cancelled at final command'}),/interrupted/);
    assert.equal(p.list()[0]?.tasks.at(-1)?.status,'interrupted');
    assert.equal(p.list()[0]?.tasks.at(-1)?.sourceHash,undefined);
  }finally{p.dispose();rmSync(root,{recursive:true,force:true});}
});

test('a new manuscript can join a catalog with an existing scaffold import without losing either article',async()=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'atlas-new-draft-')),data=path.join(root,'artifacts/data');
  const plan={...structuredClone(EXAMPLES[0]),id:'fresh-draft'};
  const p=new Production(root,data,async(command,args)=>{
    if(command!=='git'||args[0]!=='worktree')return;
    const directory=args[4];
    for(const name of ['.git','content','knowledge','sources'])mkdirSync(path.join(directory,name),{recursive:true});
    writeFileSync(path.join(directory,'package.json'),JSON.stringify({type:'module'}));
    writeFileSync(path.join(directory,'content/existing.ts'),"export default {articleId:'article:existing'};");
    writeFileSync(path.join(directory,'content/catalog.ts'),"import studioDraft from './existing.js';\nexport const CONTENT_ENTRIES: ContentEntry[]=[{directory:'mathematics/existing',page:studioDraft}];");
    writeFileSync(path.join(directory,'sources/registry.json'),'[]');
    writeFileSync(path.join(directory,'knowledge/concepts.json'),'[]');
  });
  try{
    p.start(plan,'new-draft','prepare');await settled(p);
    const work=p.list()[0];assert.equal(work?.tasks[0]?.status,'completed');assert.ok(work);
    const generated:unknown=await import(pathToFileURL(path.join(work.directory,'content/catalog.ts')).href);
    assert.ok(generated&&typeof generated==='object'&&'CONTENT_ENTRIES'in generated&&Array.isArray(generated.CONTENT_ENTRIES));
    const directories=generated.CONTENT_ENTRIES.map((entry:unknown)=>{assert.ok(entry&&typeof entry==='object'&&'directory'in entry);return entry.directory;});
    assert.deepEqual(directories,['mathematics/fresh-draft','mathematics/existing']);
    const articleIds=generated.CONTENT_ENTRIES.map((entry:unknown)=>{
      assert.ok(entry&&typeof entry==='object'&&'page'in entry&&entry.page&&typeof entry.page==='object'&&'articleId'in entry.page);
      return entry.page.articleId;
    });
    assert.deepEqual(articleIds,['article:mathematics.fresh-draft.ko','article:existing']);
  }finally{p.dispose();rmSync(root,{recursive:true,force:true});}
});
