import {weekdayDeductions,WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {WORLD_COLORS,worldLabel} from './weekday-world-style.js';

/** The equality joins dates; it is neither an access edge nor a time trajectory. */
export function calendarCorrespondence(input:WeekdayInterpretation):string|null {
  const c=input.contexts,assumed=c.consequent;
  const forward=assumed!==0&&c.yesterday===0&&c.tomorrow===assumed&&c.question===0;
  const reverse=assumed!==0&&c.yesterday===assumed&&c.tomorrow===0&&c.question===0;
  if(!forward&&!reverse)return null;
  const result=weekdayDeductions(input),actual=result.worlds.find(world=>world.id===0),hypothesis=result.worlds.find(world=>world.id===assumed);
  if(result.questionCandidates.length!==1||!actual||!hypothesis||[...actual.days,...hypothesis.days].some(days=>days.length!==1))return null;
  const topIndex=forward?2:0,bottomIndex=forward?0:2,shared=hypothesis.days[topIndex][0];
  const relation=forward?'가정의 내일 = 현실의 어제':'가정의 어제 = 현실의 내일';
  const centres=[110,300,490],labels=['어제','오늘','내일'];
  const row=(world:typeof actual,y:number,linked:number)=>{
    const color=WORLD_COLORS[world.id];
    return `<g data-calendar-world="${world.id}"><text x="26" y="${world.id===0?y+104:y-12}" class="weekday-calendar-world" fill="${color.ink}">${world.id===0?'현실의 달력':worldLabel(world.id)+'의 달력'}</text>${world.days.map((days,index)=>`<g data-role="${labels[index]}" data-day="${days[0]}" data-linked="${index===linked}"><rect x="${centres[index]-84}" y="${y}" width="168" height="78" rx="10" fill="${color.tint}" stroke="${color.stroke}" stroke-width="${index===1?3:1.5}"/><text x="${centres[index]}" y="${y+24}" class="weekday-calendar-role">${labels[index]}</text><text x="${centres[index]}" y="${y+58}" class="weekday-calendar-day">${WEEKDAYS[days[0]]}</text>${index===linked?`<rect x="${centres[index]-84}" y="${y+69}" width="168" height="9" rx="4" fill="#a56a24"/>`:''}</g>`).join('')}</g>`;
  };
  const x=centres[topIndex],u=centres[bottomIndex];
  return `<figure class="weekday-calendar" data-direction="${forward?'forward':'reverse'}" data-shared-day="${shared}"><svg viewBox="0 0 600 350" role="img" aria-label="${relation}: ${WEEKDAYS[shared]}. 가정한 오늘은 ${WEEKDAYS[hypothesis.days[1][0]]}, 현실의 오늘은 ${WEEKDAYS[actual.days[1][0]]}입니다.">${row(hypothesis,48,topIndex)}<path d="M${x} 126 C${x} 166 ${u} 178 ${u} 224" fill="none" stroke="#a56a24" stroke-width="3"/><circle cx="${x}" cy="126" r="5" fill="#a56a24"/><circle cx="${u}" cy="224" r="5" fill="#a56a24"/><rect x="264" y="151" width="72" height="32" rx="16" fill="#fff9ed" stroke="#a56a24"/><text x="300" y="174" text-anchor="middle" font-size="25" fill="#704918">=</text>${row(actual,224,bottomIndex)}</svg><figcaption>${relation} · <strong>같은 ${WEEKDAYS[shared]}</strong></figcaption></figure>`;
}
