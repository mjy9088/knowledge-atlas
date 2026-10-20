import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContentCatalog} from '../packages/content/load-catalog.js';
import {execFileSync} from 'node:child_process';
import {CONTENT_ENTRIES,CONTENT_PAGES,INDEX_PAGES} from '../content/catalog.js';

function fixture(){
  const entry={directory:'measurement/sample',article:'article.en.json',claims:'claims.json',articleId:'article:sample'};
  const registry={entries:[entry],claimFiles:['content/measurement/sample/claims.json'],collectionFile:'content/collections/sample.json'};
  const files={
    'content/collections/sample.json':{id:'collection:sample',reviewStatus:'needs-content-review'},
    'sources/registry.json':[],
    'content/measurement/sample/claims.json':[{id:'claim:sample'}],
    'content/measurement/sample/article.en.json':{id:'article:sample',title:'Test fixture',blocks:[]},
  };
  return {registry,files,read:async (name: string)=>{if(!(name in files))throw new Error("Unknown fixture path "+name);return structuredClone(files[name as keyof typeof files]);}};
}
test('catalog loads a topic and language through supplied I/O without a logic-specific directory',async()=>{
  const f=fixture(),result=await loadContentCatalog(f.read,f.registry);
  assert.equal(result.collection.articles[0].id,'article:sample');
  assert.deepEqual(result.claims,[{id:'claim:sample'}]);
  assert.equal(result.collection.reviewStatus,'needs-content-review');
});
test('catalog rejects ambiguous routes, duplicate claim ownership, and mismatched article identities',async()=>{
  const f=fixture();
  await assert.rejects(loadContentCatalog(f.read,{...f.registry,entries:[...f.registry.entries,...f.registry.entries]}),/catalog article/);
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

test('source impact CLI retains source-only articles without inventing public scenes',()=>{
  const output=JSON.parse(execFileSync(process.execPath,['--import','tsx','scripts/impact.ts','source:sutcliffe-fde-2018'],{encoding:'utf8',cwd:new URL('..',import.meta.url)}));
  assert.ok(output.impactCandidate.claims.includes('claim:logic.fde.four-values'));
  const article=output.impactCandidate.articles.find((item: {articleId:string;scenes:string[]})=>item.articleId==='article:logic.paraconsistent.ko');
  assert.deepEqual(article.scenes,[]);
});

test('source registry and public index remain separate contracts',()=>{
  // Given the complete provenance registry and curated public index.
  const publicIds=['article:physics.newton-to-quantum.ko','article:mathematics.number-structures.ko','article:logic.weekday-worlds.ko','article:statistics.monty-hall.ko','article:statistics.two-children.ko'];
  // When the derived public pages are inspected.
  // Then all legacy source identities remain registered while exactly five pages are public in editorial order.
  assert.ok(CONTENT_ENTRIES.length>CONTENT_PAGES.length);
  assert.ok(CONTENT_ENTRIES.every(entry=>!Object.hasOwn(entry,'page')));
  assert.deepEqual(CONTENT_PAGES.map(page=>page.articleId),publicIds);
  assert.deepEqual(INDEX_PAGES,CONTENT_PAGES);
});
