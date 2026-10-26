import {required,byId,eventElement} from '../../components/dom.js';
import type {ReaderView} from '../../components/reader/state.js';
interface ArticleElements {[id:string]:HTMLElement;'reader-prev':HTMLButtonElement;'reader-next':HTMLButtonElement;'reader-reset':HTMLButtonElement;'reader-skip':HTMLButtonElement}
import type {PresentationState} from '../../components/reader/presentation-contract.js';
export interface RelatedState {readonly sceneId:string;readonly cover?:boolean;readonly interaction?:TopicState;readonly presentation?:PresentationState}
type ParsedRelatedState=Omit<RelatedState,'interaction'|'presentation'>&{readonly interaction?:unknown;readonly presentation?:unknown};
import {CONTENT_PAGES} from '/content/catalog.js';
import {readerDestination,readerSkip,createRelatedReader} from '../../components/reader/state.js';
import {mountReaderPanels} from '../../components/reader/panels.js';
import {mountEvaluationFeedback} from '../../components/reader/evaluation-feedback.js';
import {mountTopicInteraction,type TopicState} from '../../topics/registry.js';
import {articlePath,scenePath,parseKnowledgePath} from '/packages/content/scene-routing.js';
import {mountPresentation} from '../../components/reader/presentation.js';
const RELATED_STATE_KEYS=['sceneId','cover','interaction','presentation'] as const;
function assertExactRecord(value:unknown,keys:readonly string[],message:string):asserts value is Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value)||!Object.keys(value).every(key=>keys.some(allowed=>allowed===key)))throw new RangeError(message);}
function isTopicStateCandidate(value:unknown):value is Record<string,unknown>{return Boolean(value)&&typeof value==='object'&&!Array.isArray(value);}
function parseRelatedState(value:unknown):ParsedRelatedState{
  assertExactRecord(value,RELATED_STATE_KEYS,'Invalid related state');if(typeof value['sceneId']!=='string')throw new RangeError('Invalid related state');
  const cover=value['cover'];if(Object.hasOwn(value,'cover')&&typeof cover!=='boolean')throw new RangeError('Invalid cover state');
  const interaction=value['interaction'];if(Object.hasOwn(value,'interaction')&&!isTopicStateCandidate(interaction))throw new RangeError('Invalid interaction state');
  const presentation=value['presentation'];if(Object.hasOwn(value,'presentation')&&!isTopicStateCandidate(presentation))throw new RangeError('Invalid presentation state');
  return{sceneId:value['sceneId'],...(typeof cover==='boolean'?{cover}:{}),...(isTopicStateCandidate(interaction)?{interaction}:{}),...(presentation!==undefined?{presentation}:{})};
}
export function mountArticle(){
const $=<K extends string & keyof ArticleElements>(id:K)=>byId<ArticleElements[K]>(id),root=required('[data-page]');
const page=(()=>{const found=CONTENT_PAGES.find(page=>page.slug===root.dataset.page);if(!found)throw new Error('Unknown article');return found;})();
const longform=Boolean(page.navigation);
const spatial=page.interactive==='physics-history';
root.dataset.mode=spatial?'spatial':page.interactive?'interactive':'reading';
const resolveSceneId=(id:string)=>page.interactive==='weekday-worlds'&&id==='reason'?'question':id;
const scenes=[...document.querySelectorAll<HTMLElement>('.reader-scene')];
const cover=document.createElement('section');cover.className='reader-cover';cover.setAttribute('aria-label','제목 슬라이드');
let coverVisible=false;
if(page.cover){cover.append(required('.reader-intro>.eyebrow'),required('.reader-intro h1'));root.insertBefore(cover,$('reader-workbench'));const titleLink=document.createElement('a');titleLink.href=articlePath(page.slug);titleLink.textContent='제목';required('.reader-menu nav').prepend(titleLink);}
if(page.cover&&page.coverArtwork){const artwork=document.createElement('img');artwork.className='reader-cover-artwork';artwork.src=page.coverArtwork.src;artwork.alt=page.coverArtwork.alt;cover.classList.add('reader-cover-illustrated');cover.append(artwork);}
if(page.interactive==='weekday-worlds'){
  root.dataset.focusReader='true';
  for(const scene of scenes){const copy=required('.reader-copy',scene),title=required('h2',copy),heading=document.createElement('div');heading.className='reader-scene-heading';copy.prepend(heading);heading.append(title,required('.reader-dialogue>.eyebrow',scene));}

  const rail=document.createElement('aside');rail.className='reader-action-rail';rail.setAttribute('aria-label','목차와 설명 이동');
  rail.append(required('.reader-menu'),$('reader-controls'));root.append(rail);
  const chrome=required('.page-chrome');chrome.classList.add('reader-reveal-chrome');chrome.setAttribute('aria-label','상단 탐색 메뉴');
  const menu=required<HTMLDetailsElement>('.reader-menu'),summary=required<HTMLElement>('summary',menu),closeMenu=document.createElement('button');closeMenu.type='button';closeMenu.className='reader-menu-close';closeMenu.textContent='목차 닫기 ×';required('nav',menu).prepend(closeMenu);
  const menuNav=required('nav',menu),indexLink=required<HTMLAnchorElement>('#reader-end-links a[href="/knowledge/"]');menuNav.append(indexLink);
  // Canvas readers keep global routes in the explicit menu, clear of source controls.
  for(const link of required('nav',chrome).querySelectorAll<HTMLAnchorElement>('a')){
    const duplicate=[...menuNav.querySelectorAll<HTMLAnchorElement>('a')].some(item=>item.getAttribute('href')===link.getAttribute('href'));
    if(duplicate)link.remove();else menuNav.append(link);
  }
  chrome.hidden=true;
  const skipActions=document.createElement('div');skipActions.className='reader-skip-actions';skipActions.hidden=true;$('reader-workbench').append(skipActions);
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
const presentation=mountPresentation(page);
let historyReady=false,followingHistory=false,followedLocation='';
let current:ReaderView,interaction:ReturnType<typeof mountTopicInteraction>|undefined;
function renderInput(){
  if(!current)return;
  const node=scenes[current.index];
  scenes.forEach((scene,index)=>{scene.hidden=index!==current.index;});
  required('.concept-diagram',node).hidden=Boolean(interaction||(!current.scene.figure&&!current.scene.cards?.length));$('reader-proof').hidden=true;
  interaction?.suggest(current.scene.suggestion);
  const topicInfo=interaction?.inspect(),topicNarration=topicInfo?.customized&&interaction&&(!('available'in topicInfo)||topicInfo.available)?interaction.describe(current.scene):null;
  const labTopic=['monty-hall','two-children','physics-history'].includes(page.interactive??'');
  if(labTopic){const available=Boolean(topicInfo&&'available'in topicInfo&&topicInfo.available);root.dataset.mode=available?(spatial?'spatial':'interactive'):'reading';$('reader-workbench').hidden=!available||coverVisible;required('.concept-diagram',node).hidden=available||(!current.scene.figure&&!current.scene.cards.length);}
  const copy=required('.reader-copy',node);
  required('h2',node).textContent=original[current.index].title;
  if(topicNarration){
    required('.scene-prose',node).textContent=longform?`${original[current.index].text} ${topicNarration.text}`:topicNarration.text;feedback[current.index].reset();copy.dataset.status=topicNarration.status;
    node.dataset.claimRefs=(page.claimRefs??original[current.index].claims.split(' ')).join(' ');
  }else{
    required('.scene-prose',node).textContent=original[current.index].text;feedback[current.index].reset();
    node.dataset.claimRefs=original[current.index].claims;copy.dataset.status='example';
  }
  const nextId=readerDestination(page,current.sceneId,'next'),next=nextId===current.sceneId?undefined:page.scenes.find(scene=>scene.id===nextId);
  const opening=page.interactive==='weekday-worlds'&&!coverVisible&&current.sceneId==='question';
  const reflecting=opening&&topicInfo&&'challenge'in topicInfo&&['answered','expired','skipped'].includes(topicInfo.challenge.phase);
  if(opening)root.dataset.opening=reflecting?'reflection':'challenge';else delete root.dataset.opening;
  // The named skip control exposes the scope and destination.
  required('.skip-context',node).hidden=true;
  $('reader-prev').disabled=readerDestination(page,current.sceneId,'previous')===current.sceneId&&!page.cover;$('reader-prev').hidden=coverVisible;$('reader-next').textContent=coverVisible?'시작 →':page.interactive==='weekday-worlds'&&current.sceneId==='question'&&!reflecting?'건너뛰기 →':next?'다음 →':'연관 지식 →';const skip=!coverVisible?readerSkip(page,current.sceneId):null;$('reader-skip').hidden=!skip;
  if(page.interactive==='weekday-worlds')required('.reader-skip-actions').hidden=!skip;
  if(skip){const button=$('reader-skip');button.textContent=skip.label+' ↗';button.title='건너뛸 내용: '+skip.scope+' · 이동: '+skip.destination;button.setAttribute('aria-label',skip.label+' · 이동: '+skip.destination);const heading=node.querySelector<HTMLElement>('.reader-scene-heading')??(longform?node.querySelector<HTMLElement>('.reader-dialogue'):null);if(page.interactive==='weekday-worlds')required('.reader-skip-actions').append(button);else if(heading)heading.insertBefore(button,required('.eyebrow',heading));else $('reader-controls').insertBefore(button,$('reader-next'));}
  if(page.cover){root.dataset.cover=String(coverVisible);cover.hidden=!coverVisible;$('reader-workbench').hidden=coverVisible||!interaction;$('reader-scenes').hidden=coverVisible||opening;}
  interaction?.setActive?.(!coverVisible&&(page.interactive!=='weekday-worlds'||current.sceneId==='question')&&(!labTopic||root.dataset.mode==='interactive'||root.dataset.mode==='spatial'));
  if(page.interactive!=='weekday-worlds'){const hint=$('reader-skip-scope');const text=spatial?'본문 ← → 장면 이동 · 시각화에 초점을 두면 방향키 회전':longform?'← → 장면 이동 · Space 문서 스크롤':'← → · Space/Enter';hint.textContent=text;hint.title=spatial?text:longform?text:'← → 방향키: 장면 이동 · Space 또는 Enter: 다음';$('reader-end-links').hidden=Boolean(next);}
   interaction?.afterRender?.();
   presentation.activate(current.scene,node);
}
function render(view:ReaderView){current=view;renderInput();const panelHash=(!historyReady||followingHistory)&&['#evidence','#connections','#main'].includes(location.hash)?location.hash:'';const url=(coverVisible?articlePath(page.slug):scenePath(page.slug,view.sceneId))+panelHash;if(location.pathname+location.hash!==url){if(historyReady&&!followingHistory)history.pushState(null,'',url);else history.replaceState(null,'',url);}followedLocation=location.href;}
const reader=createRelatedReader(page,{onChange:render});
if(page.interactive){
  required('.model-toolbar').hidden=true;
  const container=document.createElement('div');$('reader-workbench').append(container);
  if(page.interactive==='weekday-worlds')$('reader-workbench').append(required('.reader-skip-actions'));
  interaction=mountTopicInteraction(page.interactive,container,{onChange:renderInput,onSceneRequest(sceneId){if(!page.scenes.some(scene=>scene.id===sceneId))throw new RangeError('Unknown requested scene');coverVisible=false;reader.setState({sceneId});const title=root.dataset.opening==='reflection'?required('.weekday-challenge-reflection h2',root):root.dataset.opening==='challenge'?required('.weekday-intro-question',root):required('h2',scenes[current.index]);title.tabIndex=-1;title.focus({preventScroll:true});}});
}else $('reader-workbench').hidden=true;
function next(){if(coverVisible){coverVisible=false;render(reader.inspect());}else if(readerDestination(page,current.sceneId,'next')===current.sceneId)panels.openHash('#connections',$('reader-next'));else{if(!interaction?.beforeNext?.())reader.next();}}
function previous(){if(coverVisible)return;if(page.cover&&current.index===0){coverVisible=true;render(reader.inspect());}else reader.previous();}
$('reader-skip').addEventListener('click',()=>{const skip=readerSkip(page,current.sceneId);if(skip){reader.setState({sceneId:skip.to});const title=required('h2',scenes[current.index]);title.tabIndex=-1;title.focus({preventScroll:true});}});
$('reader-next').addEventListener('click',next);$('reader-prev').addEventListener('click',previous);
$('reader-reset').hidden=false;$('reader-reset').addEventListener('click',()=>{coverVisible=Boolean(page.cover);interaction?.reset();presentation.reset();reader.reset();required<HTMLDetailsElement>('.reader-menu').open=false;});
document.addEventListener('click',event=>{const link=eventElement(event)?.closest<HTMLAnchorElement>('a');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.origin!==location.origin)return;const route=parseKnowledgePath(link.pathname),id=resolveSceneId(link.hash.slice(1)||route?.sceneId||'');if(route?.slug!==page.slug)return;const title=Boolean(page.cover&&!route.sceneId&&(!link.hash||link.hash==='#title'));if(!title&&!page.scenes.some(scene=>scene.id===id))return;event.preventDefault();coverVisible=title;if(title)render(reader.inspect());else reader.setState({sceneId:id});required<HTMLDetailsElement>('.reader-menu').open=false;window.scrollTo(0,0);});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||document.querySelector('dialog[open]'))return;
  if(eventElement(event)?.closest('input,textarea,select,summary,details,[contenteditable]'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();previous();}
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  if(!longform&&[' ','Enter'].includes(event.key)&&!eventElement(event)?.closest('a,button')){event.preventDefault();next();}
});
function followLocation(){
  panels.close();
  const route=parseKnowledgePath(location.pathname),id=resolveSceneId(location.hash.slice(1));
  const scene=page.scenes.find(scene=>scene.id===id)?.id??route?.sceneId??page.scenes[0].id;
  followingHistory=true;
  try{coverVisible=Boolean(page.cover&&!route?.sceneId&&(!location.hash||location.hash==='#title'));reader.setState({sceneId:page.scenes.some(item=>item.id===scene)?scene:page.scenes[0].id});}
  finally{followingHistory=false;}
  panels.openHash(location.hash);
}
// Traversal can dispatch both events; the second sees the same canonical location.
function followNavigation(){const url=location.href;if(url===followedLocation)return;followLocation();followedLocation=location.href;}
window.addEventListener('hashchange',followNavigation);
window.addEventListener('popstate',followNavigation);
$('reader-controls').hidden=false;if(page.interactive!=='weekday-worlds')$('reader-skip-scope').hidden=false;
followLocation();
document.documentElement.classList.add('reader-enhanced');window.scrollTo(0,0);historyReady=true;
const relatedAPI={
  getState:()=>({...reader.getState(),...(page.cover?{cover:coverVisible}:{}),...(interaction?{interaction:interaction.getState()}:{}),...(presentation.available?{presentation:presentation.getState()}:{})}),
  setState(value:unknown){
    const state=parseRelatedState(value),sceneId=resolveSceneId(state.sceneId),hasCover=Object.hasOwn(state,'cover'),hasInteraction=Object.hasOwn(state,'interaction');
    if(!page.scenes.some(scene=>scene.id===sceneId))throw new RangeError('Unknown related scene');
    if(hasCover&&!page.cover)throw new RangeError('Unsupported cover state');
    if(hasInteraction){if(!interaction)throw new RangeError('This article has no interaction');interaction.validateState(state.interaction);}
    if(Object.hasOwn(state,'presentation')){if(!presentation.available)throw new RangeError('No presentation on this article');presentation.validateState(state.presentation);}
    const priorHistory=followingHistory;followingHistory=true;
    try{coverVisible=state.cover??false;reader.setState({sceneId});if(state.interaction)interaction?.setState(state.interaction);if(state.presentation)presentation.setState(state.presentation);}
    finally{followingHistory=priorHistory;}
  },
  reset(){coverVisible=Boolean(page.cover);interaction?.reset();presentation.reset();reader.reset();},seek(timeMs:number){if(!interaction&&!presentation.available)throw new RangeError('No seekable interaction');interaction?.seek(timeMs);presentation.seek(timeMs);},
  getInspectionSnapshot(){const node=scenes[current.index],evaluation=feedback[current.index].getState();return {...reader.inspect(),...(page.cover?{cover:coverVisible}:{}),model:page.interactive??null,experiment:null,interaction:interaction?.inspect()??null,visual:null,evaluation,displayedDialogue:{title:required('h2',node).textContent,text:evaluation.available?required('.scene-prose',node).textContent:evaluation.detail,status:required('.reader-copy',node).dataset.status}};}
};

window.__atlasRelated=relatedAPI;
return relatedAPI;
}
export type ArticleAPI=ReturnType<typeof mountArticle>;
