import type {Scene} from '/packages/content/types.js';
import type {LambdaAnalysis} from '/packages/models/typed-lambda.js';
export interface LambdaState {context:string;term:string;goal:string;example:string;customized:boolean;step:number;rule:number}
interface LambdaExample {label:string;context:string;term:string;goal:string}
import {analyzeLambda} from '/packages/models/typed-lambda.js';

const EXAMPLES:Record<string,LambdaExample>={
  identity:{label:'항등 함수',context:'',term:'λx:A. x',goal:'A → A'},
  apply:{label:'함수와 가정',context:'f:A→B, a:A',term:'f a',goal:'B'},
  beta:{label:'직접 적용',context:'a:A',term:'(λx:A. x) a',goal:'A'},
  compose:{label:'함수 합성 계산',context:'h:B→C, k:A→B, a:A',term:'(λf:B→C. λg:A→B. λx:A. f (g x)) h k a',goal:'C'},
  'compose-proof':{label:'함수 합성 증명',context:'f:A→B, g:B→C',term:'λx:A. g (f x)',goal:'A→C'},
  pair:{label:'쌍 만들기',context:'a:A, b:B',term:'<a,b>',goal:'A×B'},
  projection:{label:'쌍에서 꺼내기',context:'a:A, b:B',term:'fst <a,b>',goal:'A'},
  shadowing:{label:'같은 이름의 안쪽 변수',context:'a:A',term:'(λx:A. λx:B. x) a',goal:'B→B'},
  capture:{label:'변수 이름 충돌',context:'y:A',term:'(λx:A. λy:B. x) y',goal:'B→A'},
  mismatch:{label:'다른 타입의 인수',context:'f:A→B, x:C',term:'f x',goal:'B'},
  'self-application':{label:'자기 적용',context:'',term:'λx:A. x x',goal:''},
};
export function mountLambdaExperiment(container:HTMLElement,{onChange=()=>{}}:{onChange?:()=>void}={}){
  const doc=container.ownerDocument,make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string|null,cls?:string)=>{const el=doc.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
  container.className='lambda-experiment';
  const controls=make('div',null,'lambda-examples'),label=make('label','비교할 예제'),select=make('select');select.setAttribute('aria-label','비교할 예제');
  for(const [id,example]of Object.entries(EXAMPLES)){const o=make('option',example.label);o.value=id;select.append(o);}
  label.append(select);const resetButton=make('button','장면 예시로');resetButton.type='button';controls.append(label,resetButton);
  const editor=make('div',null,'lambda-editor');
  function input(label:string,name:string,multiline=false){const wrap=make('label',label),el=make(multiline?'textarea':'input');if(el instanceof HTMLInputElement)el.type='text';else el.rows=2;el.maxLength=512;el.spellcheck=false;el.setAttribute('aria-label',name);wrap.append(el);editor.append(wrap);return el;}
  const context=input('가정 · 이름:타입','타입 가정'),term=input('식 · λ는 함수, 공백은 적용','람다 식',true),goal=input('확인할 타입 · 선택 사항','확인할 타입');
  const syntax=make('p','타입 A·B·C, →, × / 식 λx:A. x, f a, <a,b>, fst p, snd p','lambda-syntax');
  const output=make('section',null,'lambda-output'),judgment=make('p',null,'lambda-judgment'),detail=make('p',null,'lambda-detail');judgment.setAttribute('aria-live','polite');
  const body=make('div',null,'lambda-results'),typing=make('div',null,'lambda-typing'),ruleLabel=make('p',null,'lambda-rule'),ruleTerm=make('p',null,'lambda-rule-term'),ruleControls=make('nav');
  const rulePrev=make('button','규칙 이전'),ruleNext=make('button','규칙 다음');rulePrev.type=ruleNext.type='button';ruleControls.setAttribute('aria-label','타입 유도 단계');ruleControls.append(rulePrev,ruleNext);typing.append(ruleLabel,ruleTerm,ruleControls);
  const reduction=make('div',null,'lambda-reduction'),stepLabel=make('p'),stepTerm=make('p',null,'lambda-step-term'),stepControls=make('nav');stepControls.setAttribute('aria-label','계산 단계');
  const prev=make('button','계산 이전'),next=make('button','한 단계 계산');prev.type=next.type='button';stepControls.append(prev,next);reduction.append(stepLabel,stepTerm,stepControls);body.append(typing,reduction);output.append(judgment,detail,body);container.append(controls,editor,syntax,output);
  let baseline='identity',state:LambdaState={...EXAMPLES.identity,example:'identity',customized:false,step:0,rule:0},result:LambdaAnalysis=analyzeLambda({});
  function sync(){
    context.value=state.context;term.value=state.term;goal.value=state.goal;select.value=state.example;resetButton.disabled=!state.customized;
    result=analyzeLambda(state);output.dataset.valid=String(result.valid);
    judgment.textContent=result.valid?`현재 타입: ${result.type}${result.matches===null?'':result.matches?' · 목표와 일치':' · 목표와 다름'}`:'현재 식을 확인할 수 없습니다';
    detail.textContent=result.valid?`${result.closed?'외부 가정 없는 식':'가정에 의존하는 식'} · 타입 검사는 지정한 규칙에 한정됩니다.`:result.message;
    body.hidden=!result.valid;
    if(result.valid){
      const row=result.rows[state.rule],step=result.trace[state.step];
      ruleLabel.textContent=`타입 유도 ${state.rule+1}/${result.rows.length} · ${row.rule}`;ruleTerm.textContent=`${row.term} : ${row.type}`;
      stepLabel.textContent=`계산 ${state.step}/${result.trace.length-1} · ${step.rule}`;stepTerm.textContent=step.term;
      rulePrev.disabled=state.rule===0;ruleNext.disabled=state.rule===result.rows.length-1;prev.disabled=state.step===0;next.disabled=state.step===result.trace.length-1;
      if(result.trace.length===1)stepLabel.textContent='계산할 β·성분 선택 단계 없음';
      if(result.truncated)detail.textContent+=' 계산 표시 한도에 도달했습니다. 종료 불가능 판정이 아닙니다.';
    }
  }
  function load(id:string,customized:boolean){if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown lambda example');const {context,term,goal}=EXAMPLES[id];state={context,term,goal,example:id,customized,step:0,rule:0};sync();}
  function edit(){state={...state,context:context.value,term:term.value,goal:goal.value,customized:true,step:0,rule:0};sync();onChange();}
  for(const el of [context,term,goal])el.addEventListener('input',edit);
  select.addEventListener('change',()=>{load(select.value,true);onChange();});
  resetButton.addEventListener('click',()=>{load(baseline,false);onChange();});
  function move(key:'step'|'rule',delta:number){state[key]+=delta;sync();onChange();}
  prev.addEventListener('click',()=>move('step',-1));next.addEventListener('click',()=>move('step',1));rulePrev.addEventListener('click',()=>move('rule',-1));ruleNext.addEventListener('click',()=>move('rule',1));
  load('identity',false);
  return {
    getState:()=>({...state}),
    validateState(next:LambdaState){
      if(!next||!Object.hasOwn(EXAMPLES,next.example)||typeof next.customized!=='boolean'||!['context','term','goal'].every(k=>typeof next[k as 'context'|'term'|'goal']==='string'&&next[k as 'context'|'term'|'goal'].length<=512))throw new TypeError('Invalid lambda state');
      const analysis=analyzeLambda(next);
      for(const [key,rows]of [['step',analysis.trace],['rule',analysis.rows]] as const)if(!Number.isInteger(next[key])||next[key]<0||next[key]>=Math.max(1,rows.length))throw new RangeError('Unknown lambda step');
    },
    setState(next:LambdaState){
      this.validateState(next);
      state={context:next.context,term:next.term,goal:next.goal,example:next.example,customized:next.customized,step:next.step,rule:next.rule};sync();onChange();
    },
    suggest(suggestion?:Scene['suggestion']){if(suggestion&&!('example' in suggestion))throw new TypeError('Expected lambda suggestion');const id=suggestion?.example??baseline;if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown lambda suggestion');const changed=baseline!==id;baseline=id;if(!state.customized&&changed)load(id,false);},
    reset(){load(baseline,false);},
    seek(ms:number){if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid time');},
    inspect:()=>({...state,result:structuredClone(result)}),
    describe(){
      if(!result.valid)return {status:'invalid',text:`현재 식: ${state.term||'(비어 있음)'}. ${result.message} 기본 예시의 해설은 이 입력에 적용하지 않습니다. 식이나 타입 가정을 수정하세요.`};
      const step=result.trace[state.step];
      return {status:'adapted',text:`현재 식의 타입은 ${result.type}입니다.${result.matches===false?' 지정한 목표 타입 '+result.goal+'과 다릅니다.':''} ${result.closed?'외부 가정 없이 타입을 유도합니다.':'입력한 타입 가정 아래에서의 결과입니다.'} ${result.trace.length>1?`계산 ${state.step}단계: ${step.term}.`:'현재 식에는 줄일 β·성분 선택 단계가 없습니다.'} 타입 유도와 계산 버튼으로 근거를 확인하세요.`};
    },
  };
}
