import type {Scene} from '/packages/content/types.js';
import type {OrbitalState} from '/packages/models/hydrogenic.js';
import type {FieldView,RenderBackend} from '../../components/spatial/field-viewer.js';
export interface OrbitalExperimentState {orbital:OrbitalState;view:FieldView;customized:boolean}
type OrbitalSuggestion=OrbitalState & {mode?:FieldView['mode']};
function basisFor(id:string){const basis=ORBITAL_BASES.find(b=>b.id===id);if(!basis)throw new RangeError('Unknown orbital basis');return basis;}
import {createHydrogenicField,validateOrbitalState,ORBITAL_BASES,DEFAULT_ORBITAL} from '/packages/models/hydrogenic.js';
import {mountFieldViewer,validateFieldView,DEFAULT_FIELD_VIEW} from '../../components/spatial/field-viewer.js';

export function mountOrbitalExperiment(container:HTMLElement,{onChange=()=>{}}:{onChange?:()=>void}={}){
  const doc=container.ownerDocument,make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string|null,className?:string)=>{const el=doc.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
  container.className='orbital-experiment';
  const controls=make('div',null,'orbital-controls'),view=make('div',null,'orbital-view'),footer=make('div',null,'orbital-footer'),summary=make('p',null,'orbital-summary'),legend=make('p',null,'field-legend'),rendererStatus=make('p',null,'orbital-renderer-status');
  legend.textContent='● 청록 ψ ≥ 0　● 주황 ψ < 0 · 점 분포·밝기: |ψ|²';
  rendererStatus.setAttribute('role','status');rendererStatus.setAttribute('aria-live','polite');rendererStatus.hidden=true;
  function select(label:string,options:[string|number,string][]){const wrap=make('label',label),input=make('select');input.setAttribute('aria-label',label);for(const [value,text]of options){const option=make('option',text);option.value=String(value);input.append(option);}wrap.append(input);controls.append(wrap);return input;}
  const nInput=select('주양자수 n',[1,2,3,4].map(n=>[n,String(n)]));
  const basisInput=select('오비탈 종류·방향',ORBITAL_BASES.map(b=>[b.id,b.label]));
  const chargeInput=select('핵전하 Z',[[1,'1 · H'],[2,'2 · He⁺'],[3,'3 · Li²⁺']]);
  const modeInput=select('표시 방식',[['cloud','3D 확률 구름'],['slice','단면'],['surface','등값면']]);
  const planeInput=select('단면 평면',[['xy','xy'],['xz','xz'],['yz','yz']]);
  function range(label:string,min:number,max:number,step:number){const wrap=make('label',label),input=make('input');input.type='range';input.min=String(min);input.max=String(max);input.step=String(step);input.setAttribute('aria-label',label);wrap.append(input);controls.append(wrap);return input;}
  const sliceInput=range('단면 위치',-1,1,.05),isoInput=range('등값면 기준',.005,.4,.005);
  const cameraReset=make('button','시점 복원'),exampleReset=make('button','장면 예시로');cameraReset.type=exampleReset.type='button';controls.append(cameraReset,exampleReset);
  const hint=make('p','드래그·방향키 회전 · 휠·+/− 확대 · 유한 격자 근사, 전자 궤적 아님','field-hint');
  footer.append(summary,legend,rendererStatus,hint);container.append(controls,view,footer);
  let input:OrbitalState={...DEFAULT_ORBITAL},baseline:OrbitalSuggestion={...DEFAULT_ORBITAL,mode:'cloud'},customized=false,suppress=false,fieldKey='',field=createHydrogenicField(input),currentMode:FieldView['mode']='cloud',backend:RenderBackend={requested:'webgl2',active:'none',status:'unavailable'};
  function updateRendererPresentation(){
    const threeDimensional=currentMode!=='slice',available=!threeDimensional||backend.active==='webgl2';
    legend.hidden=!available;legend.textContent=currentMode==='surface'?'● 청록 ψ ≥ 0　● 주황 ψ < 0 · 명암은 표면 방향 조명이며 밀도가 아님':currentMode==='slice'?'● 청록 ψ ≥ 0　● 주황 ψ < 0 · 밝기: |ψ|²의 비선형 표시':'● 청록 ψ ≥ 0　● 주황 ψ < 0 · 점 분포: |ψ|² 가중 샘플';
    rendererStatus.hidden=available;rendererStatus.textContent=available?'':backend.status==='context-lost'?'GPU 연결이 끊겨 3D 표시를 사용할 수 없습니다. 복원 중이며 단면과 본문은 계속 사용할 수 있습니다.':'GPU를 사용할 수 없어 3D 표시를 사용할 수 없습니다. 단면과 본문은 계속 사용할 수 있습니다.';
  }
  updateRendererPresentation();
  const viewer=mountFieldViewer(view,{label:'수소형 원자 오비탈의 3차원 확률밀도. 방향키로 회전, +와 -로 확대',onBackendChange(next){backend={...next};updateRendererPresentation();},onChange(){if(suppress)return;customized=true;sync();onChange();}});
  function sync(){
    const state=viewer.getState(),basis=basisFor(input.basis);currentMode=state.mode;
    nInput.value=String(input.n);basisInput.value=input.basis;chargeInput.value=String(input.Z);modeInput.value=state.mode;planeInput.value=state.plane;sliceInput.value=String(state.slice);isoInput.value=String(state.iso);
    for(const option of basisInput.options)option.disabled=basisFor(option.value).l>=input.n;
    if(planeInput.parentElement)planeInput.parentElement.hidden=state.mode!=='slice';if(sliceInput.parentElement)sliceInput.parentElement.hidden=state.mode!=='slice';if(isoInput.parentElement)isoInput.parentElement.hidden=state.mode!=='surface';
    cameraReset.disabled=state.mode==='slice';exampleReset.disabled=!customized;
    const density=state.mode==='surface'?` · 기준: 격자 최대 밀도의 ${(100*state.iso).toFixed(1)}% (포함 확률 아님)`:state.mode==='slice'?` · ${state.plane} 단면, 위치 ${(state.slice*field.extent).toFixed(1)} a₀`:' · 점은 격자 밀도에 따른 분포 샘플';
    summary.textContent=`${input.n}${basis.label} · l=${basis.l} · 방사 마디 ${field.radialNodes} · E=${field.energyHartree.toFixed(4)} Eₕ${density}`;
    hint.textContent=`${state.mode==='slice'?'단면 위치·평면을 바꿔 내부를 확인':'드래그·방향키 회전 · 휠·+/− 확대'} · 좌표 a₀ · 계산 상자 ±${field.extent.toFixed(1)} a₀ · 자동 구도 · 격자 근사`;
    updateRendererPresentation();
  }
  function apply(next:OrbitalState,viewState:Partial<FieldView>,edited:boolean){
    const checked=validateOrbitalState(next),checkedView=validateFieldView(viewState),key=JSON.stringify(checked);
    suppress=true;
    try{
      if(key!==fieldKey){const nextField=createHydrogenicField(checked),extent=nextField.extent;viewer.setField({evaluate:nextField.evaluate,weight:value=>value*value,bounds:[[-extent,extent],[-extent,extent],[-extent,extent]],resolution:30});field=nextField;fieldKey=key;}
      input=checked;customized=edited;viewer.setState(checkedView);sync();
    }finally{suppress=false;}
  }
  function edit(){const n=Number(nInput.value);let basis=basisInput.value;if(basisFor(basis).l>=n)basis='s';apply({n,basis,Z:Number(chargeInput.value)},{...viewer.getState(),mode:modeInput.value as FieldView['mode'],plane:planeInput.value as FieldView['plane'],slice:Number(sliceInput.value),iso:Number(isoInput.value)},true);onChange();}
  for(const control of [nInput,basisInput,chargeInput,modeInput,planeInput])control.addEventListener('change',edit);
  for(const control of [sliceInput,isoInput])control.addEventListener('input',edit);
  cameraReset.addEventListener('click',()=>{const current=viewer.getState();apply(input,{...DEFAULT_FIELD_VIEW,mode:current.mode,plane:current.plane,iso:current.iso,slice:current.slice},true);onChange();});
  function reset(){apply(baseline,{...DEFAULT_FIELD_VIEW,mode:baseline.mode??'cloud'},false);}
  exampleReset.addEventListener('click',()=>{reset();onChange();});
  apply(input,DEFAULT_FIELD_VIEW,false);
  return {
    getState:()=>({orbital:{...input},view:viewer.getState(),customized}),
    afterRender(){viewer.seek(0);},
    validateState(state:OrbitalExperimentState){if(typeof state?.customized!=='boolean')throw new TypeError('Expected customized state');validateOrbitalState(state.orbital);validateFieldView(state.view);},
    setState(state:OrbitalExperimentState){if(typeof state?.customized!=='boolean')throw new TypeError('Expected customized state');apply(state.orbital,state.view,state.customized);onChange();},
    suggest(next?:Scene['suggestion']){if(next&&!('n' in next))throw new TypeError('Expected orbital suggestion');if(next)baseline={...validateOrbitalState(next),mode:(next.mode??'cloud') as FieldView['mode']};if(!customized)reset();},reset,seek:viewer.seek,
    inspect:()=>({orbital:{...input},l:field.l,radialNodes:field.radialNodes,angularNodes:field.angularNodes,energyHartree:field.energyHartree,customized,viewer:viewer.inspect()}),
    dispose(){viewer.dispose();},
    describe(scene:Scene){
      const label=`${input.n}${basisFor(input.basis).label}`,v=viewer.getState();
      const common=`현재 ${label}, n=${input.n}, l=${field.l}, Z=${input.Z}입니다.`;
      const details:Record<string,string>={
        orbit:'회전은 분포를 보는 시점만 바꿉니다. 점은 전자의 이동 경로가 아니라 확률밀도를 표현하는 샘플입니다.',
        density:'작은 부피에서 전자를 찾을 확률은 그 부피에 걸쳐 |ψ|²를 적분해 얻습니다. 화면은 유한 격자에서 분포를 근사합니다.',
        numbers:'s·p·d는 l=0·1·2입니다. pₓ·pᵧ와 실수 d 방향은 복소 구면조화함수의 조합이며, 각각을 하나의 m 값과 동일시하지 않습니다.',
        nodes:`이 상태의 방사 마디 수는 n−l−1=${field.radialNodes}, 각 마디 수는 l=${field.angularNodes}입니다. 단면에서 밀도가 0이 되는 곳을 비교하세요.`,
        phase:'청록\u2060·\u2060주황은 선택한 실수 파동함수의 부호입니다. 전하의 부호가 아닙니다. 전체 부호를 뒤집어도 |\u2060ψ\u2060|\u2060²는 같습니다.',
        views:v.mode==='surface'?`지금 등값면은 격자 최대 밀도의 ${(100*v.iso).toFixed(1)}%를 잇습니다. 그 안에 전자가 그 확률로 들어 있다는 뜻은 아닙니다.`:v.mode==='slice'?`지금 ${v.plane} 평면의 단면입니다. 밝기는 밀도, 두 색은 파동함수 부호를 나타냅니다.`:'지금 점은 유한 계산 상자 안의 격자 밀도에 비례해 뽑은 샘플입니다. 실제 관측 기록이 아닙니다.',
        charge:`고정 핵 모형에서 E=−Z²/(2n²)=${field.energyHartree.toFixed(4)} Eₕ입니다. Z가 커지면 길이 척도는 1/Z로 줄지만 화면은 자동으로 구도를 맞춥니다.`,
        limits:'한 전자·고정 점핵·비상대론 모형입니다. 다전자 원자, 분자, 스핀, 상대론 및 환산질량 보정은 계산하지 않습니다.',
      };
      return {text:common+' '+details[scene.id],status:'adapted'};
    },
  };
}
