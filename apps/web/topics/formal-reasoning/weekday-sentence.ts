import {WEEKDAYS,interpretWeekdayWorlds,type WeekdayInterpretation,type WorldIndex,worldSymbol} from '/packages/models/weekday-worlds.js';
import {weekdayNotation} from '/packages/models/weekday-notation.js';
import {colorWorld,worldText,worldLabel} from './weekday-world-style.js';
export type WeekdayRepresentation='sentence'|'symbols';
export type WeekdayLogicMode='calendar'|'alethic';
// This riddle's explicit context assignments, not a general indexical parser.
export function mountWeekdaySentence(container:HTMLElement,{onRepresentationChange=()=>{}}:{onRepresentationChange?:(view:WeekdayRepresentation,logicMode:WeekdayLogicMode)=>void}={}){
  const doc=container.ownerDocument;
  container.className='weekday-sentence';container.setAttribute('role','group');container.setAttribute('aria-label','문장과 논리 기호의 대응');
  const source=doc.createElement('div');source.className='weekday-source';
  const formal=doc.createElement('div');formal.className='weekday-symbolic-summary';
  const sourceSection=doc.createElement('section');sourceSection.className='weekday-original-section';const sourceTitle=doc.createElement('h2');sourceTitle.textContent='원문';sourceSection.append(sourceTitle,source);
  const symbolSection=doc.createElement('section');symbolSection.className='weekday-symbol-section';const symbolTitle=doc.createElement('h2');symbolTitle.textContent='기호';
  const toggleLabel=doc.createElement('label');toggleLabel.className='weekday-modal-toggle';const toggle=doc.createElement('input');toggle.type='checkbox';toggle.setAttribute('aria-label','양상 논리 사용');toggleLabel.append(toggle,'양상 논리 사용 (□·◇)');
  let currentRepresentation:WeekdayRepresentation='symbols';toggle.addEventListener('change',()=>onRepresentationChange(currentRepresentation,toggle.checked?'alethic':'calendar'));symbolSection.append(symbolTitle,toggleLabel,formal);container.append(sourceSection,symbolSection);
  function word(text:string,world:WorldIndex,value:string){
    const node=doc.createElement('span');node.className='weekday-word';colorWorld(node,world);
    node.setAttribute('aria-label',`${text}: ${worldLabel(world)} 기준, ${value}`);
    const label=doc.createElement('strong');label.textContent=text;
    const index=doc.createElement('sub');index.textContent=worldLabel(world);
    const day=doc.createElement('small');day.textContent=value;node.append(label,index,day);return node;
  }
  function paragraph(text:string,cls:string){const node=doc.createElement('p');worldText(node,text);node.className=cls;return node;}
  return {render(input:WeekdayInterpretation,representation:WeekdayRepresentation,logicMode:WeekdayLogicMode){
    const result=interpretWeekdayWorlds(input),c=input.contexts,n=weekdayNotation(input);
    const value=(world:WorldIndex,index:number)=>{const days=result.worldDays.find(w=>w.id===world)?.days;return days?WEEKDAYS[days[index]]:'미정';};
    const line=doc.createElement('p');line.className='weekday-sentence-line';
    line.append('“',word('① 어제',c.yesterday,value(c.yesterday,0)),'가 ',word('② 내일',c.tomorrow,value(c.tomorrow,2)),'이었으면 좋겠다. 그럼 ',word('③ 오늘',c.consequent,value(c.consequent,1)),'이 ',WEEKDAYS[input.target],'일 텐데…”');
    const question=doc.createElement('p');question.className='weekday-sentence-question';question.append('문제에서 묻는 것은 ',word('④ 오늘',c.question,value(c.question,1)));
    const worldSet=`W = {${result.worldDays.map(w=>worldSymbol(w.id)).join(', ')}}`;
    const legend=doc.createElement('p');legend.className='weekday-sentence-legend';legend.textContent='현재 세계: '+result.worldDays.map(w=>worldLabel(w.id)).join(' · ');source.replaceChildren(line,question,legend);
    formal.replaceChildren(
      paragraph(`${worldSet} · tᵢ: wᵢ의 오늘 · 월=0, …, 일=6`,'weekday-symbol-definition'),
      paragraph(`A: ${n.antecedent}    B: ${n.consequent}`,'weekday-symbol-constraints'),
      paragraph(`Γ = {A, B}    질문: ${n.question}`,'weekday-symbol-query'),
      paragraph('≡₇: 같은 요일 · ⊨₇: 모든 해에서 성립 · Mod₇(Γ): 해 집합','weekday-symbol-definition'),
      paragraph('Γ는 달력 제약 · 원문의 반사실 전체를 A→B로 동일시하지 않습니다.','weekday-symbol-limit'),
    );
    if(logicMode==='alethic')formal.replaceChildren(
      paragraph(`M = (W, R, V) · ${worldSet} · P: 오늘이 목표 요일`,'weekday-symbol-definition'),
      paragraph('M,w ⊨ ◇P ⇔ ∃v (wRv ∧ M,v ⊨ P)','weekday-symbol-constraints'),
      paragraph('M,w ⊨ □P ⇔ ∀v (wRv ⇒ M,v ⊨ P)','weekday-symbol-query'),
      paragraph('R은 직접 접근 관계 · 가능·필연은 이 교육용 틀에 상대적','weekday-symbol-definition'),
      paragraph('◇P는 원문의 반사실도, 현실 요일의 답도 아닙니다.','weekday-symbol-limit'),
    );
    currentRepresentation=representation;toggle.checked=logicMode==='alethic';
    source.hidden=false;formal.hidden=false;
  }};
}
