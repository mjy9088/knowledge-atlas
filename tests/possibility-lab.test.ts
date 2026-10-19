import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLabState,validateLabState,labFrameAt,labSummary,labTrial,isFunction,relationPairs} from '../packages/models/possibility-lab.js';
test('sampling retains the observation denominator and agrees with exact finite models',()=>{
 for(const topic of ['monty-hall','two-children'] as const)for(const mode of topic==='monty-hall'?['informed','blind'] as const:['filter','child'] as const){
  const s={...initialLabState(topic),count:10000,mode},summary=labSummary(s);
  assert.ok(Math.abs(summary.rate!-summary.theoretical)<.025);
  assert.equal(summary.attempted,10000);assert.ok(summary.accepted<=10000);
  if(mode==='informed')assert.equal(summary.accepted,10000);else assert.ok(summary.accepted<10000);
  assert.equal(summary.rate,summary.successes/summary.accepted);
 }
});
test('draws and frames are reproducible independent of traversal, with validated atomic snapshots',()=>{
 const s=initialLabState('monty-hall'),a=labFrameAt(s,5000);labFrameAt(s,400000);assert.deepEqual(labFrameAt(s,5000),a);
 assert.deepEqual(labTrial(a,13),labTrial({...a,count:1},13));assert.equal(a.count,100);
 assert.equal(labFrameAt(s,1e12).count,10000);assert.equal(labSummary(s).rate,null);
  for(const bad of [{...s,count:-1},{...s,seed:NaN},{...s,mode:'child'},{...s,edges:16},{...s,revealed:1},{...s,unexpected:true}])assert.throws(()=>validateLabState(bad,s.topic));
 assert.throws(()=>labFrameAt(s,Infinity));assert.throws(()=>labFrameAt(s,-1));
});
test('relation selection preserves direction and checks exactly one image for every input',()=>{
 assert.deepEqual(relationPairs(11),['민 → 논리','민 → 확률','수 → 확률']);
 assert.equal(isFunction(11),false);assert.equal(isFunction(9),true);assert.equal(isFunction(0),false);assert.equal(isFunction(3),false);
});
