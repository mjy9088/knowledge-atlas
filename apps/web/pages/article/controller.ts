import {required,byId,eventElement} from '../../components/dom.js';
import type {ReaderView} from '../../components/reader/state.js';
import type {ExperimentInput} from '/packages/experiments/premise-state.js';
interface ArticleElements {[id:string]:HTMLElement;'reader-prev':HTMLButtonElement;'reader-next':HTMLButtonElement;'reader-reset':HTMLButtonElement;'reader-skip':HTMLButtonElement}
export interface RelatedState {sceneId:string;cover?:boolean;experiment?:ExperimentInput;visual?:{step:number};interaction?:ReturnType<NonNullable<ReturnType<typeof mountTopicInteraction>>['getState']>}
import {CONTENT_PAGES} from '/content/catalog.js';
import {readerSkip,createRelatedReader} from '../../components/reader/state.js';
import {mountPremiseExperiment,normalizeExperimentInput,evaluateExperimentInput} from '../../components/experiment/premise-editor.js';
import {RELATED_MODELS,relatedNarration} from '../../topics/formal-reasoning/experiments.js';
import {mountInferenceExplorer} from '../../components/inference/explorer.js';
import {mountReaderPanels} from '../../components/reader/panels.js';
import {mountEvaluationFeedback} from '../../components/reader/evaluation-feedback.js';
import {mountTopicInteraction} from '../../topics/registry.js';
const $=<K extends string & keyof ArticleElements>(id:K)=>byId<ArticleElements[K]>(id),root=required('[data-page]');
const page=(()=>{const found=CONTENT_PAGES.find(page=>page.slug===root.dataset.page);if(!found)throw new Error('Unknown article');return found;})(),model=page.model?RELATED_MODELS[page.model]:undefined;
if(page.model&&!model)throw new RangeError('Unknown experiment adapter');
root.dataset.mode=page.interactive?(page.interactive==='hydrogenic-orbitals'?'spatial':'interactive'):model?'experiment':'reading';
const resolveSceneId=(id:string)=>page.interactive==='weekday-worlds'&&id==='reason'?'question':id;
const requestedHash=location.hash==='#reason'&&page.interactive==='weekday-worlds'?'#question':location.hash,scenes=[...document.querySelectorAll<HTMLElement>('.reader-scene')];
const cover=document.createElement('section');cover.className='reader-cover';cover.setAttribute('aria-label','제목 슬라이드');
let coverVisible=Boolean(page.cover&&(!requestedHash||requestedHash==='#title'));
if(page.cover){cover.append(required('.reader-intro>.eyebrow'),required('.reader-intro h1'));root.insertBefore(cover,$('reader-workbench'));const titleLink=document.createElement('a');titleLink.href='#title';titleLink.textContent='제목';required('.reader-menu nav').prepend(titleLink);}
if(page.cover&&page.coverArtwork){const artwork=document.createElement('img');artwork.className='reader-cover-artwork';artwork.src=page.coverArtwork.src;artwork.alt=page.coverArtwork.alt;artwork.width=1200;artwork.height=1000;cover.classList.add('reader-cover-illustrated');cover.append(artwork);}
if(page.interactive==='weekday-worlds'){
  root.dataset.focusReader='true';
  for(const scene of scenes){const copy=required('.reader-copy',scene),title=required('h2',copy),heading=document.createElement('div');heading.className='reader-scene-heading';copy.prepend(heading);heading.append(title,required('.reader-dialogue>.eyebrow',scene));}

  const rail=document.createElement('aside');rail.className='reader-action-rail';rail.setAttribute('aria-label','목차와 설명 이동');
  rail.append(required('.reader-menu'),$('reader-controls'));root.append(rail);
  const chrome=required('.page-chrome');chrome.classList.add('reader-reveal-chrome');chrome.setAttribute('aria-label','상단 탐색 메뉴');
  const menu=required<HTMLDetailsElement>('.reader-menu'),summary=required<HTMLElement>('summary',menu),closeMenu=document.createElement('button');closeMenu.type='button';closeMenu.className='reader-menu-close';closeMenu.textContent='목차 닫기 ×';required('nav',menu).prepend(closeMenu);
  const menuNav=required('nav',menu),indexLink=required<HTMLAnchorElement>('#reader-end-links a[href="/knowledge/"]');menuNav.append(indexLink);
  $('reader-end-links').remove();$('reader-skip-scope').remove();
  $('reader-prev').title='← 방향키: 이전 장면';$('reader-prev').setAttribute('aria-keyshortcuts','ArrowLeft');
  $('reader-next').title='→ 방향키 · Space / Enter: 다음';$('reader-next').setAttribute('aria-keyshortcuts','ArrowRight Space Enter');
  const dismissMenu=()=>{menu.open=false;summary.focus({preventScroll:true});};closeMenu.addEventListener('click',dismissMenu);
  menu.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dismissMenu();}});
  document.addEventListener('pointerdown',event=>{if(menu.open&&event.target instanceof Node&&!menu.contains(event.target))menu.open=false;});
}
const original=scenes.map(node=>({title:required('h2',node).textContent,text:required('.scene-prose',node).textContent,claims:node.dataset.claimRefs??''}));
const feedback=scenes.map(node=>mountEvaluationFeedback({content:required('.scene-prose',node),message:required('.scene-result',node)}));
const panels=mountReaderPanels([{element:$('connections'),title:'연관 지식'},{element:$('evidence'),title:'근거와 범위'}]);
let current:ReaderView,experiment:ReturnType<typeof mountPremiseExperiment>|undefined,interaction:ReturnType<typeof mountTopicInteraction>|undefined;const explorer=mountInferenceExplorer($('reader-proof'));
function renderInput(){
  if(!current||model&&!experiment)return;
  const node=scenes[current.index],info=experiment?.inspect(),customized=info?.customized??false;
  scenes.forEach((scene,index)=>{scene.hidden=index!==current.index;});
  required('.concept-diagram',node).hidden=Boolean(model||interaction||(!current.scene.figure&&!current.scene.cards?.length));$('reader-proof').hidden=!model;
  if(model){
  $('reader-proof').dataset.claimRefs=model.claimRefs.join(' ');
  if(info?.valid)explorer.update(info);else explorer.invalidate('입력을 완성하면 추론 도표를 갱신합니다.');
  }
  interaction?.suggest(current.scene.suggestion);
  const topicInfo=interaction?.inspect(),topicNarration=topicInfo?.customized&&interaction?interaction.describe(current.scene):null;
  const narration=info?relatedNarration(page.model??'',info):null,copy=required('.reader-copy',node);
  required('h2',node).textContent=original[current.index].title;
  if(topicNarration){
    required('.scene-prose',node).textContent=topicNarration.text;feedback[current.index].reset();copy.dataset.status=topicNarration.status;
    node.dataset.claimRefs=(page.claimRefs??original[current.index].claims.split(' ')).join(' ');
  }else if(narration&&model&&(customized||info&&!info.valid)){
    const available=narration.status==='adapted';
    required('.scene-prose',node).textContent=available?narration.text:'';
    feedback[current.index].setState({available,summary:available?'':narration.title,detail:available?'':narration.text});
    copy.dataset.status=narration.status;node.dataset.claimRefs=model.claimRefs.join(' ');
  }else{
    required('.scene-prose',node).textContent=original[current.index].text;feedback[current.index].reset();
    node.dataset.claimRefs=original[current.index].claims;copy.dataset.status='example';
  }
  const next=page.scenes[current.index+1];
  const opening=page.interactive==='weekday-worlds'&&!coverVisible&&current.sceneId==='question';
  const reflecting=opening&&topicInfo&&'challenge'in topicInfo&&['answered','expired','skipped'].includes(topicInfo.challenge.phase);
  if(opening)root.dataset.opening=reflecting?'reflection':'challenge';else delete root.dataset.opening;
  // Article scenes have no authored multi-scene skip destination.
  required('.skip-context',node).hidden=true;
  $('reader-prev').disabled=current.index===0&&!page.cover;$('reader-prev').hidden=coverVisible;$('reader-next').textContent=coverVisible?'내용 보기 →':page.interactive==='weekday-worlds'&&current.sceneId==='question'&&!reflecting?'건너뛰기 →':next?'다음 →':'연관 지식 →';const skip=!coverVisible?readerSkip(page,current.sceneId):null;$('reader-skip').hidden=!skip;
  if(skip){const button=$('reader-skip');button.textContent=skip.label+' ↗';button.title='건너뛸 내용: '+skip.scope+' · 이동: '+skip.destination;button.setAttribute('aria-label',skip.label+' · 이동: '+skip.destination);const heading=node.querySelector<HTMLElement>('.reader-scene-heading');if(heading)heading.insertBefore(button,required('.eyebrow',heading));else $('reader-controls').insertBefore(button,$('reader-next'));}
  if(page.cover){root.dataset.cover=String(coverVisible);cover.hidden=!coverVisible;$('reader-workbench').hidden=coverVisible||!model&&!interaction;$('reader-scenes').hidden=coverVisible||opening;}
  interaction?.setActive?.(!coverVisible&&current.sceneId==='question');
  if(page.interactive!=='weekday-worlds'){$('reader-skip-scope').textContent=page.interactive==='hydrogenic-orbitals'?'본문 ← → 장면 이동 · 시각화에 초점을 두면 방향키 회전':'← → 방향키 · Space / Enter 다음';$('reader-end-links').hidden=Boolean(next);}
}
function render(view:ReaderView){current=view;renderInput();history.replaceState(null,'',coverVisible?'#title':'#'+view.sceneId);}
const reader=createRelatedReader(page,{onChange:render});
if(model){
$('reader-experiment').hidden=false;$('reader-model-label').textContent=model.label;
experiment=mountPremiseExperiment($('reader-experiment'),{suggestion:model.presets[0],derive:model.derive,syntaxText:model.syntax,onChange:renderInput});
experiment.suggest(model.presets[0]);
for(const preset of model.presets){const button=document.createElement('button');button.type='button';button.textContent=preset.label;button.addEventListener('click',()=>experiment?.setState(preset));$('reader-presets').append(button);}
}else if(page.interactive){
  required('.model-toolbar').hidden=true;
  const container=document.createElement('div');$('reader-workbench').append(container);
  interaction=mountTopicInteraction(page.interactive,container,{onChange:renderInput,onSceneRequest(sceneId){if(!page.scenes.some(scene=>scene.id===sceneId))throw new RangeError('Unknown requested scene');coverVisible=false;reader.setState({sceneId});const title=root.dataset.opening==='reflection'?required('.weekday-challenge-reflection h2',root):root.dataset.opening==='challenge'?required('.weekday-intro-question',root):required('h2',scenes[current.index]);title.tabIndex=-1;title.focus({preventScroll:true});}});
}else $('reader-workbench').hidden=true;
function next(){if(coverVisible){coverVisible=false;render(reader.inspect());}else if(current.index===page.scenes.length-1)panels.openHash('#connections',$('reader-next'));else{if(!interaction?.beforeNext?.())reader.next();}}
function previous(){if(coverVisible)return;if(page.cover&&current.index===0){coverVisible=true;render(reader.inspect());}else reader.previous();}
$('reader-skip').addEventListener('click',()=>{const skip=readerSkip(page,current.sceneId);if(skip){reader.setState({sceneId:skip.to});const title=required('h2',scenes[current.index]);title.tabIndex=-1;title.focus({preventScroll:true});}});
$('reader-next').addEventListener('click',next);$('reader-prev').addEventListener('click',previous);
$('reader-reset').hidden=false;$('reader-reset').addEventListener('click',()=>{coverVisible=Boolean(page.cover);experiment?.reset();interaction?.reset();reader.reset();required<HTMLDetailsElement>('.reader-menu').open=false;});
required('.reader-menu nav').addEventListener('click',event=>{const link=eventElement(event)?.closest<HTMLAnchorElement>('a');if(!link||!(page.cover&&link.hash==='#title')&&!page.scenes.some(scene=>scene.id===link.hash.slice(1)))return;event.preventDefault();coverVisible=Boolean(page.cover&&link.hash==='#title');if(coverVisible)render(reader.inspect());else reader.setState({sceneId:link.hash.slice(1)});required<HTMLDetailsElement>('.reader-menu').open=false;});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||document.querySelector('dialog[open]'))return;
  if(eventElement(event)?.closest('input,textarea,select,summary,details,[contenteditable]'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();previous();}
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  if([' ','Enter'].includes(event.key)&&!eventElement(event)?.closest('a,button')){event.preventDefault();next();}
});
function followHash(){const id=resolveSceneId(location.hash.slice(1));if(page.cover&&id==='title'){coverVisible=true;render(reader.inspect());}else if(page.scenes.some(scene=>scene.id===id)){coverVisible=false;reader.setState({sceneId:id});}else panels.openHash(location.hash);}
window.addEventListener('hashchange',followHash);
$('reader-controls').hidden=false;if(page.interactive!=='weekday-worlds')$('reader-skip-scope').hidden=false;
const requestedScene=requestedHash.slice(1);if(page.scenes.some(scene=>scene.id===requestedScene))reader.setState({sceneId:requestedScene});else render(reader.inspect());
document.documentElement.classList.add('reader-enhanced');window.scrollTo(0,0);panels.openHash(requestedHash);
export const relatedAPI={
  getState:()=>({...reader.getState(),...(page.cover?{cover:coverVisible}:{}),...(experiment?{experiment:experiment.getState(),visual:explorer.getState()}:{}),...(interaction?{interaction:interaction.getState()}:{})}),
  setState(state:RelatedState){
    state={...state,sceneId:resolveSceneId(state?.sceneId)};
    if(!page.scenes.some(scene=>scene.id===state?.sceneId))throw new RangeError('Unknown related scene');
    if(state.cover!==undefined&&(typeof state.cover!=='boolean'||!page.cover))throw new RangeError('Unsupported cover state');
    if(!experiment){if(state.experiment||state.visual)throw new RangeError('This article has no premise experiment');if(state.interaction&&interaction?.validateState){interaction.validateState(state.interaction);coverVisible=state.cover??false;reader.setState(state);interaction.setState(state.interaction);return;}if(state.interaction){if(!interaction)throw new RangeError('This article has no interaction');interaction.setState(state.interaction);}coverVisible=state.cover??false;reader.setState(state);return;}
    const input=state.experiment?normalizeExperimentInput(state.experiment):experiment.getState(),info=evaluateExperimentInput(input,model?.derive);
    if(state.visual&&(!Number.isInteger(state.visual.step)||state.visual.step<0||state.visual.step>=Math.max(1,info.proof?.lines.length??0)))throw new RangeError('Unknown proof step');
    if(state.experiment)experiment.setState(state.experiment);reader.setState(state);
    if(state.visual&&info.proof?.lines.length)explorer.setState(state.visual);
  },
  reset(){coverVisible=Boolean(page.cover);experiment?.reset();interaction?.reset();reader.reset();},seek(timeMs:number){if(!interaction)throw new RangeError('No seekable interaction');interaction.seek(timeMs);},
  getInspectionSnapshot(){const node=scenes[current.index],evaluation=feedback[current.index].getState();return {...reader.inspect(),...(page.cover?{cover:coverVisible}:{}),model:page.interactive??page.model??null,experiment:experiment?.inspect()??null,interaction:interaction?.inspect()??null,visual:model?explorer.getState():null,evaluation,displayedDialogue:{title:required('h2',node).textContent,text:evaluation.available?required('.scene-prose',node).textContent:evaluation.detail,status:required('.reader-copy',node).dataset.status}};}
};

window.__atlasRelated=relatedAPI;
