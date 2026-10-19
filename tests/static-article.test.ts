import test from 'node:test';
import assert from 'node:assert/strict';
import article from '../content/number-systems/counting-zero/article.ko.json';
import quality from '../content/number-systems/counting-zero/quality.json';
import page from '../content/number-systems/counting-zero/page.js';
import physicsArticle from '../content/physics-discovery/inertial-motion/article.ko.json';
import physicsQuality from '../content/physics-discovery/inertial-motion/quality.json';
import physicsPage from '../content/physics-discovery/inertial-motion/page.js';
import {sceneText} from '../content/catalog.js';
import {createStaticArticleTimeline,staticArticleFrameAt,createStaticArticleCursor} from '../packages/projection/static-article.js';

test('canonical static articles preserve all scene text and planned timing',()=>{
  // Given canonical inputs from two domains.
  for(const input of [{article,page,quality},{article:physicsArticle,page:physicsPage,quality:physicsQuality}]){
    // When a silent projection is constructed.
    const timeline=createStaticArticleTimeline(input);
    // Then each hard cut carries the canonical text and complete reader identity.
    assert.equal(timeline.durationMs,input.quality.narration.seconds*1000);
    assert.equal(timeline.timingStatus,'planned');
    let end=0;
    timeline.cues.forEach((cue,index)=>{
      assert.equal(cue.startMs,end);
      assert.equal(cue.endMs-cue.startMs,input.quality.narration.segments[index].seconds*1000);
      assert.deepEqual(cue.readerState,{sceneId:input.page.scenes[index].id});
      assert.equal(cue.text,sceneText(input.article,input.page.scenes[index]));
      end=cue.endMs;
    });
  }
});

test('independent lookup selects the next scene at a cut and clamps the endpoint',()=>{
  // Given a canonical timeline, regardless of earlier seeks.
  const timeline=createStaticArticleTimeline({article,page,quality});
  // When times are requested in reverse and unordered order.
  const frames=[116000,22000,0,21999,999999].map(time=>staticArticleFrameAt(timeline,time));
  // Then half-open intervals and final-state clamping are stable.
  assert.deepEqual(frames.map(frame=>frame.readerState.sceneId),['transfer','empty-set','question','question','transfer']);
  assert.equal(frames[4].timeMs,116000);
});

test('cursor restores serialized state and resets without hidden prior interaction',()=>{
  // Given a cursor that has already visited its end.
  const cursor=createStaticArticleCursor(createStaticArticleTimeline({article,page,quality}));
  cursor.seek(116000);
  // When an earlier serialized state is restored.
  const restored=cursor.setState(JSON.parse(JSON.stringify({version:1,articleId:article.id,timeMs:22000})));
  // Then it selects that scene independently, and reset returns to the opening.
  assert.equal(restored.readerState.sceneId,'empty-set');
  assert.deepEqual(cursor.getState(),{version:1,articleId:article.id,timeMs:22000});
  assert.equal(cursor.reset().readerState.sceneId,'question');
});

test('invalid saved states and time inputs are rejected atomically',()=>{
  // Given a noninitial cursor.
  const timeline=createStaticArticleTimeline({article,page,quality});
  const cursor=createStaticArticleCursor(timeline);
  cursor.seek(44000);
  const before=cursor.getState();
  // When malformed, foreign, or out-of-bounds states are submitted.
  for(const state of [null,[],{}, {...before,version:2},{...before,articleId:'foreign'},
    {...before,timeMs:-1},{...before,timeMs:116001},{...before,timeMs:NaN},{...before,sceneId:'transfer'}]){
    assert.throws(()=>cursor.setState(state));
    // Then the previously accepted state survives.
    assert.deepEqual(cursor.getState(),before);
  }
  for(const time of [-1,NaN,Infinity]){
    assert.throws(()=>cursor.seek(time));
    assert.throws(()=>staticArticleFrameAt(timeline,time));
    assert.deepEqual(cursor.getState(),before);
  }
});

test('returned snapshots cannot mutate the timeline or cursor',()=>{
  // Given a timeline and cursor.
  const timeline=createStaticArticleTimeline({article,page,quality});
  const cursor=createStaticArticleCursor(timeline);
  const frame=cursor.seek(0),state=cursor.getState();
  // When consumers modify detached output.
  Reflect.set(frame.readerState,'sceneId','foreign');state.timeMs=99000;
  // Then subsequent lookups and cursor state remain unchanged.
  assert.equal(staticArticleFrameAt(timeline,0).readerState.sceneId,'question');
  assert.equal(cursor.getState().timeMs,0);
  assert.ok(Object.isFrozen(timeline.cues[0].readerState));
});

test('unsupported pages and inconsistent timing fail before a timeline is returned',()=>{
  // Given canonical source with one invalid boundary input per case.
  const inputs=[
    {article,page:{...page,slug:'negative-numbers'},quality},
    {article,page:{...page,articleId:'foreign'},quality},
    {article,page:{...page,model:'classical' as const},quality},
    {article,page:{...page,interactive:'binary-search' as const},quality},
    {article,page,quality:{...quality,narration:{...quality.narration,seconds:117}}},
    {article,page,quality:{...quality,narration:{...quality.narration,segments:[...quality.narration.segments].reverse()}}},
    {article,page:{...page,scenes:[{...page.scenes[0],block:999},...page.scenes.slice(1)]},quality},
  ];
  // When construction is attempted, then every invalid source is rejected.
  for(const input of inputs)assert.throws(()=>createStaticArticleTimeline(input));
});
