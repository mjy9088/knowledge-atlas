import {WEEKDAYS} from '/packages/models/weekday-worlds.js';
import {CHALLENGE_DURATION_MS,type WeekdayChallenge} from '/packages/experiments/weekday-challenge.js';

export function mountWeekdayChallenge(container:HTMLElement,{onStart,onAnswer}:{onStart:()=>void;onAnswer:(day:number)=>void}){
  const doc=container.ownerDocument;
  const make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{const n=doc.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  container.className='weekday-challenge';
  const quiz=make('section',undefined,'weekday-challenge-quiz'),toolbar=make('div',undefined,'weekday-challenge-toolbar'),clock=make('output',undefined,'weekday-challenge-time'),start=make('button','20초 도전 시작');clock.setAttribute('role','timer');clock.setAttribute('aria-label','남은 시간');clock.setAttribute('aria-live','off');start.type='button';start.addEventListener('click',startAttempt);toolbar.append(make('span','20초 제한'),clock,start);
  const progress=make('progress');progress.max=CHALLENGE_DURATION_MS;progress.setAttribute('aria-label','남은 도전 시간');
  const choices=make('div',undefined,'weekday-challenge-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','오늘의 요일 선택');
  const buttons=WEEKDAYS.map((day,index)=>{const button=make('button',day);button.type='button';button.addEventListener('click',()=>onAnswer(index));choices.append(button);return button;});
  quiz.append(toolbar,progress,choices);
  const reflection=make('section',undefined,'weekday-challenge-reflection'),question=make('h2','왜 그렇게 생각하셨나요?'),retry=make('button','다시 풀어보기');question.tabIndex=-1;retry.type='button';retry.addEventListener('click',startAttempt);reflection.append(question,retry);container.append(quiz,reflection);
  function startAttempt(){onStart();buttons[0].focus({preventScroll:true});}
  return {render(state:WeekdayChallenge,scene:string){
    const reflecting=['answered','expired','skipped'].includes(state.phase);
    container.hidden=scene!=='question';quiz.hidden=reflecting;reflection.hidden=!reflecting;
    const seconds=Math.ceil((CHALLENGE_DURATION_MS-state.elapsedMs)/1000);clock.textContent=`${seconds}초`;progress.value=CHALLENGE_DURATION_MS-state.elapsedMs;
    start.hidden=state.phase==='running'&&state.playback==='live';start.textContent=state.phase==='ready'?'20초 도전 시작':'다시 20초 도전';
    for(const [index,button]of buttons.entries()){button.disabled=state.phase!=='running';button.setAttribute('aria-pressed',String(state.answer===index));}

  }};
}
