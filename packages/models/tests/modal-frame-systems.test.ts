import {test} from 'node:test';
import assert from 'node:assert/strict';
import {modalFrameSystems} from '../modal-frame-systems.js';
import type {WorldIndex} from '../weekday-worlds.js';

test('the default frame meets S4 conditions and the reverse edge adds the S5 conditions',()=>{
  const frame={evaluationWorld:0 as const,access:[[0,0],[0,1],[1,1]] as [WorldIndex,WorldIndex][]};
  assert.deepEqual(modalFrameSystems([0,1],frame).systems,{K:true,D:true,T:true,B:false,S4:true,S5:false});
  assert.equal(modalFrameSystems([0,1],{...frame,access:[...frame.access,[1,0]]}).systems.S5,true);
  assert.deepEqual(modalFrameSystems([0,1],{...frame,access:[]}).systems,{K:true,D:false,T:false,B:false,S4:false,S5:false});
});
test('frame conditions agree with axiom validity for every valuation on every two-world frame',()=>{
  for(let bits=0;bits<16;bits++){
    const edge=(a:number,b:number)=>Boolean(bits&(1<<(a*2+b))),access:[WorldIndex,WorldIndex][]=[];
    for(const a of [0,1] as const)for(const b of [0,1] as const)if(edge(a,b))access.push([a,b]);
    const result=modalFrameSystems([0,1],{evaluationWorld:0,access}),valid={D:true,T:true,B:true,four:true,five:true};
    for(let values=0;values<4;values++)for(const w of [0,1]){
      const p=(v:number)=>Boolean(values&(1<<v)),box=(f:(v:number)=>boolean,u:number)=>[0,1].every(v=>!edge(u,v)||f(v)),diamond=(f:(v:number)=>boolean,u:number)=>[0,1].some(v=>edge(u,v)&&f(v));
      valid.D&&=!box(p,w)||diamond(p,w);valid.T&&=!box(p,w)||p(w);valid.B&&=!p(w)||box(v=>diamond(p,v),w);valid.four&&=!box(p,w)||box(v=>box(p,v),w);valid.five&&=!diamond(p,w)||box(v=>diamond(p,v),w);
    }
    assert.equal(result.serial,valid.D);assert.equal(result.reflexive,valid.T);assert.equal(result.symmetric,valid.B);assert.equal(result.transitive,valid.four);assert.equal(result.euclidean,valid.five);
  }
});
test('conditions inspect all stable world IDs, not only the evaluation point or a transitive closure',()=>{
  const access:[WorldIndex,WorldIndex][]=[[0,0],[0,1],[1,1],[1,3],[3,3]],a=modalFrameSystems([0,1,3],{evaluationWorld:0,access});
  assert.equal(a.transitive,false);assert.equal(a.systems.S4,false);assert.deepEqual(modalFrameSystems([0,1,3],{evaluationWorld:3,access}),a);
  assert.equal(modalFrameSystems([0,1,3],{evaluationWorld:0,access:[...access,[0,3]]}).systems.S4,true);
  for(const [ids,frame]of [[[],{evaluationWorld:0,access:[]}],[[0,0],{evaluationWorld:0,access:[]}],[[0,1],{evaluationWorld:0,access:[[0,3]]}],[[0,1],{evaluationWorld:0,access:[[0,1],[0,1]]}]] as const)assert.throws(()=>modalFrameSystems(ids as never,frame as never));
});
