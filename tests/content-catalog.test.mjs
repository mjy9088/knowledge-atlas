import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContentCatalog} from '../packages/content/load-catalog.mjs';

function fixture(){
  const entry={directory:'measurement/sample',article:'article.en.json',claims:'claims.json',page:{slug:'sample',articleId:'article:sample'}};
  const registry={entries:[entry],claimFiles:['content/measurement/sample/claims.json'],collectionFile:'content/collections/sample.json'};
  const files={
    'content/collections/sample.json':{id:'collection:sample',reviewStatus:'needs-content-review'},
    'sources/registry.json':[],
    'content/measurement/sample/claims.json':[{id:'claim:sample'}],
    'content/measurement/sample/article.en.json':{id:'article:sample',title:'Test fixture',blocks:[]},
  };
  return {registry,files,read:async name=>structuredClone(files[name])};
}
test('catalog loads a topic and language through supplied I/O without a logic-specific directory',async()=>{
  const f=fixture(),result=await loadContentCatalog(f.read,f.registry);
  assert.equal(result.collection.articles[0].id,'article:sample');
  assert.deepEqual(result.claims,[{id:'claim:sample'}]);
  assert.equal(result.collection.reviewStatus,'needs-content-review');
});
test('catalog rejects ambiguous routes, duplicate claim ownership, and mismatched article identities',async()=>{
  const f=fixture();
  await assert.rejects(loadContentCatalog(f.read,{...f.registry,entries:[...f.registry.entries,...f.registry.entries]}),/route\/article/);
  await assert.rejects(loadContentCatalog(f.read,{...f.registry,claimFiles:[...f.registry.claimFiles,...f.registry.claimFiles]}),/claim ownership/);
  f.files['content/measurement/sample/article.en.json'].id='article:other';
  await assert.rejects(loadContentCatalog(f.read,f.registry),/identity mismatch/);
});
test('invalid catalog paths are rejected before invoking a data reader',async()=>{
  const f=fixture();let reads=0;const read=async()=>{reads++;};
  await assert.rejects(loadContentCatalog(read,{...f.registry,entries:[{...f.registry.entries[0],directory:'../outside'}]}),/entry path/);
  await assert.rejects(loadContentCatalog(read,{...f.registry,claimFiles:['content/../outside.json']}),/data path/);
  assert.equal(reads,0);
});
