import {WEEKDAYS,weekdayDeductions,type WeekdayContexts,type WeekdayInterpretation,type WorldIndex,worldSymbol} from '/packages/models/weekday-worlds.js';
import {colorWorld,worldText,worldLabel} from './weekday-world-style.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {calendarClause,calendarQuery,conditionalReading,annotateWeekdayEquivalence} from './weekday-alignment.js';
export type WeekdayRepresentation='sentence'|'symbols';
export type WeekdayLogicMode='calendar'|'alethic';
// This riddle's explicit context assignments, not a general indexical parser.
export function mountWeekdaySentence(container:HTMLElement,{onRepresentationChange=()=>{}}:{onRepresentationChange?:(view:WeekdayRepresentation,logicMode:WeekdayLogicMode)=>void}={}){
  const doc=container.ownerDocument;
  container.className='weekday-sentence';container.setAttribute('role','group');container.setAttribute('aria-label','문장과 논리 기호의 대응');
  const source=doc.createElement('div');source.className='weekday-source';
  const formal=doc.createElement('div');formal.className='weekday-symbolic-summary';
  const sourceSection=doc.createElement('section');sourceSection.className='weekday-original-section';const sourceTitle=doc.createElement('h2');sourceTitle.textContent='원문';sourceSection.append(sourceTitle,source);
  const alignmentStatus=doc.createElement('p');alignmentStatus.className='alignment-status';alignmentStatus.setAttribute('aria-live','polite');sourceSection.append(alignmentStatus);
  const symbolSection=doc.createElement('section');symbolSection.className='weekday-symbol-section';const symbolTitle=doc.createElement('h2');symbolTitle.textContent='기호';
  const toggleLabel=doc.createElement('label');toggleLabel.className='weekday-modal-toggle';const toggle=doc.createElement('input');toggle.type='checkbox';toggle.setAttribute('aria-label','양상 논리로 번역');toggle.setAttribute('aria-description','원문을 바람과 반사실 조건문의 구조로 번역합니다. 바람은 별도 표기하며, 반사실의 진리값을 자동 판정하지 않습니다.');toggleLabel.title=toggle.getAttribute('aria-description')!;toggleLabel.append(toggle,'양상 논리로 번역');
  const symbolHeader=doc.createElement('div');symbolHeader.className='weekday-symbol-header';symbolHeader.append(symbolTitle,toggleLabel);
  let currentRepresentation:WeekdayRepresentation='symbols';toggle.addEventListener('change',()=>onRepresentationChange(currentRepresentation,toggle.checked?'alethic':'calendar'));symbolSection.append(symbolHeader,formal);container.append(sourceSection,symbolSection);
  let references:Partial<Record<keyof WeekdayContexts,HTMLSelectElement>>={};
  function word(text:string,world:WorldIndex,value:string,id:string,offset=false){
    const node=markAlignment(doc.createElement('span'),id,'source');node.classList.add('weekday-word');colorWorld(node,world);
    node.setAttribute('aria-label',`${text}: ${worldLabel(world)} 기준, ${value}`);
    const label=doc.createElement('strong');label.textContent=text;if(offset)markAlignment(label,`${id}-offset`,'source');
    const index=markAlignment(doc.createElement('sub'),id.replace('-today','')+'-base','source');index.append(worldLabel(world),' ▾');const key=({'yesterday':'yesterday','tomorrow':'tomorrow','consequent-today':'consequent','query-today':'question'} as const)[id as 'yesterday'|'tomorrow'|'consequent-today'|'query-today'];const control=references[key];if(control){control.title=`${text}의 기준 선택: ${worldLabel(world)}`;index.append(control);node.classList.add('weekday-reference-trigger');}
    node.append(label,index);return node;
  }
  function paragraph(text:string,cls:string){const node=doc.createElement('p');worldText(node,text);annotateWeekdayEquivalence(node);node.className=cls;return node;}
  return {alignmentStatus,render(input:WeekdayInterpretation,representation:WeekdayRepresentation,logicMode:WeekdayLogicMode,controls:Partial<Record<keyof WeekdayContexts,HTMLSelectElement>>={},targetControl?:HTMLSelectElement){
    references=controls;const result=weekdayDeductions(input),c=input.contexts;
    const value=(world:WorldIndex,index:number)=>{const days=result.worlds.find(w=>w.id===world)!.days[index];return days.length===1?WEEKDAYS[days[0]]:days.length?'미정':'해 없음';};
    const line=doc.createElement('p');line.className='weekday-sentence-line';
    const sentenceRoot=markAlignment(doc.createElement('span'),'constraints','source'),a=markAlignment(doc.createElement('span'),'antecedent','source');a.append(word('① 어제',c.yesterday,value(c.yesterday,0),'yesterday',true),'가 ',word('② 내일',c.tomorrow,value(c.tomorrow,2),'tomorrow',true));
    const b=markAlignment(doc.createElement('span'),'consequent','source'),target=markAlignment(doc.createElement('span'),'target','source');target.textContent=WEEKDAYS[input.target]+' ▾';if(targetControl){target.classList.add('weekday-target-trigger');target.append(targetControl);}b.append(word('③ 오늘',c.consequent,value(c.consequent,1),'consequent-today'),'이 ',target);
    const wishPart=markAlignment(doc.createElement('span'),logicMode==='alethic'?'wish-marker':'conditional-connective','source'),ifPart=markAlignment(doc.createElement('span'),'conditional-connective','source'),thenPart=markAlignment(doc.createElement('span'),'conditional-connective','source');wishPart.textContent='이었으면 좋겠다.';ifPart.textContent=' 그럼 ';thenPart.textContent='일 텐데';sentenceRoot.append(a,wishPart,ifPart,b,thenPart);line.append('“',sentenceRoot,'…”');
    const question=markAlignment(doc.createElement('p'),'query','source');question.className='weekday-sentence-question alignment-node';question.append('그렇다면 ',word('④ 오늘',c.question,value(c.question,1),'query-today'),'은 무슨 요일일까?');
    const worldSet=`W = {${result.worlds.map(w=>worldSymbol(w.id)).join(', ')}}`;
    source.replaceChildren(line,question);
    const clauses=doc.createElement('div');clauses.className='weekday-symbol-constraints';const clauseRoot=markAlignment(doc.createElement('div'),'constraints','symbol');
    for(const id of ['A','B'] as const){const clause=paragraph(id+': ','weekday-symbol-clause');clause.append(calendarClause(doc,input,id));clauseRoot.append(clause);}clauses.append(clauseRoot);
    const queryLine=doc.createElement('span');queryLine.className='weekday-symbol-query';queryLine.append(' · 질문: ',calendarQuery(doc,input));
    const conditional=paragraph(logicMode==='alethic'?'원문 양상 번역: ':'조건문 단순화: ','weekday-symbol-conditional');conditional.dataset.claimRefs=logicMode==='alethic'?'claim:logic.weekday-worlds.modal-translation':'claim:logic.weekday-worlds.conditional-reading';conditional.append(conditionalReading(doc,logicMode==='alethic'),queryLine);
    const glossary=paragraph('','weekday-symbol-definition'),sameDay=markAlignment(doc.createElement('span'),'weekday-equivalence','symbol');sameDay.classList.add('weekday-equivalence-definition');sameDay.textContent='≡₇: 같은 요일';glossary.append(sameDay);if(logicMode==='calendar')glossary.append(' · ⊨₇: 모든 해에서 성립 · Mod₇(Γ): 해 집합');
    formal.replaceChildren(
      paragraph(`${worldSet} · tᵢ: wᵢ의 오늘 · 월=0, …, 일=6`,'weekday-symbol-definition'),
      conditional,clauses,glossary,
      ...(logicMode==='calendar'?[paragraph('단순화 A→B ≠ 동시 제약 Γ · 바람·반사실 전체의 번역 아님','weekday-symbol-limit')]:[]),
    );
    if(logicMode==='alethic'){
      formal.append(
        paragraph('Wishₛ(A): 화자가 A를 바람 · A □→ B: A였더라면 B였을 것','weekday-symbol-definition'),
        paragraph('□→: 가장 가까운 A-세계에서 B · 유사성 기준은 미지정','weekday-symbol-definition'),
        paragraph('바람은 진리 양상 외 별도 표기 · □→는 단순 □(A→B)가 아님','weekday-symbol-limit'),
      );
    }
    currentRepresentation=representation;toggle.checked=logicMode==='alethic';
    source.hidden=false;formal.hidden=false;
  }};
}
