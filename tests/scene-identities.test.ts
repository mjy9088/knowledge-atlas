import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRelatedPages} from '../packages/site/related-site.js';
import type {ContentCollection,ContentPage,Scene} from '../packages/content/types.js';

const scene:Scene={id:'question',title:'Fixture',block:0,from:0,cards:[],known:'Fixture'};
const page:ContentPage={slug:'fixture',articleId:'article:fixture',label:'Fixture',category:'Fixture',scenes:[scene]};
const collection:ContentCollection={id:'collection:fixture',reviewStatus:'needs-content-review',sourceSnapshotVerified:false,articles:[{id:'article:fixture',conceptId:'concept:fixture',title:'Fixture',reviewStatus:'needs-content-review',relatedConcepts:[],blocks:[{id:'block:fixture',text:'A condition.',claimRefs:[]}]}]};

test('authored scenes cannot hijack evidence, connections or reader controls',()=>{
  for(const id of ['main','evidence','connections','reader-controls','reader-reset']){
    const errors=validateRelatedPages(collection,[],[{...page,scenes:[{...scene,id}]}]);
    assert.ok(errors.some(error=>error.includes('Reserved reader identity')),id);
  }
});

test('scoped evidence and comparison scene names retain their authored meaning',()=>{
  for(const id of ['question','observation','evidence-limit','connections-comparison']){
    assert.deepEqual(validateRelatedPages(collection,[],[{...page,scenes:[{...scene,id}]}]),[]);
  }
});
