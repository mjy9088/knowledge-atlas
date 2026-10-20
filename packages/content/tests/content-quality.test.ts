import test from 'node:test';
import assert from 'node:assert/strict';
import {validateQuality,validateContentLimit} from '../quality.js';

function fixture(){
  return {
    schemaVersion:1,articleId:'article:fixture',seriesId:'series:fixture',
    openingQuestion:'Which condition changes the result?',readerOutcome:'Explain the result from the declared conditions.',
    assumedKnowledge:['integer addition'],misconception:'The result is independent of the conditions.',
    transfer:{question:'What if one condition changes?',answer:'The result changes.',rationale:'Reapply the same rule to the new condition.'},
    narration:{status:'planned',seconds:90,segments:[{sceneId:'question',seconds:30},{sceneId:'reasoning',seconds:60}]},
    review:{status:'review-required',blockers:['Independent source and pedagogy review pending.']},
  };
}
const identity={articleId:'article:fixture',seriesId:'series:fixture',sceneIds:['question','reasoning']};

test('quality accepts a bounded plan without treating it as measured or approved',()=>{
  // Given a planned explanation with every scene budgeted.
  const candidate=fixture();
  // When checking its structural authoring contract.
  const errors=validateQuality(candidate,identity);
  // Then it is a valid review candidate, not an approval.
  assert.deepEqual(errors,[]);
  assert.equal(candidate.review.status,'review-required');
});

test('quality rejects missing, repeated and foreign scene timing without deriving expectations from the candidate',()=>{
  // Given independent expected scene identities.
  const candidate=fixture();
  candidate.narration.segments=[{sceneId:'question',seconds:30},{sceneId:'question',seconds:60},{sceneId:'foreign',seconds:1}];
  // When checking the plan against the reader scenes.
  const errors=validateQuality(candidate,identity);
  // Then coverage, identity and timing defects are reported.
  assert.ok(errors.some(error=>error.includes('scene coverage')));
  assert.ok(errors.some(error=>error.includes('duration sum')));
});

test('quality rejects overlong, malformed and falsely measured or approved records',()=>{
  // Given untrusted records that cross editorial boundaries.
  const candidates:unknown[]=[null,{}, {...fixture(),articleId:'article:other'},
    {...fixture(),narration:{status:'measured',seconds:90,segments:[]}},
    {...fixture(),narration:{status:'planned',seconds:181,segments:[{sceneId:'question',seconds:90},{sceneId:'reasoning',seconds:91}]}},
    {...fixture(),transfer:{question:'',answer:'',rationale:''}},
    {...fixture(),review:{status:'approved',blockers:[]}},
    {...fixture(),narration:{...fixture().narration,measuredSeconds:90,audioApproved:true}},
    {...fixture(),review:{...fixture().review,expertApproved:true}}];
  // When validating each input at the file boundary.
  const results=candidates.map(candidate=>validateQuality(candidate,identity));
  // Then none silently receives candidate status.
  assert.ok(results.every(errors=>errors.length>0));
});

test('production cap includes existing articles and rejects duplicates rather than silently dropping them',()=>{
  // Given the complete registered population, not only this series.
  const ids=Array.from({length:100},(_,index)=>`article:${index}`);
  // When checking the boundary and two invalid populations.
  const results=[validateContentLimit(ids),validateContentLimit([...ids,'article:100']),validateContentLimit([...ids,'article:0'])];
  // Then exactly 100 fits and both overflow and duplicate ownership fail.
  assert.deepEqual(results[0],[]);
  assert.ok(results[1].some(error=>error.includes('100')));
  assert.ok(results[2].some(error=>error.includes('duplicate')));
});
