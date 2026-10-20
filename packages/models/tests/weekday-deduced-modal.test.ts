import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deducedWeekdayModal} from '../weekday-modal.js';
import {PRESET_CONTEXTS,type WeekdayInterpretation} from '../weekday-worlds.js';

const input:WeekdayInterpretation={actual:0,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds:[{id:0,today:0},{id:1,today:0},{id:3,today:4}]};
test('modal projection uses deduced calendars and preserves undetermined worlds',()=>{
  assert.deepEqual(deducedWeekdayModal(input,{evaluationWorld:0,access:[[0,0],[0,1]]}),{accessible:[0,1],consistent:true,actual:false,diamond:true,box:false});
  const unknown=deducedWeekdayModal(input,{evaluationWorld:3,access:[[3,3]]});assert.equal(unknown.actual,null);assert.equal(unknown.diamond,null);assert.equal(unknown.box,null);
  const mixed=deducedWeekdayModal(input,{evaluationWorld:0,access:[[0,1],[0,3]]});assert.equal(mixed.diamond,true);assert.equal(mixed.box,null);
  const changed={...input,actual:6,worlds:input.worlds!.map(w=>({...w,today:w.id===0?6:2}))};
  assert.deepEqual(deducedWeekdayModal(changed,{evaluationWorld:0,access:[[0,1],[0,3]]}),mixed);
});
test('empty access and impossible calendars are separate states',()=>{
  const empty=deducedWeekdayModal(input,{evaluationWorld:0,access:[]});assert.equal(empty.diamond,false);assert.equal(empty.box,true);
  const impossible=deducedWeekdayModal({...input,contexts:PRESET_CONTEXTS['same-context']},{evaluationWorld:0,access:[]});assert.equal(impossible.consistent,false);assert.equal(impossible.diamond,null);assert.equal(impossible.box,null);
  const one=deducedWeekdayModal(input,{evaluationWorld:0,access:[[0,1]]});assert.equal(one.actual,false);assert.equal(one.box,true);
});
