import {RELATED_PAGES} from '/content/formal-logic/explosion/related-pages.mjs';
import {createRelatedReader} from './related-reader.mjs';
import {mountPremiseExperiment,normalizeExperimentInput} from './premise-experiment.mjs';
import {describeExperiment} from './experiment-dialogue.mjs';
import {mountInferenceVisual} from './inference-visual.mjs';
const $=id=>document.getElementById(id),root=document.querySelector('[data-page]');
const page=RELATED_PAGES.find(page=>page.slug===root.dataset.page);
const requestedScene=location.hash.slice(1);
const scenes=[...document.querySelectorAll('.reader-scene')];
const original=scenes.map(node=>({title:node.querySelector('h2').textContent,text:node.querySelector('.scene-prose').textContent,claims:node.dataset.claimRefs}));
let current,experiment;const proofView=mountInferenceVisual($('reader-proof'));
function renderInput(){
  if(!current)return;
  const node=scenes[current.index],info=experiment?.inspect(),customized=Boolean(info?.customized);
  scenes.forEach((scene,index)=>{scene.hidden=index!==current.index;});
  node.querySelector('.concept-diagram').hidden=customized;
  $('reader-proof').hidden=!customized;
  const copy=node.querySelector('.reader-copy');
  if(customized){
    const section=current.scene.id==='explosion'?'explosion':current.scene.id==='boundary'?'consistency':'question';
    const narration=describeExperiment(section,info);
    node.querySelector('h2').textContent=narration.title;node.querySelector('.scene-prose').textContent=narration.text;
    copy.dataset.status=narration.status;node.dataset.claimRefs=narration.claimRefs.join(' ');
    if(info.valid&&info.proof.goalReached)proofView.update({...info,step:narration.stepIndex});
    else $('reader-proof').replaceChildren(Object.assign(document.createElement('p'),{textContent:info.valid?'목표 경로 미발견':'명제식 입력 대기'}));
  }else{
    node.querySelector('h2').textContent=original[current.index].title;node.querySelector('.scene-prose').textContent=original[current.index].text;
    node.dataset.claimRefs=original[current.index].claims;copy.dataset.status='example';
  }
  const next=page.scenes[current.index+1];
  node.querySelector('.skip-context').textContent='건너뛸 내용: '+(customized?'현재 전제·목표의 근거와 도출 결과':current.scene.known)+' · 다음: '+(next?.title??'연관 지식');
  $('reader-prev').disabled=current.index===0;$('reader-next').textContent=next?'다음 →':'연관 지식 →';
  $('reader-skip').hidden=!next;
  $('reader-skip-scope').textContent='← → 방향키 · Space / Enter 다음 · '+(customized?'현재 입력의 설명':current.scene.known);
}
function render(view){current=view;renderInput();history.replaceState(null,'','#'+view.sceneId);}
const reader=createRelatedReader(page,{onChange:render});
if(page.experiment){
  $('reader-experiment').hidden=false;
  experiment=mountPremiseExperiment($('reader-experiment'),{suggestion:{premises:['P','¬P'],goal:'Q'},onChange:renderInput});
  experiment.suggest({premises:['P','¬P'],goal:'Q'});
}
function next(){if(current.index===page.scenes.length-1)$('connections').scrollIntoView({block:'start'});else reader.next();}
$('reader-next').addEventListener('click',next);$('reader-prev').addEventListener('click',()=>reader.previous());$('reader-skip').addEventListener('click',next);
$('reader-reset').hidden=false;$('reader-reset').addEventListener('click',()=>{experiment?.reset();reader.reset();document.querySelector('.reader-menu').open=false;});
document.querySelector('.reader-menu nav').addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;event.preventDefault();reader.setState({sceneId:link.hash.slice(1)});document.querySelector('.reader-menu').open=false;});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(event.target.closest('input,textarea,select,summary,details,[contenteditable]'))return;
  const bounds=$('reader-controls').getBoundingClientRect();if(bounds.bottom<0||bounds.top>innerHeight)return;
  if(event.key==='ArrowLeft'){event.preventDefault();reader.previous();}
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  if([' ','Enter'].includes(event.key)&&!event.target.closest('a,button')){event.preventDefault();next();}
});
function followHash(){const id=location.hash.slice(1);if(page.scenes.some(s=>s.id===id))reader.setState({sceneId:id});}
window.addEventListener('hashchange',followHash);
$('reader-controls').hidden=false;$('reader-skip-scope').hidden=false;
if(page.scenes.some(scene=>scene.id===requestedScene))reader.setState({sceneId:requestedScene});else render(reader.inspect());
window.__atlasRelated={getState:()=>({...reader.getState(),...(experiment?{experiment:experiment.getState()}:{})}),setState(state){if(!page.scenes.some(s=>s.id===state?.sceneId))throw new RangeError('Unknown related scene');if(state.experiment){normalizeExperimentInput(state.experiment);if(!experiment)throw new TypeError('This page has no model adapter');experiment.setState(state.experiment);}reader.setState(state);},reset(){experiment?.reset();reader.reset();},getInspectionSnapshot(){const node=scenes[current.index];return {...reader.inspect(),experiment:experiment?.inspect(),displayedDialogue:{title:node.querySelector('h2').textContent,text:node.querySelector('.scene-prose').textContent,status:node.querySelector('.reader-copy').dataset.status}};}};
