import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Chats,type RpcFactory} from '../tools/studio/chat.js';
import {Production} from '../tools/studio/production.js';
import {Studio} from '../tools/studio/engine.js';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
async function until(check:()=>boolean){for(let i=0;i<200;i++){if(check())return;await new Promise(r=>setTimeout(r,5));}throw Error('Timeout');}
function harness(){
 const data=mkdtempSync(path.join(os.tmpdir(),'atlas-chat-')),studio=new Studio(root,data,async()=>{throw Error('Not a review test');}),production=new Production(root,data,'unused');
 const connections:{event:(v:unknown)=>void;fail:(e:Error)=>void;calls:{method:string;params:unknown}[];replies:{id:string|number;result:unknown;error?:string}[];closed:boolean}[]=[];
 const factory:RpcFactory=(_cwd,event,fail)=>{const fixture={event,fail,calls:[] as {method:string;params:unknown}[],replies:[] as {id:string|number;result:unknown;error?:string}[],closed:false};connections.push(fixture);return{call:async(method,params)=>{fixture.calls.push({method,params});return method==='turn/start'?{turn:{id:'turn-'+connections.length}}:method==='thread/start'?{thread:{id:'thread-1'}}:method==='thread/resume'?{thread:{id:'thread-1'}}:{};},notify:()=>{},reply:(id,result,error)=>fixture.replies.push({id,result,error}),close:()=>{fixture.closed=true;}};};
 const chats=new Chats(root,data,production,factory);return{data,studio,production,chats,connections,factory,close:()=>{chats.dispose();production.dispose();studio.dispose();rmSync(data,{recursive:true,force:true});}};
}
test('chat streams public messages, persists history, resumes the exact thread and never becomes review evidence',async()=>{
 const h=harness();try{
  const topic=h.studio.topic('monty-hall'),c=h.chats.send(topic,'','ask','Explain the host rule');await until(()=>h.connections[0].calls.some(c=>c.method==='turn/start'));
  const event=h.connections[0].event;event({method:'item/agentMessage/delta',params:{threadId:'thread-1',itemId:'reply',delta:'관측 '}});event({method:'item/agentMessage/delta',params:{threadId:'thread-1',itemId:'reply',delta:'절차'}});
  assert.equal(h.chats.list()[0].messages.at(-1)?.text,'관측 절차');event({method:'item/completed',params:{threadId:'thread-1',item:{id:'reply',type:'agentMessage',text:'관측 절차가 중요합니다.'}}});event({method:'turn/completed',params:{threadId:'thread-1',turn:{id:'turn-1',status:'completed'}}});
  assert.equal(h.chats.list()[0].status,'idle');assert.equal(h.studio.topic(topic.plan.id).gate.ready,false);
  h.chats.send(topic,c.id,'ask','And the abbreviated statement?');await until(()=>h.connections.length===2&&h.connections[1].calls.some(c=>c.method==='turn/start'));assert.ok(h.connections[1].calls.some(c=>c.method==='thread/resume'&&(c.params as {threadId:string}).threadId==='thread-1'));
  assert.throws(()=>h.production.start(topic.plan,topic.revision,'prepare'),/chat/);await h.chats.stop(c.id);assert.equal(h.chats.list()[0].status,'interrupted');assert.equal(h.connections[1].closed,true);
  const restored=new Chats(root,h.data,h.production,()=>{throw Error('No automatic model replay');});try{assert.equal(restored.list()[0].messages.filter(m=>m.role==='user').length,2);assert.equal(restored.list()[0].messages.find(m=>m.id==='reply')?.text,'관측 절차가 중요합니다.');}finally{restored.dispose();}
 }finally{h.close();}
});
test('questions require scoped explicit answers, read-only approvals cannot escalate, and stale requests cannot be replayed',async()=>{
 const h=harness();try{
  const topic=h.studio.topic('monty-hall'),c=h.chats.send(topic,'','ask','Ask me first');await until(()=>h.chats.list()[0].turnId==='turn-1');const connection=h.connections[0];
  connection.event({id:81,method:'item/tool/requestUserInput',params:{threadId:'thread-1',turnId:'turn-1',questions:[{id:'scope',header:'범위',question:'어디까지 설명할까요?',isSecret:false,options:[{label:'핵심만',description:'가볍게'}]}]}});
  const request=h.chats.list()[0].requests[0];assert.equal(h.chats.list()[0].status,'waiting');assert.equal(connection.replies.length,0);assert.throws(()=>h.chats.answer('two-children',c.id,request.id,{answers:{scope:'핵심만'}}),/expired/);assert.throws(()=>h.chats.answer(topic.plan.id,c.id,request.id,{answers:{}}),/every/);
  h.chats.answer(topic.plan.id,c.id,request.id,{answers:{scope:'핵심만'}});assert.deepEqual(connection.replies[0],{id:81,result:{answers:{scope:{answers:['핵심만']}}},error:undefined});assert.throws(()=>h.chats.answer(topic.plan.id,c.id,request.id,{answers:{scope:'again'}}),/expired/);
  connection.event({id:'approval',method:'item/commandExecution/requestApproval',params:{threadId:'thread-1',turnId:'turn-1',reason:'Needs more access',command:'test command',cwd:root}});const approval=h.chats.list()[0].requests[0];assert.equal(approval.canAccept,false);assert.throws(()=>h.chats.answer(topic.plan.id,c.id,approval.id,{decision:'accept'}),/Invalid/);h.chats.answer(topic.plan.id,c.id,approval.id,{decision:'decline'});assert.deepEqual(connection.replies[1].result,{decision:'decline'});
  connection.event({id:90,method:'unknown/tool',params:{threadId:'thread-1',turnId:'turn-1'}});assert.ok(connection.replies.at(-1)?.error);await h.chats.stop(c.id);assert.equal(h.chats.list()[0].requests.length,0);
 }finally{h.close();}
});
test('write conversations retain the production lease through clarification and require one-shot human approval',async()=>{
 const h=harness();const topic=h.studio.topic('binary-relations'),workspace=path.join(root,'artifacts/studio-workspaces','chat-fixture-'+path.basename(h.data));
 try{
  mkdirSync(path.join(workspace,'.git'),{recursive:true});writeFileSync(path.join(h.data,'production.json'),JSON.stringify([{id:topic.plan.id,directory:workspace,branch:'codex/studio/chat-fixture',seedRevision:topic.revision,route:'/knowledge/binary-relations/',tasks:[]} ]));
  const production=new Production(root,h.data,'unused'),chats=new Chats(root,path.join(h.data,'work'),production,h.factory);
  try{const c=chats.send(topic,'','work','Implement the diagram');await until(()=>chats.list()[0].turnId==='turn-1');assert.equal(production.list()[0].tasks.at(-1)?.status,'running');assert.throws(()=>production.start(topic.plan,topic.revision,'build'),/chat/);
   h.connections[0].event({id:10,method:'item/fileChange/requestApproval',params:{threadId:'thread-1',turnId:'turn-1',reason:'Change fixture',grantRoot:workspace}});const request=chats.list()[0].requests[0];assert.equal(request.canAccept,true);assert.equal(h.connections[0].replies.length,0);chats.answer(topic.plan.id,c.id,request.id,{decision:'accept'});assert.deepEqual(h.connections[0].replies[0].result,{decision:'accept'});
   await chats.stop(c.id);assert.equal(production.list()[0].tasks.at(-1)?.status,'interrupted');}finally{chats.dispose();production.dispose();}
  const persisted=JSON.parse(readFileSync(path.join(h.data,'work/chats.json'),'utf8')) as unknown[];assert.equal(persisted.length,1);
 }finally{h.close();if(path.dirname(workspace)!==path.join(root,'artifacts/studio-workspaces'))throw Error('Unsafe fixture cleanup');rmSync(workspace,{recursive:true,force:true});}
});
