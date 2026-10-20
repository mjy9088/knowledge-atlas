import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weekdayWorlds,interpretWeekdayWorlds,weekdayDeductions,PRESET_CONTEXTS} from '../weekday-worlds.js';

test('displayed calendar deductions ignore sample days and leave unlinked worlds undetermined',()=>{
  for(let actual=0;actual<7;actual++){
    const input={actual,target:4,contexts:PRESET_CONTEXTS['actual-yesterday'],worlds:[{id:0 as const,today:actual},{id:1 as const,today:0},{id:2 as const,today:1}]};
    const result=weekdayDeductions(input);
    assert.deepEqual(result.worlds[0].days,[[5],[6],[0]]);
    assert.deepEqual(result.worlds[1].days,[[3],[4],[5]]);
    assert.deepEqual(result.worlds[2].days,Array.from({length:3},()=>[0,1,2,3,4,5,6]));
    const impossible=weekdayDeductions({...input,contexts:PRESET_CONTEXTS['same-context']});
    assert.ok(impossible.worlds.every(w=>w.days.every(days=>days.length===0)));
  }
});

test('separate context assignments give Sunday and Wednesday for imagined Friday',()=>{
  const a=weekdayWorlds({actual:6,target:4,rule:'actual-yesterday'});
  assert.deepEqual(a.actualDays,[5,6,0]);assert.deepEqual(a.imaginedDays,[3,4,5]);assert.deepEqual(a.candidates,[6]);assert.equal(a.matches,true);
  const b=weekdayWorlds({actual:2,target:4,rule:'imagined-yesterday'});
  assert.deepEqual(b.actualDays,[1,2,3]);assert.deepEqual(b.imaginedDays,[3,4,5]);assert.deepEqual(b.candidates,[2]);assert.equal(b.matches,true);
  assert.equal(weekdayWorlds({actual:6,target:4,rule:'imagined-yesterday'}).matches,false);
});
test('explicit Monday transfer has Wednesday and Saturday solutions',()=>{
  assert.deepEqual(weekdayWorlds({actual:2,target:0,rule:'actual-yesterday'}).candidates,[2]);
  assert.equal(weekdayWorlds({actual:2,target:0,rule:'actual-yesterday'}).matches,true);
  assert.deepEqual(weekdayWorlds({actual:5,target:0,rule:'imagined-yesterday'}).candidates,[5]);
  assert.equal(weekdayWorlds({actual:5,target:0,rule:'imagined-yesterday'}).matches,true);
});
test('every target has exactly one actual weekday per explicit cross-context rule',()=>{
  for(const rule of ['actual-yesterday','imagined-yesterday'] as const)for(let target=0;target<7;target++){
    const solutions=[];
    for(let actual=0;actual<7;actual++){
      const result=weekdayWorlds({actual,target,rule});assert.ok(result.imaginedDays);
      const [y,h,t]=result.imaginedDays;
      assert.equal((y+1)%7,h);assert.equal((h+1)%7,t);
      assert.equal(rule==='actual-yesterday'?result.actualDays[0]:result.actualDays[2],rule==='actual-yesterday'?t:y);
      if(result.matches)solutions.push(actual);
    }
    assert.equal(solutions.length,1);assert.deepEqual(solutions,weekdayWorlds({actual:0,target,rule}).candidates);
  }
});
test('same-context yesterday and tomorrow are never equal in a seven-day calendar',()=>{
  for(let actual=0;actual<7;actual++){
    const result=weekdayWorlds({actual,target:4,rule:'same-context'});
    assert.equal(result.kind,'impossible');assert.equal(result.imaginedDays,null);assert.deepEqual(result.candidates,[]);assert.equal(result.matches,false);
  }
});
test('unsupported calendar inputs are rejected',()=>{
  for(const input of [null,{}, {actual:-1,target:4,rule:'actual-yesterday'},{actual:7,target:4,rule:'actual-yesterday'},{actual:0.5,target:4,rule:'actual-yesterday'},{actual:0,target:NaN,rule:'actual-yesterday'},{actual:0,target:4,rule:'unknown'},{actual:'0',target:4,rule:'actual-yesterday'}])assert.throws(()=>weekdayWorlds(input as Parameters<typeof weekdayWorlds>[0]));
});


test('all sixteen context assignments distinguish contradiction, repeated answer and inference direction',()=>{
  const counts:Record<string,number>={impossible:0,inferred:0,reversed:0,direct:0};
  for(const yesterday of [0,1] as const)for(const tomorrow of [0,1] as const)for(const consequent of [0,1] as const)for(const question of [0,1] as const){
    const result=interpretWeekdayWorlds({actual:6,target:4,contexts:{yesterday,tomorrow,consequent,question}});counts[result.kind]++;
    if(yesterday===tomorrow){assert.equal(result.kind,'impossible');assert.deepEqual(result.solutions,[]);assert.deepEqual(result.questionCandidates,[]);continue;}
    assert.equal(result.solutions.length,1);
    const fixture=yesterday===0?consequent===0?{actual:4,imagined:2}:{actual:6,imagined:4}:consequent===0?{actual:4,imagined:6}:{actual:2,imagined:4};
    assert.deepEqual(result.actualCandidates,[fixture.actual]);assert.deepEqual(result.questionCandidates,[question===0?fixture.actual:fixture.imagined]);
    assert.equal(result.matches,fixture.actual===6);
  }
  assert.deepEqual(counts,{impossible:8,inferred:2,reversed:2,direct:4});
});
test('preset inference preserves Friday and Monday fixtures under four explicit assignments',()=>{
  for(const [target,a,b]of [[4,6,2],[0,2,5]]){
    for(const [rule,expected]of [['actual-yesterday',a],['imagined-yesterday',b]] as const){
      const result=interpretWeekdayWorlds({actual:expected,target,contexts:PRESET_CONTEXTS[rule]});assert.equal(result.kind,'inferred');assert.deepEqual(result.questionCandidates,[expected]);assert.equal(result.matches,true);
    }
    assert.equal(interpretWeekdayWorlds({actual:0,target,contexts:PRESET_CONTEXTS['same-context']}).kind,'impossible');
  }
});
test('independent assignments validate every world index and do not mutate caller data',()=>{
  const input={actual:6,target:4,contexts:{...PRESET_CONTEXTS['actual-yesterday']}},before=structuredClone(input),result=interpretWeekdayWorlds(input);
  result.solutions[0].actual=0;result.actualDays[0]=0;assert.deepEqual(input,before);assert.deepEqual(interpretWeekdayWorlds(input).questionCandidates,[6]);
  for(const contexts of [null,{}, {...input.contexts,question:2},{...input.contexts,consequent:'1'},{...input.contexts,yesterday:NaN}])assert.throws(()=>interpretWeekdayWorlds({...input,contexts} as Parameters<typeof interpretWeekdayWorlds>[0]));
});
