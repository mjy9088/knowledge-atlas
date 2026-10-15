import {createExplosionEpisode} from './explosion-episode.mjs';
import {deriveProof} from '/packages/models/propositional.mjs';
import {INFERENCE_PRESETS} from './inference-presets.mjs';
import {createVideoTimeline} from './inference-video.mjs';
import {mountInferenceVisual} from './inference-visual.mjs';
import {shortsFrame,advanceShortsTime} from './shorts-frame.mjs';
const $ = id => document.getElementById(id);
const requested = new URLSearchParams(location.search).get('preset');
const preset = INFERENCE_PRESETS[Object.hasOwn(INFERENCE_PRESETS,requested) ? requested : 'chain'];
const proof = deriveProof(preset), timeline = !requested||requested==='episode'?createExplosionEpisode():createVideoTimeline({...preset,proof},{expanded:true});
document.querySelector('.shorts-title h1').textContent=timeline.title??'전제에서 결론까지';
let timeMs=0, playing=false, raf, last, cueKey='';
const content=$('shorts-content'), visual=mountInferenceVisual(content);
$('shorts-goal').textContent=`목표 ${timeline.goal}`;
$('shorts-seek').max=timeline.durationMs;
function fit(){const box=$('shorts-viewport').getBoundingClientRect();$('shorts-stage').style.transform=`translate(-50%, -50%) scale(${Math.min(box.width/1080,box.height/1440)})`;}
new ResizeObserver(fit).observe($('shorts-viewport'));fit();
function render(){
  const frame=shortsFrame(timeline,timeMs),key=frame.cueId,presentation=frame.presentation;
  $('shorts-goal').textContent=`목표 ${presentation.goal}`;
  if(key!==cueKey){
    cueKey=key;content.dataset.phase=frame.phase;
    if(frame.phase==='step') {
      visual.update({...presentation.snapshot,step:frame.activeLine});
      const explanation=document.createElement('p');explanation.className='shorts-explanation';explanation.textContent=frame.caption;content.append(explanation);
    }
    else {
      const phase=document.createElement('p');phase.className='shorts-phase';phase.textContent=frame.title;
      const body=document.createElement('div');body.className='shorts-outro';body.textContent=frame.caption;
      if(frame.phase==='intro') {const formulas=document.createElement('p');formulas.className='shorts-formula-summary';formulas.textContent=presentation.premises.join(' · ');body.append(formulas);}
      content.replaceChildren(phase,body);
    }
  }
  $('shorts-seek').value=timeMs;$('shorts-time').textContent=`${(timeMs/1000).toFixed(1)} / ${(timeline.durationMs/1000).toFixed(1)}초`;
}
function pause(){playing=false;cancelAnimationFrame(raf);$('shorts-play').textContent='재생';}
function tick(now){if(!playing)return;timeMs=advanceShortsTime(timeMs,now-last,timeline.durationMs);last=now;render();if(timeMs===timeline.durationMs)pause();else raf=requestAnimationFrame(tick);}
function play(){if(playing)return;if(timeMs>=timeline.durationMs)timeMs=0;playing=true;last=performance.now();$('shorts-play').textContent='일시정지';raf=requestAnimationFrame(tick);}
function seek(next){shortsFrame(timeline,next);pause();timeMs=Math.min(next,timeline.durationMs);render();}
$('shorts-play').addEventListener('click',()=>playing?pause():play());
$('shorts-reset').addEventListener('click',()=>{seek(0);play();});
$('shorts-seek').addEventListener('input',()=>seek(Number($('shorts-seek').value)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.__atlasShorts={getState:()=>({timeMs}),setState(state){if(!state||typeof state.timeMs!=='number')throw new TypeError('timeMs required');seek(state.timeMs);},seek,reset:()=>seek(0),play,pause};
render();play();
