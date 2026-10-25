import {calendarCorrespondence} from './weekday-calendar.js';
import {WEEKDAYS,weekdayDeductions,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';

// An ordinary-language projection of the same calendar result, before terminology.
export function mountWeekdayIntro(source:HTMLElement,reasoning:HTMLElement){
  const doc=source.ownerDocument;
  const make=(tag:string,text:string,cls:string)=>{const node=doc.createElement(tag);node.textContent=text;node.className=cls;return node;};
  source.className='weekday-intro-source';reasoning.className='weekday-intro-reasoning';
  reasoning.setAttribute('aria-label','요일로 따라가는 풀이');
  const heading=make('h2','요일 수수께끼','weekday-intro-heading'),quote=make('p','','weekday-intro-quote'),question=make('p','그렇다면 오늘은 무슨 요일일까?','weekday-intro-question');source.append(heading,quote,question);
  const worlds=make('div','','weekday-intro-worlds');worlds.append(make('h3','서로 다른 상황을 ‘가능세계’로',''),make('p','현실과 가정한 상황을 나누어 비교하는 모형입니다. 각 상황의 ‘오늘’도 따로 정합니다.',''));source.append(worlds);
  return {render(input:WeekdayInterpretation,scene:string){
    worlds.hidden=scene!=='wednesday';
    const value=weekdayDeductions(input),c=input.contexts;
    quote.textContent=scene==='question'||scene==='reason'?`“어제가 내일이었으면 좋겠다. 그럼 오늘이 ${WEEKDAYS[input.target]}일 텐데…”`:`“만약 어제가 내일이라면, 오늘이 ${WEEKDAYS[input.target]}이다.”`;

    reasoning.replaceChildren();
    if(scene==='question'||scene==='reason')return;
    const calendar=calendarCorrespondence(input);
    if(calendar){reasoning.innerHTML=calendar;return;}
    function step(label:string,day:string){const card=make('div','','weekday-intro-step');card.append(make('span',label,'weekday-intro-label'),make('strong',day,'weekday-intro-day'));if(reasoning.childElementCount)reasoning.append(make('span','↓','weekday-intro-arrow'));reasoning.append(card);}
    const a=c.yesterday===0&&c.tomorrow===1&&c.consequent===1&&c.question===0;
    const b=c.yesterday===1&&c.tomorrow===0&&c.consequent===1&&c.question===0;
    if((a||b)&&value.questionCandidates.length===1){
      step('가정한 오늘',WEEKDAYS[input.target]);
      step(a?'그 상황의 내일 = 지금의 어제':'그 상황의 어제 = 지금의 내일',WEEKDAYS[(input.target+(a?1:6))%7]);
      step('지금의 오늘',WEEKDAYS[value.questionCandidates[0]]);
    }else{
      step('문장에서 정한 요일',WEEKDAYS[input.target]);
      step('지금 물은 오늘',value.questionCandidates.length===1?WEEKDAYS[value.questionCandidates[0]]:value.questionCandidates.length?'아직 하나로 정할 수 없어요':'조건에 맞는 날짜가 없어요');
    }
  }};
}
