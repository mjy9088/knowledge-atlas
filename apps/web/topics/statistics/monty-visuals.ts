import {DOORS,type Door} from '/content/statistics/monty-hall/scenarios.js';

export function doorDrawing(opened:boolean,prize:boolean):string {
  const inside=prize?'<path d="M60 40l8 17 19 3-14 13 3 19-16-9-17 9 4-19-14-13 19-3z" fill="#d5a23d" stroke="#8b6220" stroke-width="2"/>':'<circle cx="67" cy="69" r="19" fill="#f1eee7" stroke="#b2a995"/><path d="M58 60l18 18m0-18L58 78" stroke="#827861" stroke-width="4" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 120 142" aria-hidden="true" focusable="false"><path d="M16 132h88" stroke="#a9b9aa" stroke-width="3"/><rect x="21" y="8" width="78" height="123" rx="3" fill="#f9fbf4" stroke="#6b8776" stroke-width="3"/>${opened||prize?inside:''}${opened?'<path d="M23 11l27 15v91l-27 12z" fill="#d5dfcf" stroke="#6b8776" stroke-width="2"/><circle cx="42" cy="74" r="3" fill="#597763"/>':prize?'':'<rect x="25" y="12" width="70" height="115" rx="2" fill="#dce7d6" stroke="#75917d"/><rect x="33" y="23" width="54" height="35" rx="2" fill="#eaf0e4" stroke="#9db09a"/><rect x="33" y="68" width="54" height="47" rx="2" fill="#eaf0e4" stroke="#9db09a"/><circle cx="84" cy="66" r="4" fill="#9c7739"/>'}</svg>`;
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
  return `<svg class="monty-switch-arrow" viewBox="0 0 600 56" role="img" aria-label="${from}번에서 ${to}번으로 교환"><defs><marker id="monty-switch-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#39775e"/></marker></defs><path d="M${x} 6Q${(x+y)/2} 66 ${y} 6" fill="none" stroke="#39775e" stroke-width="3" marker-end="url(#monty-switch-tip)"/><text x="${(x+y)/2}" y="49" text-anchor="middle" fill="#365c42" font-size="20">교환</text></svg>`;
}
