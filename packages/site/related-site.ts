import type {Article,Claim,ContentCollection,ContentPage,SourceRecord} from '../content/types.js';
import {articleDisplayTitle} from '../content/presentation.js';
import {CONTENT_PAGES,INDEX_PAGES,pageURL,sceneText} from '../../content/catalog.js';
import {isURLSafeSceneId} from '../content/scene-routing.js';
import {chapterMenu,branchLinks,sceneProgress} from './reader-navigation.js';
import {escapeHTML} from './html.js';
export {escapeHTML} from './html.js';

const e=escapeHTML;
const shell=(title:string,description:string,body:string,head='')=>`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(description)}"><title>${e(title)} · Knowledge Atlas</title><meta property="og:title" content="${e(title)}"><link rel="stylesheet" href="/pages/article/article.css"><link rel="stylesheet" href="/components/experiment/premise-editor.css"><link rel="stylesheet" href="/components/reader/frame.css"><link rel="stylesheet" href="/components/reader/cover.css"><link rel="stylesheet" href="/components/viewport/desktop-fit.css"><script type="module" src="/components/viewport/desktop-fit.js"></script>${head}</head><body><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="page-chrome"><a href="/knowledge/" aria-label="지식 목록">KA</a><nav><a href="/">지식 지도</a><a href="#connections">연관 지식</a></nav></header>${body}</body></html>`;

function articleFor(collection:ContentCollection,articleId:string):Article{
  const article=collection.articles.find(item=>item.id===articleId);
  if(!article)throw new TypeError(`Missing article ${articleId}`);
  return article;
}

export function validateRelatedPages(collection:ContentCollection,claims:Claim[],pages:readonly ContentPage[]=CONTENT_PAGES){
  const errors:string[]=[],slugs=new Set<string>(),claimIds=new Set(claims.map(claim=>claim.id));
  for(const page of pages){
    if(!/^[a-z][a-z-]+$/.test(page.slug)||slugs.has(page.slug))errors.push('Invalid or duplicate page slug');
    slugs.add(page.slug);
    if(page.workbenchPlacement!==undefined&&(page.workbenchPlacement!=='after-explanation'||!page.navigation||!page.interactive))errors.push(`Workbench placement requires a chaptered interactive reader ${page.articleId}`);
    const article=collection.articles.find(item=>item.id===page.articleId);
    if(!article){errors.push(`Missing article ${page.articleId}`);continue;}
    if(page.coverArtwork&&(!/^\/content\/(?:[a-z][a-z0-9-]*\/)+[a-z][a-z0-9-]*\.svg$/.test(page.coverArtwork.src)||!page.coverArtwork.alt.trim()))errors.push(`Invalid article cover artwork ${page.articleId}`);
    const sceneIds=new Set<string>(),coverage:string[][]=article.blocks.map(()=>[]);
    for(const scene of page.scenes){
      if(!isURLSafeSceneId(scene.id)||['main','connections','evidence'].includes(scene.id)||scene.id.startsWith('reader-'))errors.push(`Reserved reader identity or unsafe route ${scene.id}`);
      if(scene.figure&&(!/^\/content\/(?:[a-z][a-z0-9-]*\/)+[a-z][a-z0-9-]*\.svg$/.test(scene.figure.src)||!scene.figure.alt.trim()||!scene.figure.caption.trim()))errors.push(`Invalid scene figure ${scene.id}`);
      if(scene.motion&&(!isURLSafeSceneId(scene.motion.id)||!scene.figure))errors.push(`Motion scene needs a URL-safe identity and static figure ${scene.id}`);
      if(sceneIds.has(scene.id))errors.push(`Duplicate scene ${scene.id}`);sceneIds.add(scene.id);
      if(scene.skip&&(page.scenes.findIndex(item=>item.id===scene.skip?.to)<=page.scenes.indexOf(scene)+1||!scene.skip.label.trim()))errors.push(`Invalid forward skip ${scene.id}`);
      const block=article.blocks[scene.block];
      if(!block||!sceneText(article,scene)){errors.push(`Empty scene ${scene.id}`);continue;}
      coverage[scene.block].push(sceneText(article,scene));
      for(const id of block.claimRefs)if(!claimIds.has(id))errors.push(`Unknown page claim ${id}`);
    }
    if(page.navigation){
      const chapterIds=page.navigation.chapters.flatMap(chapter=>chapter.sceneIds);
      const identities=page.navigation.chapters.map(chapter=>chapter.id);
      const mainlineIds=new Set(page.navigation.chapters.filter(chapter=>chapter.kind==='mainline').flatMap(chapter=>chapter.sceneIds));
      if(chapterIds.length!==page.scenes.length||new Set(chapterIds).size!==chapterIds.length||chapterIds.some(id=>!sceneIds.has(id)))errors.push(`Invalid chapter coverage ${page.articleId}`);
      if(new Set(identities).size!==identities.length)errors.push(`Duplicate chapter identities ${page.articleId}`);
      if(page.navigation.chapters.some(chapter=>chapter.sceneIds.length===0))errors.push(`Invalid empty chapter ${page.articleId}`);
      for(const chapter of page.navigation.chapters)if(chapter.kind==='detour'&&(!mainlineIds.has(chapter.parentSceneId)||!mainlineIds.has(chapter.returnSceneId)))errors.push(`Detour parent and return must be mainline scenes ${chapter.id}`);
    }
    article.blocks.forEach((block,index)=>{if(coverage[index].join(' ')!==block.text)errors.push(`Scene coverage differs from source ${block.id}`);});
  }
  return errors;
}

function knowledgeCard(page:ContentPage,article:Article){
  const opening=page.scenes[0],finalMainlineId=page.navigation?.chapters.filter(chapter=>chapter.kind==='mainline').at(-1)?.sceneIds.at(-1),payoff=page.scenes.find(scene=>scene.id===finalMainlineId)??page.scenes.at(-1);
  return `<a class="knowledge-card" href="${pageURL(page)}" title="${e(article.title)}"><span>${e(page.category)}</span><h3>${e(articleDisplayTitle(article))}</h3><p>${e(opening?.title??page.label)}</p><small>도착점 · ${e(payoff?.title??page.label)}\u00a0→</small></a>`;
}
export function renderRelatedIndex(collection:ContentCollection){
  const cards=INDEX_PAGES.map(page=>knowledgeCard(page,articleFor(collection,page.articleId))).join('');
  const body=`<main id="main" class="knowledge-index catalog-index"><p class="eyebrow">KNOWLEDGE ATLAS</p><h1>질문에서 시작하는 지식 지도</h1><p class="catalog-intro">마음에 걸리는 질문을 골라 어디서든 시작하세요. 각 글은 첫 질문에서 출발해 한 가지 도착점까지 이어집니다.</p><section id="connections" class="catalog-section" aria-labelledby="catalog-connections-title"><header><p>START ANYWHERE</p><h2 id="catalog-connections-title">어디서든 시작해 보세요</h2></header><div class="knowledge-grid">${cards}</div></section><p class="review-note">모든 글은 내용·출처·권리 검토와 공개 승인을 기다리는 초안입니다.</p></main>`;
  return shell('질문에서 시작하는 지식 지도','어떤 질문에서든 시작해 연결된 설명을 탐색합니다.',body,'<link rel="stylesheet" href="/pages/catalog/catalog.css">');
}

function sceneHTML(page:ContentPage,article:Article,scene:ContentPage['scenes'][number],index:number,selectedId:string,dimensions:Readonly<Record<string,{readonly width:number;readonly height:number}>>){
  const block=article.blocks[scene.block];
  if(!block)throw new TypeError(`Missing scene block ${scene.id}`);
  const visual=scene.figure?'figure':scene.cards.length?'cards':'none';
  const progress=sceneProgress(page,scene.id,index);
  const size=scene.figure?dimensions[scene.figure.src]:undefined;
  if(scene.figure&&!size)throw new RangeError(`Missing SVG dimensions ${scene.figure.src}`);
  const cards=page.navigation?`<ul class="concept-facts">${scene.cards.map(card=>`<li><span class="concept-fact-value">${e(card)}</span></li>`).join('')}</ul>`:scene.cards.map(card=>`<span>${e(card)}</span>`).join('<span class="concept-connector" aria-hidden="true">·</span>');
  const diagram=scene.figure?`<figure class="scene-figure"><img src="${e(scene.figure.src)}" alt="${e(scene.figure.alt)}" width="${size?.width}" height="${size?.height}"><figcaption>${e(scene.figure.caption)}</figcaption></figure>`:cards;
  return `<section class="reader-scene" data-visual="${visual}"${progress.attribute} id="${scene.id}"${scene.motion?` data-motion="${e(scene.motion.id)}"`:''} data-claim-refs="${e(block.claimRefs.join(' '))}" aria-labelledby="${scene.id}-title"${scene.id===selectedId?'':' hidden'}><div class="concept-diagram"${visual==='none'?' hidden':''} aria-label="${e(scene.title)}의 ${page.navigation?'핵심 사실과 조건':'개념 관계'}">${diagram}</div><div class="reader-dialogue"><p class="eyebrow">${progress.label}</p><div class="reader-copy"><h2 id="${scene.id}-title">${e(scene.title)}</h2><p class="scene-prose">${e(sceneText(article,scene))}</p><p class="scene-result" hidden></p>${branchLinks(page,scene.id)}</div><p class="skip-context" hidden>건너뛸 내용: ${e(scene.known)}</p></div></section>`;
}

export function renderRelatedPage(page:ContentPage,collection:ContentCollection,claims:Claim[],sources:SourceRecord[],selectedSceneId=page.scenes[0]?.id,dimensions:Readonly<Record<string,{readonly width:number;readonly height:number}>>={}){
  if(!selectedSceneId||!page.scenes.some(scene=>scene.id===selectedSceneId))throw new RangeError('Unknown selected scene');
  const article=articleFor(collection,page.articleId),used=new Set(article.blocks.flatMap(block=>block.claimRefs));
  if(page.model==='classical')for(const claim of claims.filter(item=>item.id.startsWith('claim:logic.inference.')||item.id.startsWith('claim:logic.explosion.')))used.add(claim.id);
  const evidence=claims.filter(claim=>used.has(claim.id)),sourceIds=new Set(evidence.flatMap(claim=>claim.sourceRefs.map(reference=>reference.sourceId)));
  const relatedIds=page.navigation?.relatedArticleIds;
  const related=CONTENT_PAGES.filter(other=>other!==page&&(relatedIds?relatedIds.includes(other.articleId):article.relatedConcepts.includes(articleFor(collection,other.articleId).conceptId)));
  const links=related.map(other=>`<a href="${pageURL(other)}">${e(other.label)} ↗</a>`).join('')+'<a href="/knowledge/">지식 목록 ↗</a>';
  const scenes=page.scenes.map((scene,index)=>sceneHTML(page,article,scene,index,selectedSceneId,dimensions)).join('');
  const intro=`<header class="reader-intro"><p class="eyebrow">${e(page.category)}${page.navigation?'':` / ${e(page.label)}`}</p><h1 title="${e(article.title)}">${e(articleDisplayTitle(article))}</h1><details class="reader-menu"><summary>목차 · 근거 ▦</summary><nav aria-label="장면 선택">${chapterMenu(page)}<a href="#connections">연관 지식</a><a href="#evidence">근거와 범위</a><button type="button" id="reader-reset" hidden>처음 상태로</button></nav></details></header>`;
  const workbench='<section id="reader-workbench" class="reader-workbench" aria-label="설명 실험"><div class="model-toolbar"><strong id="reader-model-label"></strong><nav id="reader-presets" aria-label="추론 예시"></nav></div><div id="reader-experiment" aria-label="현재 전제와 목표 편집" hidden></div><div id="reader-proof" class="reader-proof" aria-label="현재 입력의 추론 시각화" hidden></div></section>';
  const controls='<nav id="reader-controls" class="reader-controls" aria-label="설명 이동" hidden><button type="button" id="reader-prev">← 이전</button><p id="reader-skip-scope" class="reader-hint" hidden></p><button type="button" id="reader-skip" hidden>이 설명은 알아요 ↗</button><nav id="reader-end-links" class="reader-end-links" aria-label="이어서 읽기" hidden><a href="/knowledge/">지식 목록 ↗</a><a href="#evidence">근거와 범위</a></nav><button type="button" id="reader-next">다음 →</button></nav>';
  const sourceHTML=sources.filter(source=>sourceIds.has(source.id)).map(source=>`<p><a href="${e(source.canonicalUrl)}" rel="noopener noreferrer" target="_blank">${e(source.title)}</a><br><small>${e(source.author)} · 확인일 ${e(source.retrievedAt)} · ${e(source.license)} · ${e(source.rightsReview)}</small></p>`).join('');
  const claimHTML=evidence.map(claim=>`<article><h3>${e(claim.id)}</h3><p>${e(claim.statement)}</p><small>범위: ${e(claim.scope)} · 검토: ${e(claim.reviewStatus)}</small><ul>${claim.sourceRefs.map(reference=>`<li>${e(reference.sourceId)} — ${e(reference.locator)}</li>`).join('')}</ul></article>`).join('');
  const presentation=page.navigation?'longform':'bounded';
  const hiddenWorkbench=workbench.replace('class="reader-workbench"','class="reader-workbench" hidden');
  const sceneContainer=`<div id="reader-scenes" aria-live="polite" aria-atomic="true">${scenes}</div>`;
  const reading=page.workbenchPlacement==='after-explanation'?sceneContainer+hiddenWorkbench:hiddenWorkbench+sceneContainer;
  const body=`<main id="main" class="related-reader server-scene-selected" data-mode="reading" data-page="${e(page.slug)}" data-server-scene="${e(selectedSceneId)}" data-presentation="${presentation}">${intro}${reading}${controls}</main><section id="connections" class="reader-connections"><h2>연관 지식</h2><nav>${links}</nav></section><section id="evidence" class="reader-evidence"><h2>근거와 범위</h2><p class="review-note">내용 검토 전 초안입니다. 출처별 확인 범위와 미확인 항목은 아래 기록에서 확인할 수 있습니다.</p>${sourceHTML}<details><summary>주장별 조건과 근거 위치</summary>${claimHTML}</details></section>`;
  const head=(page.styles??[]).map(href=>`<link rel="stylesheet" href="${e(href)}">`).join('')+'<link rel="stylesheet" href="/components/reader/presentation.css"><script type="module" src="/pages/article/controller.js"></script>';
  return shell(article.title,sceneText(article,page.scenes[0]),body,head).replace('<html lang="ko">','<html lang="ko" class="reader-enhanced">');
}
