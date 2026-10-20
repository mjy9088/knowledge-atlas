import {test} from 'node:test';
import assert from 'node:assert/strict';
import {alethicValuationAt} from '../../../../packages/models/weekday-modal.js';
import {MODAL_INTRO_EXAMPLES} from '../modal-examples.js';

test('introductory valuations distinguish actual truth, possibility and necessity without calendar premises',()=>{
  for(const [index,example]of MODAL_INTRO_EXAMPLES.entries()){
    const result=alethicValuationAt(example.worlds.map(w=>w.id),example.worlds.filter(w=>w.today===4).map(w=>w.id),{evaluationWorld:0,access:example.worlds.map(w=>[0,w.id])});
    assert.deepEqual([result.actual,result.diamond,result.box],index===0?[false,true,false]:[true,true,true]);assert.deepEqual(result.accessible,[0,1,2]);
  }
});
test('valuation evaluation validates frames and keeps empty-access clauses distinct from actual truth',()=>{
  assert.deepEqual(alethicValuationAt([0,1],[1],{evaluationWorld:0,access:[]}),{accessible:[],actual:false,diamond:false,box:true});
  assert.throws(()=>alethicValuationAt([0,0],[],{evaluationWorld:0,access:[]}));assert.throws(()=>alethicValuationAt([0],[1],{evaluationWorld:0,access:[]}));assert.throws(()=>alethicValuationAt([0],[],{evaluationWorld:0,access:[[0,1]]}));
});
