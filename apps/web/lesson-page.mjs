import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';
import {createExplosionEpisode} from './explosion-episode.mjs';
import {mountInferenceVisual} from './inference-visual.mjs';
import {createLessonDialogue} from './lesson-dialogue.mjs';
import {mountPremiseExperiment} from './premise-experiment.mjs';
import {describeExperiment,EXPERIMENT_RULE_CLAIMS} from './experiment-dialogue.mjs';
const $=id=>document.getElementById(id),make=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
const timeline=createExplosionEpisode(),menu=$('lesson-menu'),stage=$('lesson-stage');
const visual=mountInferenceVisual(stage);
let navigatingHistory=false,currentView;
const experiment=mountPremiseExperiment($('lesson-experiment'),{suggestion:timeline.cues[0].presentation.snapshot,idPrefix:'lesson-input',onChange(info){if(currentView)renderExperiment(currentView,info);}});
function formulaCard(formula,label){const card=make('div');card.className='story-formula';card.append(make('span',label),make('strong',formula));return card;}
function render(view){
  currentView=view;
  const section=view.section,presentation=timeline.cues[view.index].presentation;
  $('lesson-chapter').textContent=view.chapter.title;
  $('lesson-position').textContent=(view.index+1)+' / '+view.total;
  $('lesson-prev').disabled=!view.canPrevious;$('lesson-next').disabled=!view.canNext;
  $('lesson-skip').hidden=!view.nextChapter;
  $('lesson-skip').title=view.nextChapter?'다음 주제: '+view.nextChapter.title:'';
  $('lesson-skip-context').textContent=view.nextChapter?'건너뛸 내용: '+view.chapter.known+' · 다음: '+view.nextChapter.title:'';
  $('lesson-skip-context').hidden=!view.nextChapter;
  experiment.suggest(presentation.controlState??presentation.snapshot);
  for(const button of $('lesson-jumps').children)button.setAttribute('aria-current',button.dataset.sectionId===section.id?'step':'false');
  if(!navigatingHistory&&location.hash.startsWith('#explanation-'))history.replaceState(null,'','#explanation-'+section.id);
}
function renderExperiment(view,info){
  const section=view.section,presentation=timeline.cues[view.index].presentation;
  const narration=info.customized?describeExperiment(section.id,info):{...section,status:'example'};
  $('dialogue-title').textContent=narration.title;
  $('dialogue-text').textContent=narration.text;
  $('lesson-dialogue-copy').dataset.claimRefs=narration.claimRefs.join(' ');
  $('lesson-dialogue-copy').dataset.status=narration.status;
  const chapterTitles={'question':'전제와 목표 읽기','premise-p':'근거에서 결론까지','change-r':'목표 바꾸기','remove-premise':'전제 포함·제외','truth':'도출과 사실'};
  $('lesson-chapter').textContent=info.customized?'내 입력 · '+chapterTitles[view.chapter.id]:view.chapter.title;
  if(info.customized){
    const known={'question':'현재 전제·목표와 명제식 표기','premise-p':'현재 경로의 전제·참조 행·적용 규칙','change-r':'목표를 바꾸며 도출 경로를 비교하는 방법','remove-premise':'전제 포함·제외와 목표 경로의 관계','truth':'도출과 사실 판단의 구별, 일관성의 의미'};
    $('lesson-skip-context').textContent=view.nextChapter?'건너뛸 내용: '+known[view.chapter.id]+' · 다음: '+chapterTitles[view.nextChapter.id]:'';
  }
  if(info.customized){
    if(!info.valid){stage.replaceChildren(make('p','명제식 입력 대기'));stage.dataset.kind='invalid';return;}
    if(!info.proof.goalReached){stage.replaceChildren(make('p',`포함된 전제 ${info.premises.length}개 · 목표 경로 미발견`));stage.dataset.kind='unavailable';return;}
    visual.update({...info,step:narration.stepIndex});stage.dataset.kind='proof';return;
  }
  if(section.phase==='intro'){
    const pair=make('div');pair.className='story-pair';pair.append(formulaCard('P','문장'),make('span','그리고'),formulaCard('¬P','그 문장의 부정'));
    stage.replaceChildren(pair);stage.dataset.kind='introduction';
  }else if(section.scene==='missing'){
    stage.replaceChildren(formulaCard('P','남아 있는 전제'),make('p','¬P 전제 제외 · 이 모순 폭발 경로는 구성되지 않습니다.'));stage.dataset.kind='missing';
  }else{
    visual.update({...presentation.snapshot,step:section.line??presentation.lines.length-1});stage.dataset.kind='proof';
  }
}
const dialogue=createLessonDialogue({onChange:render});
for(const section of EXPLOSION_EPISODE.sections){
  const button=make('button',section.title);button.type='button';button.dataset.sectionId=section.id;
  button.addEventListener('click',()=>{dialogue.setState({sectionId:section.id});menu.close();});$('lesson-jumps').append(button);
}
$('lesson-prev').addEventListener('click',()=>dialogue.previous());
$('lesson-next').addEventListener('click',()=>dialogue.next());
$('lesson-skip').addEventListener('click',()=>dialogue.skip());
$('lesson-reset').addEventListener('click',()=>{dialogue.reset();menu.close();});
$('lesson-menu-open').addEventListener('click',()=>menu.showModal());
$('lesson-menu-close').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>$('lesson-menu-open').focus());
menu.addEventListener('click',event=>{if(event.target===menu)menu.close();});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||menu.open)return;
  if(event.target.closest('input,textarea,select,summary,details,dialog,[contenteditable]'))return;
  const box=$('lesson-dialogue-copy').getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;
  if(event.key==='ArrowLeft'){event.preventDefault();dialogue.previous();}
  if(event.key==='ArrowRight'){event.preventDefault();dialogue.next();}
  if([' ','Enter'].includes(event.key)&&!event.target.closest('button,a')){event.preventDefault();dialogue.next();}
});
function followSection(){
  if(!location.hash.startsWith('#explanation-'))return;
  const id=location.hash.slice('#explanation-'.length);
  if(!EXPLOSION_EPISODE.sections.some(s=>s.id===id))return;
  navigatingHistory=true;try{dialogue.setState({sectionId:id});}finally{navigatingHistory=false;}
  document.querySelector('.dialogue-experience').scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',followSection);
window.__atlasLesson={...dialogue,getState:()=>({...dialogue.getState(),experiment:experiment.getState()}),getInspectionSnapshot(){const reading=dialogue.inspect(),input=experiment.inspect();return {...reading,experiment:input,displayedDialogue:input.customized?describeExperiment(reading.section.id,input):reading.section};},setState(state){if(!EXPLOSION_EPISODE.sections.some(s=>s.id===state?.sectionId))throw new RangeError('Unknown lesson section');if(state.experiment)experiment.setState(state.experiment);dialogue.setState(state);},reset(){dialogue.reset();experiment.reset();}};
window.__atlasLessonExperiment=experiment;
render(dialogue.inspect());followSection();
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
  const usedClaims=new Set([...Object.values(EXPERIMENT_RULE_CLAIMS),...EXPLOSION_EPISODE.sections.flatMap(s=>s.claimRefs),...related.articles.flatMap(a=>a.blocks.flatMap(b=>b.claimRefs))]);
  const usedSources=new Set([...usedClaims].flatMap(id=>claimById.get(id)?.sourceRefs.map(r=>r.sourceId)??[]));
  for(const source of sources.filter(s=>usedSources.has(s.id))){const p=make('p'),a=make('a',source.title);a.href=source.canonicalUrl;a.target='_blank';a.rel='noopener noreferrer';p.append(a,make('span',` · ${source.author} · 확인일 ${source.retrievedAt}`));$('lesson-sources').append(p);}
  for(const claim of claims.filter(c=>usedClaims.has(c.id))){const div=make('div');div.className='lesson-claim';div.append(make('strong',claim.id),make('p',claim.statement),make('p',`범위: ${claim.scope}`),make('p',`조건: ${claim.assumptions.join(' / ')}`),make('p',claim.sourceRefs.map(r=>`${r.sourceId} · ${r.locator}`).join('; ')),make('p',claim.reviewStatus));$('lesson-claims').append(div);}
  if(location.hash){document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();}
}catch(error){$('lesson-error').textContent=error.message;}
