import type {Scene} from '/packages/content/types.js';
import {sphereSlice,validateSphereSliceInput} from '/packages/models/sphere-slices.js';

export interface SphereSlicesState {radius:number;height:number;example:string;customized:boolean;revealed:boolean}
const EXAMPLES:Record<string,{label:string;radius:number;height:number}>={
  center:{label:'중심을 자르기',radius:5,height:0},
  predict:{label:'중심에서 3 cm 위',radius:5,height:3},
  triangle:{label:'직각삼각형으로 확인',radius:5,height:3},
  mirror:{label:'중심에서 3 cm 아래',radius:5,height:-3},
  outside:{label:'구 바깥에서 자르기',radius:5,height:6},
  transfer:{label:'작은 구에서 같은 높이',radius:4,height:3},
};
export function mountSphereSlicesExperiment(container:HTMLElement,{onChange=()=>{}}:{onChange?:()=>void}={}){
  const doc=container.ownerDocument;
  const make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{const el=doc.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
  container.className='sphere-experiment';
  const toolbar=make('div',undefined,'sphere-toolbar'),select=make('select');select.setAttribute('aria-label','단면 예제');
  for(const [id,value]of Object.entries(EXAMPLES)){const option=make('option',value.label);option.value=id;select.append(option);}
  const resetButton=make('button','장면 예시로');resetButton.type='button';toolbar.append(select,resetButton);
  const controls=make('div',undefined,'sphere-controls');
  function slider(label:string,min:string,max:string){const wrap=make('label'),caption=make('span',label),output=make('output'),input=make('input');input.type='range';input.min=min;input.max=max;input.step='0.1';input.setAttribute('aria-label',label);wrap.append(caption,output,input);controls.append(wrap);return {input,output};}
  const radius=slider('구의 반지름 R','1','5'),height=slider('평면 높이 h','-6','6');
  const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 520 260');svg.setAttribute('role','img');svg.classList.add('sphere-diagram');
  const summary=make('p',undefined,'sphere-result');summary.setAttribute('aria-live','polite');
  const scope=make('p','이상적인 속 찬 구 · 두께 없는 평면 · 같은 축척 · 조절 0.1 cm 단위','sphere-scope');
  const transfer=make('div',undefined,'sphere-transfer'),revealButton=make('button','같은 원판의 두 구 보기'),answer=make('span','R=5, h=3과 R=4, h=0은 모두 r=4 cm입니다.');revealButton.type='button';transfer.append(revealButton,answer);
  container.append(toolbar,controls,svg,summary,scope,transfer);
  let baseline='center',state:SphereSlicesState={radius:5,height:0,example:'center',customized:false,revealed:false};
  const fmt=(value:number)=>Number(value.toFixed(2)).toLocaleString('ko-KR');
  function sync(){
    const result=sphereSlice(state),scale=17,cx=130,cy=130,right=390,y=cy-state.height*scale;
    radius.input.value=String(state.radius);height.input.value=String(state.height);radius.output.textContent=`${fmt(state.radius)} cm`;height.output.textContent=`${fmt(state.height)} cm`;select.value=state.example;resetButton.disabled=!state.customized;
    answer.hidden=!state.revealed;revealButton.setAttribute('aria-expanded',String(state.revealed));revealButton.textContent=state.revealed?'예시 접기':'같은 원판의 두 구 보기';
    const detail=result.kind==='empty'?'평면이 구 바깥에 있어 단면이 없습니다.':result.kind==='point'?'한 점에서만 닿습니다. 넓이는 0 cm²입니다.':`단면 반지름 r = ${fmt(result.radius)} cm · 넓이 ${fmt(result.area)} cm²`;
    summary.textContent=detail;
    svg.setAttribute('aria-label',`왼쪽은 구의 중심을 지나는 옆 단면, 오른쪽은 절단 평면에서 본 모습. R=${fmt(state.radius)} cm, h=${fmt(state.height)} cm. ${detail}`);
    svg.replaceChildren();
    function shape(tag:string,attrs:Record<string,string|number>,text?:string){const el=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));if(text)el.textContent=text;svg.append(el);return el;}
    shape('text',{x:cx,y:15,'text-anchor':'middle'},'중심을 지나는 옆 단면');shape('text',{x:right,y:15,'text-anchor':'middle'},'절단 평면에서 본 모습');
    shape('circle',{cx,cy,r:state.radius*scale,class:'sphere-outline'});
    shape('line',{x1:cx,y1:25,x2:cx,y2:235,class:'sphere-axis'});
    shape('line',{x1:25,y1:cy,x2:235,y2:cy,class:'sphere-axis'});
    shape('line',{x1:25,y1:y,x2:235,y2:y,class:'sphere-plane'});
    shape('text',{x:30,y:y>210?y-6:y+14},`h = ${fmt(state.height)}`);
    shape('circle',{cx,cy,r:2.5,class:'sphere-center'});
    if(result.kind!=='empty'){
      const r=result.radius*scale;
      shape('path',{d:`M ${cx} ${cy} L ${cx} ${y} L ${cx+r} ${y} Z`,class:'sphere-triangle'});
      shape('line',{x1:cx-r,y1:y,x2:cx+r,y2:y,class:'sphere-chord'});
      shape('text',{x:cx+r/2+7,y:(cy+y)/2+15},'R');
      if(r>12)shape('text',{x:cx+r/2,y:y-6},'r');
      if(Math.abs(state.height)>0.8)shape('text',{x:cx-18,y:(cy+y)/2},'|h|');
      if(result.kind==='disk')shape('circle',{cx:right,cy,r,class:'sphere-disk'});
      else shape('circle',{cx:right,cy,r:3,class:'sphere-center'});
      shape('line',{x1:right,y1:cy,x2:right+r,y2:cy,class:'sphere-chord'});
    }else shape('text',{x:right,y:cy,'text-anchor':'middle'},'단면 없음');
    shape('text',{x:260,y:252,'text-anchor':'middle'},'길이 cm · 넓이 cm² · 수치는 반올림');
  }
  function load(id:string,customized:boolean){if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown sphere example');const {radius,height}=EXAMPLES[id];state={radius,height,example:id,customized,revealed:false};sync();}
  for(const input of [radius.input,height.input])input.addEventListener('input',()=>{state={...state,radius:Number(radius.input.value),height:Number(height.input.value),customized:true};sync();onChange();});
  select.addEventListener('change',()=>{load(select.value,true);onChange();});resetButton.addEventListener('click',()=>{load(baseline,false);onChange();});
  revealButton.addEventListener('click',()=>{state={...state,revealed:!state.revealed,customized:true};sync();onChange();});
  function validateState(next:SphereSlicesState){
    validateSphereSliceInput(next);
    if(![next.radius,next.height].every(value=>Math.abs(value*10-Math.round(value*10))<1e-9))throw new RangeError('Sphere controls support 0.1 cm increments');
    if(typeof next.example!=='string'||!Object.hasOwn(EXAMPLES,next.example)||typeof next.customized!=='boolean'||typeof next.revealed!=='boolean')throw new TypeError('Invalid sphere state');
  }
  sync();
  return {
    getState:()=>({...state}),validateState,
    setState(next:SphereSlicesState){validateState(next);state={radius:next.radius,height:next.height,example:next.example,customized:next.customized,revealed:next.revealed};sync();onChange();},
    suggest(suggestion?:Scene['suggestion']){if(suggestion&&!('example'in suggestion))throw new TypeError('Expected sphere example');const id=suggestion?.example??baseline;if(!Object.hasOwn(EXAMPLES,id))throw new RangeError('Unknown sphere suggestion');baseline=id;if(!state.customized)load(id,false);},
    reset(){load(baseline,false);},
    seek(ms:number){if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid time');},
    inspect:()=>({...state,result:sphereSlice(state)}),
    describe(scene:Scene){
      const result=sphereSlice(state),intro=`현재 R=${fmt(state.radius)} cm, h=${fmt(state.height)} cm입니다. `;
      if(result.kind==='empty')return {status:'adapted',text:intro+'|h|가 R보다 커서 평면과 구는 만나지 않습니다. h를 중심 쪽으로 옮겨 단면이 처음 생기는 위치를 찾아보세요.'};
      if(result.kind==='point')return {status:'adapted',text:intro+'|h|=R이라 한 점에서 닿습니다. 단면이 없는 경우와 구별하세요. 조금만 중심 쪽으로 옮기면 원판이 생깁니다.'};
      const prompts:Record<string,string>={question:'h를 움직이며 어느 위치에서 원판이 가장 커지는지 찾아보세요.',predict:'중심에서 더 멀어지면 단면 반지름은 어떻게 될까요? 높이를 바꿔 확인하세요.',explain:'왼쪽 직각삼각형에서 r²+h²=R²입니다. 수치와 그림의 세 변을 대응해 보세요.',mirror:'h의 부호만 바꿔 보세요. h²가 같으므로 단면 크기도 같습니다.',boundary:'|h|를 R까지, 이어 R보다 크게 옮겨 원판·한 점·단면 없음의 경계를 비교하세요.',transfer:'h를 고정하고 R만 바꿔 보세요. 구의 크기를 모르면 같은 단면으로 전체 크기를 하나로 정할 수 없습니다.'};
      return {status:'adapted',text:intro+`r=${fmt(result.radius)} cm입니다. `+(prompts[scene.id]??prompts.question)};
    },
  };
}
