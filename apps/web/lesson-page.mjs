import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';
import {createExplosionEpisode} from './explosion-episode.mjs';
import {mountInferenceVideo} from './inference-video.mjs';
const $=id=>document.getElementById(id),make=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
const timeline=createExplosionEpisode(),player=mountInferenceVideo($('episode-player'));
player.updateTimeline(timeline);
$('lesson-duration').textContent=`본편 ${Math.floor(timeline.durationMs/60000)}분 ${timeline.durationMs/1000%60}초 · 무음 · 내용 검토 전`;
for(const [index,section] of EXPLOSION_EPISODE.sections.entries()){
  const block=make('article');block.className='lesson-block';block.id=`explanation-${section.id}`;
  const button=make('button',`${Math.floor(timeline.cues[index].startMs/60000)}:${String(timeline.cues[index].startMs/1000%60).padStart(2,'0')} 이 장면 보기`);button.type='button';
  button.addEventListener('click',()=>{player.seek(timeline.cues[index].startMs);$('episode-player').scrollIntoView({block:'start',behavior:'instant'});});
  block.dataset.claimRefs=section.claimRefs.join(' ');block.append(make('h3',section.title),make('p',section.text),button);$('episode-transcript').append(block);
}
window.__atlasLesson={getState:()=>({timeMs:document.querySelector('#episode-player input[type=range]').valueAsNumber}),setState(state){player.seek(state.timeMs);},reset:()=>player.seek(0),seek:time=>player.seek(time)};
const read=async path=>{const response=await fetch(path);if(!response.ok)throw new Error(`자료를 읽지 못했습니다: ${response.status}`);return response.json();};
try{
  const [related,sources,original,inference]=await Promise.all([read('/content/formal-logic/explosion/related.json'),read('/sources/registry.json'),read('/content/formal-logic/explosion/claims.json'),read('/content/formal-logic/explosion/inference-claims.json')]);
  const claims=[...original,...inference,...related.claims],claimById=new Map(claims.map(c=>[c.id,c]));
  const articleId=article=>article.id.replaceAll(':','-').replaceAll('.','-');
  for(const article of related.articles){
    const id=articleId(article),link=make('a',article.title);link.href=`#${id}`;$('related-nav').append(link);
    const card=make('article');card.className='related-article';card.id=id;card.dataset.conceptId=article.conceptId;
    card.append(make('h3',article.title));
    for(const block of article.blocks){const p=make('p',block.text);p.id=block.id;p.dataset.claimRefs=block.claimRefs.join(' ');card.append(p);}
    const refs=new Set(article.blocks.flatMap(b=>b.claimRefs).flatMap(id=>claimById.get(id)?.sourceRefs.map(r=>r.sourceId)??[]));
    const footer=make('footer','근거: ');
    for(const id of refs){const source=sources.find(s=>s.id===id),a=make('a',source.title);a.href=source.canonicalUrl;a.target='_blank';a.rel='noopener noreferrer';footer.append(a);}
    footer.append(make('p',`범위: ${article.scope??'개념 소개이며 정리의 전체 증명이 아닙니다.'} · ${article.reviewStatus}`));card.append(footer);$('related-articles').append(card);
  }
  const usedClaims=new Set([...EXPLOSION_EPISODE.sections.flatMap(s=>s.claimRefs),...related.articles.flatMap(a=>a.blocks.flatMap(b=>b.claimRefs))]);
  const usedSources=new Set([...usedClaims].flatMap(id=>claimById.get(id)?.sourceRefs.map(r=>r.sourceId)??[]));
  for(const source of sources.filter(s=>usedSources.has(s.id))){const p=make('p'),a=make('a',source.title);a.href=source.canonicalUrl;a.target='_blank';a.rel='noopener noreferrer';p.append(a,make('span',` · ${source.author} · 확인일 ${source.retrievedAt}`));$('lesson-sources').append(p);}
  for(const claim of claims.filter(c=>usedClaims.has(c.id))){const div=make('div');div.className='lesson-claim';div.append(make('strong',claim.id),make('p',claim.statement),make('p',`범위: ${claim.scope}`),make('p',`조건: ${claim.assumptions.join(' / ')}`),make('p',claim.sourceRefs.map(r=>`${r.sourceId} · ${r.locator}`).join('; ')),make('p',claim.reviewStatus));$('lesson-claims').append(div);}
  if(location.hash){document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();}
}catch(error){$('lesson-error').textContent=error.message;}
