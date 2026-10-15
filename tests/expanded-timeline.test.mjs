import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveProof} from '../packages/models/propositional.mjs';
import {INFERENCE_PRESETS} from '../apps/web/inference-presets.mjs';
import {createVideoTimeline,frameAt,timelineVtt} from '../apps/web/inference-video.mjs';
test('lab explanation uses content length rather than padding to three minutes, with unchanged proof',()=>{
  for(const preset of Object.values(INFERENCE_PRESETS)){
    const proof=deriveProof(preset),timeline=createVideoTimeline({...preset,proof},{expanded:true});
    assert.ok(timeline.durationMs>10000&&timeline.durationMs<180000);
    assert.deepEqual(timeline.snapshot.proof,proof);
    let end=0;const ids=new Set();
    for(const cue of timeline.cues){assert.equal(cue.startMs,end);assert.ok(cue.endMs>cue.startMs);end=cue.endMs;assert.ok(cue.claimRefs.length);assert.ok(cue.title);assert.ok(!ids.has(cue.id));ids.add(cue.id);}
    proof.lines.forEach((line,index)=>{const cues=timeline.cues.filter(cue=>cue.activeLine===index);assert.equal(cues.length,2);assert.match(cues[0].text,new RegExp(line.formula.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.deepEqual(timeline.lines[index].dependsOn,line.dependsOn);});
    const before=frameAt(timeline,0);for(const time of [60000,120000,180000,24000])frameAt(timeline,time);assert.deepEqual(frameAt(timeline,0),before);
    assert.equal(frameAt(timeline,0).phase,'intro');assert.match(timelineVtt(timeline),/^WEBVTT/);
  }
});
test('expanded lesson handles empty and long proofs without compressing steps',()=>{
  const empty=createVideoTimeline({premises:[],goal:'Z',proof:{lines:[],goalReached:false}},{expanded:true});
  assert.ok(empty.durationMs<180000);assert.ok(empty.cues.some(cue=>/일반적/.test(cue.text)));
  const lines=Array.from({length:64},(_,i)=>({id:`line-${i+1}`,formula:'A',rule:'premise',dependsOn:[]}));
  const long=createVideoTimeline({premises:['A'],goal:'A',proof:{lines,goalReached:true}},{expanded:true});
  assert.ok(long.cues.filter(c=>c.activeLine>=0).every(c=>c.endMs-c.startMs>=1800));assert.ok(long.durationMs>180000);
});
