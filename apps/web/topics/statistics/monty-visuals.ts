import {DOORS,type Door} from '/content/statistics/monty-hall/scenarios.js';

export function doorDrawing(opened:boolean,prize:boolean):string {
  const inside=prize?'<path d="M60 41l21 28-21 28-21-28z" fill="var(--ds-positive,#007d79)"/><path d="M49 69l8 8 15-17" fill="none" stroke="#fff" stroke-width="4"/>':'<path d="M48 56l25 25m0-25L48 81" fill="none" stroke="var(--ds-negative,#da1e28)" stroke-width="5"/>';
  return `<svg viewBox="0 0 120 142" aria-hidden="true" focusable="false"><path d="M12 132h96" stroke="var(--ds-border-strong,#8d8d8d)" stroke-width="2"/><rect x="22" y="10" width="76" height="120" fill="var(--ds-surface,#fff)" stroke="var(--ds-text,#161616)" stroke-width="2"/>${opened||prize?inside:''}${opened?'<path d="M23 12l22 14v91l-22 12z" fill="var(--ds-canvas,#f4f4f4)" stroke="var(--ds-text,#161616)" stroke-width="2"/>':prize?'':'<rect x="27" y="15" width="66" height="110" fill="var(--ds-canvas,#f4f4f4)"/><path d="M73 72h12" stroke="var(--ds-text,#161616)" stroke-width="3"/>'}</svg>`;
}

export function renderDoors(choice:number,opened:Door|undefined,prize:Door|undefined,selectable:boolean,selected:boolean):string {
  return `<div class="monty-doors">${DOORS.map(value=>{
    const chosen=value===choice&&(!selectable||selected);
    const label=value===opened?prize===opened?'상품 공개':'꽝 공개':value===prize?'상품':'닫힌 문';
    const content=`<strong>${value}번</strong><span class="monty-door-face">${doorDrawing(value===opened,value===prize)}<span>${label}</span></span><span class="monty-door-tag">${chosen?'내 선택':value===opened?'진행자가 엶':' '}</span>`;
    return selectable?`<button type="button" class="monty-door" data-door="${value}" aria-label="${value}번 문 선택" aria-pressed="${chosen}">${content}</button>`:`<div class="monty-door" data-door="${value}" data-chosen="${chosen}" data-open="${value===opened}" data-prize="${value===prize}">${content}</div>`;
  }).join('')}</div>`;
}

export function switchingArrow(from:Door,to:Door):string {
  const x=(from-1)*200+100,y=(to-1)*200+100;
  return `<svg class="monty-switch-arrow" viewBox="0 0 600 56" role="img" aria-label="${from}번에서 ${to}번으로 교환"><defs><marker id="monty-switch-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--ds-primary,#0f62fe)"/></marker></defs><path d="M${x} 6Q${(x+y)/2} 66 ${y} 6" fill="none" stroke="var(--ds-primary,#0f62fe)" stroke-width="3" marker-end="url(#monty-switch-tip)"/><text x="${(x+y)/2}" y="49" text-anchor="middle" fill="var(--ds-primary,#0f62fe)" font-size="20">교환</text></svg>`;
}
