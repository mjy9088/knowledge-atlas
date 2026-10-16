import type {ProofInput,ProofResult} from '../models/types.js';
export interface PremiseRow {formula:string;enabled:boolean}
export interface ExperimentInput {premises:PremiseRow[];goal:string}
export interface ExperimentDraft {premises:(string|PremiseRow)[];goal:string;customized?:boolean}
export interface ExperimentState extends ExperimentInput {customized:boolean}
export type DeriveAdapter=(input:ProofInput)=>ProofResult;
export type ExperimentEvaluation={valid:true;premises:string[];goal:string;proof:ProofResult;error:null}|{valid:false;premises:string[];goal:string;proof:null;error:string};
export type ExperimentInspection=ExperimentEvaluation & {input:ExperimentInput;suggestion:ExperimentInput;customized:boolean};
import {deriveProof,LIMITS} from '../models/propositional.js';
import {displayFormula} from './formula-display.js';
const copy=<T>(value:T):T=>structuredClone(value);

export function normalizeExperimentInput(input:ExperimentDraft):ExperimentInput{
  if(!input||!Array.isArray(input.premises)||input.premises.length>LIMITS.premises||typeof input.goal!=='string')throw new TypeError('전제는 최대 8개, 목표는 명제식 문자열이어야 합니다.');
  const premises=input.premises.map(row=>{
    if(typeof row==='string')return {formula:displayFormula(row),enabled:true};
    if(!row||typeof row.formula!=='string'||typeof row.enabled!=='boolean')throw new TypeError('전제의 식과 포함 여부를 확인하세요.');
    return {formula:displayFormula(row.formula),enabled:row.enabled};
  });
  return {premises,goal:displayFormula(input.goal)};
}
export function evaluateExperimentInput(input:ExperimentDraft,derive:DeriveAdapter=deriveProof):ExperimentEvaluation{
  const draft=normalizeExperimentInput(input),premises=draft.premises.filter(row=>row.enabled).map(row=>row.formula.trim()),goal=draft.goal.trim();
  try{
    if(!goal||premises.some(formula=>!formula))throw new SyntaxError('포함한 전제와 목표의 식을 완성하세요.');
    const proof=derive({premises,goal});
    return {valid:true,premises,goal:proof.goal,proof,error:null};
  }catch(error){return {valid:false,premises,goal,proof:null,error:displayFormula(error instanceof Error?error.message:String(error))};}
}
export function createPremiseExperiment({suggestion,onChange,derive=deriveProof}:{suggestion:ExperimentDraft;onChange?:(value:ExperimentInspection)=>void;derive?:DeriveAdapter}){
  let baseline=normalizeExperimentInput(suggestion),input=copy(baseline),customized=false;
  const getState=()=>({...copy(input),customized});
  const inspect=()=>({...evaluateExperimentInput(input,derive),input:copy(input),suggestion:copy(baseline),customized});
  const notify=()=>onChange?.(inspect());
  return {getState,inspect,
    setState(next:ExperimentDraft){const checked=normalizeExperimentInput(next);if(next.customized!==undefined&&typeof next.customized!=='boolean')throw new TypeError('customized must be boolean');input=checked;customized=next.customized??true;notify();},
    suggest(next:ExperimentDraft){baseline=normalizeExperimentInput(next);if(!customized)input=copy(baseline);notify();},
    reset(){input=copy(baseline);customized=false;notify();}
  };
}
