import type {ContentPage,Scene} from '/packages/content/types.js';
import {sequences} from '../../topics/presentation/definitions.js';
import {createPresentationStore} from './presentation-state.js';
import type {MountedSequence} from './presentation-contract.js';

export function mountPresentation(page:ContentPage){
  const definitions=page.scenes.flatMap(scene=>{
    if(!scene.motion)return[];
    const definition=sequences.find(item=>item.id===scene.motion?.id);
    if(!definition)throw new RangeError(`Unknown presentation ${scene.motion.id}`);
    return[definition];
  });
  const store=createPresentationStore(Object.fromEntries(definitions.map(item=>[item.id,item.durationMs])));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resetPositions=()=>{store.reset();if(reduced)for(const item of definitions)store.seek(item.id,item.posterMs);};
  resetPositions();
  let current:Scene|undefined,mounted:MountedSequence|undefined,host:HTMLElement|undefined,playing=false,frame=0,start=0;
  const stop=()=>{playing=false;cancelAnimationFrame(frame);};
  function draw(){const id=current?.motion?.id;if(!id||!mounted)return;const position=store.getState().positions[id]??0;mounted.renderAt(position);if(host){const input=host.querySelector('input');if(input)input.value=String(position);const button=host.querySelector('[data-play]');if(button)button.textContent=playing?'일시정지':'다시 보기';}}
  function tick(now:number){
    const definition=definitions.find(item=>item.id===current?.motion?.id);if(!definition||!playing)return;
    const position=Math.min(definition.durationMs,now-start);store.seek(definition.id,position);draw();
    if(position<definition.durationMs)frame=requestAnimationFrame(tick);else{stop();draw();}
  }
  function activate(scene:Scene,node:HTMLElement){
    if(current?.id===scene.id)return;
    stop();mounted?.dispose();host?.remove();current=scene;mounted=undefined;host=undefined;
    const definition=definitions.find(item=>item.id===scene.motion?.id);if(!definition)return;
    const diagram=node.querySelector<HTMLElement>('.concept-diagram');if(!diagram)return;
    host=document.createElement('div');host.className='scene-motion';
    const visual=document.createElement('div');host.append(visual);mounted=definition.mount(visual);
    const controls=document.createElement('div');controls.className='scene-motion-controls';
    const play=document.createElement('button');play.type='button';play.dataset.play='';play.textContent='다시 보기';
    const reset=document.createElement('button');reset.type='button';reset.textContent='처음으로';
    const scrub=document.createElement('input');scrub.type='range';scrub.min='0';scrub.max=String(definition.durationMs);scrub.step='10';scrub.setAttribute('aria-label','시각 설명의 진행 위치');
    play.addEventListener('click',()=>{if(playing){stop();draw();return;}store.seek(definition.id,0);playing=true;start=performance.now();draw();frame=requestAnimationFrame(tick);});
    reset.addEventListener('click',()=>{stop();store.seek(definition.id,0);draw();});
    scrub.addEventListener('input',()=>{stop();store.seek(definition.id,Number(scrub.value));draw();});
    controls.append(play,reset,scrub);host.append(controls);diagram.prepend(host);
    const poster=diagram.querySelector<HTMLElement>('.scene-figure img');if(poster)poster.hidden=true;
    draw();
  }
  return {available:definitions.length>0,activate,getState:store.getState,validateState(value:unknown){const test=createPresentationStore(Object.fromEntries(definitions.map(item=>[item.id,item.durationMs])));test.setState(value);},setState(value:unknown){stop();store.setState(value);draw();},reset(){stop();resetPositions();draw();},seek(timeMs:number){const id=current?.motion?.id,definition=definitions.find(item=>item.id===id);if(!id||!definition)return;stop();store.seek(id,Math.max(0,Math.min(definition.durationMs,timeMs)));draw();}};
}
