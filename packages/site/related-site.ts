import type {ContentCollection,Claim,SourceRecord,ContentPage} from '../content/types.js';
import {CONTENT_PAGES,pageURL,sceneText} from '../../content/catalog.js';
export const escapeHTML=(value: unknown)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'} as Record<string,string>)[c]);
const e=escapeHTML;
const interactionLabels:Record<NonNullable<ContentPage['interactive']>,string>={
  'hydrogenic-orbitals':'공간 실험','typed-lambda':'타입·계산 실험',
  'binary-search':'탐색 실험','sphere-slices':'단면 실험','base-rates':'경보 비교 실험',
};
const shell=(title:string,description:string,body:string,script='')=>`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(description)}"><title>${e(title)} · Knowledge Atlas</title><link rel="stylesheet" href="/pages/article/article.css"><link rel="stylesheet" href="/components/experiment/premise-editor.css"><link rel="stylesheet" href="/components/reader/frame.css">${script}</head><body><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="page-chrome"><a href="/knowledge/" aria-label="지식 목록">◈</a><nav><a href="/">지식 지도</a><a href="#connections">연관 지식</a></nav></header>${body}</body></html>`;
export function validateRelatedPages(collection:ContentCollection,claims:Claim[]){
  const errors:string[]=[],slugs=new Set<string>(),ids=new Set(claims.map(c=>c.id));
  for(const page of CONTENT_PAGES){
    if(!/^[a-z][a-z-]+$/.test(page.slug)||slugs.has(page.slug))errors.push('Invalid or duplicate page slug');slugs.add(page.slug);
    const article=collection.articles.find(a=>a.id===page.articleId);
    if(!article){errors.push('Missing article '+page.articleId);continue;}
    const sceneIds=new Set(),coverage:string[][]=article.blocks.map(()=>[]);
    for(const scene of page.scenes){
      if(sceneIds.has(scene.id))errors.push('Duplicate scene '+scene.id);sceneIds.add(scene.id);
      if(!article.blocks[scene.block]||!sceneText(article,scene)){errors.push('Empty scene '+scene.id);continue;}
      coverage[scene.block].push(sceneText(article,scene));
      for(const id of article.blocks[scene.block].claimRefs)if(!ids.has(id))errors.push('Unknown page claim '+id);
    }
    article.blocks.forEach((block,i)=>{if(coverage[i].join(' ')!==block.text)errors.push('Scene coverage differs from source '+block.id);});
  }
  return errors;
}
export function renderRelatedIndex(collection:ContentCollection){
  return shell('연결을 따라 읽기','관심 있는 과학 주제의 설명과 근거를 각자의 순서로 탐색합니다.',`<main id="main" class="knowledge-index"><p class="eyebrow">KNOWLEDGE ATLAS / 연결을 따라 읽기</p><h1>다음 질문은 무엇인가요?</h1><p>알고 있는 설명은 건너뛰고, 궁금한 관계부터 살펴보세요.</p><section id="connections" class="knowledge-grid" aria-label="지식 항목">${CONTENT_PAGES.map(page=>{const article=collection.articles.find(a=>a.id===page.articleId)!;return `<a class="knowledge-card" href="${pageURL(page)}"><span>${e(page.label)}</span><h2>${e(article.title)}</h2><small>${page.scenes.length}개 장면 · ${page.interactive?interactionLabels[page.interactive]:page.model?'추론 실험':'해설'} ↗</small></a>`;}).join('')}</section><a href="/lesson.html">모순 폭발: 전제와 목표를 바꾸며 살펴보기 ↗</a><p class="review-note">내용 검토 전 초안</p></main>`);
}
export function renderRelatedPage(page:ContentPage,collection:ContentCollection,claims:Claim[],sources:SourceRecord[]){
  const article=collection.articles.find(a=>a.id===page.articleId)!,used=new Set(article.blocks.flatMap(b=>b.claimRefs));
  if(page.model==='classical')for(const claim of claims.filter(c=>c.id.startsWith('claim:logic.inference.')||c.id.startsWith('claim:logic.explosion.')))used.add(claim.id);
  const evidence=claims.filter(c=>used.has(c.id)),sourceIDs=new Set(evidence.flatMap(c=>c.sourceRefs.map(r=>r.sourceId)));
  const related=CONTENT_PAGES.filter(other=>other!==page&&article.relatedConcepts.includes(collection.articles.find(a=>a.id===other.articleId)!.conceptId));
  const links=related.map(other=>`<a href="${pageURL(other)}">${e(other.label)} ↗</a>`).join('')+(article.relatedConcepts.includes('concept:logic.explosion')?'<a href="/lesson.html">모순 폭발 ↗</a>':'')+'<a href="/knowledge/">지식 목록 ↗</a>';
  const scenes=page.scenes.map((scene,index)=>{
    const block=article.blocks[scene.block];
    return `<section class="reader-scene" data-visual="${scene.cards.length?'cards':'none'}" id="${scene.id}" data-claim-refs="${e(block.claimRefs.join(' '))}" aria-labelledby="${scene.id}-title"><div class="concept-diagram"${scene.cards.length?'':' hidden'} aria-label="${e(scene.title)}의 개념 관계">${scene.cards.map(card=>`<span>${e(card)}</span>`).join('<span class="concept-connector" aria-hidden="true">·</span>')}</div><div class="reader-dialogue"><p class="eyebrow">${index+1} / ${page.scenes.length}</p><div class="reader-copy"><h2 id="${scene.id}-title">${e(scene.title)}</h2><p class="scene-prose">${e(sceneText(article,scene))}</p><p class="scene-result" hidden></p></div><p class="skip-context">건너뛸 내용: ${e(scene.known)} · 다음: ${e(page.scenes[index+1]?.title??'연관 지식')}</p></div></section>`;
  }).join('');
  const body=`<main id="main" class="related-reader" data-page="${e(page.slug)}"><header class="reader-intro"><p class="eyebrow">${e(page.category)} / ${e(page.label)}</p><h1>${e(article.title)}</h1><details class="reader-menu"><summary>목차 · 근거 ▦</summary><nav aria-label="장면 선택">${page.scenes.map(scene=>`<a href="#${scene.id}">${e(scene.title)}</a>`).join('')}<a href="#connections">연관 지식</a><a href="#evidence">근거와 범위</a><button type="button" id="reader-reset" hidden>처음 상태로</button></nav></details></header><section id="reader-workbench" class="reader-workbench" aria-label="설명 실험"><div class="model-toolbar"><strong id="reader-model-label"></strong><nav id="reader-presets" aria-label="추론 예시"></nav></div><div id="reader-experiment" aria-label="현재 전제와 목표 편집" hidden></div><div id="reader-proof" class="reader-proof" aria-label="현재 입력의 추론 시각화" hidden></div></section><div id="reader-scenes" aria-live="polite" aria-atomic="true">${scenes}</div><nav id="reader-controls" class="reader-controls" aria-label="설명 이동" hidden><button type="button" id="reader-prev">← 이전</button><button type="button" id="reader-skip" aria-describedby="reader-skip-scope">이 설명은 알아요 ↗</button><button type="button" id="reader-next">다음 →</button></nav><p id="reader-skip-scope" class="reader-hint" hidden></p><nav id="reader-end-links" class="reader-end-links" aria-label="이어서 읽기" hidden>${links}<a href="#evidence">근거와 범위</a></nav></main><section id="connections" class="reader-connections"><h2>연관 지식</h2><nav>${links}</nav></section><section id="evidence" class="reader-evidence"><h2>근거와 범위</h2><p class="review-note">내용 검토 전 초안입니다. 출처별 확인 범위와 미확인 항목은 아래 기록에서 확인할 수 있습니다.</p>${sources.filter(s=>sourceIDs.has(s.id)).map(s=>`<p><a href="${e(s.canonicalUrl)}" rel="noopener noreferrer" target="_blank">${e(s.title)}</a><br><small>${e(s.author)} · 확인일 ${e(s.retrievedAt)} · ${e(s.license)} · ${e(s.rightsReview)}</small></p>`).join('')}<details><summary>주장별 조건과 근거 위치</summary>${evidence.map(c=>`<article id="${e(c.id.replaceAll(':','-').replaceAll('.','-'))}" class="claim"><h3>${e(c.id)}</h3><p>${e(c.statement)}</p><p>범위: ${e(c.scope)}</p><p>조건: ${e(c.assumptions.join(' / '))}</p><p>${e(c.sourceRefs.map(r=>r.sourceId+' · '+r.locator).join('; '))}</p><small>${e(c.reviewStatus)}</small></article>`).join('')}</details></section>`;
  return shell(article.title,sceneText(article,page.scenes[0]),body,(page.styles??[]).map(href=>`<link rel="stylesheet" href="${e(href)}">`).join('')+'<script type="module" src="/pages/article/controller.js"></script>');
}
