import type {WorldIndex} from '/packages/models/weekday-worlds.js';
export const worldLabel=(id:WorldIndex)=>id===0?'현실':`가정 ${id}`;

// Identity colors are independent of valuation, accessibility and array position.
export const WORLD_COLORS = [
  {tint:'#e7f2df',ink:'#35542b',stroke:'#73985c',name:'연한 초록'},
  {tint:'#e3effb',ink:'#214f7c',stroke:'#628eb9',name:'파랑'},
  {tint:'#fff2c9',ink:'#705417',stroke:'#b7973e',name:'노랑'},
  {tint:'#fbe4e3',ink:'#873c3c',stroke:'#bd7774',name:'빨강'},
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
