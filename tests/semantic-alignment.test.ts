import test from 'node:test';
import assert from 'node:assert/strict';
import {createAlignmentModel} from '../packages/experiments/semantic-alignment.js';

test('alignment paths preserve the entire declared ancestry and distinguish repeated text and separate roots',()=>{
  const nodes=[{id:'root',label:'expression'},{id:'left',parent:'root',label:'branch'},{id:'left-value',parent:'left',label:'x'},{id:'right',parent:'root',label:'branch'},{id:'right-value',parent:'right',label:'x'},{id:'question',label:'question'}];
  const model=createAlignmentModel(nodes);
  assert.deepEqual(model.path('left-value'),['root','left','left-value']);assert.deepEqual(model.path('right-value'),['root','right','right-value']);assert.deepEqual(model.path('question'),['question']);
  nodes[0].label='mutated';model.path('left-value').pop();assert.equal(model.label('root'),'expression');assert.deepEqual(model.path('left-value'),['root','left','left-value']);
  assert.deepEqual(model.validate({activeId:null}),{activeId:null});const state={activeId:'right-value'};const detached=model.validate(state);detached.activeId=null;assert.equal(state.activeId,'right-value');
});

test('alignment rejects invalid forests, cycles, dangling parents, depth and unsupported saved selections',()=>{
  for(const forest of [null,[],[{id:'r',label:''}],[{id:'r',label:'one'},{id:'r',label:'two'}],[{id:'a',parent:'missing',label:'a'}],[{id:'a',parent:'b',label:'a'},{id:'b',parent:'a',label:'b'}],Array.from({length:33},(_,i)=>({id:`n${i}`,label:String(i),...(i?{parent:`n${i-1}`}:{})})),Array.from({length:257},(_,i)=>({id:`n${i}`,label:String(i)}))])assert.throws(()=>createAlignmentModel(forest as never));
  const model=createAlignmentModel([{id:'r',label:'root'}]);for(const value of [null,{}, {activeId:'unknown'},{activeId:0}])assert.throws(()=>model.validate(value));assert.throws(()=>model.path('unknown'));
});
