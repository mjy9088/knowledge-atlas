import {required,byId,eventElement} from '../../components/dom.js';
import type {LessonView} from './state.js';
import type {ExperimentInspection,ExperimentInput} from '/packages/experiments/premise-state.js';
import type {ExperimentDraft} from '/packages/experiments/premise-state.js';
import type {ProofResult} from '/packages/models/types.js';
import type {Article} from '/packages/content/types.js';
interface LessonElements {[id:string]:HTMLElement;'lesson-prev':HTMLButtonElement;'lesson-next':HTMLButtonElement;'lesson-skip':HTMLButtonElement}
export interface LessonState {sectionId:string;experiment?:ExperimentInput}
import {EXPLOSION_EPISODE} from '../../../../content/formal-logic/explosion/episode.js';
import {createExplosionEpisode} from '../../../../packages/projection/explosion.js';
import {mountInferenceVisual} from '../../components/inference/visual.js';
import {createLessonDialogue} from './state.js';
import {mountPremiseExperiment,normalizeExperimentInput} from '../../components/experiment/premise-editor.js';
import {describeExperiment,EXPERIMENT_RULE_CLAIMS} from '../../topics/formal-reasoning/dialogue.js';
import {CONTENT_PAGES,pageURL} from '../../../../content/catalog.js';
import {mountReaderPanels} from '../../components/reader/panels.js';
import {mountEvaluationFeedback} from '../../components/reader/evaluation-feedback.js';
import {loadContentCatalog} from '../../../../packages/content/load-catalog.js';
const $=<K extends string & keyof LessonElements>(id:K)=>byId<LessonElements[K]>(id),make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string|null)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
const timeline=createExplosionEpisode(),menu=byId<HTMLDialogElement>('lesson-menu'),stage=$('lesson-stage');
const initialLessonHash=location.hash;
const evidenceNode=required('.lesson-evidence');evidenceNode.id='lesson-evidence';
const panels=mountReaderPanels([{element:$('related'),title:'연관 지식'},{element:evidenceNode,title:'출처와 근거'}]);
const endLinks=make('nav');endLinks.className='lesson-end-links';endLinks.hidden=true;
for(const [href,label]of [['#related','연관 지식 ↗'],['#lesson-evidence','출처와 근거']]){
  const link=make('a',label);link.href=href;endLinks.append(link);
  const menuLink=make('a',label);menuLink.href=href;required('.lesson-tools').append(menuLink);
}
required('.dialogue-box').append(endLinks);
const visual=mountInferenceVisual(stage);
const evaluationMessage=make('p');evaluationMessage.id='lesson-evaluation';$('lesson-dialogue-copy').append(evaluationMessage);
const feedback=mountEvaluationFeedback({content:$('dialogue-text'),message:evaluationMessage});
let navigatingHistory=false,currentView:LessonView|undefined;
const experiment=mountPremiseExperiment($('lesson-experiment'),{suggestion:normalizeExperimentInput(timeline.cues[0].presentation.snapshot as ExperimentDraft),idPrefix:'lesson-input',onChange(info){if(currentView)renderExperiment(currentView,info);}});
function formulaCard(formula:string,label:string){const card=make('div');card.className='story-formula';card.append(make('span',label),make('strong',formula));return card;}
function renderSkip(view:LessonView,label=view.chapter.title,scope=view.chapter.known,target=view.nextChapter?.title){
  const available=view.skippedSections.length>0;
  $('lesson-skip').hidden=!available;$('lesson-skip-context').hidden=!available;
  $('lesson-skip').textContent=available?`${label} 건너뛰기 ↗`:'';
  $('lesson-skip').title=available?`건너뛸 장면: ${view.skippedSections.map(s=>s.title).join(' · ')} · 이동: ${target}`:'';
  $('lesson-skip-context').textContent=available?`건너뛸 내용: ${scope} (${view.skippedSections.length}개 장면) · 이동: ${target}`:'';
}
function render(view:LessonView){
  currentView=view;
  const section=view.section,presentation=timeline.cues[view.index].presentation;
  $('lesson-chapter').textContent=view.chapter.title;
  $('lesson-position').textContent=(view.index+1)+' / '+view.total;
  $('lesson-prev').disabled=!view.canPrevious;$('lesson-next').disabled=!view.canNext;
  endLinks.hidden=view.canNext;
  renderSkip(view);
  experiment.suggest(presentation.controlState??normalizeExperimentInput(presentation.snapshot as ExperimentDraft));
  for(const button of $('lesson-jumps').querySelectorAll<HTMLButtonElement>(':scope > button'))button.setAttribute('aria-current',button.dataset.sectionId===section.id?'step':'false');
  if(!navigatingHistory&&location.hash.startsWith('#explanation-'))history.replaceState(null,'','#explanation-'+section.id);
}
function renderExperiment(view:LessonView,info:ExperimentInspection){
  const section=view.section,presentation=timeline.cues[view.index].presentation;
  const narration=info.customized?describeExperiment(section.id,info):{...section,status:'example'};
  $('dialogue-title').textContent=section.title;
  const available=narration.status==='example'||narration.status==='adapted';
  $('dialogue-text').textContent=available?narration.text:'';
  feedback.setState({available,summary:available?'':narration.title,detail:available?'':narration.text});
  $('lesson-dialogue-copy').dataset.claimRefs=narration.claimRefs.join(' ');
  $('lesson-dialogue-copy').dataset.status=narration.status;
  const chapterTitles:Record<string,string>={'question':'전제와 목표 읽기','premise-p':'근거에서 결론까지','change-r':'목표 바꾸기','remove-premise':'전제 포함·제외','truth':'도출과 사실','summary':'정리와 다음 질문'};
  $('lesson-chapter').textContent=info.customized?'내 입력 · '+chapterTitles[view.chapter.id]:view.chapter.title;
  if(info.customized){
    const known:Record<string,string>={'question':'현재 전제·목표와 명제식 표기','premise-p':'현재 경로의 전제·참조 행·적용 규칙','change-r':'목표를 바꾸며 도출 경로를 비교하는 방법','remove-premise':'전제 포함·제외와 목표 경로의 관계','truth':'도출과 사실 판단의 구별, 일관성의 의미'};
    renderSkip(view,chapterTitles[view.chapter.id],known[view.chapter.id],view.nextChapter?chapterTitles[view.nextChapter.id]:undefined);
  }else renderSkip(view);
  if(info.customized){
    if(!info.valid){stage.replaceChildren(make('p','명제식 입력 대기'));stage.dataset.kind='invalid';return;}
    if(!info.proof.goalReached){stage.replaceChildren(make('p',`포함된 전제 ${info.premises.length}개 · 목표 경로 미발견`));stage.dataset.kind='unavailable';return;}
    visual.update({...info,step:('stepIndex' in narration?narration.stepIndex:null)??0});stage.dataset.kind='proof';return;
  }
  if(section.phase==='intro'){
    const pair=make('div');pair.className='story-pair';pair.append(formulaCard('P','문장'),make('span','그리고'),formulaCard('¬P','그 문장의 부정'));
    stage.replaceChildren(pair);stage.dataset.kind='introduction';
  }else if(section.scene==='missing'){
    stage.replaceChildren(formulaCard('P','남아 있는 전제'),make('p','¬P 전제 제외 · 이 모순 폭발 경로는 구성되지 않습니다.'));stage.dataset.kind='missing';
  }else{
    if(!presentation.snapshot.proof)throw new Error('Missing presentation proof');visual.update({premises:presentation.premises,goal:presentation.goal,proof:presentation.snapshot.proof as ProofResult,step:section.line??presentation.lines.length-1});stage.dataset.kind='proof';
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
  if(eventElement(event)?.closest('input,textarea,select,summary,details,dialog,[contenteditable]'))return;
  const box=$('lesson-dialogue-copy').getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;
  if(event.key==='ArrowLeft'){event.preventDefault();dialogue.previous();}
  if(event.key==='ArrowRight'){event.preventDefault();dialogue.next();}
  if([' ','Enter'].includes(event.key)&&!eventElement(event)?.closest('button,a')){event.preventDefault();dialogue.next();}
});
function followSection(){
  if(!location.hash.startsWith('#explanation-'))return;
  const id=location.hash.slice('#explanation-'.length);
  if(!EXPLOSION_EPISODE.sections.some(s=>s.id===id))return;
  navigatingHistory=true;try{dialogue.setState({sectionId:id});}finally{navigatingHistory=false;}
  required('.dialogue-experience').scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',followSection);
export const lessonAPI={...dialogue,getState:()=>({...dialogue.getState(),experiment:experiment.getState()}),getInspectionSnapshot(){const reading=dialogue.inspect(),input=experiment.inspect();return {...reading,experiment:input,evaluation:feedback.getState(),displayedDialogue:{...(input.customized?describeExperiment(reading.section.id,input):reading.section),title:$('dialogue-title').textContent}};},setState(state:LessonState){if(!EXPLOSION_EPISODE.sections.some(s=>s.id===state?.sectionId))throw new RangeError('Unknown lesson section');if(state.experiment)experiment.setState(state.experiment);dialogue.setState(state);},reset(){dialogue.reset();experiment.reset();}};
window.__atlasLesson=lessonAPI;window.__atlasLessonExperiment=experiment;
render(dialogue.inspect());if(initialLessonHash.startsWith('#explanation-'))history.replaceState(null,'',initialLessonHash);followSection();document.documentElement.classList.add('reader-enhanced');window.scrollTo(0,0);
const read=async (path:string)=>{const response=await fetch(path);if(!response.ok)throw new Error(`자료를 읽지 못했습니다: ${response.status}`);return response.json();};
try{
  const {collection:related,sources,claims}=await loadContentCatalog(name=>read('/'+name));
  related.articles=related.articles.filter(article=>related.articleRefs?.includes(article.id));
  const claimById=new Map(claims.map(c=>[c.id,c]));
  const articleId=(article:Article)=>article.id.replaceAll(':','-').replaceAll('.','-');
  for(const article of related.articles){
    const id=articleId(article),link=make('a',article.title),page=CONTENT_PAGES.find(page=>page.articleId===article.id);link.href=page?pageURL(page):`#${id}`;$('related-nav').append(link);
    const card=make('article');card.className='related-article';card.id=id;card.dataset.conceptId=article.conceptId;
    card.append(make('h3',article.title));
    if(page){const open=make('a','장면별 해설로 읽기 ↗');open.href=pageURL(page);card.append(open);}
    for(const block of article.blocks){const p=make('p',block.text);p.id=block.id;p.dataset.claimRefs=block.claimRefs.join(' ');card.append(p);}
    const refs=new Set(article.blocks.flatMap(b=>b.claimRefs).flatMap(id=>claimById.get(id)?.sourceRefs.map(r=>r.sourceId)??[]));
    const footer=make('footer','근거: ');
    for(const id of refs){const source=sources.find(s=>s.id===id),a=make('a',source?.title??id);if(!source)continue;a.href=source.canonicalUrl;a.target='_blank';a.rel='noopener noreferrer';footer.append(a);}
    footer.append(make('p',`범위: ${article.scope??'개념 소개이며 정리의 전체 증명이 아닙니다.'} · ${article.reviewStatus}`));card.append(footer);$('related-articles').append(card);
  }
  const usedClaims=new Set([...Object.values(EXPERIMENT_RULE_CLAIMS),...EXPLOSION_EPISODE.sections.flatMap(s=>s.claimRefs),...related.articles.flatMap(a=>a.blocks.flatMap(b=>b.claimRefs))]);
  const usedSources=new Set([...usedClaims].flatMap(id=>claimById.get(id)?.sourceRefs.map(r=>r.sourceId)??[]));
  for(const source of sources.filter(s=>usedSources.has(s.id))){const p=make('p'),a=make('a',source.title);a.href=source.canonicalUrl;a.target='_blank';a.rel='noopener noreferrer';p.append(a,make('span',` · ${source.author} · 확인일 ${source.retrievedAt}`));$('lesson-sources').append(p);}
  for(const claim of claims.filter(c=>usedClaims.has(c.id))){const div=make('div');div.className='lesson-claim';div.append(make('strong',claim.id),make('p',claim.statement),make('p',`범위: ${claim.scope}`),make('p',`조건: ${claim.assumptions.join(' / ')}`),make('p',claim.sourceRefs.map(r=>`${r.sourceId} · ${r.locator}`).join('; ')),make('p',claim.reviewStatus));$('lesson-claims').append(div);}
  if(location.hash&&!location.hash.startsWith('#explanation-'))panels.openHash(location.hash);
}catch(error){$('lesson-error').textContent=error instanceof Error?error.message:String(error);}

export type LessonExperiment=typeof experiment;
