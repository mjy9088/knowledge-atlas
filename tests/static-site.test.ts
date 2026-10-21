import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {CONTENT_PAGES,sceneText} from '../content/catalog.js';
import {loadSiteContent,siteDocuments,buildSite,projectRoot} from '../scripts/build-site.js';
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
test('pre-rendered scene routes select exactly the requested scene before JavaScript',async()=>{
  const data=await loadSiteContent(),docs=siteDocuments(data);
  assert.equal(docs.size,CONTENT_PAGES.reduce((count,page)=>count+page.scenes.length+1,2));
  for(const page of CONTENT_PAGES){
    const html=docs.get(`/knowledge/${page.slug}/`)!,article=data.collection.articles.find(a=>a.id===page.articleId)!;
    assert.ok(html.includes(`data-server-scene="${page.scenes[0]?.id}"`));
    for(const scene of page.scenes){
      const sceneHTML=docs.get(`/knowledge/${page.slug}/${scene.id}/`)??'';
      assert.ok(sceneHTML.includes(`data-server-scene="${scene.id}"`));
      assert.ok(sceneHTML.includes(`id="${scene.id}"`));
      assert.ok(sceneHTML.includes(escapeHTML(sceneText(article,scene))));
    }
    assert.ok(html.includes('주장별 조건과 근거 위치'));assert.ok(html.includes('내용 검토 전 초안'));
  }
  const untrusted=structuredClone(data);untrusted.collection.articles.find(a=>a.id==='article:physics.newton-to-quantum.ko')!.title='<script>alert("x")</script>';
  const html=siteDocuments(untrusted).get('/knowledge/newton-to-quantum/')!;
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert'));
});
test('chaptered works expose long-form presentation and chapter-local progress',async()=>{
  // Given the complete static documents for main works and retained readers.
  const docs=siteDocuments(await loadSiteContent());
  // When each page's presentation and scene progress are inspected.
  for(const page of CONTENT_PAGES){
    const html=docs.get(`/knowledge/${page.slug}/`)??'';
    if(!page.navigation){assert.ok(html.includes('data-presentation="bounded"'));continue;}
    assert.ok(html.includes('data-presentation="longform"'));
    assert.ok(html.includes(`<p class="eyebrow">${escapeHTML(page.category)}</p>`));
    assert.ok(!html.includes(`<p class="eyebrow">${escapeHTML(page.category)} / ${escapeHTML(page.label)}</p>`));
    const mainline=page.navigation.chapters.filter(chapter=>chapter.kind==='mainline').flatMap(chapter=>chapter.sceneIds);
    for(const chapter of page.navigation.chapters)chapter.sceneIds.forEach((sceneId,index)=>{
      const prefix=chapter.kind==='mainline'?'본문':'선택';
      const position=chapter.kind==='mainline'?mainline.indexOf(sceneId):index;
      const total=chapter.kind==='mainline'?mainline.length:chapter.sceneIds.length;
      assert.ok(html.includes(`data-chapter-kind="${chapter.kind}" id="${sceneId}"`));
      assert.ok(html.includes(`<p class="eyebrow">${prefix} ${position+1} / ${total}</p>`));
    });
  }
  // Then retained readers remain explicitly bounded instead of inheriting the exception.
  assert.equal(CONTENT_PAGES.filter(page=>!page.navigation).length,1);
});
test('chaptered cards render authored facts without causal connectors or dropped values',async()=>{
  const docs=siteDocuments(await loadSiteContent());
  const parity=docs.get('/knowledge/number-structures/sqrt-parity-contradiction/')??'';
  assert.ok(parity.includes('>2 | gcd(p,q): 모순<'),'The mathematical divisibility operator must survive rendering');
  for(const page of CONTENT_PAGES.filter(candidate=>candidate.navigation)){
    const html=docs.get(`/knowledge/${page.slug}/`)??'';
    assert.ok(!html.includes('class="concept-connector"'));
    for(const card of page.scenes.flatMap(scene=>scene.figure?[]:scene.cards)){
      assert.ok(html.includes(`<span class="concept-fact-value">${escapeHTML(card)}</span>`));
    }
  }
});
test('static last-detour documents retain their declared no-JavaScript return link',async()=>{
  const docs=siteDocuments(await loadSiteContent());
  for(const page of CONTENT_PAGES.filter(candidate=>candidate.navigation))for(const chapter of page.navigation?.chapters??[]){
    if(chapter.kind!=='detour')continue;
    const lastScene=chapter.sceneIds.at(-1),html=lastScene?docs.get(`/knowledge/${page.slug}/${lastScene}/`)??'':'';
    assert.ok(html.includes(`class="reader-branch-links"`));
    assert.ok(html.includes(`href="/knowledge/${page.slug}/${chapter.returnSceneId}/"`));
    assert.ok(html.includes('본문 돌아가기 ↩'));
  }
});
test('site documents expose five active routes and omit retired readers',async()=>{
  // Given the source-complete catalog.
  const docs=siteDocuments(await loadSiteContent());
  // When static route documents are derived.
  // Then only the two main works and three retained subjects receive article routes.
   assert.deepEqual([...docs.keys()].filter(url=>url.split('/').filter(Boolean).length<=2),['/','/knowledge/','/knowledge/newton-to-quantum/','/knowledge/number-structures/','/knowledge/weekday-worlds/','/knowledge/monty-hall/','/knowledge/two-children/']);
  for(const retired of ['/lesson.html','/knowledge/binary-search/','/knowledge/atomic-orbitals/','/knowledge/real-completeness/'])assert.equal(docs.has(retired),false);
});
test('every catalog card names its authored payoff without substituting a trailing detour',async()=>{
  const data=await loadSiteContent(),html=siteDocuments(data).get('/knowledge/')??'';
  for(const page of CONTENT_PAGES){
    const finalChapter=page.navigation?.chapters.filter(chapter=>chapter.kind==='mainline').at(-1),finalId=finalChapter?.sceneIds.at(-1),finalScene=page.scenes.find(scene=>scene.id===finalId);
    const payoff=finalScene??page.scenes.at(-1);
    assert.ok(payoff&&html.includes(`도착점 · ${escapeHTML(payoff.title)}\u00a0→`));
  }
});
test('related navigation links only to active reader routes',async()=>{
  // Given a main work whose authored related IDs currently identify source-only articles.
  const html=siteDocuments(await loadSiteContent()).get('/knowledge/number-structures/')??'';
  // When the public related-navigation section is rendered.
  const links=[...html.matchAll(/href="(\/knowledge\/[^"#]+)"/g)].map(match=>match[1]);
  // Then retired source records do not reappear as active reader links.
  assert.ok(html.includes('href="/knowledge/"'));
  for(const retired of ['/knowledge/rational-representations/','/knowledge/irrational-numbers/','/knowledge/real-completeness/','/knowledge/complex-numbers/'])assert.ok(!links.includes(retired));
});
test('reader supports direct jumps, detached states, reset and rejection without mutation',()=>{
  for(const page of CONTENT_PAGES){
    const reader=createRelatedReader(page),initial=reader.getState(),mainline=page.navigation?.chapters.filter(chapter=>chapter.kind==='mainline').flatMap(chapter=>chapter.sceneIds),lastId=mainline?.at(-1)??page.scenes.at(-1)?.id;
    assert.ok(lastId);reader.setState({sceneId:lastId});const last=reader.inspect().index;
    reader.next();assert.equal(reader.inspect().index,last);reader.previous();assert.notEqual(reader.inspect().index,last);
    const detached=reader.inspect();detached.scene.cards[0]='changed';assert.notEqual(reader.inspect().scene.cards[0],'changed');
    const before=reader.getState();assert.throws(()=>reader.setState({sceneId:'invalid'}));assert.deepEqual(reader.getState(),before);
    reader.reset();assert.deepEqual(reader.getState(),initial);
  }
});
test('static build resolves HTML links and module imports and hashes artifacts deterministically',async()=>{
  const first=await buildSite(),manifest=first.manifest;
  assert.equal(manifest.published,false);assert.equal(manifest.sourceSnapshotVerified,false);
  assert.ok(manifest.files.every(file=>!file.path.startsWith('tools/')),'Local production tools and private manuscripts must not enter public assets');
  assert.ok(manifest.pages.every(url=>!url.startsWith('/tools/')),'Local production tools must not become public routes');
  assert.ok(manifest.files.every(file=>!/(?:^|\/)(?:tests|__tests__|test-support)(?:\/|$)|\.(?:test|spec|browser)\./u.test(file.path)),'Test code and supporting fixtures must not enter public output');
  const modelTest='packages/models/tests/hydrogenic.test.ts';
  assert.ok((await stat(path.join(projectRoot,modelTest))).isFile());
  assert.equal(manifest.files.some(file=>file.path===modelTest.replace(/\.ts$/,'.js')),false);
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
