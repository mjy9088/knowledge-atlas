import type {WorldIndex} from '/packages/models/weekday-worlds.js';
export const worldLabel=(id:WorldIndex)=>id===0?'현실':`가정 ${id}`;

// Identity colors are independent of valuation, accessibility and array position.
export const WORLD_COLORS = [
  {tint:'#edf5ff',ink:'#0043ce',stroke:'#0f62fe',name:'파랑'},
  {tint:'#d9fbfb',ink:'#005d5d',stroke:'#007d79',name:'청록'},
  {tint:'#f6f2ff',ink:'#6929c4',stroke:'#8a3ffc',name:'보라'},
  {tint:'#e5f6ff',ink:'#00539a',stroke:'#1192e8',name:'하늘색'},
] as const;

export function colorWorld(node:HTMLElement,id:WorldIndex){
  const color=WORLD_COLORS[id];node.dataset.world=String(id);
  node.style.setProperty('--world-tint',color.tint);node.style.setProperty('--world-ink',color.ink);node.style.setProperty('--world-stroke',color.stroke);
}

// Keep complete text/accessible names while marking each explicit world reference.
export function worldText(node:HTMLElement,text:string){
  node.replaceChildren();let start=0;
  for(const match of text.matchAll(/[wt][₀₁₂₃]/g)){
    node.append(text.slice(start,match.index));const badge=node.ownerDocument.createElement('span');badge.className='weekday-world-reference';badge.textContent=match[0];colorWorld(badge,'₀₁₂₃'.indexOf(match[0][1]) as WorldIndex);node.append(badge);start=match.index+match[0].length;
  }
  node.append(text.slice(start));
}
