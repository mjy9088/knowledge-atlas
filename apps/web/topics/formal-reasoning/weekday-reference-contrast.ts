import {PRESET_CONTEXTS,WEEKDAYS,weekdayDeductions} from '/packages/models/weekday-worlds.js';
import {deducedWeekdayModal} from '/packages/models/weekday-modal.js';
import {weekdayClassicalProof} from '/packages/models/weekday-classical.js';
import {worldText} from './weekday-world-style.js';

// Optional, derived two-world reference sheet. It does not edit the reader's frame.
export function mountWeekdayReferenceContrast(container:HTMLElement){
  const doc=container.ownerDocument,dialog=doc.createElement('dialog');dialog.className='weekday-reference-contrast';dialog.setAttribute('aria-label','기준 변경과 양상 논리 비교');
  dialog.dataset.claimRefs='claim:logic.weekday-worlds.assignments claim:logic.weekday-worlds.congruence-rules claim:logic.weekday-worlds.deduced-modality';
  const make=(tag:string,text:string)=>{const node=doc.createElement(tag);node.textContent=text;return node;};
  const header=make('header',''),close=doc.createElement('button');close.type='button';close.textContent='닫기';close.setAttribute('aria-label','비교 자료 닫기');close.addEventListener('click',()=>dialog.close());header.append(make('h2','기준을 바꾸는 것과 양상을 바꾸는 것'),close);
  const body=make('div','');body.className='weekday-reference-contrast-body';dialog.append(header,body);container.append(dialog);
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  function table(headings:string[],rows:string[][],label:string){const table=make('table','');table.setAttribute('aria-label',label);const head=make('thead',''),tr=make('tr','');for(const text of headings)tr.append(make('th',text));head.append(tr);table.append(head);const tbody=make('tbody','');for(const cells of rows){const row=make('tr','');for(const text of cells){const cell=make('td','');worldText(cell,text);row.append(cell);}tbody.append(row);}table.append(tbody);return table;}
  return {close(){if(dialog.open)dialog.close();},open(target:number){
    const first={actual:0,target,contexts:PRESET_CONTEXTS['actual-yesterday']},second={...first,contexts:PRESET_CONTEXTS['imagined-yesterday']};
    body.replaceChildren(make('p',`두 세계의 비교 예시 · t: 현실의 오늘 · h: 가정 1의 오늘 · B: h ≡₇ ${target} (${WEEKDAYS[target]})`),make('h3','① “어제가 내일이다”의 기준을 바꾸면'));
    body.append(table(['읽는 기준','양상 논리 없이 나타낸 A','가정 아래 현실의 오늘'],[
      ['현실의 어제 = 가정 1의 내일',weekdayClassicalProof(first).equation!,WEEKDAYS[weekdayDeductions(first).questionCandidates[0]]],
      ['가정 1의 어제 = 현실의 내일',weekdayClassicalProof(second).equation!,WEEKDAYS[weekdayDeductions(second).questionCandidates[0]]],
    ],'기준에 따른 날짜 식과 답'));
    body.append(make('p','같은 말도 기준을 정해야 식이 정해집니다. 이 두 날짜 식은 양상 논리를 사용해도 그대로 필요합니다.'),make('h3','② A의 기준을 고정하고, 살펴볼 세계만 바꾸면'),make('p',`위 첫째 줄의 A를 유지합니다. P: 그 세계의 오늘은 ${WEEKDAYS[target]}. 현실에서 평가합니다.`));
    const both=deducedWeekdayModal(first,{evaluationWorld:0,access:[[0,0],[0,1],[1,1]]}),assumed=deducedWeekdayModal(first,{evaluationWorld:0,access:[[0,1],[1,1]]});
    const truth=(value:boolean|null)=>value===null?'미정':value?'참':'거짓';
    body.append(table(['접근 대상','양상 논리 없이 풀어 쓰기','양상 논리로'],[
      ['현실과 가정 1','하나 이상: P(w₀) ∨ P(w₁)\n모두: P(w₀) ∧ P(w₁)',`◇P: ${truth(both.diamond)}\n□P: ${truth(both.box)}`],
      ['가정 1만','하나 이상·모두: P(w₁)',`◇P: ${truth(assumed.diamond)}\n□P: ${truth(assumed.box)}`],
    ],'접근 범위에 따른 비양상 전개와 양상 판정'),make('p','P(w₀)·P(w₁)는 각각 현실·가정 1에서 P를 평가한다는 표기입니다. 날짜와 A의 기준은 그대로이고, 접근 대상에 따라 가능·필연 판정이 달라집니다.'),make('p','양상 논리는 세계 사이의 “하나 이상 / 모두”를 표현합니다. “어제”의 기준을 대신 정하거나 원문 전체를 자동 번역하지는 않습니다.'));
    if(!dialog.open)dialog.showModal();close.focus();
  }};
}
