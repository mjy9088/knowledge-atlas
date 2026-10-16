import type {Scene} from '/packages/content/types.js';
import {DEFAULT_BASE_RATES,evaluateBaseRates,validateBaseRates,type BaseRatesInput,type BaseRatesResult} from '/packages/models/base-rates.js';

interface RateDraft {prevalence:string;sensitivity:string;falseAlarmRate:string}
export interface BaseRatesState extends BaseRatesInput { example:string; customized:boolean; prediction:string; draft:RateDraft|null }
const EXAMPLES:Record<string,BaseRatesInput>={question:{...DEFAULT_BASE_RATES},predict:{...DEFAULT_BASE_RATES},observe:{...DEFAULT_BASE_RATES},denominator:{...DEFAULT_BASE_RATES},common:{...DEFAULT_BASE_RATES,prevalence:.1},transfer:{...DEFAULT_BASE_RATES,prevalence:.1}};
const PREDICTIONS=['','under-half','over-half','unsure'];
const count=(n:number)=>n>0&&n<.001?n.toExponential(2):n.toLocaleString('ko-KR',{maximumSignificantDigits:6});
const percent=(n:number)=>n>0&&n*100<.01?`${(n*100).toExponential(2)}%`:`${(n*100).toLocaleString('ko-KR',{maximumFractionDigits:2})}%`;
export function mountBaseRatesExperiment(container:HTMLElement,{onChange=()=>{}}:{onChange?:()=>void}={}){
  const doc=container.ownerDocument,make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{const el=doc.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
  container.className='base-rates-experiment';
  const heading=make('p','가상 공장 · 10,000개로 환산한 기대 개수','base-rates-scope');
  const controls=make('div',undefined,'base-rates-controls');
  function field(label:string){const wrap=make('label',label),input=make('input');input.type='number';input.min='0';input.max='100';input.step='any';input.setAttribute('aria-label',label);wrap.append(input);controls.append(wrap);return input;}
  const prevalence=field('불량 비율 (%)'),sensitivity=field('불량 중 경보 (%)'),falseAlarm=field('정상 중 경보 (%)');
  const predictionWrap=make('label','예상 · 건너뛰어도 됩니다'),prediction=make('select');prediction.setAttribute('aria-label','경보 중 불량 비율 예상');
  for(const [value,label]of [['','선택 안 함'],['under-half','절반보다 적다'],['over-half','절반 이상이다'],['unsure','아직 모르겠다']]){const option=make('option',label);option.value=value;prediction.append(option);}predictionWrap.append(prediction);
  const resetButton=make('button','장면 예시로');resetButton.type='button';const actions=make('div',undefined,'base-rates-actions');actions.append(predictionWrap,resetButton);
  const prompt=make('p',undefined,'base-rates-prompt'),output=make('div',undefined,'base-rates-output'),table=make('table');table.setAttribute('aria-label','불량 여부와 경보 여부의 기대 개수');
  const caption=make('caption','기대 개수 · 관측 자료가 아닙니다');table.append(caption);const thead=make('thead'),headrow=make('tr');for(const text of ['','불량','정상']){const th=make('th',text);th.scope='col';headrow.append(th);}thead.append(headrow);table.append(thead);
  const body=make('tbody'),cells:HTMLTableCellElement[]=[];for(const rowLabel of ['경보','경보 없음']){const row=make('tr'),th=make('th',rowLabel);th.scope='row';row.append(th);for(let i=0;i<2;i++){const cell=make('td');cells.push(cell);row.append(cell);}body.append(row);}table.append(body);
  const answer=make('p',undefined,'base-rates-answer');answer.setAttribute('aria-live','polite');output.append(table,answer);container.append(heading,controls,actions,prompt,output);
  let baseline='question',state:BaseRatesState={...DEFAULT_BASE_RATES,example:'question',customized:false,prediction:'',draft:null},result:BaseRatesResult|null=null;
  const detached=()=>({...state,draft:state.draft?{...state.draft}:null});
  function invalidDraft(draft:RateDraft){return [draft.prevalence,draft.sensitivity,draft.falseAlarmRate].some(value=>value.trim()===''||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>100);}
  function sync(){
    prevalence.value=state.draft?.prevalence??String(state.prevalence*100);sensitivity.value=state.draft?.sensitivity??String(state.sensitivity*100);falseAlarm.value=state.draft?.falseAlarmRate??String(state.falseAlarmRate*100);prediction.value=state.prediction;
    heading.textContent=`가상 공장 · ${count(state.population)}개로 환산한 기대 개수`;
    resetButton.disabled=!state.customized;
    const early=baseline==='question'||baseline==='predict';predictionWrap.hidden=!early;
    prompt.textContent=early?'경보가 울린 제품 중 불량은 절반 이상일까요? 예상한 뒤 다음 장면에서 표를 보세요.':'경보 행에서 불량 칸과 정상 칸을 비교해 보세요.';
    output.hidden=early||state.draft!==null;result=state.draft?null:evaluateBaseRates(state);
    if(!result){for(const cell of cells)cell.textContent='—';answer.textContent='';prompt.textContent='각 비율에 0~100의 수를 입력하세요. 이전 결과는 지웠습니다.';return;}
    for(const [cell,value]of cells.map((cell,i)=>[cell,[result!.trueAlerts,result!.falseAlerts,result!.missed,result!.correctRejections][i]] as const))cell.textContent=count(value);
    answer.textContent=result.probability===null?'경보가 0개여서 경보 중 불량 비율은 정의되지 않습니다.':`경보 중 불량: ${count(result.trueAlerts)} ÷ ${count(result.alerts)} ≈ ${percent(result.probability)}`;
  }
  function load(id:string){state={...EXAMPLES[id],example:id,customized:false,prediction:'',draft:null};sync();}
  function edit(){
    const draft={prevalence:prevalence.value,sensitivity:sensitivity.value,falseAlarmRate:falseAlarm.value};
    state={...state,customized:true,draft:invalidDraft(draft)?draft:null};
    if(!state.draft)state={...state,prevalence:Number(draft.prevalence)/100,sensitivity:Number(draft.sensitivity)/100,falseAlarmRate:Number(draft.falseAlarmRate)/100};
    sync();
    onChange();
  }
  for(const input of [prevalence,sensitivity,falseAlarm])input.addEventListener('input',edit);
  prediction.addEventListener('change',()=>{state={...state,prediction:prediction.value};onChange();});
  resetButton.addEventListener('click',()=>{load(baseline);onChange();});sync();
  return {
    getState:detached,
    validateState(next:BaseRatesState){
      validateBaseRates(next);if(!Object.hasOwn(EXAMPLES,next.example)||typeof next.customized!=='boolean'||!PREDICTIONS.includes(next.prediction))throw new TypeError('Invalid base-rate state');
      if(next.draft!==null){if(!next.draft||typeof next.draft!=='object'||!['prevalence','sensitivity','falseAlarmRate'].every(key=>typeof next.draft![key as keyof RateDraft]==='string')||!invalidDraft(next.draft)||!next.customized)throw new TypeError('Invalid saved rate draft');}
    },
    setState(next:BaseRatesState){this.validateState(next);state={prevalence:next.prevalence,sensitivity:next.sensitivity,falseAlarmRate:next.falseAlarmRate,population:next.population,example:next.example,customized:next.customized,prediction:next.prediction,draft:next.draft?{...next.draft}:null};sync();onChange();},
    suggest(suggestion?:Scene['suggestion']){if(suggestion&&!('example'in suggestion))throw new TypeError('Expected base-rate suggestion');const id=suggestion?.example??baseline;if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown base-rate example');const changed=baseline!==id;baseline=id;if(changed&&!state.customized){const prediction=state.prediction;load(id);state.prediction=prediction;}sync();},
    reset(){load(baseline);},
    seek(ms:number){if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid time');},
    inspect:()=>({...detached(),result:result?{...result}:null,valid:state.draft===null}),
    describe(scene:Scene){
      if(state.draft||!result)return {status:'invalid',text:'현재 비율을 계산할 수 없습니다. 각 입력에 0~100의 수를 넣으세요.'};
      if(scene.id==='question'||scene.id==='predict')return {status:'adapted',text:`현재 가정은 불량 ${percent(state.prevalence)}, 불량 중 경보 ${percent(state.sensitivity)}, 정상 중 경보 ${percent(state.falseAlarmRate)}입니다. 경보가 난 제품 중 불량은 절반 이상일까요? 예상은 선택 사항입니다.`};
      if(result.probability===null)return {status:'invalid',text:'현재 모형에서는 경보가 0개입니다. 조건으로 삼을 경보 집합이 없어 경보 중 불량 비율은 정의되지 않습니다. 비율을 바꾸어 비교하세요.'};
      const ratio=`경보 ${count(result.alerts)}개 중 불량 ${count(result.trueAlerts)}개로, 약 ${percent(result.probability)}입니다.`;
      if(scene.id==='denominator')return {status:'adapted',text:`${ratio} 분모는 전체 ${count(state.population)}개도, 불량 제품만의 개수도 아닙니다. 불량에서 난 경보와 정상에서 난 경보를 모두 더합니다.`};
      if(scene.id==='transfer')return {status:'adapted',text:`${ratio} 여기서 정상 중 경보 비율만 절반으로 줄이면 어떤 칸이 줄까요? 값을 바꿔 확인하고 분모가 어떻게 달라지는지 설명해 보세요. 모든 개수는 가상 모형의 기대값입니다.`};
      return {status:'adapted',text:`${ratio} 불량에서 난 경보 ${count(result.trueAlerts)}개와 정상에서 난 경보 ${count(result.falseAlerts)}개를 함께 보세요. ${scene.id==='common'?'검사기의 두 경보 비율을 유지하고 불량 비율만 바꾸면 결과는 어떻게 달라질까요?':'이는 측정 자료가 아닌, 입력한 확률로 계산한 기대 개수입니다.'}`};
    },
  };
}
