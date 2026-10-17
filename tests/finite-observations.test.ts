import test from 'node:test';
import assert from 'node:assert/strict';
import {familyObservation,montyObservation} from '../packages/models/finite-observations.js';
test('family filtering and individual observation preserve different evidence multiplicities',()=>{
 const filter=familyObservation('filter'),child=familyObservation('child');
 assert.deepEqual(filter.map(r=>r.posterior),[1/3,1/3,1/3,0]);assert.deepEqual(child.map(r=>r.posterior),[.5,.25,.25,0]);
 // Independent eight equally likely (family, selected child) outcomes: four display a boy, two from BB.
 const observations=['BB','BG','GB','GG'].flatMap(family=>[0,1].map(index=>({family,sex:family[index]}))).filter(o=>o.sex==='B');
 assert.equal(observations.length,4);assert.equal(child[0].posterior,observations.filter(o=>o.family==='BB').length/observations.length);
});
test('Monty unconditional strategy is tie-policy independent, while a numbered-door posterior can change',()=>{
 for(const tie of [0,.2,.5,.8,1]){assert.ok(Math.abs(montyObservation('informed',undefined,tie).switchProbability!-2/3)<1e-12);assert.equal(montyObservation('blind',undefined,tie).switchProbability,.5);}
 assert.equal(montyObservation('informed',3,0).switchProbability,.5);assert.equal(montyObservation('informed',3,1).switchProbability,1);
 const blind=montyObservation('blind');assert.equal(blind.rows.length,4);assert.equal(blind.rows.filter(r=>r.switchWins).length,2);assert.ok(Math.abs(blind.denominator-2/3)<1e-12);
 assert.throws(()=>montyObservation('informed',undefined,NaN));
});
