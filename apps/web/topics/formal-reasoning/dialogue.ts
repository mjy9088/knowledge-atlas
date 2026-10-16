import type {ExperimentInspection} from '/packages/experiments/premise-state.js';
import {RULES} from '../../../../packages/models/propositional.js';

export const EXPERIMENT_RULE_CLAIMS:Record<string,string>={
  premise:'claim:logic.inference.proof-structure',
  contradiction:'claim:logic.explosion.from_pair',
  explosion:'claim:logic.explosion.rule',
  'modus-ponens':'claim:logic.inference.modus-ponens',
  'and-elimination':'claim:logic.inference.and-elimination',
  'and-introduction':'claim:logic.inference.and-introduction',
  'or-introduction':'claim:logic.inference.or-introduction'
};
const boundary='claim:logic.explosion.not-reality';
const structure='claim:logic.inference.proof-structure';
const limits='경로를 찾지 못했다는 것은 목표가 거짓이거나 다른 모든 증명도 불가능하다는 뜻은 아닙니다.';

// Describe recorded proof lines, never a canned example or a newly invented inference.
export function describeExperiment(sectionId:string,info:ExperimentInspection){
  const result=(status:string,title:string,text:string,stepIndex:number|null=null,claimRefs:string[]=[structure,boundary])=>({id:`explanation:logic.experiment.${sectionId}`,status,title,text,stepIndex,claimRefs});
  if(!info.valid)return result('invalid','현재 입력의 설명을 만들 수 없습니다',`포함한 전제와 목표의 명제식을 완성해 주세요. ${info.error} 입력이 유효해지면 대사와 도표를 함께 갱신합니다.`);
  const lines=info.proof.lines,goalIndex=lines.findIndex(line=>line.formula===info.goal);
  const target=goalIndex>=0?lines[goalIndex]:null;
  const included=info.premises.length,excluded=info.input.premises.filter(row=>!row.enabled).length;
  const selected=`현재 전제 ${included}개를 사용하고${excluded?` ${excluded}개는 제외하며,`:' 있으며,'} 목표는 ${info.goal}입니다.`;
  const goalSummary=target?target.rule==='premise'
    ? `목표 ${info.goal}는 이미 포함한 전제입니다. 이 목표를 얻기 위해 추가 도출 규칙을 사용하지 않았습니다.`
    : `${target.dependsOn.map(id=>id.replace('line-','')+'행').join(', ')}의 근거에 ${RULES.find(rule=>rule.id===target.rule)?.label??target.rule} 규칙을 적용해 ${info.goal}를 얻었습니다.`
    : `현재 탐색에서 목표 ${info.goal}에 도달하지 못했습니다. ${limits}`;
  const targetClaims=[EXPERIMENT_RULE_CLAIMS[target?.rule??'']??structure,boundary];
  if(!target)return result('unavailable',`목표 ${info.goal}의 경로를 찾지 못했습니다`,`${selected} ${goalSummary}`);
  if(['question','symbols'].includes(sectionId))return result('adapted','현재 전제와 목표로 살펴봅니다',`${selected} 전제는 출발점으로 사용하는 가정입니다. ${goalSummary}`,goalIndex,targetClaims);
  if(['premise-p','premise-not-p'].includes(sectionId)){
    const index=sectionId==='premise-p'?0:1;
    const premiseLines=lines.filter(line=>line.rule==='premise'),line=premiseLines[index];
    if(!line)return result('unavailable','이 장면에서 설명할 전제가 없습니다',`현재 경로에는 ${index+1}번째 전제 행이 없습니다. ${goalSummary}`,goalIndex,targetClaims);
    return result('adapted',`현재 전제: ${line.formula}`,`${line.formula}는 포함한 전제 중 하나입니다. 다른 행에서 도출한 결론이 아니라 이번 탐색의 출발점입니다. 현재 목표는 ${info.goal}입니다.`,lines.indexOf(line),[structure,boundary]);
  }
  const requested=sectionId==='contradiction'?'contradiction':['explosion','change-r','change-s'].includes(sectionId)?'explosion':null;
  if(requested){
    const index=lines.findIndex(line=>line.rule===requested);
    if(index<0)return result('unavailable',requested==='explosion'?'현재 경로에는 폭발 단계가 없습니다':'현재 경로에는 모순 도출 단계가 없습니다',`이 장면의 규칙 설명은 현재 경로에 적용되지 않습니다. ${goalSummary}`,goalIndex,targetClaims);
    const line=lines[index],refs=line.dependsOn.map(id=>lines.find(item=>item.id===id)?.formula).filter(Boolean);
    return result('adapted',requested==='explosion'?`⊥에서 현재 목표 ${info.goal}로`:'현재 전제에서 얻은 모순',requested==='explosion'
      ? `현재 경로에서 얻은 ⊥에 폭발 규칙을 적용해 ${line.formula}를 도출했습니다. 이 체계에서는 임의의 목표식을 이렇게 얻을 수 있습니다. 현실의 사실로 확인했다는 뜻은 아닙니다.`
      : `${refs.join('와 ')}를 함께 사용해 ⊥를 얻었습니다. 두 근거는 같은 식과 그 부정입니다. 현재 목표는 ${info.goal}입니다.`,index,[EXPERIMENT_RULE_CLAIMS[requested],boundary]);
  }
  if(sectionId==='remove-premise')return result('adapted',excluded?`현재 전제 ${excluded}개를 제외했습니다`:'현재 제외된 전제가 없습니다',`${selected} ${goalSummary}`,goalIndex,targetClaims);
  if(sectionId==='truth')return result('adapted',`목표 ${info.goal}의 도출과 사실을 구별합니다`,`${goalSummary} 이것은 선택한 가정과 규칙 아래의 결과입니다. ${info.goal}가 현실의 사실인지 조사한 결과는 아닙니다.`,goalIndex,targetClaims);
  if(sectionId==='consistency'){
    const hasBottom=lines.some(line=>line.formula==='⊥');
    return result('adapted','현재 경로와 일관성',`${hasBottom?'현재 경로에 모순 ⊥가 기록되어 있습니다.':'현재 반환된 경로에는 ⊥가 기록되어 있지 않습니다. 이것만으로 입력 전체의 일관성을 증명한 것은 아닙니다.'} 폭발을 허용하는 체계에서 모순을 증명하면 모든 문장을 도출할 수 있습니다. ${goalSummary}`,goalIndex,['claim:logic.consistency.nontrivial',...targetClaims]);
  }
  return result('adapted',`현재 입력의 결과: ${info.goal}`,`${selected} ${goalSummary} 어떤 전제와 규칙을 사용했는지 도표에서 확인하세요. 도출과 현실의 사실 판단은 구별해야 합니다.`,goalIndex,targetClaims);
}
