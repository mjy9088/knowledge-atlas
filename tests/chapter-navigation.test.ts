import test from 'node:test';
import assert from 'node:assert/strict';
import {createRelatedReader} from '../apps/web/components/reader/state.js';
import {validateRelatedPages} from '../packages/site/related-site.js';
import type {ContentCollection,ContentPage,Scene} from '../packages/content/types.js';

const scene=(id:string,block:number):Scene=>({id,title:id,block,from:0,cards:[],known:id});
const page:ContentPage={
  slug:'fixture',articleId:'article:fixture',label:'Fixture',category:'Fixture',
  scenes:[scene('opening',0),scene('detail-a',1),scene('detail-b',2),scene('closing',3)],
  navigation:{chapters:[
    {kind:'mainline',id:'argument',title:'Argument',sceneIds:['opening','closing']},
    {kind:'detour',id:'details',title:'Details',sceneIds:['detail-a','detail-b'],parentSceneId:'opening',returnSceneId:'opening'},
  ]},
};
const collection:ContentCollection={
  id:'collection:fixture',reviewStatus:'needs-content-review',sourceSnapshotVerified:false,
  articles:[{id:'article:fixture',conceptId:'concept:fixture',title:'Fixture',reviewStatus:'needs-content-review',relatedConcepts:[],blocks:[0,1,2,3].map(index=>({id:`block:${index}`,text:`Sentence ${index}.`,claimRefs:[]}))}],
};

test('mainline traversal bypasses detours while detour boundaries return explicitly',()=>{
  // Given a work with one optional chapter.
  const reader=createRelatedReader(page);
  // When the mainline and detour controls advance independently.
  reader.next();
  assert.equal(reader.getState().sceneId,'closing');
  reader.setState({sceneId:'detail-a'});reader.previous();
  assert.equal(reader.getState().sceneId,'opening');
  reader.setState({sceneId:'detail-b'});reader.next();
  // Then no hidden history is needed to return to the declared mainline scene.
  assert.equal(reader.getState().sceneId,'opening');
});

test('direct entry, reset and restoration depend only on scene identity',()=>{
  // Given direct entry into the last detour scene.
  const reader=createRelatedReader(page);reader.setState({sceneId:'detail-b'});
  const saved=reader.getState();
  // When unrelated traversal and reset happen before restoration.
  reader.next();reader.reset();reader.setState(saved);
  // Then the exact direct-entry state is restored without a history stack.
  assert.deepEqual(reader.getState(),saved);
});

test('chapter validation requires exact coverage and mainline parent and return targets',()=>{
  // Given valid chapter metadata, then it covers every authored scene exactly once.
  assert.deepEqual(validateRelatedPages(collection,[],[page]),[]);
  // When coverage overlaps or a detour points to another detour.
  const overlap=structuredClone(page);overlap.navigation?.chapters[0].sceneIds.push('detail-a');
  const nested=structuredClone(page);const chapter=nested.navigation?.chapters[1];
  if(chapter?.kind==='detour')chapter.parentSceneId='detail-a';
  // Then both invalid navigation graphs are rejected.
  assert.ok(validateRelatedPages(collection,[],[overlap]).some(error=>error.includes('chapter coverage')));
  assert.ok(validateRelatedPages(collection,[],[nested]).some(error=>error.includes('mainline')));
});

test('chapter validation rejects duplicate identities and empty chapters',()=>{
  const duplicate=structuredClone(page);if(duplicate.navigation)duplicate.navigation.chapters[1].id='argument';
  const empty=structuredClone(page);empty.navigation?.chapters.push({kind:'mainline',id:'empty',title:'Empty',sceneIds:[]});
  assert.ok(validateRelatedPages(collection,[],[duplicate]).some(error=>error.includes('chapter identities')));
  assert.ok(validateRelatedPages(collection,[],[empty]).some(error=>error.includes('empty chapter')));
});
