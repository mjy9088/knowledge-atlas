import {weekdayNotation} from '/packages/models/weekday-notation.js';
import {WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {worldText} from './weekday-world-style.js';

export function mountWeekdayLogic(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-logic-diagram';container.setAttribute('role','group');container.setAttribute('aria-label','달력 제약의 논리적 추론');
  function element(tag:string,text:string,cls:string){const node=doc.createElement(tag);worldText(node,text);node.className=cls;return node;}
  return {render(input:WeekdayInterpretation){
    const n=weekdayNotation(input);container.dataset.kind=n.kind;container.replaceChildren();
    const premises=element('div','','weekday-logic-premises');
    const a=element('section','','weekday-logic-node');a.setAttribute('aria-label','전제 A');a.append(element('h3','A · ①어제 = ②내일','weekday-logic-title'),element('p',n.antecedent,'weekday-logic-formula'));
    const b=element('section','','weekday-logic-node');b.setAttribute('aria-label','조건 B');b.append(element('h3',`B · ③오늘 = ${WEEKDAYS[input.target]}(${input.target})`,'weekday-logic-title'),element('p',n.consequent,'weekday-logic-formula'));
    const and=element('span','∧','weekday-logic-and');and.setAttribute('aria-label','두 조건을 함께 요구');premises.append(a,and,b);
    const join=element('p',n.kind==='impossible'?'↓ 조건을 함께 만족하는 달력이 없음':'↓ Γ = {A, B}를 만족하는 달력에서','weekday-logic-join');
    const conclusion=element('section','','weekday-logic-conclusion');conclusion.setAttribute('aria-label','질문에 대한 결과');
    conclusion.append(element('p',n.conclusion,'weekday-logic-formula'));
    const detail=n.kind==='impossible'?'0 ≡₇ 2는 불가능 · 요일 답을 추출하지 않습니다.':n.answer===null?'조건이 질문 세계의 요일을 하나로 정하지 못합니다.':`${n.relation} · ④오늘 = ${WEEKDAYS[n.answer]}`;
    conclusion.append(element('p',detail,'weekday-logic-detail'));
    container.append(premises,join,conclusion);
  }};
}
