import {RULES} from '../models/propositional.mjs';
import {displayFormula} from '../experiments/formula-display.mjs';

const lineName=id=>String(id).replace(/^line-(\d+)$/,'$1행');
// Presentation of existing proof lines only; no inference or premise rewriting.
export function visualForStep({premises=[],goal='',proof,step=0}) {
  if(!proof || !Array.isArray(proof.lines)) throw new TypeError('An existing proof result is required');
  const lines=proof.lines;
  if(lines.length && (!Number.isInteger(step) || step<0 || step>=lines.length)) throw new RangeError('Step must identify an existing proof line');
  const current=lines[step];
  const overall=proof.goalReached?'전체 탐색에서 목표에 도달했습니다.':proof.limitReached?'탐색 한도에서 멈췄습니다.':'이 탐색에서 목표에 도달하지 못했습니다.';
  const rule=proof.ruleLabels?.[current?.rule] ?? RULES.find(item=>item.id===current?.rule)?.label ?? current?.rule ?? '표시할 단계 없음';
  const card=line=>({id:line.id,label:lineName(line.id),formula:displayFormula(line.formula)});
  return {
    sceneId:'scene:logic.inference.lab',step:current?step:null,total:lines.length,
    goal:displayFormula(goal),premises:premises.map(value=>displayFormula(value)),
    kind:current?(current.rule==='premise'?'premise':'derivation'):'empty',
    current:current?card(current):null,rule,
    dependencies:(current?.dependsOn??[]).map(id=>{const line=lines.find(item=>item.id===id);return line?card(line):{id,label:lineName(id),formula:'참조 단계를 찾을 수 없음',missing:true};}),
    overall,goalReached:Boolean(proof.goalReached),
    limitation:'전제는 사용한 가정입니다. 경로 미발견은 일반적인 증명 불가능성이나 현실의 거짓을 뜻하지 않습니다.',
  };
}
