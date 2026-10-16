import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {CONTENT_PAGES,sceneText} from '../content/catalog.js';
import {loadSiteContent,siteDocuments,buildSite} from '../scripts/build-site.js';
import {validateRelatedPages,escapeHTML} from '../packages/site/related-site.js';
import {createRelatedReader} from '../apps/web/components/reader/state.js';
import type {Article,Scene} from '../packages/content/types.js';

test('scene sentence ranges preserve decimals and trailing text',()=>{
  const article:Article={id:'article:decimal',title:'Fixture',conceptId:'concept:fixture',reviewStatus:'needs-content-review',relatedConcepts:[],blocks:[{id:'block:decimal',text:'비율은 15.38%입니다. 2.5%로 바꾸면? 마지막 설명',claimRefs:[]}]};
  const scene:Scene={id:'decimal',title:'Fixture',block:0,from:0,to:1,cards:[],known:'Fixture'};
  assert.equal(sceneText(article,scene),'비율은 15.38%입니다.');
  assert.equal(sceneText(article,{...scene,from:1,to:2}),'2.5%로 바꾸면?');
  assert.equal(sceneText(article,{...scene,from:2,to:undefined}),'마지막 설명');
  assert.equal(sceneText(article,{...scene,to:undefined}),article.blocks[0].text);
});

test('related scenes preserve every source sentence, claim reference and review boundary',async()=>{
  const data=await loadSiteContent();assert.deepEqual(validateRelatedPages(data.collection,data.claims),[]);
  for(const page of CONTENT_PAGES){
    const article=data.collection.articles.find(a=>a.id===page.articleId)!;
    article.blocks.forEach((block,i)=>assert.equal(page.scenes.filter(s=>s.block===i).map(s=>sceneText(article,s)).join(' '),block.text));
  }
  const broken=structuredClone(data.collection);broken.articles[0].blocks[0].claimRefs.push('claim:missing');
  assert.ok(validateRelatedPages(broken,data.claims).some(e=>e.includes('Unknown page claim')));
});
test('pre-rendered pages contain complete readable prose and escaped evidence without running JavaScript',async()=>{
  const data=await loadSiteContent(),docs=siteDocuments(data);
  assert.equal(docs.size,CONTENT_PAGES.length+2);
  for(const page of CONTENT_PAGES){
    const html=docs.get(`/knowledge/${page.slug}/`)!,article=data.collection.articles.find(a=>a.id===page.articleId)!;
    for(const scene of page.scenes)assert.ok(html.includes(escapeHTML(sceneText(article,scene))));
    assert.ok(html.includes('주장별 조건과 근거 위치'));assert.ok(html.includes('내용 검토 전 초안'));
    assert.ok(!html.includes('reader-scene" hidden'));
  }
  const untrusted=structuredClone(data);untrusted.collection.articles.find(a=>a.id==='article:logic.consistency.ko')!.title='<script>alert("x")</script>';
  const html=siteDocuments(untrusted).get('/knowledge/consistency/')!;
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert'));
});
test('reader supports direct jumps, detached states, reset and rejection without mutation',()=>{
  for(const page of CONTENT_PAGES){
    const reader=createRelatedReader(page),initial=reader.getState(),last=page.scenes.length-1;reader.setState({sceneId:page.scenes[last].id});
    reader.next();assert.equal(reader.inspect().index,last);reader.previous();assert.equal(reader.inspect().index,last-1);
    const detached=reader.inspect();detached.scene.cards[0]='changed';assert.notEqual(reader.inspect().scene.cards[0],'changed');
    const before=reader.getState();assert.throws(()=>reader.setState({sceneId:'invalid'}));assert.deepEqual(reader.getState(),before);
    reader.reset();assert.deepEqual(reader.getState(),initial);
  }
});
test('static build resolves HTML links and module imports and hashes artifacts deterministically',async()=>{
  const first=await buildSite(),manifest=first.manifest;
  assert.equal(manifest.published,false);assert.equal(manifest.sourceSnapshotVerified,false);
  for(const file of manifest.files){
    const data=await readFile(path.join(first.output,file.path));
    assert.equal(createHash('sha256').update(data).digest('hex'),file.sha256);
    const refs=file.path.endsWith('.html')?[...data.toString().matchAll(/(?:href|src)="([^"#]+)"/g)].map(m=>m[1])
      :file.path.endsWith('.js')?[...data.toString().matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(m=>m[1]):[];
    for(const ref of refs){
      if(!ref.startsWith('/')&&!ref.startsWith('.'))continue;
      const url=new URL(ref,'http://static.test/'+file.path),relative=decodeURIComponent(url.pathname).slice(1);
      const target=path.join(first.output,relative.endsWith('/')||!relative?relative+'index.html':relative);
      assert.ok((await stat(target)).isFile(),`${file.path} -> ${ref}`);
    }
  }
  const second=await buildSite();assert.deepEqual(second.manifest,manifest);
});
