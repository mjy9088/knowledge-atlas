import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveProof} from '../../models/propositional.js';
import {createVideoTimeline,frameAt,timelineVtt} from '../timeline.js';

const input = () => {const premises = ['A','A -> B']; const goal = 'B'; return {premises,goal,proof:deriveProof({premises,goal})};};
test('video preserves model proof and freezes input rather than recomputing it',() => {
  const source = input(); const timeline = createVideoTimeline(source);
  assert.deepEqual(timeline.snapshot.proof,source.proof);
  assert.equal(timeline.lines.at(-1)!.formula,'B');
  assert.deepEqual(timeline.lines.at(-1)!.dependsOn,source.proof.lines.at(-1)!.dependsOn);
  source.premises.push('C'); source.proof.lines[0].formula = 'CHANGED';
  assert.deepEqual(timeline.premises,['A','A → B']);
  assert.equal(timeline.lines[0].formula,'A');
  assert.ok(Object.isFrozen(timeline.snapshot.proof!.lines![0]));
});
test('video seek is deterministic out of order with caption and dependency references',() => {
  const timeline = createVideoTimeline(input());
  for (const time of [0,2500,4300,9000,timeline.durationMs,1e8,0]) {
    assert.deepEqual(frameAt(timeline,time),frameAt(createVideoTimeline(input()),time));
  }
  const proofCue = timeline.cues.find(cue => cue.activeLine === timeline.lines.length - 1);
  assert.match(proofCue!.text,/참조 \d+행/);
  assert.equal(frameAt(timeline,proofCue!.startMs).visibleLines.at(-1)!.formula,'B');
  assert.match(frameAt(timeline,timeline.durationMs).caption,/목표 B에 도달/);
  for (const bad of [-1,NaN,Infinity,'1000',null]) assert.throws(() => frameAt(timeline,bad as never));
});
test('VTT covers clip from zero through final caption, unresolved goal stays qualified',() => {
  const unresolved = createVideoTimeline({premises:[],goal:'Z',proof:{lines:[],goalReached:false}});
  assert.equal(unresolved.durationMs,10000);
  assert.match(frameAt(unresolved,unresolved.durationMs).caption,/일반적인 증명 불가능성을 뜻하지/);
  const vtt = timelineVtt(unresolved);
  assert.match(vtt,/^WEBVTT\n\n/);
  assert.match(vtt,/00:00:00.000 --> 00:00:02.500/);
  assert.match(vtt,/00:00:02.500 --> 00:00:10.000/);
});
test('long proof preserves readable per-step timing; every proof line has a cue',() => {
  const lines = Array.from({length:64},(_,index) => ({id:`line-${index+1}`,formula:'A',rule:'premise',dependsOn:[]}));
  const timeline = createVideoTimeline({premises:['A'],goal:'A',proof:{lines,goalReached:true}});
  assert.equal(timeline.durationMs,2500+64*1800+3000);
  assert.ok(timeline.cues.filter(cue=>cue.activeLine>=0).every(cue=>cue.endMs-cue.startMs>=1800));
  assert.equal(timeline.cues.length,lines.length+2);
});
test('animations derive from time alone and reduced motion preserves the proof',() => {
  const timeline=createVideoTimeline(input());
  const moving=frameAt(timeline,2600),still=frameAt(timeline,2600,{reducedMotion:true});
  assert.ok(moving.transition>0 && moving.transition<1);
  assert.equal(still.transition,1);assert.equal(still.dependencyPulse,1);
  assert.equal(moving.activeLine,still.activeLine);assert.equal(moving.caption,still.caption);
  assert.deepEqual(moving.visibleLines,still.visibleLines);
  assert.equal(frameAt(timeline,2950).transition,1);
});
test('playback and VTT use display symbols while raw inputs remain reproducible',()=>{
  const timeline=createVideoTimeline({premises:['A -> B','!C & D','E | F'],goal:'!C',proof:{lines:[],goalReached:false}});
  assert.deepEqual(timeline.premises,['A → B','¬C ∧ D','E ∨ F']);
  assert.equal(timeline.goal,'¬C');
  assert.deepEqual(timeline.snapshot.premises,['A -> B','!C & D','E | F']);
  assert.match(frameAt(timeline,0).caption,/A → B/);
  assert.match(timelineVtt(timeline),/¬C ∧ D/);
});
