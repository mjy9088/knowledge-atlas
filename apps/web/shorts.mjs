import {deriveProof} from '/packages/models/propositional.mjs';
import {INFERENCE_PRESETS} from './inference-presets.mjs';
import {createVideoTimeline} from './inference-video.mjs';
import {mountInferenceVisual} from './inference-visual.mjs';
import {shortsFrame,advanceShortsTime} from './shorts-frame.mjs';
const $ = id => document.getElementById(id);
const requested = new URLSearchParams(location.search).get('preset');
const preset = INFERENCE_PRESETS[Object.hasOwn(INFERENCE_PRESETS,requested) ? requested : 'chain'];
const proof = deriveProof(preset), timeline = createVideoTimeline({...preset,proof});
let timeMs=0, playing=false, raf, last, cueKey='';
const content=$('shorts-content'), visual=mountInferenceVisual(content);
$('shorts-goal').textContent=`목표 ${timeline.goal}`;
$('shorts-seek').max=timeline.durationMs;
function fit(){const box=$('shorts-viewport').getBoundingClientRect();$('shorts-stage').style.transform=`scale(${Math.min(box.width/1080,box.height/1920)})`;}
new ResizeObserver(fit).observe($('shorts-viewport'));fit();
function render(){
  const frame=shortsFrame(timeline,timeMs),key=`${frame.phase}:${frame.activeLine}`;
  if(key!==cueKey){
    cueKey=key;content.dataset.phase=frame.phase;
    if(frame.phase==='step') visual.update({...preset,proof,step:frame.activeLine});
    else {
      const phase=document.createElement('p');phase.className='shorts-phase';phase.textContent=frame.phase==='intro'?'사용할 전제':'탐색 결과';
      const body=document.createElement('div');body.className=frame.phase==='intro'?'shorts-premises':'shorts-outro';
      if(frame.phase==='intro') for(const formula of timeline.premises){const row=document.createElement('p');row.textContent=formula;body.append(row);}
      else body.textContent=frame.caption;
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
