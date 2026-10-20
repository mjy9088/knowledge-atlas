import test from 'node:test';
import assert from 'node:assert/strict';
import {createExplosionEpisode} from '../../../../packages/projection/explosion.js';
import {frameAt,timelineVtt} from '../../../../packages/projection/timeline.js';
import {renderPlan} from '../../../../tools/media/renderer.js';
import {deriveProof} from '../../../../packages/models/propositional.js';

test('focused episode keeps question, Q/R/S comparison and removed premise in deterministic snapshots',()=>{
  const timeline=createExplosionEpisode();
  assert.ok(timeline.durationMs<180000);assert.match(timeline.title,/모순/);
  let end=0;
  for(const cue of timeline.cues){
    assert.equal(cue.startMs,end);end=cue.endMs;
    const frame=frameAt(timeline,cue.startMs);
    assert.deepEqual(frame.presentation.snapshot.proof,deriveProof(frame.presentation.snapshot as Parameters<typeof deriveProof>[0]));
    if(cue.activeLine>=0)assert.equal(frame.visibleLines.at(-1)!.formula,frame.presentation.lines[cue.activeLine].formula);
  }
  for(const goal of ['Q','R','S'])assert.ok(timeline.cues.some(c=>c.presentation.goal===goal&&c.activeLine>=0&&c.presentation.lines[c.activeLine].rule.includes('폭발')));
  const removed=timeline.cues.find(c=>c.id!.endsWith(':remove-premise'));
  const frame=frameAt(timeline,removed!.startMs);
  assert.deepEqual(frame.presentation.premises,['P']);assert.equal(frame.presentation.snapshot.proof!.goalReached,false);
  assert.ok(!frame.visibleLines.some(l=>l.formula==='⊥'||l.formula==='S'));
  const before=frameAt(timeline,removed!.startMs);frameAt(timeline,0);frameAt(timeline,90000);assert.deepEqual(frameAt(timeline,removed!.startMs),before);
  assert.match(timelineVtt(timeline),/현실/);assert.equal(renderPlan(timeline).durationMs,timeline.durationMs);
});
test('Shorts export rejects overlong lessons without truncating or accelerating their content',()=>{
  assert.throws(()=>renderPlan({durationMs:180001}),/최대 180초/);
  assert.equal(renderPlan({durationMs:180000}).durationMs,180000);
  assert.ok(renderPlan({durationMs:181000},{width:1920,height:1080}).durationMs>180000);
});
