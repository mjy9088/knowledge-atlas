import {required,byId,eventElement} from '../../components/dom.js';
import type {ReaderView} from '../../components/reader/state.js';
import type {ExperimentInput} from '/packages/experiments/premise-state.js';
interface ArticleElements {[id:string]:HTMLElement;'reader-prev':HTMLButtonElement;'reader-next':HTMLButtonElement;'reader-reset':HTMLButtonElement;'reader-skip':HTMLButtonElement}
export interface RelatedState {sceneId:string;experiment?:ExperimentInput;visual?:{step:number};interaction?:ReturnType<NonNullable<ReturnType<typeof mountTopicInteraction>>['getState']>}
import {CONTENT_PAGES} from '/content/catalog.js';
import {createRelatedReader} from '../../components/reader/state.js';
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
const requestedHash=location.hash,scenes=[...document.querySelectorAll<HTMLElement>('.reader-scene')];
const original=scenes.map(node=>({title:required('h2',node).textContent,text:required('.scene-prose',node).textContent,claims:node.dataset.claimRefs??''}));
const feedback=scenes.map(node=>mountEvaluationFeedback({content:required('.scene-prose',node),message:required('.scene-result',node)}));
const panels=mountReaderPanels([{element:$('connections'),title:'연관 지식'},{element:$('evidence'),title:'근거와 범위'}]);
let current:ReaderView,experiment:ReturnType<typeof mountPremiseExperiment>|undefined,interaction:ReturnType<typeof mountTopicInteraction>|undefined;const explorer=mountInferenceExplorer($('reader-proof'));
function renderInput(){
  if(!current||model&&!experiment)return;
  const node=scenes[current.index],info=experiment?.inspect(),customized=info?.customized??false;
  scenes.forEach((scene,index)=>{scene.hidden=index!==current.index;});
  required('.concept-diagram',node).hidden=Boolean(model||interaction||!current.scene.cards?.length);$('reader-proof').hidden=!model;
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
  required('.skip-context',node).textContent='건너뛸 내용: '+(topicInfo?.customized?'현재 상태와 '+current.scene.known:customized?'현재 입력과 적용 규칙':current.scene.known)+' · 다음: '+(next?.title??'연관 지식');
  $('reader-prev').disabled=current.index===0;$('reader-next').textContent=next?'다음 →':'연관 지식 →';$('reader-skip').hidden=!next;
  $('reader-skip-scope').textContent=page.interactive==='hydrogenic-orbitals'?'본문 ← → 장면 이동 · 시각화에 초점을 두면 방향키 회전':'← → 방향키 · Space / Enter 다음';$('reader-end-links').hidden=Boolean(next);
}
function render(view:ReaderView){current=view;renderInput();history.replaceState(null,'','#'+view.sceneId);}
const reader=createRelatedReader(page,{onChange:render});
if(model){
$('reader-experiment').hidden=false;$('reader-model-label').textContent=model.label;
experiment=mountPremiseExperiment($('reader-experiment'),{suggestion:model.presets[0],derive:model.derive,syntaxText:model.syntax,onChange:renderInput});
experiment.suggest(model.presets[0]);
for(const preset of model.presets){const button=document.createElement('button');button.type='button';button.textContent=preset.label;button.addEventListener('click',()=>experiment?.setState(preset));$('reader-presets').append(button);}
}else if(page.interactive){
  required('.model-toolbar').hidden=true;
  const container=document.createElement('div');$('reader-workbench').append(container);
  interaction=mountTopicInteraction(page.interactive,container,{onChange:renderInput});
}else $('reader-workbench').hidden=true;
function next(){if(current.index===page.scenes.length-1)panels.openHash('#connections',$('reader-next'));else reader.next();}
$('reader-next').addEventListener('click',next);$('reader-prev').addEventListener('click',()=>reader.previous());$('reader-skip').addEventListener('click',next);
$('reader-reset').hidden=false;$('reader-reset').addEventListener('click',()=>{experiment?.reset();interaction?.reset();reader.reset();required<HTMLDetailsElement>('.reader-menu').open=false;});
required('.reader-menu nav').addEventListener('click',event=>{const link=eventElement(event)?.closest<HTMLAnchorElement>('a');if(!link||!page.scenes.some(scene=>scene.id===link.hash.slice(1)))return;event.preventDefault();reader.setState({sceneId:link.hash.slice(1)});required<HTMLDetailsElement>('.reader-menu').open=false;});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||document.querySelector('dialog[open]'))return;
  if(eventElement(event)?.closest('input,textarea,select,summary,details,[contenteditable]'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();reader.previous();}
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  if([' ','Enter'].includes(event.key)&&!eventElement(event)?.closest('a,button')){event.preventDefault();next();}
});
function followHash(){const id=location.hash.slice(1);if(page.scenes.some(scene=>scene.id===id))reader.setState({sceneId:id});else panels.openHash(location.hash);}
window.addEventListener('hashchange',followHash);
$('reader-controls').hidden=false;$('reader-skip-scope').hidden=false;
const requestedScene=requestedHash.slice(1);if(page.scenes.some(scene=>scene.id===requestedScene))reader.setState({sceneId:requestedScene});else render(reader.inspect());
document.documentElement.classList.add('reader-enhanced');window.scrollTo(0,0);panels.openHash(requestedHash);
export const relatedAPI={
  getState:()=>({...reader.getState(),...(experiment?{experiment:experiment.getState(),visual:explorer.getState()}:{}),...(interaction?{interaction:interaction.getState()}:{})}),
  setState(state:RelatedState){
    if(!page.scenes.some(scene=>scene.id===state?.sceneId))throw new RangeError('Unknown related scene');
    if(!experiment){if(state.experiment||state.visual)throw new RangeError('This article has no premise experiment');if(state.interaction&&interaction?.validateState){interaction.validateState(state.interaction);reader.setState(state);interaction.setState(state.interaction);return;}if(state.interaction){if(!interaction)throw new RangeError('This article has no interaction');interaction.setState(state.interaction);}reader.setState(state);return;}
    const input=state.experiment?normalizeExperimentInput(state.experiment):experiment.getState(),info=evaluateExperimentInput(input,model?.derive);
    if(state.visual&&(!Number.isInteger(state.visual.step)||state.visual.step<0||state.visual.step>=Math.max(1,info.proof?.lines.length??0)))throw new RangeError('Unknown proof step');
    if(state.experiment)experiment.setState(state.experiment);reader.setState(state);
    if(state.visual&&info.proof?.lines.length)explorer.setState(state.visual);
  },
  reset(){experiment?.reset();interaction?.reset();reader.reset();},seek(timeMs:number){if(!interaction)throw new RangeError('No seekable interaction');interaction.seek(timeMs);},
  getInspectionSnapshot(){const node=scenes[current.index],evaluation=feedback[current.index].getState();return {...reader.inspect(),model:page.interactive??page.model??null,experiment:experiment?.inspect()??null,interaction:interaction?.inspect()??null,visual:model?explorer.getState():null,evaluation,displayedDialogue:{title:required('h2',node).textContent,text:evaluation.available?required('.scene-prose',node).textContent:evaluation.detail,status:required('.reader-copy',node).dataset.status}};}
};

window.__atlasRelated=relatedAPI;
