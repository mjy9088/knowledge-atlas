import {WEEKDAYS} from '/packages/models/weekday-worlds.js';
import {CHALLENGE_DURATION_MS,type WeekdayChallenge} from '/packages/experiments/weekday-challenge.js';

export function mountWeekdayChallenge(container:HTMLElement,{onStart,onAnswer,onReason}:{onStart:()=>void;onAnswer:(day:number)=>void;onReason:(reason:string)=>void}){
  const doc=container.ownerDocument;
  const make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{const n=doc.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  container.className='weekday-challenge';
  const quiz=make('section',undefined,'weekday-challenge-quiz'),toolbar=make('div',undefined,'weekday-challenge-toolbar'),clock=make('output',undefined,'weekday-challenge-time'),start=make('button','20초 도전 시작');clock.setAttribute('role','timer');clock.setAttribute('aria-label','남은 시간');clock.setAttribute('aria-live','off');start.type='button';start.addEventListener('click',startAttempt);toolbar.append(make('span','20초 제한'),clock,start);
  const progress=make('progress');progress.max=CHALLENGE_DURATION_MS;progress.setAttribute('aria-label','남은 도전 시간');
  const choices=make('div',undefined,'weekday-challenge-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','오늘의 요일 선택');
  const buttons=WEEKDAYS.map((day,index)=>{const button=make('button',day);button.type='button';button.addEventListener('click',()=>onAnswer(index));choices.append(button);return button;});
  const hint=make('p','시작을 누른 뒤 20초 안에 골라 보세요. 정답은 아직 공개하지 않습니다.','weekday-challenge-hint');quiz.append(toolbar,progress,choices,hint);
  const reflection=make('section',undefined,'weekday-challenge-reflection'),summary=make('p',undefined,'weekday-challenge-summary'),label=make('label','그렇게 생각한 이유 (선택)'),reason=make('textarea');reason.setAttribute('aria-label','그렇게 생각한 이유');reason.maxLength=1000;reason.rows=2;reason.placeholder='생각한 과정을 짧게 적어 보세요.';reason.addEventListener('input',()=>onReason(reason.value));label.append(reason);const retry=make('button','다시 20초 도전');retry.type='button';retry.addEventListener('click',startAttempt);reflection.append(summary,label,retry);container.append(quiz,reflection);
  function startAttempt(){onStart();buttons[0].focus({preventScroll:true});}
  return {render(state:WeekdayChallenge,scene:string){
    container.hidden=scene!=='question'&&scene!=='reason';quiz.hidden=scene!=='question';reflection.hidden=scene!=='reason';
    const seconds=Math.ceil((CHALLENGE_DURATION_MS-state.elapsedMs)/1000);clock.textContent=`${seconds}초`;progress.value=CHALLENGE_DURATION_MS-state.elapsedMs;
    start.hidden=state.phase==='running'&&state.playback==='live';start.textContent=state.phase==='ready'?'20초 도전 시작':'다시 20초 도전';
    for(const [index,button]of buttons.entries()){button.disabled=state.phase!=='running';button.setAttribute('aria-pressed',String(state.answer===index));}
    hint.textContent=state.phase==='running'?'20초 안에 요일을 골라 보세요.':state.phase==='answered'?`고른 답: ${WEEKDAYS[state.answer!]}. 이제 생각한 이유를 정리해 보세요.`:state.phase==='expired'?'20초가 지났어요. 어떤 생각이 들었나요?':state.phase==='skipped'?'시간 도전 없이 생각한 이유를 정리해도 좋습니다.':'시작을 누른 뒤 20초 안에 골라 보세요. 정답은 아직 공개하지 않습니다.';
    summary.textContent=state.answer!==null?`고른 답: ${WEEKDAYS[state.answer]}`:state.phase==='expired'?'20초가 지났어요. 어떤 답이 떠올랐나요?':'아직 답을 고르지 않았어도 괜찮아요. 어떤 생각을 했나요?';
    if(reason.value!==state.reason)reason.value=state.reason;
  }};
}
