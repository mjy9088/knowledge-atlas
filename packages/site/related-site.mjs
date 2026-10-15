import {RELATED_PAGES,pageURL,sceneText} from '../../content/formal-logic/explosion/related-pages.mjs';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHTML;
const shell=(title,description,body,script='')=>`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(description)}"><title>${e(title)} · Knowledge Atlas</title><link rel="stylesheet" href="/related-page.css"><link rel="stylesheet" href="/premise-experiment.css">${script}</head><body><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="page-chrome"><a href="/knowledge/" aria-label="지식 목록">◈</a><nav><a href="/lesson.html">모순 폭발</a><a href="#connections">연관 지식</a></nav></header>${body}</body></html>`;
export function validateRelatedPages(collection,claims){
  const errors=[],slugs=new Set(),ids=new Set(claims.map(c=>c.id));
  for(const page of RELATED_PAGES){
    if(!/^[a-z][a-z-]+$/.test(page.slug)||slugs.has(page.slug))errors.push('Invalid or duplicate page slug');slugs.add(page.slug);
    const article=collection.articles.find(a=>a.id===page.articleId);
    if(!article){errors.push('Missing article '+page.articleId);continue;}
    const sceneIds=new Set(),coverage=article.blocks.map(()=>[]);
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
export function renderRelatedIndex(collection){
  return shell('연결을 따라 읽기','일관성, 초일관 논리, ZFC와 연속체 가설을 각자의 순서로 탐색합니다.',`<main id="main" class="knowledge-index"><p class="eyebrow">KNOWLEDGE ATLAS / 연결을 따라 읽기</p><h1>다음 질문은 무엇인가요?</h1><p>알고 있는 설명은 건너뛰고, 궁금한 관계부터 살펴보세요.</p><section id="connections" class="knowledge-grid" aria-label="지식 항목">${RELATED_PAGES.map(page=>{const article=collection.articles.find(a=>a.id===page.articleId);return `<a class="knowledge-card" href="${pageURL(page)}"><span>${e(page.label)}</span><h2>${e(article.title)}</h2><p>${e(sceneText(article,page.scenes[0]))}</p><small>${page.scenes.length}개 장면 · ${page.experiment?'전제·목표 실험':'개념 도표'} ↗</small></a>`;}).join('')}</section><a href="/lesson.html">모순 폭발: 전제와 목표를 바꾸며 살펴보기 ↗</a><p class="review-note">내용 검토 전 초안 · 공개 승인 대기</p></main>`);
}
export function renderRelatedPage(page,collection,claims,sources){
  const article=collection.articles.find(a=>a.id===page.articleId);
  const used=new Set(article.blocks.flatMap(b=>b.claimRefs));
  if(page.experiment)for(const id of ['claim:logic.explosion.rule','claim:logic.explosion.from_pair','claim:logic.explosion.not-reality','claim:logic.inference.proof-structure','claim:logic.inference.modus-ponens','claim:logic.inference.and-elimination','claim:logic.inference.and-introduction','claim:logic.inference.or-introduction'])used.add(id);
  const evidence=claims.filter(c=>used.has(c.id));
  const sourceIDs=new Set(evidence.flatMap(c=>c.sourceRefs.map(r=>r.sourceId)));
  const related=RELATED_PAGES.filter(other=>other!==page&&article.relatedConcepts.includes(collection.articles.find(a=>a.id===other.articleId).conceptId));
  return shell(article.title,sceneText(article,page.scenes[0]),`<main id="main" class="related-reader" data-page="${e(page.slug)}"><header class="reader-intro"><p class="eyebrow">논리 / ${e(page.label)}</p><h1>${e(article.title)}</h1><details class="reader-menu"><summary>목차 ▦</summary><nav aria-label="장면 선택">${page.scenes.map(scene=>`<a href="#${scene.id}">${e(scene.title)}</a>`).join('')}<button type="button" id="reader-reset" hidden>처음 상태로</button></nav></details></header><div id="reader-experiment" aria-label="현재 전제와 목표 편집" hidden></div><div id="reader-proof" class="reader-proof" aria-label="현재 입력의 논리 도표" hidden></div><div id="reader-scenes" aria-live="polite" aria-atomic="true">${page.scenes.map((scene,index)=>{const block=article.blocks[scene.block];return `<section class="reader-scene" id="${scene.id}" data-claim-refs="${e(block.claimRefs.join(' '))}" aria-labelledby="${scene.id}-title"><div class="concept-diagram" aria-label="${e(scene.title)}의 개념 관계">${scene.cards.map(card=>`<span>${e(card)}</span>`).join('<span class="concept-connector" aria-hidden="true">·</span>')}</div><div class="reader-dialogue"><p class="eyebrow">${index+1} / ${page.scenes.length}</p><div class="reader-copy"><h2 id="${scene.id}-title">${e(scene.title)}</h2><p class="scene-prose">${e(sceneText(article,scene))}</p></div><p class="skip-context">건너뛸 내용: ${e(scene.known)} · 다음: ${e(page.scenes[index+1]?.title??'연관 지식')}</p></div></section>`;}).join('')}</div><nav id="reader-controls" class="reader-controls" aria-label="설명 이동" hidden><button type="button" id="reader-prev">← 이전</button><button type="button" id="reader-skip" aria-describedby="reader-skip-scope">이 설명은 알아요 ↗</button><button type="button" id="reader-next">다음 →</button></nav><p id="reader-skip-scope" class="reader-hint" hidden></p><section id="connections" class="reader-connections"><p class="eyebrow">이어서 탐색하기</p><h2>연관 지식</h2><nav>${related.map(other=>`<a href="${pageURL(other)}">${e(other.label)} ↗</a>`).join('')}<a href="/lesson.html">모순 폭발 · 전제와 목표 실험 ↗</a><a href="/knowledge/">전체 지식 목록 ↗</a></nav></section><section class="reader-evidence"><h2>근거와 범위</h2><p class="review-note">내용 검토 전 초안입니다. 원문 불변 판본·권리 감사·사람의 내용 승인·공개는 대기 중입니다.</p>${sources.filter(s=>sourceIDs.has(s.id)).map(s=>`<p><a href="${e(s.canonicalUrl)}" rel="noopener noreferrer" target="_blank">${e(s.title)}</a><br><small>${e(s.author)} · 확인일 ${e(s.retrievedAt)} · ${e(s.license)} · ${e(s.rightsReview)}</small></p>`).join('')}<details><summary>주장별 조건과 근거 위치</summary>${evidence.map(c=>`<article id="${e(c.id.replaceAll(':','-').replaceAll('.','-'))}" class="claim"><h3>${e(c.id)}</h3><p>${e(c.statement)}</p><p>범위: ${e(c.scope)}</p><p>조건: ${e(c.assumptions.join(' / '))}</p><p>${e(c.sourceRefs.map(r=>r.sourceId+' · '+r.locator).join('; '))}</p><small>${e(c.reviewStatus)}</small></article>`).join('')}</details></section></main>`,`<script type="module" src="/related-page.mjs"></script>`);
}
