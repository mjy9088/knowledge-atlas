import {weekdayNotation} from '/packages/models/weekday-notation.js';
import {WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {worldText} from './weekday-world-style.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {calendarClause,calendarQuery,annotateWeekdayEquivalence} from './weekday-alignment.js';

export function mountWeekdayLogic(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-logic-diagram';container.setAttribute('role','group');container.setAttribute('aria-label','달력 제약의 논리적 추론');
  function element(tag:string,text:string,cls:string){const node=doc.createElement(tag);worldText(node,text);annotateWeekdayEquivalence(node);node.className=cls;return node;}
  return {render(input:WeekdayInterpretation,modal=false){
    const n=weekdayNotation(input);container.dataset.kind=n.kind;container.replaceChildren();
    const premises=markAlignment(element('div','','weekday-logic-premises'),'constraints','symbol');
    const a=markAlignment(element('section','','weekday-logic-node'),'antecedent','symbol');a.setAttribute('aria-label','전제 A');const aFormula=element('p','','weekday-logic-formula');aFormula.append(calendarClause(doc,input,'A',false));a.append(element('h3','A','weekday-logic-title'),aFormula);
    const b=markAlignment(element('section','','weekday-logic-node'),'consequent','symbol');b.setAttribute('aria-label','조건 B');const bFormula=element('p','','weekday-logic-formula');bFormula.append(calendarClause(doc,input,'B',false));b.append(element('h3','B','weekday-logic-title'),bFormula);
    const and=element('span','∧','weekday-logic-and');and.setAttribute('aria-label','두 조건을 함께 요구');premises.append(a,and,b);
    const join=element('p',n.kind==='impossible'?'↓ 조건을 함께 만족하는 달력이 없음':'↓ 두 조건을 함께 만족하는 달력에서','weekday-logic-join');
    const conclusion=element('section','','weekday-logic-conclusion');conclusion.setAttribute('aria-label','질문에 대한 결과');
    const answer=n.kind==='impossible'?'조건을 만족하는 달력 없음':n.answer===null?'질문의 오늘: 아직 미정':`④ 오늘은 ${WEEKDAYS[n.answer]}`;
    conclusion.append(element('p',answer,'weekday-logic-formula'));
    const detail=n.kind==='impossible'?'0 ≡₇ 2는 불가능 · 요일 답을 추출하지 않습니다.':n.answer===null?'조건이 질문 세계의 요일을 하나로 정하지 못합니다.':`${n.relation} · ④오늘 = ${WEEKDAYS[n.answer]}`;
    conclusion.append(element('p',detail,'weekday-logic-detail'));
    if(n.kind==='impossible'){
      const note=element('p','고전 논리: ⊥에서 모든 요일 명제가 도출됨. 현실의 사실은 아님. ','weekday-logic-detail weekday-explosion-note');
      note.dataset.claimRefs='claim:logic.weekday-worlds.explosion claim:logic.explosion.rule claim:logic.explosion.not-reality';
  const link=doc.createElement('a');link.href='#evidence';link.textContent='근거와 범위 ↗';note.append(link);conclusion.append(note);
    }
    join.prepend('질문: ',calendarQuery(doc,input),' · ');
    if(modal)container.append(element('p','요일 계산: 두 조건을 함께 가정 · 접근 관계와는 별개','weekday-logic-join'));
    container.append(premises,join,conclusion);
  }};
}
