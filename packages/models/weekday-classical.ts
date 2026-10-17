import {weekdayDeductions,type WeekdayInterpretation} from './weekday-worlds.js';

export interface WeekdayProofStep {formula:string;reason:string;premises:number[];congruence?:[CalendarTerm,CalendarTerm]}
export interface CalendarTerm {variable:'t'|'h'|null;offset:number}

// A scoped derivation in the antecedent case requested by the simplified problem.
export function weekdayClassicalProof(input:WeekdayInterpretation){
  const result=weekdayDeductions(input),c=input.contexts;
  const forward=c.yesterday===0&&c.tomorrow===1,reversed=c.yesterday===1&&c.tomorrow===0;
  const supported=(forward||reversed)&&c.consequent===1&&c.question===0;
  const term=(variable:CalendarTerm['variable'],offset=0):CalendarTerm=>({variable,offset});
  const steps:WeekdayProofStep[]=[];
  function add(formula:string,reason:string,premises:number[],congruence?:[CalendarTerm,CalendarTerm]){steps.push({formula,reason,premises,...(congruence?{congruence}:{})});}
  if(supported){
    const d=input.target,answer=result.questionCandidates[0];
    add('A → B','문제의 풀이용 조건문',[]);
    add('A','문제가 묻는 A인 경우를 가정 (문제의 전제)',[],forward?[term('t',-1),term('h',1)]:[term('h',-1),term('t',1)]);
    add(`B: h ≡₇ ${d}`,'1·2: 전건 긍정 (→E)',[1,2],[term('h'),term(null,d)]);
    add(`h ${forward?'+':'−'} 1 ≡₇ ${d} ${forward?'+':'−'} 1`,`3: 양변에 ${forward?'1':'−1'} 더하기`,[3],[term('h',forward?1:-1),term(null,d+(forward?1:-1))]);
    if(!forward)add(`t + 1 ≡₇ h − 1`,'2: 대칭',[2],[term('t',1),term('h',-1)]);
    add(forward?`t − 1 ≡₇ ${d} + 1`:`t + 1 ≡₇ ${d} − 1`,forward?'2·4: 추이 (대입의 근거)':'5·4: 추이 (대입의 근거)',forward?[2,4]:[5,4],[term('t',forward?-1:1),term(null,d+(forward?1:-1))]);
    const previous=steps.length;
    add(`t ≡₇ ${d} ${forward?'+':'−'} 2`,`${previous}: 양변에 ${forward?'1':'−1'} 더하기 · 정수 계산`,[previous],[term('t'),term(null,d+(forward?2:-2))]);
    add(`t ≡₇ ${answer}`,`${steps.length}: 7의 배수를 더하거나 빼기 (정의·추이)`,[steps.length],[term('t'),term(null,answer)]);
  }
  return {kind:result.kind,supported,answer:result.questionCandidates.length===1?result.questionCandidates[0]:null,
    steps,
    equation:supported?(forward?'t − 1 ≡₇ h + 1':'h − 1 ≡₇ t + 1'):null,
    substituted:supported?(forward?`t − 1 ≡₇ ${input.target} + 1`:`${input.target} − 1 ≡₇ t + 1`):null,
    relation:supported?(forward?`t ≡₇ ${input.target} + 2`:`t ≡₇ ${input.target} − 2`):null,
  };
}
