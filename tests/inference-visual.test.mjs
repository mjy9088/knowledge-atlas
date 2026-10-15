import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveProof} from '../packages/models/propositional.mjs';
import {visualForStep} from '../apps/web/components/inference/visual.mjs';

test('static derivation diagram preserves model dependencies and current formula',()=>{
  const premises=['A','A -> B'],goal='B',proof=deriveProof({premises,goal});
  const original=structuredClone(proof),step=proof.lines.length-1;
  const visual=visualForStep({premises,goal,proof,step});
  assert.equal(visual.kind,'derivation');assert.equal(visual.current.formula,'B');
  assert.deepEqual(visual.dependencies.map(line=>line.id),proof.lines[step].dependsOn);
  assert.deepEqual(visual.dependencies.map(line=>line.formula),['(A → B)','A']);
  assert.equal(visual.rule,'→ 제거 (전건 긍정)');assert.deepEqual(proof,original);
  visual.dependencies[0].formula='changed';assert.deepEqual(proof,original);
});
test('premise step does not invent derivation; goal status refers to full exploration',()=>{
  const premises=['A','A -> B'],goal='B',proof=deriveProof({premises,goal});
  const visual=visualForStep({premises,goal,proof,step:0});
  assert.equal(visual.kind,'premise');assert.deepEqual(visual.dependencies,[]);
  assert.equal(visual.current.formula,'A');assert.equal(visual.goalReached,true);
  assert.match(visual.overall,/전체 탐색/);
  assert.deepEqual(visual.premises,['A','A → B']);
});
test('empty and unsupported selections are explicit and do not imply unprovability',()=>{
  const proof=deriveProof({premises:[],goal:'Z'});
  const visual=visualForStep({premises:[],goal:'Z',proof});
  assert.equal(visual.kind,'empty');assert.equal(visual.current,null);
  assert.match(visual.limitation,/일반적인 증명 불가능성/);
  const nonempty=deriveProof({premises:['A'],goal:'B'});
  for(const step of [-1,0.5,999,'0']) assert.throws(()=>visualForStep({proof:nonempty,step}));
  assert.throws(()=>visualForStep({proof:null}));
});
test('missing recorded dependency is visible rather than invented',()=>{
  const visual=visualForStep({goal:'B',proof:{lines:[{id:'line-2',formula:'B',rule:'modus-ponens',dependsOn:['line-missing']}],goalReached:true},step:0});
  assert.equal(visual.dependencies[0].missing,true);
  assert.match(visual.dependencies[0].formula,/찾을 수 없음/);
});
