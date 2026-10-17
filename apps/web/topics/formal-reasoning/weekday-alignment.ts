import type {AlignmentNode} from '/packages/experiments/semantic-alignment.js';
import {todaySymbol,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {weekdayNotation,type CalendarTerm} from '/packages/models/weekday-notation.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {worldText} from './weekday-world-style.js';

// Authored calendar-role alignment, not a Korean parse or counterfactual translation.
export const WEEKDAY_ALIGNMENT:readonly AlignmentNode[]=[
  {id:'constraints',label:'A·B의 전체 구조'},
  {id:'wish-marker',parent:'constraints',label:'바람: ~이었으면 좋겠다'},
  {id:'conditional-connective',parent:'constraints',label:'조건 연결: ~이면 ~이다'},
  {id:'antecedent',parent:'constraints',label:'어제·내일의 대응'},
  {id:'yesterday',parent:'antecedent',label:'① 어제'},
  {id:'yesterday-base',parent:'yesterday',label:'① 기준의 오늘'},
  {id:'yesterday-offset',parent:'yesterday',label:'하루 전'},
  {id:'tomorrow',parent:'antecedent',label:'② 내일'},
  {id:'tomorrow-base',parent:'tomorrow',label:'② 기준의 오늘'},
  {id:'tomorrow-offset',parent:'tomorrow',label:'하루 뒤'},
  {id:'consequent',parent:'constraints',label:'오늘·목표 요일'},
  {id:'consequent-today',parent:'consequent',label:'③ 오늘'},
  {id:'consequent-base',parent:'consequent-today',label:'③ 기준의 오늘'},
  {id:'target',parent:'consequent',label:'목표 요일'},
  {id:'query',label:'묻는 오늘'},
  {id:'query-today',parent:'query',label:'④ 오늘'},
  {id:'query-base',parent:'query-today',label:'④ 기준의 오늘'},
];

export function conditionalReading(doc:Document,modal=false){
  const node=markAlignment(doc.createElement('span'),'constraints','symbol');
  const a=markAlignment(doc.createElement('span'),'antecedent','symbol'),arrow=markAlignment(doc.createElement('span'),'conditional-connective','symbol'),b=markAlignment(doc.createElement('span'),'consequent','symbol');
  a.textContent='A';arrow.textContent=modal?'□→':'→';b.textContent='B';
  if(modal){const wish=markAlignment(doc.createElement('span'),'wish-marker','symbol'),wishA=markAlignment(doc.createElement('span'),'antecedent','symbol');wish.textContent='Wishₛ';wishA.textContent='A';node.append(wish,'(',wishA,') ∧ (',a,' ',arrow,' ',b,')');}
  else node.append(a,' ',arrow,' ',b);return node;
}

function term(doc:Document,value:CalendarTerm,id:string){
  const node=markAlignment(doc.createElement('span'),id,'symbol'),base=markAlignment(doc.createElement('span'),id==='yesterday'||id==='tomorrow'?`${id}-base`:id.replace('-today','-base'),'symbol');
  worldText(base,todaySymbol(value.world));node.append(base);
  if(value.offset){const offset=markAlignment(doc.createElement('span'),`${id}-offset`,'symbol');offset.textContent=value.offset<0?'− 1':'+ 1';node.append(' ',offset);}return node;
}
export function calendarClause(doc:Document,input:WeekdayInterpretation,clause:'A'|'B',withParent=true){
  const n=weekdayNotation(input),node=doc.createElement('span');if(withParent)markAlignment(node,clause==='A'?'antecedent':'consequent','symbol');
  if(clause==='A')node.append(term(doc,n.left,'yesterday'),' ≡₇ ',term(doc,n.right,'tomorrow'));
  else{const target=markAlignment(doc.createElement('span'),'target','symbol');target.textContent=String(input.target);node.append(term(doc,n.goal,'consequent-today'),' ≡₇ ',target);}return node;
}
export function calendarQuery(doc:Document,input:WeekdayInterpretation){
  const n=weekdayNotation(input),node=markAlignment(doc.createElement('span'),'query','symbol');node.append(term(doc,n.query,'query-today'),' = ?');return node;
}
