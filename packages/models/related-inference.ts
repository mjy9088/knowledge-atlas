import type {Formula,ProofInput,ProofLine,ProofResult,FDESemantics} from './types.js';
import {parseFormula,formatFormula,LIMITS} from './propositional.js';
export const RELATED_RULE_LABELS={
  'fde-entailment':'FDE 지정값 보존 확인',
  'set-membership':'부분집합 정의 · 원소 전달',
  'set-transitivity':'부분집합 추이성',
  'set-extensionality':'상호 포함 · 외연성',
  'ch-godel':'괴델 상대일관성 정리 적용',
  'ch-cohen':'코언 상대일관성 정리 적용',
  'ch-not-negative':'CH 확장의 일관성에서',
  'ch-not-positive':'¬CH 확장의 일관성에서',
  'ch-independent':'양쪽 비증명 결합'
};
export const FDE_VALUES=['N · 어느 쪽도 아님','T · 참 쪽만','F · 거짓 쪽만','B · 양쪽 모두'];
export function evaluateFDE(ast:Formula,assignment:Record<string,number>):number{
  if(ast.type==='atom'){const value=assignment[ast.name];if(![0,1,2,3].includes(value))throw new TypeError('Unknown FDE value');return value;}
  if(ast.type==='not'){const v=evaluateFDE(ast.operand,assignment);return ((v&1)<<1)|((v&2)>>1);}
  if(ast.type!=='and'&&ast.type!=='or')throw new SyntaxError('FDE 예시는 ¬, ∧, ∨만 지원합니다. →와 ⊥는 입력하지 마세요.');
  const a=evaluateFDE(ast.left,assignment),b=evaluateFDE(ast.right,assignment);
  return ast.type==='and'?((a&b)&1)|((a|b)&2):((a|b)&1)|((a&b)&2);
}
function graph(goal:string){
  const lines:ProofLine[]=[],known=new Map<string,ProofLine>();let limitReached=false;
  const add=(formula:string,rule:string,dependsOn:ProofLine[]=[])=>{
    if(known.has(formula))return known.get(formula)!;
    if(lines.length>=64){limitReached=true;return null;}
    const line={id:'line-'+(lines.length+1),formula,rule,dependsOn:dependsOn.map(line=>line.id)};
    lines.push(line);known.set(formula,line);return line;
  };
  return {lines,known,add,result(extra:Partial<ProofResult>={}):ProofResult{return {goal,lines,goalReached:known.has(goal),limitReached,ruleLabels:RELATED_RULE_LABELS,...extra};}};
}
function checkInput(premises:string[],goal:string){
  if(!Array.isArray(premises)||premises.length>LIMITS.premises||typeof goal!=='string'||!goal.trim())throw new TypeError('전제는 최대 8개이며 목표를 입력해야 합니다.');
  if([...premises,goal].some(value=>typeof value!=='string'||!value.trim()||value.length>LIMITS.characters))throw new TypeError('비어 있거나 너무 긴 식입니다.');
}
export function deriveFDE({premises,goal}:ProofInput):ProofResult{
  checkInput(premises,goal);
  const parsed=premises.map(parseFormula),target=parseFormula(goal),atoms=new Set<string>();
  function visit(ast:Formula):void{if(ast.type==='atom')atoms.add(ast.name);else if(ast.type==='not')visit(ast.operand);else if(ast.type==='and'||ast.type==='or'){visit(ast.left);visit(ast.right);}else throw new SyntaxError('FDE 예시는 ¬, ∧, ∨만 지원합니다.');}
  [...parsed,target].forEach(visit);if(atoms.size>5)throw new RangeError('FDE 전수 비교는 서로 다른 명제 기호 5개까지 지원합니다.');
  const names=[...atoms].sort(),g=graph(formatFormula(target));parsed.forEach(ast=>g.add(formatFormula(ast),'premise'));
  let counterexample:FDESemantics['counterexample']=null,checked=0,admissible=0;
  for(let i=0;i<4**names.length;i++){
    const assignment=Object.fromEntries(names.map((name,j)=>[name,(i>>2*j)&3]));checked++;
    if(parsed.every(ast=>evaluateFDE(ast,assignment)&1)){
      admissible++;
      if(!(evaluateFDE(target,assignment)&1)&&!counterexample)counterexample={assignment,premiseValues:parsed.map(ast=>evaluateFDE(ast,assignment)),goalValue:evaluateFDE(target,assignment)};
    }
  }
  if(!counterexample)g.add(formatFormula(target),'fde-entailment',[...g.lines]);
  return g.result({semantics:{kind:'FDE',checked,admissible,counterexample}});
}
export function parseSetStatement(value:string){
  const match=/^([A-Z][A-Z0-9_]{0,15})\s*(∈|⊆|=)\s*([A-Z][A-Z0-9_]{0,15})$/.exec(value.trim());
  if(!match)throw new SyntaxError('집합 예시: X ∈ A, A ⊆ B, A = B 형태를 사용하세요. ∈와 ⊆는 다른 관계입니다.');
  return {left:match[1],op:match[2],right:match[3],formula:`${match[1]} ${match[2]} ${match[3]}`};
}
export function deriveSetRelations({premises,goal}:ProofInput):ProofResult{
  checkInput(premises,goal);const parsed=premises.map(parseSetStatement),target=parseSetStatement(goal),g=graph(target.formula);
  parsed.forEach(statement=>g.add(statement.formula,'premise'));
  for(let pass=0;pass<64;pass++){
    const before=g.lines.length,snapshot=g.lines.map(line=>({...parseSetStatement(line.formula),line}));
    for(const a of snapshot)for(const b of snapshot){
      if(a.op==='∈'&&b.op==='⊆'&&a.right===b.left)g.add(`${a.left} ∈ ${b.right}`,'set-membership',[a.line,b.line]);
      if(a.op==='⊆'&&b.op==='⊆'&&a.right===b.left){
        g.add(`${a.left} ⊆ ${b.right}`,'set-transitivity',[a.line,b.line]);
        if(a.left===b.right)g.add(`${a.left} = ${a.right}`,'set-extensionality',[a.line,b.line]);
      }
    }
    if(g.lines.length===before||g.known.has(target.formula))break;
  }
  return g.result();
}
const META=['Con(ZFC)','Con(ZFC+CH)','Con(ZFC+¬CH)','ZFC ⊬ CH','ZFC ⊬ ¬CH','Ind(CH,ZFC)','CH','¬CH'];
function meta(value:string){const text=value.replace(/\s/g,'');const found=META.find(item=>item.replace(/\s/g,'')===text);if(!found)throw new SyntaxError('사용 가능한 식: '+META.join(' · '));return found;}
export function deriveCHConnections({premises,goal}:ProofInput):ProofResult{
  checkInput(premises,goal);const target=meta(goal),g=graph(target);premises.map(meta).forEach(formula=>g.add(formula,'premise'));
  const consistency=g.known.get('Con(ZFC)');
  if(consistency){g.add('Con(ZFC+CH)','ch-godel',[consistency]);g.add('Con(ZFC+¬CH)','ch-cohen',[consistency]);}
  if(g.known.has('Con(ZFC+CH)'))g.add('ZFC ⊬ ¬CH','ch-not-negative',[g.known.get('Con(ZFC+CH)')!]);
  if(g.known.has('Con(ZFC+¬CH)'))g.add('ZFC ⊬ CH','ch-not-positive',[g.known.get('Con(ZFC+¬CH)')!]);
  if(g.known.has('ZFC ⊬ CH')&&g.known.has('ZFC ⊬ ¬CH'))g.add('Ind(CH,ZFC)','ch-independent',[g.known.get('ZFC ⊬ CH')!,g.known.get('ZFC ⊬ ¬CH')!]);
  return g.result({registeredTheorems:true});
}
