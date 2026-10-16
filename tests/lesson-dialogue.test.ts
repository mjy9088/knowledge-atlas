import test from 'node:test';
import assert from 'node:assert/strict';
import {createLessonDialogue} from '../apps/web/pages/lesson/state.js';

test('reader moves freely, skips known chapters and restores scene state without a clock',()=>{
  const reader=createLessonDialogue();
  assert.deepEqual(reader.getState(),{sectionId:'question'});
  reader.previous();assert.equal(reader.inspect().canPrevious,false);
  reader.next();assert.equal(reader.getState().sectionId,'symbols');
  reader.skip();assert.equal(reader.getState().sectionId,'premise-p');
  reader.skip();assert.equal(reader.getState().sectionId,'change-r');
  const saved=reader.getState();reader.setState({sectionId:'remove-premise'});
  assert.equal(reader.inspect().section.scene,'missing');
  reader.setState(saved);assert.equal(reader.inspect().section.scene,'R');
  reader.setState({sectionId:'summary'});reader.next();reader.skip();
  assert.equal(reader.getState().sectionId,'summary');assert.equal(reader.inspect().canNext,false);
  reader.reset();assert.equal(reader.getState().sectionId,'question');
});
test('unsupported positions cannot change the reader or mutate the canonical explanation',()=>{
  const reader=createLessonDialogue();reader.setState({sectionId:'explosion'});
  const initial=reader.inspect();const detached=reader.inspect();detached.section.text='changed';
  detached.section.claimRefs.push('invented');assert.deepEqual(reader.inspect(),initial);
  for(const state of [null,{}, {sectionId:2},{sectionId:'unknown'}]){
    assert.throws(()=>reader.setState(state as never));assert.deepEqual(reader.inspect(),initial);
  }
  for(const time of [-1,NaN,Infinity,'12'])assert.throws(()=>reader.seek(time as never));
  reader.seek(80000);assert.equal(reader.getState().sectionId,'remove-premise');
  reader.seek(0);assert.equal(reader.getState().sectionId,'question');
  reader.seek(1e6);assert.equal(reader.getState().sectionId,'summary');
});
