import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weekdayModal} from '../packages/models/weekday-modal.js';
import {interpretWeekdayWorlds,PRESET_CONTEXTS,type WorldIndex,type CalendarWorld} from '../packages/models/weekday-worlds.js';

test('alethic evaluation agrees with some/all accessible worlds for every two-world frame and valuation',()=>{
  for(let edges=0;edges<16;edges++)for(let truth=0;truth<4;truth++)for(const evaluationWorld of [0,1] as const){
    const worlds:CalendarWorld[]=[{id:0,today:truth&1?4:0},{id:1,today:truth&2?4:0}],access:[WorldIndex,WorldIndex][]=[];
    for(let from=0;from<2;from++)for(let to=0;to<2;to++)if(edges&(1<<(from*2+to)))access.push([from as WorldIndex,to as WorldIndex]);
    const input={actual:worlds[0].today,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds},m=weekdayModal(input,{evaluationWorld,access}),visible=[0,1].filter(id=>edges&(1<<(evaluationWorld*2+id)));
    assert.equal(m.actual,Boolean(truth&(1<<evaluationWorld)));assert.equal(m.diamond,visible.some(id=>Boolean(truth&(1<<id))));assert.equal(m.box,visible.every(id=>Boolean(truth&(1<<id))));
    const negativeWorlds=worlds.map(w=>({...w,today:w.today===4?0:4})),negative=weekdayModal({...input,actual:negativeWorlds[0].today,worlds:negativeWorlds},{evaluationWorld,access});assert.equal(m.diamond,!negative.box);
    if(access.some(([from,to])=>from===evaluationWorld&&to===evaluationWorld)&&m.box)assert.equal(m.actual,true);
  }
});
test('possibility does not imply actuality; a changed R can make necessity nonfactive',()=>{
  const input={actual:6,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds:[{id:0 as const,today:6},{id:1 as const,today:4}]};
  const reflexive=weekdayModal(input,{evaluationWorld:0,access:[[0,0],[0,1],[1,1]]});assert.equal(reflexive.actual,false);assert.equal(reflexive.diamond,true);assert.equal(reflexive.box,false);
  const changed=weekdayModal(input,{evaluationWorld:0,access:[[0,1]]});assert.equal(changed.box,true);assert.equal(changed.actual,false);assert.equal(changed.reflexive,false);
  const empty=weekdayModal(input,{evaluationWorld:0,access:[]});assert.equal(empty.box,true);assert.equal(empty.diamond,false);
});
test('accessibility is direct and is never silently replaced by its transitive closure',()=>{
  const input={actual:0,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds:[{id:0 as const,today:0},{id:1 as const,today:0},{id:2 as const,today:4}]};
  const m=weekdayModal(input,{evaluationWorld:0,access:[[0,1],[1,2]]});assert.deepEqual(m.accessible,[1]);assert.equal(m.diamond,false);
});
test('additional unconnected calendars can leave the requested weekday underdetermined',()=>{
  const worlds:CalendarWorld[]=[{id:0,today:6},{id:1,today:4},{id:3,today:1}],contexts={...PRESET_CONTEXTS['actual-yesterday'],question:3 as const};
  const result=interpretWeekdayWorlds({actual:6,target:4,contexts,worlds});assert.equal(result.kind,'underdetermined');assert.deepEqual(result.questionCandidates,[0,1,2,3,4,5,6]);assert.equal(result.models.length,7);assert.deepEqual(result.actualCandidates,[6]);
  const fixed=interpretWeekdayWorlds({actual:6,target:4,contexts:{...contexts,consequent:3},worlds});assert.equal(fixed.kind,'direct');assert.deepEqual(fixed.questionCandidates,[4]);assert.equal(fixed.models.length,7);
});
test('world configuration rejects duplicate IDs, dangling references and malformed access before evaluation',()=>{
  const input={actual:6,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds:[{id:0 as const,today:6},{id:1 as const,today:4}]};
  for(const worlds of [[],[{id:0,today:6},{id:0,today:4}],[{id:1,today:4}],[{id:0,today:5},{id:1,today:4}],[{id:0,today:6},{id:4,today:4}]])assert.throws(()=>interpretWeekdayWorlds({...input,worlds} as Parameters<typeof interpretWeekdayWorlds>[0]));
  for(const frame of [{evaluationWorld:2,access:[]},{evaluationWorld:0,access:[[0,2]]},{evaluationWorld:0,access:[[0,1],[0,1]]},{evaluationWorld:0,access:[[0]]}])assert.throws(()=>weekdayModal(input,frame as Parameters<typeof weekdayModal>[1]));
});
