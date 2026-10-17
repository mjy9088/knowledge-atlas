import {interpretWeekdayWorlds,type WeekdayInterpretation,type WorldIndex,todaySymbol} from './weekday-worlds.js';

export interface CalendarTerm {world:WorldIndex;offset:-1|0|1}
export function calendarTermText(term:CalendarTerm){return `${todaySymbol(term.world)}${term.offset===-1?' − 1':term.offset===1?' + 1':''}`;}
// A formalization of the chosen finite calendar constraints, not a translation
// of the full wish/counterfactual into material implication or modal semantics.
export function weekdayNotation(input:WeekdayInterpretation){
  const result=interpretWeekdayWorlds(input),c=input.contexts;
  const left:CalendarTerm={world:c.yesterday,offset:-1},right:CalendarTerm={world:c.tomorrow,offset:1};
  const goal:CalendarTerm={world:c.consequent,offset:0},query:CalendarTerm={world:c.question,offset:0};
  const antecedent=`${calendarTermText(left)} ≡₇ ${calendarTermText(right)}`;
  const consequent=`${calendarTermText(goal)} ≡₇ ${input.target}`;
  const question=`${calendarTermText(query)} = ?`;
  const answer=result.questionCandidates.length===1?result.questionCandidates[0]:null;
  const relation=c.yesterday===c.tomorrow?'0 ≡₇ 2（불가능）':result.offset!==null?`t₁ ≡₇ t₀ ${result.offset===-2?'− 2':'+ 2'}`:`${todaySymbol(c.tomorrow)} ≡₇ ${todaySymbol(c.yesterday)} − 2`;
  return {left,right,goal,query,antecedent,consequent,question,relation,
    kind:result.kind,answer,modelCount:result.models.length,
    conclusion:result.kind==='impossible'?'Mod₇(Γ) = ∅':answer===null?`${calendarTermText(query)} ∈ {${result.questionCandidates.join(', ')}}`:`Γ ⊨₇ ${calendarTermText(query)} ≡₇ ${answer}`,
  };
}
