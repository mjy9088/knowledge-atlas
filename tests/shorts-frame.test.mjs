import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveProof} from '../packages/models/propositional.mjs';
import {INFERENCE_PRESETS} from '../apps/web/inference-presets.mjs';
import {createVideoTimeline} from '../apps/web/inference-video.mjs';
import {shortsFrame,advanceShortsTime} from '../apps/web/shorts-frame.mjs';
test('first RAF timestamp cannot rewind playback and elapsed time stops at the end',()=>{
  assert.equal(advanceShortsTime(0,-3,1000),0);
  assert.equal(advanceShortsTime(400,-3,1000),400);
  assert.equal(advanceShortsTime(400,16,1000),416);
  assert.equal(advanceShortsTime(999,16,1000),1000);
});
test('portrait presentation keeps the existing timeline and proof across out-of-order seeks',()=>{
  for(const preset of Object.values(INFERENCE_PRESETS)){
    const proof=deriveProof(preset),timeline=createVideoTimeline({...preset,proof});
    const initial=shortsFrame(timeline,0);
    assert.equal(initial.phase,'intro');
    assert.equal(shortsFrame(timeline,timeline.durationMs).phase,'outro');
    proof.lines.forEach((line,index)=>{const time=2500+index*1800,frame=shortsFrame(timeline,time);assert.equal(frame.phase,'step');assert.equal(frame.activeLine,index);assert.equal(timeline.lines[index].formula,line.formula);assert.deepEqual(timeline.lines[index].dependsOn,line.dependsOn);});
    assert.deepEqual(shortsFrame(timeline,0),initial);
    assert.throws(()=>shortsFrame(timeline,-1),RangeError);
    assert.throws(()=>shortsFrame(timeline,NaN),RangeError);
    assert.throws(()=>shortsFrame(timeline,Infinity),RangeError);
    assert.equal(shortsFrame(timeline,timeline.durationMs+1000).phase,'outro');
  }
});
