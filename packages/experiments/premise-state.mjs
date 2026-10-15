import {deriveProof,LIMITS} from '../models/propositional.mjs';
import {displayFormula} from './formula-display.mjs';
const copy=value=>structuredClone(value);

export function normalizeExperimentInput(input){
  if(!input||!Array.isArray(input.premises)||input.premises.length>LIMITS.premises||typeof input.goal!=='string')throw new TypeError('전제는 최대 8개, 목표는 명제식 문자열이어야 합니다.');
  const premises=input.premises.map(row=>{
    if(typeof row==='string')return {formula:displayFormula(row),enabled:true};
    if(!row||typeof row.formula!=='string'||typeof row.enabled!=='boolean')throw new TypeError('전제의 식과 포함 여부를 확인하세요.');
    return {formula:displayFormula(row.formula),enabled:row.enabled};
  });
  return {premises,goal:displayFormula(input.goal)};
}
export function evaluateExperimentInput(input,derive=deriveProof){
  const draft=normalizeExperimentInput(input),premises=draft.premises.filter(row=>row.enabled).map(row=>row.formula.trim()),goal=draft.goal.trim();
  try{
    if(!goal||premises.some(formula=>!formula))throw new SyntaxError('포함한 전제와 목표의 식을 완성하세요.');
    const proof=derive({premises,goal});
    return {valid:true,premises,goal:proof.goal,proof,error:null};
  }catch(error){return {valid:false,premises,goal,proof:null,error:displayFormula(error.message)};}
}
export function createPremiseExperiment({suggestion,onChange,derive=deriveProof}={}){
  let baseline=normalizeExperimentInput(suggestion),input=copy(baseline),customized=false;
  const getState=()=>({...copy(input),customized});
  const inspect=()=>({...evaluateExperimentInput(input,derive),input:copy(input),suggestion:copy(baseline),customized});
  const notify=()=>onChange?.(inspect());
  return {getState,inspect,
    setState(next){const checked=normalizeExperimentInput(next);if(next.customized!==undefined&&typeof next.customized!=='boolean')throw new TypeError('customized must be boolean');input=checked;customized=next.customized??true;notify();},
    suggest(next){baseline=normalizeExperimentInput(next);if(!customized)input=copy(baseline);notify();},
    reset(){input=copy(baseline);customized=false;notify();}
  };
}
