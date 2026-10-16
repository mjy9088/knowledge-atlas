import test from 'node:test';
import assert from 'node:assert/strict';
import {createPremiseExperiment} from '../apps/web/components/experiment/premise-editor.js';
import {describeExperiment} from '../apps/web/topics/formal-reasoning/dialogue.js';
import {EXPLOSION_EPISODE} from '../content/formal-logic/explosion/episode.js';
const inspect=(input: Parameters<typeof createPremiseExperiment>[0]["suggestion"])=>createPremiseExperiment({suggestion:input}).inspect();

test('changed targets and contradiction symbols replace the fixed example in dialogue and diagram selection',()=>{
  const info=inspect({premises:['A','¬A'],goal:'Z'});
  for(const id of ['explosion','change-r','change-s']){
    const copy=describeExperiment(id,info);
    assert.equal(copy.status,'adapted');assert.match(copy.title,/Z/);assert.match(copy.text,/Z/);
    assert.equal(info.proof!.lines[copy.stepIndex!].formula,'Z');assert.ok(!copy.text.includes('R로 바꿨습니다'));
  }
  const contradiction=describeExperiment('contradiction',info);
  assert.match(contradiction.text,/A와 ¬A/);assert.ok(!contradiction.text.includes('P와'));
  assert.equal(info.proof!.lines[contradiction.stepIndex!].rule,'contradiction');
});
test('a conditional proof invalidates explosion copy and explains the actual referenced derivation',()=>{
  const info=inspect({premises:['A','A → B'],goal:'B'}),copy=describeExperiment('explosion',info);
  assert.equal(copy.status,'unavailable');assert.match(copy.title,/폭발 단계가 없습니다/);
  assert.match(copy.text,/→ 제거/);assert.match(copy.text,/B/);
  assert.equal(info.proof!.lines[copy.stepIndex!].rule,'modus-ponens');
  const removed=describeExperiment('remove-premise',info);
  assert.match(removed.title,/제외된 전제가 없습니다/);assert.ok(!removed.text.includes('P만 남'));
});
test('missing goals and malformed inputs invalidate every chapter instead of retaining authored copy',()=>{
  const missing=inspect({premises:[{formula:'P',enabled:true},{formula:'¬P',enabled:false}],goal:'Z'});
  const invalid=inspect({premises:['P'],goal:'Z →'});
  for(const section of EXPLOSION_EPISODE.sections){
    const copy=describeExperiment(section.id,missing);
    assert.equal(copy.status,'unavailable');assert.equal(copy.stepIndex,null);assert.match(copy.text,/Z/);
    assert.match(copy.text,/다른 모든 증명/);assert.notEqual(copy.text,section.text);
    const bad=describeExperiment(section.id,invalid);
    assert.equal(bad.status,'invalid');assert.equal(bad.stepIndex,null);assert.notEqual(bad.text,section.text);
  }
});
test('already-given goals and stopped proof search do not fabricate explosion or consistency judgments',()=>{
  const info=inspect({premises:['A','¬A'],goal:'A'});
  assert.match(describeExperiment('summary',info).text,/이미 포함한 전제/);
  assert.equal(describeExperiment('explosion',info).status,'unavailable');
  const consistency=describeExperiment('consistency',info);
  assert.match(consistency.text,/일관성을 증명한 것은 아닙니다/);
  assert.equal(info.proof!.lines[consistency.stepIndex!].rule,'premise');
});
