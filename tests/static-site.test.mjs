import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {CONTENT_PAGES,sceneText} from '../content/catalog.mjs';
import {loadSiteContent,siteDocuments,buildSite} from '../scripts/build-site.mjs';
import {validateRelatedPages,escapeHTML} from '../packages/site/related-site.mjs';
import {createRelatedReader} from '../apps/web/components/reader/state.mjs';

test('related scenes preserve every source sentence, claim reference and review boundary',async()=>{
  const data=await loadSiteContent();assert.deepEqual(validateRelatedPages(data.collection,data.claims),[]);
  for(const page of CONTENT_PAGES){
    const article=data.collection.articles.find(a=>a.id===page.articleId);
    article.blocks.forEach((block,i)=>assert.equal(page.scenes.filter(s=>s.block===i).map(s=>sceneText(article,s)).join(' '),block.text));
  }
  const broken=structuredClone(data.collection);broken.articles[0].blocks[0].claimRefs.push('claim:missing');
  assert.ok(validateRelatedPages(broken,data.claims).some(e=>e.includes('Unknown page claim')));
});
test('pre-rendered pages contain complete readable prose and escaped evidence without running JavaScript',async()=>{
  const data=await loadSiteContent(),docs=siteDocuments(data);
  assert.equal(docs.size,CONTENT_PAGES.length+2);
  for(const page of CONTENT_PAGES){
    const html=docs.get(`/knowledge/${page.slug}/`),article=data.collection.articles.find(a=>a.id===page.articleId);
    for(const scene of page.scenes)assert.ok(html.includes(escapeHTML(sceneText(article,scene))));
    assert.ok(html.includes('주장별 조건과 근거 위치'));assert.ok(html.includes('공개는 대기 중'));
    assert.ok(!html.includes('reader-scene" hidden'));
  }
  const untrusted=structuredClone(data);untrusted.collection.articles.find(a=>a.id==='article:logic.consistency.ko').title='<script>alert("x")</script>';
  const html=siteDocuments(untrusted).get('/knowledge/consistency/');
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
      :file.path.endsWith('.mjs')?[...data.toString().matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(m=>m[1]):[];
    for(const ref of refs){
      if(!ref.startsWith('/')&&!ref.startsWith('.'))continue;
      const url=new URL(ref,'http://static.test/'+file.path),relative=decodeURIComponent(url.pathname).slice(1);
      const target=path.join(first.output,relative.endsWith('/')||!relative?relative+'index.html':relative);
      assert.ok((await stat(target)).isFile(),`${file.path} -> ${ref}`);
    }
  }
  const second=await buildSite();assert.deepEqual(second.manifest,manifest);
});
