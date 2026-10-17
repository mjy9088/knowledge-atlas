import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weekdayNotation} from '../packages/models/weekday-notation.js';
import {PRESET_CONTEXTS,interpretWeekdayWorlds,type WorldIndex} from '../packages/models/weekday-worlds.js';

test('Friday A and B display the independently derived calendar equalities and answers',()=>{
  const a=weekdayNotation({actual:6,target:4,contexts:PRESET_CONTEXTS['actual-yesterday']});
  assert.equal(a.antecedent,'t₀ − 1 ≡₇ t₁ + 1');assert.equal(a.consequent,'t₁ ≡₇ 4');assert.equal(a.question,'t₀ = ?');assert.equal(a.relation,'t₁ ≡₇ t₀ − 2');assert.equal(a.conclusion,'Γ ⊨₇ t₀ ≡₇ 6');assert.equal(a.answer,6);
  const b=weekdayNotation({actual:2,target:4,contexts:PRESET_CONTEXTS['imagined-yesterday']});
  assert.equal(b.antecedent,'t₁ − 1 ≡₇ t₀ + 1');assert.equal(b.relation,'t₁ ≡₇ t₀ + 2');assert.equal(b.conclusion,'Γ ⊨₇ t₀ ≡₇ 2');assert.equal(b.answer,2);
});
test('inconsistent calendar constraints display an empty model set instead of extracting a weekday',()=>{
  const n=weekdayNotation({actual:6,target:4,contexts:PRESET_CONTEXTS['same-context']});
  assert.equal(n.antecedent,'t₀ − 1 ≡₇ t₀ + 1');assert.equal(n.modelCount,0);assert.equal(n.answer,null);assert.equal(n.conclusion,'Mod₇(Γ) = ∅');
});
test('formal terms describe exactly the satisfying calendar pairs for every assignment and target',()=>{
  for(let mask=0;mask<16;mask++)for(let target=0;target<7;target++){
    const bit=(i:number):WorldIndex=>(mask>>i)&1?1:0;
    const input={actual:6,target,contexts:{yesterday:bit(0),tomorrow:bit(1),consequent:bit(2),question:bit(3)}};
    const n=weekdayNotation(input),result=interpretWeekdayWorlds(input),pairs:{actual:number;imagined:number;answer:number}[]=[];
    for(let t0=0;t0<7;t0++)for(let t1=0;t1<7;t1++){
      const values=[t0,t1];
      const left=(values[n.left.world]+n.left.offset+7)%7,right=(values[n.right.world]+n.right.offset+7)%7;
      if(left===right&&values[n.goal.world]===target)pairs.push({actual:t0,imagined:t1,answer:values[n.query.world]});
    }
    assert.deepEqual(pairs,result.solutions);assert.equal(n.modelCount,pairs.length);
    if(n.answer!==null){assert.ok(pairs.length>0);assert.ok(pairs.every(pair=>pair.answer===n.answer));}
  }
});
test('the formalized constraint set requires both A and B, not material implication',()=>{
  const input={actual:0,target:4,contexts:PRESET_CONTEXTS['actual-yesterday']};
  // At (Monday, Monday), A and B are both false; A→B would be true.
  assert.ok(!interpretWeekdayWorlds(input).solutions.some(pair=>pair.actual===0&&pair.imagined===0));
  const n=weekdayNotation({...input,target:0});assert.equal(n.answer,2);assert.equal(n.consequent,'t₁ ≡₇ 0');
});
