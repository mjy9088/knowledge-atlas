import test from 'node:test';
import assert from 'node:assert/strict';
import {createRelatedReader,readerSkip} from '../state.js';
import {validateRelatedPages} from '../../../../../packages/site/related-site.js';
import {orderScenes} from '../../../../../packages/content/reading-order.js';
import {CONTENT_PAGES} from '../../../../../content/catalog.js';
import type {ContentCollection,ContentPage,Scene} from '../../../../../packages/content/types.js';

const scene=(id:string,block:number):Scene=>({id,title:id,block,from:0,cards:[],known:id});
const page:ContentPage={
  slug:'fixture',articleId:'article:fixture',label:'Fixture',category:'Fixture',
  scenes:[scene('opening',0),{...scene('detail-a',1),skip:{to:'closing',label:'Details 건너뛰기'}},scene('detail-b',2),scene('closing',3)],
  navigation:{chapters:[
    {id:'argument',title:'Argument',sceneIds:['opening','closing']},
    {id:'details',title:'Details',sceneIds:['detail-a','detail-b']},
  ]},
};
const collection:ContentCollection={
  id:'collection:fixture',reviewStatus:'needs-content-review',sourceSnapshotVerified:false,
  articles:[{id:'article:fixture',conceptId:'concept:fixture',title:'Fixture',reviewStatus:'needs-content-review',relatedConcepts:[],blocks:[0,1,2,3].map(index=>({id:`block:${index}`,text:`Sentence ${index}.`,claimRefs:[]}))}],
};

test('Next and Previous include every scene exactly once in both directions on every active reader',()=>{
  for(const candidate of [page,...CONTENT_PAGES]){
    const reader=createRelatedReader(candidate),visited=[reader.getState().sceneId];
    for(let index=1;index<candidate.scenes.length;index++){reader.next();visited.push(reader.getState().sceneId);}
    assert.deepEqual(visited,candidate.scenes.map(scene=>scene.id));
    reader.next();assert.equal(reader.getState().sceneId,visited.at(-1));
    for(let index=candidate.scenes.length-2;index>=0;index--){reader.previous();assert.equal(reader.getState().sceneId,visited[index]);}
  }
});

test('skipping is explicit and normal traversal still includes the skipped section',()=>{
  const reader=createRelatedReader(page);reader.next();
  const skip=readerSkip(page,reader.getState().sceneId);assert.ok(skip);
  assert.equal(skip.to,'closing');assert.equal(skip.scope,'detail-a · detail-b');
  reader.setState({sceneId:skip.to});reader.previous();assert.equal(reader.getState().sceneId,'detail-b');
  const saved=reader.getState();reader.reset();reader.setState(saved);reader.next();assert.equal(reader.getState().sceneId,'closing');
});

test('chapter validation requires complete unique coverage and nonempty groups',()=>{
  assert.deepEqual(validateRelatedPages(collection,[],[page]),[]);
  const overlap=structuredClone(page);overlap.navigation?.chapters[0].sceneIds.push('detail-a');
  assert.ok(validateRelatedPages(collection,[],[overlap]).some(error=>error.includes('chapter coverage')));
  const duplicate=structuredClone(page);if(duplicate.navigation)duplicate.navigation.chapters[1].id='argument';
  const empty=structuredClone(page);empty.navigation?.chapters.push({id:'empty',title:'Empty',sceneIds:[]});
  assert.ok(validateRelatedPages(collection,[],[duplicate]).some(error=>error.includes('chapter identities')));
  assert.ok(validateRelatedPages(collection,[],[empty]).some(error=>error.includes('empty chapter')));
});

test('declaring a reading order rejects missing, duplicate and unsupported scenes',()=>{
  const before=structuredClone(page);
  for(const ids of [['opening','closing'],['opening','detail-a','detail-a','closing'],['opening','detail-a','unknown','closing']])assert.throws(()=>orderScenes(page,ids));
  assert.deepEqual(page,before);
});
