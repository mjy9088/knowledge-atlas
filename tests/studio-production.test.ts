import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Production} from '../tools/studio/production.js';
import {EXAMPLES} from '../tools/studio/examples.js';

async function settled(p:Production){for(let i=0;i<200;i++){if(!p.list().some(w=>w.tasks.some(t=>t.status==='running')))return;await new Promise(r=>setTimeout(r,10));}throw Error('Timeout');}
test('isolated production preserves edited sources, snapshots successful output, rejects overlaps and retains prior build after failure',async()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'atlas-production-')),data=path.join(root,'artifacts/data');let fail=false,diagnostic=0,hold:(()=>void)|undefined;
 // Controlled process fixture exercises lifecycle, not a claim that the real repository build passed.
 const p=new Production(root,data,'fixture',async(command,args,cwd,_input,signal,output)=>{
  if(command==='git'&&args[0]==='worktree'){
   const workspace=args[4];for(const dir of ['.git','content','knowledge','sources'])mkdirSync(path.join(workspace,dir),{recursive:true});
   writeFileSync(path.join(workspace,'content/catalog.ts'),'export const CONTENT_ENTRIES: ContentEntry[]=[];');writeFileSync(path.join(workspace,'sources/registry.json'),'[]');writeFileSync(path.join(workspace,'knowledge/concepts.json'),'[]');
  }else if(command==='fixture'){await new Promise<void>((resolve,reject)=>{hold=resolve;signal.addEventListener('abort',()=>reject(Error('cancelled')));});}
  else if(args.includes('scripts/build-site.ts')){if(fail)throw Error('Deliberate build failure');const file=path.join(cwd,'dist/knowledge/binary-relations');mkdirSync(file,{recursive:true});writeFileSync(path.join(file,'index.html'),'<p>Built fixture</p>');}
  if(command==='git')output(`changing diagnostic ${diagnostic++}\n`,'stderr');
  if(!(command==='git'&&args[0]==='ls-files'))output('fixture process output\n','stdout');
 });
 try{
  p.start(EXAMPLES[0],'r1','prepare');assert.throws(()=>p.start(EXAMPLES[0],'r1','prepare'),/already running/);await settled(p);
  const w=p.list()[0],article=path.join(w.directory,'content/mathematics/binary-relations/article.ko.json');assert.match(readFileSync(article,'utf8'),/needs-content-review/);
  writeFileSync(article,'Accepted human edit');assert.throws(()=>p.start(EXAMPLES[0],'r2','prepare'),/preserve edits/);assert.equal(readFileSync(article,'utf8'),'Accepted human edit');
  p.start(EXAMPLES[0],'r1','build');await settled(p);assert.equal(p.list()[0].tasks.at(-1)?.status,'completed');const build=p.list()[0].build!;assert.match(await(await fetch(build.url!)).text(),/Built fixture/);
  assert.equal((await fetch(new URL('/production.json',build.url!))).status,404);
  p.start(EXAMPLES[0],'changed-plan-only','build');await settled(p);assert.equal(p.list()[0].build?.revision,'r1');
  const lastGoodId=p.list()[0].build?.id;
  fail=true;p.start(EXAMPLES[0],'r2','build');await settled(p);assert.equal(p.list()[0].tasks.at(-1)?.status,'failed');assert.equal(p.list()[0].build?.id,lastGoodId);
  assert.throws(()=>p.start(EXAMPLES[0],'r2','implement',''),/Describe/);const task=p.start(EXAMPLES[0],'r2','implement','Change the diagram');assert.ok(hold);p.cancel(task.id);await settled(p);assert.equal(p.list()[0].tasks.at(-1)?.status,'interrupted');
  p.dispose();const restored=new Production(root,data,'fixture',async()=>{throw Error('Do not replay')});try{await restored.restore();assert.ok(restored.list()[0].build?.url);assert.equal(restored.list()[0].build?.id,lastGoodId);}finally{restored.dispose();}
 }finally{p.dispose();rmSync(root,{recursive:true,force:true});}
});
