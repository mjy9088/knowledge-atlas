import {weekdayDeductions,type WeekdayInterpretation} from './weekday-worlds.js';

// A scoped derivation under an added antecedent assumption, not A→B alone.
export function weekdayClassicalProof(input:WeekdayInterpretation){
  const result=weekdayDeductions(input),c=input.contexts;
  const forward=c.yesterday===0&&c.tomorrow===1,reversed=c.yesterday===1&&c.tomorrow===0;
  const supported=(forward||reversed)&&c.consequent===1&&c.question===0;
  return {kind:result.kind,supported,answer:result.questionCandidates.length===1?result.questionCandidates[0]:null,
    equation:supported?(forward?'t − 1 ≡₇ h + 1':'h − 1 ≡₇ t + 1'):null,
    substituted:supported?(forward?`t − 1 ≡₇ ${input.target} + 1`:`${input.target} − 1 ≡₇ t + 1`):null,
    relation:supported?(forward?`t ≡₇ ${input.target} + 2`:`t ≡₇ ${input.target} − 2`):null,
  };
}
