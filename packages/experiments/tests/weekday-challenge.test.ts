import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshWeekdayChallenge,validateWeekdayChallenge,advanceWeekdayChallenge,answerWeekdayChallenge,weekdayChallengeAt,type WeekdayChallenge} from '../weekday-challenge.js';

const live=():WeekdayChallenge=>({...freshWeekdayChallenge(),phase:'running',promptTarget:4,playback:'live'});
test('a weekday choice before the deadline records a choice without grading it',()=>{
  const before=advanceWeekdayChallenge(live(),19_999),answer=answerWeekdayChallenge(before,2);
  assert.equal(answer.phase,'answered');assert.equal(answer.answer,2);assert.equal(answer.elapsedMs,19_999);assert.equal(answer.playback,'paused');
  assert.deepEqual(advanceWeekdayChallenge(answer,100_000),answer);assert.equal(before.answer,null);
});
test('the exact 20-second deadline rejects a late answer and long timer gaps do not grant extra time',()=>{
  for(const delta of [20_000,20_001,90_000]){const expired=advanceWeekdayChallenge(live(),delta);assert.equal(expired.phase,'expired');assert.equal(expired.elapsedMs,20_000);assert.equal(expired.answer,null);assert.deepEqual(answerWeekdayChallenge(expired,6),expired);}
});
test('independent challenge frames are frozen and do not inherit earlier answers or reflection',()=>{
  const later=weekdayChallengeAt(18_000,0),earlier=weekdayChallengeAt(5_000,4);
  assert.equal(later.elapsedMs,18_000);assert.equal(earlier.elapsedMs,5_000);assert.equal(earlier.playback,'paused');assert.equal(earlier.answer,null);assert.equal(earlier.promptTarget,4);
  assert.equal(weekdayChallengeAt(100_000).phase,'expired');assert.equal(weekdayChallengeAt(100_000).elapsedMs,20_000);
});
test('challenge restoration validates phase, elapsed time, prompt, choice without aliasing',()=>{
  const original=answerWeekdayChallenge(advanceWeekdayChallenge(live(),1234),6),restored=validateWeekdayChallenge(original);restored.answer=2;assert.notEqual(original.answer,restored.answer);
  for(const patch of [{elapsedMs:NaN},{elapsedMs:-1},{elapsedMs:20_001},{phase:'unknown'},{phase:'running',answer:2},{answer:7},{promptTarget:null},{promptTarget:7},{unexpected:true},{playback:'live'},{phase:'expired',elapsedMs:10,answer:null}])assert.throws(()=>validateWeekdayChallenge({...original,...patch}));
  for(const ms of [-1,NaN,Infinity])assert.throws(()=>weekdayChallengeAt(ms));
});
