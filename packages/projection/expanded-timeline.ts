import type {ProofResult} from '../models/types.js';
import type {TimelineLine,Cue} from './types.js';
import {LESSON} from '../../content/formal-logic/explosion/lesson.js';
export function expandedCues({lines,goal,proof}:{lines:TimelineLine[];goal:string;proof:Partial<ProofResult>}) {
  const cues:Cue[]=[];let cursor=0;
  const add=(id:string,duration:number,phase:string,title:string,text:string,activeLine=-1,claimRefs:string[]=[])=>{
    cues.push({id:`${LESSON.id}:${id}`,startMs:cursor,endMs:cursor+duration,phase,title,text,activeLine,claimRefs});cursor+=duration;
  };
  for(const section of LESSON.intro) add(section.id,Math.max(4500,section.text.length*65),'intro',section.title,section.text,-1,section.claimRefs);
  const stepDuration=Math.max(1800,4200);
  lines.forEach((line,index)=>{
    const note=LESSON.rules[proof.lines![index].rule as keyof typeof LESSON.rules];
    const refs=line.dependsOn.map(id=>`${String(id).replace('line-','')}행`).join(', ');
    add(`line-${index+1}-inspect`,stepDuration,'step',`${index+1}행의 근거 살펴보기`,
      `${line.formula}. ${refs?`${refs}을 참조해 ${line.rule} 규칙을 적용했습니다. 근거 카드와 결과 카드의 수식을 번갈아 확인해 보세요.`:'입력한 전제입니다. 이 행은 탐색의 출발점이며 다른 행에서 도출된 결과가 아닙니다.'}`,index,note?.claimRefs);
    const explanation=proof.lines![index].rule==='premise' ? LESSON.premiseNotes[line.formula as keyof typeof LESSON.premiseNotes]??note?.text : note?.text;
    const explanationRefs=proof.lines![index].rule==='premise'&&LESSON.premiseNotes[line.formula as keyof typeof LESSON.premiseNotes]?[...note!.claimRefs,'claim:logic.inference.modus-ponens']:note?.claimRefs;
    add(`line-${index+1}-explain`,stepDuration,'step',line.rule,explanation??'기록된 규칙과 참조 행을 함께 확인해 주세요.',index,explanationRefs);
  });
  if(!lines.length) add('no-lines',6500,'outro','사용 가능한 증명 행이 없습니다','포함된 전제에서 표시할 행을 얻지 못했습니다. 입력과 탐색 범위를 확인하세요. 이것은 목표의 거짓이나 일반적 증명 불가능성 판정이 아닙니다.');
  for(const section of LESSON.outro) add(section.id,Math.max(4500,section.text.length*65),'outro',section.title,
    section.id==='result'?`${proof.goalReached?`목표 ${goal}에 도달했습니다.`:`목표 ${goal}의 경로를 이 탐색에서 찾지 못했습니다.`} ${section.text}`:section.text,-1,section.claimRefs);
  return {cues,lessonId:LESSON.id};
}
