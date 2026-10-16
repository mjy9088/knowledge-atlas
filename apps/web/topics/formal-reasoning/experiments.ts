import type {DeriveAdapter,ExperimentInspection} from '/packages/experiments/premise-state.js';
interface Preset {label:string;premises:string[];goal:string}
interface RelatedModel {label:string;derive:DeriveAdapter;syntax:string;claimRefs:string[];presets:Preset[]}
import {deriveFDE,deriveSetRelations,deriveCHConnections,FDE_VALUES} from '/packages/models/related-inference.js';
import {deriveProof,RULES} from '/packages/models/propositional.js';
const preset=(label:string,premises:string[],goal:string)=>({label,premises,goal});
export const RELATED_MODELS:Record<string,RelatedModel>={
  classical:{label:'고전 명제논리',derive:input=>({...deriveProof(input),ruleLabels:Object.fromEntries(RULES.map(rule=>[rule.id,rule.label]))}),syntax:'P, Q… · ¬ ∧ ∨ →',claimRefs:['claim:logic.consistency.nontrivial'],presets:[preset('모순에서 Q',['P','¬P'],'Q'),preset('전제 하나만',['P'],'Q'),preset('조건문 연결',['P','P → Q'],'Q')]},
  fde:{label:'FDE · 네 값의 지정값 보존',derive:deriveFDE,syntax:'P, Q… · ¬ ∧ ∨ · 기호 최대 5개',claimRefs:['claim:logic.fde.four-values'],presets:[preset('모순과 별개인 목표',['P','¬P'],'Q'),preset('그리고 나누기',['P ∧ Q'],'P'),preset('또는 넓히기',['P'],'P ∨ Q'),preset('배중률 비교',[],'P ∨ ¬P')]},
  sets:{label:'집합 관계 · 부분집합과 외연성',derive:deriveSetRelations,syntax:'∈: 원소로 속함 · ⊆: 부분집합 · =: 같은 집합',claimRefs:['claim:set.relations.membership','claim:set.relations.extensionality'],presets:[preset('원소 전달',['X ∈ A','A ⊆ B'],'X ∈ B'),preset('부분집합 연결',['A ⊆ B','B ⊆ C'],'A ⊆ C'),preset('서로 포함',['A ⊆ B','B ⊆ A'],'A = B'),preset('역방향은?', ['A ⊆ B'],'B ⊆ A')]},
  ch:{label:'CH · 등록된 정리의 연결',derive:deriveCHConnections,syntax:'Con(T): T에서 모순을 증명할 수 없음 · Ind(CH,ZFC): ZFC로부터 독립',claimRefs:['claim:set.ch.relative-consistency','claim:logic.independence.ch'],presets:[preset('두 방향을 결합',['Con(ZFC)'],'Ind(CH,ZFC)'),preset('CH를 더한 확장',['Con(ZFC)'],'Con(ZFC+CH)'),preset('¬CH를 더한 확장',['Con(ZFC)'],'Con(ZFC+¬CH)'),preset('가정을 빼면',[],'Ind(CH,ZFC)')]}
};
export function relatedNarration(model:string,info:ExperimentInspection){
  if(!info.valid)return {title:'현재 입력을 확인해 주세요',text:info.error,status:'invalid'};
  const target=info.proof.lines.find(line=>line.formula===info.goal),count=info.premises.length;
  if(model==='fde'){
    const semantic=info.proof.semantics;if(!semantic)throw new Error('FDE evaluation lacks semantics');const witness=semantic.counterexample;
    if(witness)return {title:'FDE에서 목표가 따라오지 않는 평가입니다',text:`${Object.entries(witness.assignment).map(([name,value])=>name+' = '+FDE_VALUES[value]).join(' · ')}. 이 평가에서 포함한 전제 ${count}개는 모두 T 또는 B인데, 목표 ${info.goal}는 ${FDE_VALUES[witness.goalValue]}입니다. 반례 평가가 있으므로 이 추론은 FDE에서 성립하지 않습니다. 현실의 참·거짓 판정은 아닙니다.`,status:'counterexample'};
    return {title:`FDE에서 ${info.goal}가 따라옵니다`,text:`가능한 ${semantic.checked}개 평가를 모두 비교했습니다. 전제 ${count}개가 지정값(T 또는 B)인 ${semantic.admissible}개 평가에서 목표도 항상 지정값입니다. 이는 이 유한 명제식의 FDE 의미론 확인입니다.`,status:'adapted'};
  }
  const scope=model==='ch'?'이 도표는 괴델·코언의 등록 정리를 사용하는 연결이며 정리 자체를 증명하거나 CH의 참·거짓을 계산하지 않습니다.':model==='sets'?'부분집합 정의·추이성·외연성의 제한된 적용이며 ZFC 전체의 증명기는 아닙니다.':'현재 가정과 고전 규칙 아래의 도출입니다. 현실의 진릿값을 판정하지 않습니다.';
  return {title:target?`현재 목표: ${info.goal}`:`목표 ${info.goal}의 경로를 찾지 못했습니다`,text:target?`${count}개 전제를 사용했습니다. ${target.rule==='premise'?'목표가 이미 포함한 전제입니다.':`${target.dependsOn.map(id=>id.replace('line-','')+'행').join(', ')}에서 ${info.proof.ruleLabels?.[target.rule]??target.rule} 규칙을 적용했습니다.`} ${scope}`:`이 규칙 모음에서 현재 목표로 가는 경로를 찾지 못했습니다. 다른 모든 증명의 불가능성이나 목표의 거짓을 뜻하지 않습니다. ${scope}`,status:target?'adapted':'unavailable'};
}
