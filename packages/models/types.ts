export type Formula = {type:'atom';name:string}|{type:'bottom'}|{type:'not';operand:Formula}|{type:'and'|'or'|'implies';left:Formula;right:Formula};
export interface ProofLine {id:string;formula:string;rule:string;dependsOn:string[]}
export interface FDESemantics {kind:'FDE';checked:number;admissible:number;counterexample:null|{assignment:Record<string,number>;premiseValues:number[];goalValue:number}}
interface ProofResultFields {lines:ProofLine[];goal:string;limitReached:boolean;exhausted?:boolean;limitations?:string[];ruleLabels?:Record<string,string>;semantics?:FDESemantics;registeredTheorems?:boolean}
export interface ProofInput {premises:string[];goal:string;maxSteps?:number}

export type ProofResult=ProofResultFields & ({goalReached:true}|{goalReached:false});
