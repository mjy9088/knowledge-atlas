import {WEEKDAYS,weekdayDeductions,type WeekdayContexts,type WeekdayInterpretation,type WorldIndex,worldSymbol} from '/packages/models/weekday-worlds.js';
import {colorWorld,worldText,worldLabel} from './weekday-world-style.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {calendarClause,calendarQuery,conditionalReading,annotateWeekdayEquivalence} from './weekday-alignment.js';
export type WeekdayRepresentation='sentence'|'symbols';
export type WeekdayLogicMode='calendar'|'alethic';
// This riddle's explicit context assignments, not a general indexical parser.
export function mountWeekdaySentence(container:HTMLElement){
  const doc=container.ownerDocument;
  container.className='weekday-sentence';container.setAttribute('role','group');container.setAttribute('aria-label','문장과 논리 기호의 대응');
  const source=doc.createElement('div');source.className='weekday-source';
  const formal=doc.createElement('div');formal.className='weekday-symbolic-summary';
  const sourceSection=doc.createElement('section');sourceSection.className='weekday-original-section';const sourceTitle=doc.createElement('h2');sourceTitle.textContent='풀이용 문장';sourceSection.append(sourceTitle,source);
  const alignmentStatus=doc.createElement('div');alignmentStatus.className='alignment-status';alignmentStatus.setAttribute('aria-live','polite');sourceSection.append(alignmentStatus);
  const symbolSection=doc.createElement('section');symbolSection.className='weekday-symbol-section';const symbolTitle=doc.createElement('h2');symbolTitle.textContent='기호';
  const symbolHeader=doc.createElement('div');symbolHeader.className='weekday-symbol-header';symbolHeader.append(symbolTitle);symbolSection.append(symbolHeader,formal);container.append(sourceSection,symbolSection);
  let references:Partial<Record<keyof WeekdayContexts,HTMLSelectElement>>={};
  function word(text:string,world:WorldIndex,value:string,id:string,offset=false){
    const node=markAlignment(doc.createElement('span'),id,'source');node.classList.add('weekday-word');colorWorld(node,world);
    node.setAttribute('aria-label',`${text}: ${worldLabel(world)} 기준, ${value}`);
    const label=doc.createElement('strong');label.textContent=text;if(offset)markAlignment(label,`${id}-offset`,'source');
    const index=markAlignment(doc.createElement('sub'),id.replace('-today','')+'-base','source');index.append(worldLabel(world),' ▾');const key=({'yesterday':'yesterday','tomorrow':'tomorrow','consequent-today':'consequent','query-today':'question'} as const)[id as 'yesterday'|'tomorrow'|'consequent-today'|'query-today'];const control=references[key];if(control){index.append(control);node.classList.add('weekday-reference-trigger');}
    node.append(label,index);return node;
  }
  function paragraph(text:string,cls:string){const node=doc.createElement('p');worldText(node,text);annotateWeekdayEquivalence(node);node.className=cls;return node;}
  return {alignmentStatus,render(input:WeekdayInterpretation,representation:WeekdayRepresentation,logicMode:WeekdayLogicMode,controls:Partial<Record<keyof WeekdayContexts,HTMLSelectElement>>={},targetControl?:HTMLSelectElement,compare=false){
    references=controls;const result=weekdayDeductions(input),c=input.contexts;
    const value=(world:WorldIndex,index:number)=>{const days=result.worlds.find(w=>w.id===world)!.days[index];return days.length===1?WEEKDAYS[days[0]]:days.length?'미정':'해 없음';};
    const line=doc.createElement('p');line.className='weekday-sentence-line';
    const sentenceRoot=markAlignment(doc.createElement('span'),'constraints','source'),a=markAlignment(doc.createElement('span'),'antecedent','source');a.append(word('① 어제',c.yesterday,value(c.yesterday,0),'yesterday',true),'가 ',word('② 내일',c.tomorrow,value(c.tomorrow,2),'tomorrow',true));
    const b=markAlignment(doc.createElement('span'),'consequent','source'),target=markAlignment(doc.createElement('span'),'target','source');target.textContent=WEEKDAYS[input.target]+' ▾';if(targetControl){target.classList.add('weekday-target-trigger');target.append(targetControl);}b.append(word('③ 오늘',c.consequent,value(c.consequent,1),'consequent-today'),'이 ',target);
    const connective=(text:string)=>{const part=markAlignment(doc.createElement('span'),'conditional-connective','source');part.textContent=text;return part;};
    const firstLine=doc.createElement('span'),secondLine=doc.createElement('span');firstLine.className='weekday-sentence-antecedent-line';secondLine.className='weekday-sentence-consequent-line';firstLine.append('“',connective('만약'),' ',a,connective('이라면, '));secondLine.append(b,connective('이다'),'.”');sentenceRoot.append(firstLine,secondLine);line.append(sentenceRoot);
    const question=markAlignment(doc.createElement('p'),'query','source');question.className='weekday-sentence-question alignment-node';question.append('그렇다면 ',word('④ 오늘',c.question,value(c.question,1),'query-today'),'은 무슨 요일일까?');
    const worldSet=`W = {${result.worlds.map(w=>worldSymbol(w.id)).join(', ')}}`;
    source.replaceChildren(line,question);
    const clauses=doc.createElement('div');clauses.className='weekday-symbol-constraints';const clauseRoot=markAlignment(doc.createElement('div'),'constraints','symbol');
    for(const id of ['A','B'] as const){const clause=paragraph(id+': ','weekday-symbol-clause');clause.append(calendarClause(doc,input,id));clauseRoot.append(clause);}clauses.append(clauseRoot);
    const queryLine=doc.createElement('span');queryLine.className='weekday-symbol-query';queryLine.append(' · 질문: ',calendarQuery(doc,input));
    const conditional=paragraph('조건문: ','weekday-symbol-conditional');conditional.dataset.claimRefs='claim:logic.weekday-worlds.conditional-reading';conditional.append(conditionalReading(doc),queryLine);
    const glossary=paragraph('','weekday-symbol-definition'),sameDay=markAlignment(doc.createElement('span'),'weekday-equivalence','symbol');sameDay.classList.add('weekday-equivalence-definition');sameDay.textContent='≡₇: 같은 요일';glossary.append(sameDay);
    formal.replaceChildren(
      paragraph(`${worldSet} · tᵢ: wᵢ의 오늘 · 월=0, …, 일=6`,'weekday-symbol-definition'),
      conditional,clauses,glossary,
      ...(logicMode==='calendar'?[paragraph('A → B만으로 A나 B가 참인 것은 아님 · 계산은 A와 B를 함께 가정','weekday-symbol-limit')]:[]),
    );
    if(logicMode==='alethic'||compare){
      const proposition=paragraph('P: ','weekday-symbol-definition');proposition.append(markAlignment(doc.createElement('span'),'consequent','symbol'));proposition.lastChild!.textContent='이 세계의 오늘은 '+WEEKDAYS[input.target];
      formal.append(proposition,paragraph('◇P: 접근 세계 중 하나 이상에서 P · □P: 모두에서 P','weekday-symbol-definition'),paragraph('요일 명제 P를 세계마다 평가하는 예시 · 조건문 전체의 양상 번역은 아님','weekday-symbol-limit'));
    }
    container.dataset.representation=representation;
    source.hidden=false;formal.hidden=false;
  }};
}
