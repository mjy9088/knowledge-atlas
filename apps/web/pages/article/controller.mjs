import {CONTENT_PAGES} from '/content/catalog.mjs';
import {createRelatedReader} from '../../components/reader/state.mjs';
import {mountPremiseExperiment,normalizeExperimentInput,evaluateExperimentInput} from '../../components/experiment/premise-editor.mjs';
import {RELATED_MODELS,relatedNarration} from '../../topics/formal-reasoning/experiments.mjs';
import {mountInferenceExplorer} from '../../components/inference/explorer.mjs';
import {mountReaderPanels} from '../../components/reader/panels.mjs';
import {mountEvaluationFeedback} from '../../components/reader/evaluation-feedback.mjs';
import {mountTopicInteraction} from '../../topics/registry.mjs';
const $=id=>document.getElementById(id),root=document.querySelector('[data-page]');
const page=CONTENT_PAGES.find(page=>page.slug===root.dataset.page),model=RELATED_MODELS[page.model];
if(page.model&&!model)throw new RangeError('Unknown experiment adapter');
root.dataset.mode=page.interactive?'spatial':model?'experiment':'reading';
const requestedHash=location.hash,scenes=[...document.querySelectorAll('.reader-scene')];
const original=scenes.map(node=>({title:node.querySelector('h2').textContent,text:node.querySelector('.scene-prose').textContent,claims:node.dataset.claimRefs}));
const feedback=scenes.map(node=>mountEvaluationFeedback({content:node.querySelector('.scene-prose'),message:node.querySelector('.scene-result')}));
const panels=mountReaderPanels([{element:$('connections'),title:'연관 지식'},{element:$('evidence'),title:'근거와 범위'}]);
let current,experiment,interaction;const explorer=mountInferenceExplorer($('reader-proof'));
function renderInput(){
  if(!current||model&&!experiment)return;
  const node=scenes[current.index],info=experiment?.inspect(),customized=info?.customized??false;
  scenes.forEach((scene,index)=>{scene.hidden=index!==current.index;});
  node.querySelector('.concept-diagram').hidden=Boolean(model||interaction);$('reader-proof').hidden=!model;
  if(model){
  $('reader-proof').dataset.claimRefs=model.claimRefs.join(' ');
  if(info.valid)explorer.update(info);else explorer.invalidate('입력을 완성하면 추론 도표를 갱신합니다.');
  }
  interaction?.suggest(current.scene.suggestion);
  const topicInfo=interaction?.inspect(),topicNarration=topicInfo?.customized?interaction.describe(current.scene):null;
  const narration=info?relatedNarration(page.model,info):null,copy=node.querySelector('.reader-copy');
  node.querySelector('h2').textContent=original[current.index].title;
  if(topicNarration){
    node.querySelector('.scene-prose').textContent=topicNarration.text;feedback[current.index].reset();copy.dataset.status=topicNarration.status;
    node.dataset.claimRefs=page.claimRefs.join(' ');
  }else if(customized||info&&!info.valid){
    const available=narration.status==='adapted';
    node.querySelector('.scene-prose').textContent=available?narration.text:'';
    feedback[current.index].setState({available,summary:available?'':narration.title,detail:available?'':narration.text});
    copy.dataset.status=narration.status;node.dataset.claimRefs=model.claimRefs.join(' ');
  }else{
    node.querySelector('.scene-prose').textContent=original[current.index].text;feedback[current.index].reset();
    node.dataset.claimRefs=original[current.index].claims;copy.dataset.status='example';
  }
  const next=page.scenes[current.index+1];
  node.querySelector('.skip-context').textContent='건너뛸 내용: '+(topicInfo?.customized?'현재 상태와 '+current.scene.known:customized?'현재 입력과 적용 규칙':current.scene.known)+' · 다음: '+(next?.title??'연관 지식');
  $('reader-prev').disabled=current.index===0;$('reader-next').textContent=next?'다음 →':'연관 지식 →';$('reader-skip').hidden=!next;
  $('reader-skip-scope').textContent=interaction?'본문 ← → 장면 이동 · 시각화에 초점을 두면 방향키 회전':'← → 방향키 · Space / Enter 다음';$('reader-end-links').hidden=Boolean(next);
}
function render(view){current=view;renderInput();history.replaceState(null,'','#'+view.sceneId);}
const reader=createRelatedReader(page,{onChange:render});
if(model){
$('reader-experiment').hidden=false;$('reader-model-label').textContent=model.label;
experiment=mountPremiseExperiment($('reader-experiment'),{suggestion:model.presets[0],derive:model.derive,syntaxText:model.syntax,onChange:renderInput});
experiment.suggest(model.presets[0]);
for(const preset of model.presets){const button=document.createElement('button');button.type='button';button.textContent=preset.label;button.addEventListener('click',()=>experiment.setState(preset));$('reader-presets').append(button);}
}else if(page.interactive){
  document.querySelector('.model-toolbar').hidden=true;
  const container=document.createElement('div');$('reader-workbench').append(container);
  interaction=mountTopicInteraction(page.interactive,container,{onChange:renderInput});
}else $('reader-workbench').hidden=true;
function next(){if(current.index===page.scenes.length-1)panels.openHash('#connections',$('reader-next'));else reader.next();}
$('reader-next').addEventListener('click',next);$('reader-prev').addEventListener('click',()=>reader.previous());$('reader-skip').addEventListener('click',next);
$('reader-reset').hidden=false;$('reader-reset').addEventListener('click',()=>{experiment?.reset();interaction?.reset();reader.reset();document.querySelector('.reader-menu').open=false;});
document.querySelector('.reader-menu nav').addEventListener('click',event=>{const link=event.target.closest('a');if(!link||!page.scenes.some(scene=>scene.id===link.hash.slice(1)))return;event.preventDefault();reader.setState({sceneId:link.hash.slice(1)});document.querySelector('.reader-menu').open=false;});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||document.querySelector('dialog[open]'))return;
  if(event.target.closest('input,textarea,select,summary,details,[contenteditable]'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();reader.previous();}
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  if([' ','Enter'].includes(event.key)&&!event.target.closest('a,button')){event.preventDefault();next();}
});
function followHash(){const id=location.hash.slice(1);if(page.scenes.some(scene=>scene.id===id))reader.setState({sceneId:id});else panels.openHash(location.hash);}
window.addEventListener('hashchange',followHash);
$('reader-controls').hidden=false;$('reader-skip-scope').hidden=false;
const requestedScene=requestedHash.slice(1);if(page.scenes.some(scene=>scene.id===requestedScene))reader.setState({sceneId:requestedScene});else render(reader.inspect());
document.documentElement.classList.add('reader-enhanced');window.scrollTo(0,0);panels.openHash(requestedHash);
window.__atlasRelated={
  getState:()=>({...reader.getState(),...(experiment?{experiment:experiment.getState(),visual:explorer.getState()}:{}),...(interaction?{interaction:interaction.getState()}:{})}),
  setState(state){
    if(!page.scenes.some(scene=>scene.id===state?.sceneId))throw new RangeError('Unknown related scene');
    if(!experiment){if(state.experiment||state.visual)throw new RangeError('This article has no premise experiment');if(state.interaction){if(!interaction)throw new RangeError('This article has no interaction');interaction.setState(state.interaction);}reader.setState(state);return;}
    const input=state.experiment?normalizeExperimentInput(state.experiment):experiment.getState(),info=evaluateExperimentInput(input,model.derive);
    if(state.visual&&(!Number.isInteger(state.visual.step)||state.visual.step<0||state.visual.step>=Math.max(1,info.proof?.lines.length??0)))throw new RangeError('Unknown proof step');
    if(state.experiment)experiment.setState(state.experiment);reader.setState(state);
    if(state.visual&&info.proof?.lines.length)explorer.setState(state.visual);
  },
  reset(){experiment?.reset();interaction?.reset();reader.reset();},seek(timeMs){if(!interaction)throw new RangeError('No spatial view');interaction.seek(timeMs);},
  getInspectionSnapshot(){const node=scenes[current.index],evaluation=feedback[current.index].getState();return {...reader.inspect(),model:page.interactive??page.model??null,experiment:experiment?.inspect()??null,interaction:interaction?.inspect()??null,visual:model?explorer.getState():null,evaluation,displayedDialogue:{title:node.querySelector('h2').textContent,text:evaluation.available?node.querySelector('.scene-prose').textContent:evaluation.detail,status:node.querySelector('.reader-copy').dataset.status}};}
};
