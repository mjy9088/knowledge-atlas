import test from 'node:test';
import assert from 'node:assert/strict';
import {articleDisplayTitle,validateArticleTitles} from '../presentation.js';
import {loadContentCatalog} from '../load-catalog.js';

test('short article titles opt into compact surfaces while preserving the canonical full title',()=>{
  const article={title:'A full question (with its subject)',shortTitle:'A full question'};validateArticleTitles(article);
  assert.equal(articleDisplayTitle(article),'A full question');assert.equal(article.title,'A full question (with its subject)');
  assert.equal(articleDisplayTitle({title:'Legacy title'}),'Legacy title');
  for(const value of [{title:''},{title:' '},{title:'x',shortTitle:''},{title:'x',shortTitle:12},{title:'x',shortTitle:'x'.repeat(161)}])assert.throws(()=>validateArticleTitles(value as never));
});

test('catalog input rejects an unsupported short title rather than rendering it',async()=>{
  await assert.rejects(loadContentCatalog(async name=>name==='content/measurement/example/article.en.json'?{id:'article:example',title:'Example',shortTitle:42}:name==='sources/registry.json'?[]:{id:'collection:example'},{entries:[{directory:'measurement/example',article:'article.en.json',claims:'claims.json',articleId:'article:example'}],claimFiles:[],collectionFile:'content/collections/example.json'}),/short article title/);
});
