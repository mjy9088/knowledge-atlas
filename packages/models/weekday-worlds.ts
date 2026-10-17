// A finite calendar comparison, not a natural-language parser or a modal prover.
export const WEEKDAYS=['월요일','화요일','수요일','목요일','금요일','토요일','일요일'] as const;
export type WeekdayRule='actual-yesterday'|'imagined-yesterday'|'same-context';
export interface WeekdayInput {actual:number;target:number;rule:WeekdayRule}
export const RULES:Record<WeekdayRule,string>={
  'actual-yesterday':'A · 현실 어제 = 가정 내일',
  'imagined-yesterday':'B · 가정 어제 = 현실 내일',
  'same-context':'C · 한 기준의 어제 = 내일',
};
export type WorldIndex=0|1|2|3;
export interface CalendarWorld {id:WorldIndex;today:number}
export const worldSymbol=(id:WorldIndex)=>`w${['₀','₁','₂','₃'][id]}`;
export const todaySymbol=(id:WorldIndex)=>`t${['₀','₁','₂','₃'][id]}`;
export interface WeekdayContexts {yesterday:WorldIndex;tomorrow:WorldIndex;consequent:WorldIndex;question:WorldIndex}
export interface WeekdayInterpretation {actual:number;target:number;contexts:WeekdayContexts;worlds?:CalendarWorld[]}
export const CONTEXT_KEYS=['yesterday','tomorrow','consequent','question'] as const;
export const PRESET_CONTEXTS:Record<WeekdayRule,WeekdayContexts>={
  'actual-yesterday':{yesterday:0,tomorrow:1,consequent:1,question:0},
  'imagined-yesterday':{yesterday:1,tomorrow:0,consequent:1,question:0},
  'same-context':{yesterday:0,tomorrow:0,consequent:0,question:0},
};
export function validateWeekdayInterpretation(input:WeekdayInterpretation){
  if(!input||![input.actual,input.target].every(n=>Number.isInteger(n)&&n>=0&&n<7)||!input.contexts)throw new RangeError('Unsupported weekday interpretation');
  const ids=input.worlds?.map(w=>w?.id)??[0,1];
  if(input.worlds&&(!Array.isArray(input.worlds)||ids.length<1||ids.length>4||new Set(ids).size!==ids.length||!ids.includes(0)||!input.worlds.every(w=>w&&Number.isInteger(w.id)&&w.id>=0&&w.id<=3&&Number.isInteger(w.today)&&w.today>=0&&w.today<7)||input.worlds.find(w=>w.id===0)?.today!==input.actual))throw new RangeError('Invalid calendar worlds');
  if(!CONTEXT_KEYS.every(key=>ids.includes(input.contexts[key])))throw new RangeError('Unknown reference world');
}
export function interpretWeekdayWorlds(input:WeekdayInterpretation){
  validateWeekdayInterpretation(input);
  const c=input.contexts,ids=input.worlds?.map(w=>w.id)??[0,1],models:{values:number[];answer:number}[]=[];
  const values:number[]=[];
  function enumerate(index:number){
    if(index<ids.length){for(let value=0;value<7;value++){values[ids[index]]=value;enumerate(index+1);}return;}
    if(day(values[c.yesterday]-1)===day(values[c.tomorrow]+1)&&values[c.consequent]===input.target)models.push({values:[...values],answer:values[c.question]});
  }
  enumerate(0);
  const unique=(numbers:number[])=>[...new Set(numbers)].sort((a,b)=>a-b);
  const actualCandidates=unique(models.map(s=>s.values[0])),questionCandidates=unique(models.map(s=>s.answer));
  const offset=c.yesterday===c.tomorrow?null:c.yesterday===0&&c.tomorrow===1?-2:c.yesterday===1&&c.tomorrow===0?2:null;
  const imagined=offset===null?null:day(input.actual+offset),days=(today:number)=>[day(today-1),today,day(today+1)];
  const sample:number[]=[];
  if(input.worlds)for(const w of input.worlds)sample[w.id]=w.today;
  else{sample[0]=input.actual;sample[1]=imagined??input.actual;}
  const actualDays=days(input.actual),imaginedDays=input.worlds?ids.includes(1)?days(sample[1]):null:imagined===null?null:days(imagined);
  const kind=!models.length?'impossible':questionCandidates.length>1?'underdetermined':c.consequent===c.question?'direct':c.question===0?'inferred':'reversed';
  const solutions=models.map(s=>({actual:s.values[0],imagined:s.values[1]??0,answer:s.answer}));
  return {kind,actualDays,imaginedDays,actualCandidates,questionCandidates,solutions,models,offset,
    worldDays:ids.map(id=>({id,days:days(sample[id])})),
    matches:day(sample[c.yesterday]-1)===day(sample[c.tomorrow]+1)&&sample[c.consequent]===input.target,
    consequentDay:sample[c.consequent],questionDay:sample[c.question],usesImagined:CONTEXT_KEYS.some(key=>c[key]!==0),
  };
}
export function day(value:number){return ((value%7)+7)%7;}
// Deductions range over every satisfying calendar; saved sample days are not premises.
export function weekdayDeductions(input:WeekdayInterpretation){
  const result=interpretWeekdayWorlds(input);
  return {...result,worlds:(input.worlds?.map(w=>w.id)??[0,1] as WorldIndex[]).map(id=>({id,
    days:[-1,0,1].map(offset=>[...new Set(result.models.map(model=>day(model.values[id]+offset)))].sort((a,b)=>a-b)),
  }))};
}
export function validateWeekdayInput(input:WeekdayInput){
  if(!input||![input.actual,input.target].every(n=>Number.isInteger(n)&&n>=0&&n<7)||!Object.hasOwn(RULES,input.rule))throw new RangeError('Unsupported weekday input');
}
export function weekdayWorlds(input:WeekdayInput){
  validateWeekdayInput(input);
  const actualDays=[day(input.actual-1),input.actual,day(input.actual+1)];
  if(input.rule==='same-context')return {kind:'impossible' as const,actualDays,imaginedDays:null,candidates:[],matches:false,offset:null};
  const offset=input.rule==='actual-yesterday'?-2:2;
  const imagined=day(input.actual+offset);
  return {kind:'comparison' as const,actualDays,imaginedDays:[day(imagined-1),imagined,day(imagined+1)],candidates:[day(input.target-offset)],matches:imagined===input.target,offset};
}
