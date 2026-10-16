import type {Scene} from '/packages/content/types.js';
import {analyzeBinarySearch,type SearchAnalysis} from '/packages/models/binary-search.js';

export interface BinarySearchState {size:string;target:string;example:string;customized:boolean;step:number;prediction:string}
const EXAMPLES:Record<string,{size:string;target:string}>={thousand:{size:'1000',target:'2000'},observe:{size:'16',target:'26'},double:{size:'32',target:'52'},missing:{size:'16',target:'25'},transfer:{size:'1000',target:'1999'}};
const PREDICTIONS=['','10','100','1000'];
export function mountBinarySearchExperiment(container:HTMLElement,{onChange=()=>{}}:{onChange?:()=>void}={}){
  const doc=container.ownerDocument;
  function make<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''){const el=doc.createElement(tag);el.textContent=text;el.className=className;return el;}
  container.className='binary-experiment';
  const controls=make('div','','binary-controls');
  function field(title:string){const label=make('label',title),input=make('input');input.type='text';input.inputMode='numeric';input.maxLength=16;input.setAttribute('aria-label',title);label.append(input);controls.append(label);return input;}
  const size=field('목록 개수');size.parentElement!.firstChild!.textContent='목록 개수 · 1–1024';
  const target=field('찾을 값');
  const predictionLabel=make('label','예상 횟수 · 선택'),prediction=make('select');prediction.setAttribute('aria-label','예상 횟수');
  for(const [value,text]of [['','건너뛰기'],['10','10회'],['100','100회'],['1000','1000회']]){const option=make('option',text);option.value=value;prediction.append(option);}predictionLabel.append(prediction);controls.append(predictionLabel);
  const scope=make('p','','binary-scope'),display=make('section','','binary-display');
  const summary=make('strong','','binary-summary'),bar=make('div','','binary-bar'),segment=make('span','','binary-segment');bar.append(segment);bar.setAttribute('role','img');
  const endpoints=make('div','','binary-endpoints'),left=make('span'),right=make('span');endpoints.append(left,right);
  const observation=make('p','','binary-observation'),pivot=make('p','','binary-pivot'),history=make('p','','binary-history');summary.setAttribute('aria-live','polite');
  const navigation=make('nav','','binary-navigation'),previous=make('button','한 비교 이전'),next=make('button','한 번 비교'),reset=make('button','장면 예시로');navigation.setAttribute('aria-label','탐색 비교 단계');for(const button of [previous,next,reset])button.type='button';navigation.append(previous,next,reset);
  display.append(summary,bar,endpoints,pivot,observation,history,navigation);container.append(controls,scope,display);
  let baseline='thousand',state:BinarySearchState={...EXAMPLES.thousand,example:'thousand',customized:false,step:0,prediction:''},result:SearchAnalysis=analyzeBinarySearch(state);
  function sync(){
    size.value=state.size;target.value=state.target;prediction.value=state.prediction;result=analyzeBinarySearch(state);
    display.dataset.valid=String(result.valid);reset.disabled=!state.customized;previous.disabled=state.step===0;
    for(const el of [bar,endpoints,pivot,observation,history])el.hidden=!result.valid;
    if(!result.valid){summary.textContent='입력을 확인하세요';scope.textContent=result.message;next.disabled=true;return;}
    const frame=result.frames[state.step];
    scope.textContent=`오름차순 짝수 목록: 2, 4, …, ${2*result.size} · 한 번은 목록 값 하나와의 비교입니다.`;
    summary.textContent=`${frame.comparisons}회 비교 · ${frame.status==='found'?'찾았습니다':frame.status==='absent'?'목록에 없습니다':`후보 ${frame.remaining}개`}`;
    segment.hidden=frame.remaining===0;segment.style.left=`${100*frame.low/result.size}%`;segment.style.width=`${100*frame.remaining/result.size}%`;
    bar.setAttribute('aria-label',`전체 ${result.size}개 중 ${frame.remaining}개 남음${frame.remaining?`, ${frame.low+1}–${frame.high+1}번째`:''}`);bar.dataset.status=frame.status;
    left.textContent='첫 값 2';right.textContent=`끝 값 ${2*result.size}`;
    const middle=frame.low+Math.floor((frame.high-frame.low)/2);
    pivot.textContent=frame.status==='searching'?`남은 범위 ${2*(frame.low+1)}–${2*(frame.high+1)} · 다음 가운데 값 ${result.values[middle]}`:frame.status==='found'?`찾은 값 ${result.values[frame.probe!]} · ${frame.probe!+1}번째`:'후보 범위가 비었습니다';
    observation.textContent=frame.probe===null?`찾을 값 ${result.target}. ‘한 번 비교’를 누르면 어느 쪽이 남을까요?`:`${result.target} ${frame.relation==='less'?'<':frame.relation==='greater'?'>':'='} ${result.values[frame.probe]} → ${frame.status==='found'?'같으므로 종료':frame.relation==='less'?'비교한 값과 그 오른쪽을 제외':'비교한 값과 그 왼쪽을 제외'}`;
    history.textContent=`남은 개수: ${result.frames.slice(0,state.step+1).map(row=>row.remaining).join(' → ')}${frame.status==='found'?' (마지막 1개는 찾은 값)':''}`;
    if(frame.status!=='searching'&&state.prediction)history.textContent+=` · 예상 ${state.prediction}회 / 실제 ${frame.comparisons}회`;
    next.disabled=state.step>=result.frames.length-1;
  }
  function load(id:string){state={...EXAMPLES[id],example:id,customized:false,step:0,prediction:''};sync();}
  function edit(){state={...state,size:size.value,target:target.value,prediction:prediction.value,customized:true,step:0};sync();onChange();}
  size.addEventListener('input',edit);target.addEventListener('input',edit);prediction.addEventListener('change',edit);
  previous.addEventListener('click',()=>{state={...state,step:state.step-1,customized:true};sync();onChange();});
  next.addEventListener('click',()=>{state={...state,step:state.step+1,customized:true};sync();onChange();});
  reset.addEventListener('click',()=>{load(baseline);onChange();});sync();
  return {
    getState:()=>({...state}),
    validateState(value:BinarySearchState){
      if(!value||typeof value.example!=='string'||!Object.hasOwn(EXAMPLES,value.example)||typeof value.customized!=='boolean'||typeof value.size!=='string'||typeof value.target!=='string'||value.size.length>16||value.target.length>16||!PREDICTIONS.includes(value.prediction))throw new TypeError('Invalid binary search state');
      const analysis=analyzeBinarySearch(value);if(!Number.isInteger(value.step)||value.step<0||value.step>=Math.max(1,analysis.frames.length))throw new RangeError('Invalid binary search step');
    },
    setState(value:BinarySearchState){this.validateState(value);state={size:value.size,target:value.target,example:value.example,customized:value.customized,step:value.step,prediction:value.prediction};sync();onChange();},
    suggest(suggestion?:Scene['suggestion']){if(suggestion&&!('example'in suggestion))throw new TypeError('Expected binary search example');const id=suggestion?.example??baseline;if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown binary search example');const changed=baseline!==id;baseline=id;if(!state.customized&&changed)load(id);},
    reset(){load(baseline);},
    seek(ms:number){if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid time');state={...state,customized:true,step:result.valid?Math.min(Math.floor(ms/1000),result.frames.length-1):0};sync();onChange();},
    inspect:()=>({...state,result:structuredClone(result)}),
    describe(scene:Scene){
      if(!result.valid)return {status:'invalid',text:`${result.message} 이전 탐색의 결과와 해설은 적용하지 않습니다.`};
      const frame=result.frames[state.step],progress=`현재 ${result.size}개에서 ${result.target} 찾기: ${frame.comparisons}회 비교, ${frame.status==='found'?'찾음':frame.status==='absent'?'후보 없음':`후보 ${frame.remaining}개`}.`;
      const explanations:Record<string,string>={question:'몇 번이면 찾을지 예상한 뒤 한 번씩 비교해 보세요. 정렬 비용은 세지 않습니다.',observe:'비교 결과로 남긴 쪽을 보세요. 작은 값들은 왼쪽, 큰 값들은 오른쪽에 있으므로 반대쪽을 제외합니다.',explain:'찾을 값이 목록에 있다면 남은 후보 범위 안에 있다는 조건을 유지합니다. 같은 값을 만나면 즉시 끝납니다.',double:`이 개수에서 최악의 비교 횟수는 ${result.maxComparisons}회입니다. 목록을 두 배로 바꿔 상한을 비교해 보세요.`,missing:'짝수 목록에서 홀수를 찾아 보세요. 찾지 못했다는 결론은 후보가 0개가 되었을 때 나옵니다.',transfer:'이 방법으로 뒤섞인 목록도 반씩 제외할 수 있을까요? 제외한 쪽에 답이 없다는 근거인 정렬이 필요합니다.'};
      return {status:'adapted',text:`${progress} ${explanations[scene.id]??explanations.observe}`};
    },
  };
}
