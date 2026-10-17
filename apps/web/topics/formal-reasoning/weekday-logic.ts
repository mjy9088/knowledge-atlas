import {weekdayNotation} from '/packages/models/weekday-notation.js';
import {WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {worldText} from './weekday-world-style.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {calendarClause,calendarQuery} from './weekday-alignment.js';

export function mountWeekdayLogic(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-logic-diagram';container.setAttribute('role','group');container.setAttribute('aria-label','달력 제약의 논리적 추론');
  function element(tag:string,text:string,cls:string){const node=doc.createElement(tag);worldText(node,text);node.className=cls;return node;}
  return {render(input:WeekdayInterpretation,modal=false){
    const n=weekdayNotation(input);container.dataset.kind=n.kind;container.replaceChildren();
    const premises=markAlignment(element('div','','weekday-logic-premises'),'constraints','symbol');
    const a=markAlignment(element('section','','weekday-logic-node'),'antecedent','symbol');a.setAttribute('aria-label','전제 A');const aFormula=element('p','','weekday-logic-formula');aFormula.append(calendarClause(doc,input,'A',false));a.append(element('h3','A · ①어제 = ②내일','weekday-logic-title'),aFormula);
    const b=markAlignment(element('section','','weekday-logic-node'),'consequent','symbol');b.setAttribute('aria-label','조건 B');const bFormula=element('p','','weekday-logic-formula');bFormula.append(calendarClause(doc,input,'B',false));b.append(element('h3',`B · ③오늘 = ${WEEKDAYS[input.target]}(${input.target})`,'weekday-logic-title'),bFormula);
    const and=element('span','∧','weekday-logic-and');and.setAttribute('aria-label','두 조건을 함께 요구');premises.append(a,and,b);
    const join=element('p',n.kind==='impossible'?'↓ 조건을 함께 만족하는 달력이 없음':'↓ Γ = {A, B}를 만족하는 달력에서','weekday-logic-join');
    const conclusion=element('section','','weekday-logic-conclusion');conclusion.setAttribute('aria-label','질문에 대한 결과');
    conclusion.append(element('p',n.conclusion,'weekday-logic-formula'));
    const detail=n.kind==='impossible'?'0 ≡₇ 2는 불가능 · 요일 답을 추출하지 않습니다.':n.answer===null?'조건이 질문 세계의 요일을 하나로 정하지 못합니다.':`${n.relation} · ④오늘 = ${WEEKDAYS[n.answer]}`;
    conclusion.append(element('p',detail,'weekday-logic-detail'));
    if(n.kind==='impossible'){
      const note=element('p','고전 논리: ⊥에서 모든 요일 명제가 도출됨. 현실의 사실은 아님. ','weekday-logic-detail weekday-explosion-note');
      note.dataset.claimRefs='claim:logic.weekday-worlds.explosion claim:logic.explosion.rule claim:logic.explosion.not-reality';
      const link=doc.createElement('a');link.href='/lesson.html#explanation-explosion';link.textContent='모순 폭발 ↗';note.append(link);conclusion.append(note);
    }
    join.prepend('질문: ',calendarQuery(doc,input),' · ');
    if(modal)container.append(element('p','추가 가정 Γ={A,B}를 함께 채택한 달력 계산 (번역식 자체의 귀결 아님)','weekday-logic-join'));
    container.append(premises,join,conclusion);
  }};
}
