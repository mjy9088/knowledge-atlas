export type LambdaType={kind:'atom';name:string}|{kind:'product';left:LambdaType;right:LambdaType}|{kind:'arrow';from:LambdaType;to:LambdaType};
export type LambdaTerm={kind:'var';name:string}|{kind:'lambda';name:string;annotation:LambdaType;body:LambdaTerm}|{kind:'apply';fn:LambdaTerm;arg:LambdaTerm}|{kind:'pair';left:LambdaTerm;right:LambdaTerm}|{kind:'fst';value:LambdaTerm}|{kind:'snd';value:LambdaTerm};
export interface LambdaInput {context?:string;term?:string;goal?:string}
export interface LambdaRow {term:string;type:string;rule:string}
export interface LambdaStep {term:string;rule:string}
export type LambdaAnalysis={valid:true;type:string;goal:string;matches:boolean|null;rows:LambdaRow[];trace:LambdaStep[];truncated:boolean;closed:boolean}|{valid:false;message:string;rows:[];trace:[]};
// Independently implemented annotated STLC with products. No host-language eval.
// Normal-order, full beta/projection reduction; finite diagnostics are not a prover.
const atom=(name:string):LambdaType=>({kind:'atom',name});
const same=(a:LambdaType,b:LambdaType)=>JSON.stringify(a)===JSON.stringify(b);
function tokens(text:string){
  if(typeof text!=='string'||text.length>512)throw new RangeError('입력은 512자 이하여야 합니다.');
  const normalized=text.replaceAll('->','→').replaceAll('×','*').replaceAll('\\','λ').replaceAll('⟨','<').replaceAll('⟩','>');
  const out=normalized.match(/[A-Za-z][A-Za-z0-9_]*|[λ→*():.,<>]|\S/gu)??[];
  if(out.length>160)throw new RangeError('식이 너무 큽니다.');
  return out;
}
function parser(text:string){
  const list=tokens(text);let pos=0;
  const peek=()=>list[pos],take=()=>list[pos++];
  function need(value:string){if(take()!==value)throw new SyntaxError(`${value} 기호가 필요합니다.`);}
  function name(){const n=take();if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(n??'')||['fst','snd'].includes(n))throw new SyntaxError('변수 이름이 필요합니다.');return n;}
  function typeAtom():LambdaType{if(peek()==='('){take();const t=type();need(')');return t;}return atom(name());}
  function product():LambdaType{let t=typeAtom();while(peek()==='*'){take();t={kind:'product',left:t,right:typeAtom()};}return t;}
  function type():LambdaType{const t=product();if(peek()==='→'){take();return {kind:'arrow',from:t,to:type()};}return t;}
  function termAtom():LambdaTerm{
    if(peek()==='('){take();const t=term();need(')');return t;}
    if(peek()==='<'){take();const left=term();need(',');const right=term();need('>');return {kind:'pair',left,right};}
    if(['fst','snd'].includes(peek()))return {kind:take() as 'fst'|'snd',value:termAtom()};
    return {kind:'var',name:name()};
  }
  function term():LambdaTerm{
    if(peek()==='λ'){take();const n=name();need(':');const annotation=type();need('.');return {kind:'lambda',name:n,annotation,body:term()};}
    let t=termAtom();while(peek()&& ![')',',','>'].includes(peek())){if(peek()==='λ')throw new SyntaxError('인수의 λ 식은 괄호로 묶으세요.');t={kind:'apply',fn:t,arg:termAtom()};}return t;
  }
  function finish<T>(value:T){if(pos!==list.length)throw new SyntaxError(`지원하지 않는 기호: ${peek()}`);return value;}
  return {type,term,finish,peek,take,name,need};
}
export function parseType(text:string):LambdaType{const p=parser(text);return p.finish(p.type());}
export function parseTerm(text:string):LambdaTerm{const p=parser(text);return p.finish(p.term());}
export function parseContext(text:string):Record<string,LambdaType>{
  const p=parser(text),context:Record<string,LambdaType>=Object.create(null);let count=0;
  while(p.peek()){
    const n=p.name();if(Object.hasOwn(context,n))throw new SyntaxError('같은 가정을 중복 선언할 수 없습니다.');
    p.need(':');context[n]=p.type();if(++count>8)throw new RangeError('가정은 8개까지 지원합니다.');
    if(p.peek()){p.need(',');if(!p.peek())throw new SyntaxError('쉼표 뒤에 가정이 필요합니다.');}
  }return context;
}
export function formatType(t:LambdaType):string{
  if(t.kind==='atom')return t.name;
  if(t.kind==='product')return `${t.left.kind==='arrow'?'('+formatType(t.left)+')':formatType(t.left)} × ${t.right.kind!=='atom'?'('+formatType(t.right)+')':formatType(t.right)}`;
  return `${t.from.kind==='arrow'?'('+formatType(t.from)+')':formatType(t.from)} → ${formatType(t.to)}`;
}
export function formatTerm(t:LambdaTerm):string{
  if(t.kind==='var')return t.name;
  if(t.kind==='lambda')return `λ${t.name}:${formatType(t.annotation)}. ${formatTerm(t.body)}`;
  if(t.kind==='pair')return `⟨${formatTerm(t.left)}, ${formatTerm(t.right)}⟩`;
  if(t.kind==='fst'||t.kind==='snd')return `${t.kind} (${formatTerm(t.value)})`;
  return `${t.fn.kind==='lambda'?'('+formatTerm(t.fn)+')':formatTerm(t.fn)} ${['apply','lambda'].includes(t.arg.kind)?'('+formatTerm(t.arg)+')':formatTerm(t.arg)}`;
}
function infer(t:LambdaTerm,context:Record<string,LambdaType>,rows:LambdaRow[]):LambdaType{
  let type:LambdaType,rule:string;
  if(t.kind==='var'){
    if(!Object.hasOwn(context,t.name))throw new TypeError(`${t.name}의 타입이 가정에 없습니다.`);
    type=context[t.name];rule='가정';
  }else if(t.kind==='lambda'){
    type={kind:'arrow',from:t.annotation,to:infer(t.body,{...context,[t.name]:t.annotation},rows)};rule='함수 만들기 · → 도입';
  }else if(t.kind==='apply'){
    const fn=infer(t.fn,context,rows),arg=infer(t.arg,context,rows);
    if(fn.kind!=='arrow')throw new TypeError(`${formatTerm(t.fn)}는 함수 타입이 아닙니다.`);
    if(!same(fn.from,arg))throw new TypeError(`인수 타입 불일치: ${formatType(fn.from)}가 필요하지만 ${formatType(arg)}입니다.`);
    type=fn.to;rule='함수 적용 · → 제거';
  }else if(t.kind==='pair'){
    type={kind:'product',left:infer(t.left,context,rows),right:infer(t.right,context,rows)};rule='쌍 만들기 · ∧ 도입';
  }else{
    const pair=infer(t.value,context,rows);if(pair.kind!=='product')throw new TypeError('fst/snd에는 쌍 타입이 필요합니다.');
    type=t.kind==='fst'?pair.left:pair.right;rule='쌍에서 꺼내기 · ∧ 제거';
  }
  rows.push({term:formatTerm(t),type:formatType(type),rule});return type;
}
function free(t:LambdaTerm,bound=new Set<string>(),result=new Set<string>()):Set<string>{
  if(t.kind==='var'){if(!bound.has(t.name))result.add(t.name);}
  else if(t.kind==='lambda')free(t.body,new Set([...bound,t.name]),result);
  else if(t.kind==='apply'){free(t.fn,bound,result);free(t.arg,bound,result);}
  else if(t.kind==='pair'){free(t.left,bound,result);free(t.right,bound,result);}
  else free(t.value,bound,result);
  return result;
}
function names(t:LambdaTerm,result=new Set<string>()):Set<string>{
  if('name' in t)result.add(t.name);
  for(const child of children(t))names(child,result);
  return result;
}
function substitute(t:LambdaTerm,x:string,value:LambdaTerm):LambdaTerm{
  if(t.kind==='var')return t.name===x?value:t;
  if(t.kind==='lambda'){
    if(t.name===x||!free(t.body).has(x))return t;
    let body=t.body,n=t.name;
    if(free(value).has(n)){
      const used=new Set([...names(body),...names(value),x]);let suffix=1;while(used.has(n+'_'+suffix))suffix++;
      const fresh=n+'_'+suffix;body=substitute(body,n,{kind:'var',name:fresh});n=fresh;
    }
    return {...t,name:n,body:substitute(body,x,value)};
  }
  return mapChildren(t,child=>substitute(child,x,value));
}
function step(t:LambdaTerm):{term:LambdaTerm;rule:string}|null{
  if(t.kind==='apply'&&t.fn.kind==='lambda')return {term:substitute(t.fn.body,t.fn.name,t.arg),rule:'β · 매개변수의 자유 출현을 인수로 치환'};
  if((t.kind==='fst'||t.kind==='snd')&&t.value.kind==='pair')return {term:t.kind==='fst'?t.value.left:t.value.right,rule:'쌍의 성분 선택'};
  for(const [key,child] of childEntries(t)){const next=step(child);if(next)return {term:{...t,[key]:next.term} as LambdaTerm,rule:next.rule};}
  return null;
}
export function analyzeLambda({context='',term='',goal=''}:LambdaInput={}):LambdaAnalysis{
  try{
    const gamma=parseContext(context),tree=parseTerm(term),rows:LambdaRow[]=[],type=infer(tree,gamma,rows),target=goal.trim()?parseType(goal):null;
    const trace=[{term:formatTerm(tree),rule:'입력'}];let current=tree,truncated=false;
    for(let i=0;i<24;i++){
      const next=step(current);if(!next)break;
      // Bound work/output before a duplicated term can grow without limit.
      const printed=formatTerm(next.term);if(printed.length>1800){truncated=true;break;}
      current=next.term;trace.push({term:printed,rule:next.rule});
      if(i===23)truncated=Boolean(step(current));
    }
    return {valid:true,type:formatType(type),goal:target?formatType(target):'',matches:target?same(type,target):null,rows,trace,truncated,closed:free(tree).size===0};
  }catch(error){return {valid:false,message:error instanceof Error?error.message:String(error),rows:[],trace:[]};}
}

type ChildKey='body'|'fn'|'arg'|'left'|'right'|'value';
function childEntries(t:LambdaTerm):[ChildKey,LambdaTerm][]{
 switch(t.kind){case 'lambda':return [['body',t.body]];case 'apply':return [['fn',t.fn],['arg',t.arg]];case 'pair':return [['left',t.left],['right',t.right]];case 'fst':case 'snd':return [['value',t.value]];default:return [];}
}
function children(t:LambdaTerm){return childEntries(t).map(([,v])=>v);}
function mapChildren(t:LambdaTerm,fn:(child:LambdaTerm)=>LambdaTerm):LambdaTerm{switch(t.kind){case 'lambda':return {...t,body:fn(t.body)};case 'apply':return {...t,fn:fn(t.fn),arg:fn(t.arg)};case 'pair':return {...t,left:fn(t.left),right:fn(t.right)};case 'fst':case 'snd':return {...t,value:fn(t.value)};default:return t;}}
