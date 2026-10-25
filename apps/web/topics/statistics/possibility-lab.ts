import {initialLabState,validateLabState,labFrameAt,labSummary,labTrial,relationPairs,isFunction,MAX_TRIALS,type LabState,type LabTopic} from '/packages/models/possibility-lab.js';
import type {Scene} from '/packages/content/types.js';
import {probabilityEquation,probabilityLedgerView,renderProbabilityLedger} from './possibility-ledger.js';

const percent=(n:number|null)=>n===null?'아직 없음':(n*100).toFixed(1)+'%';
const modeLabel=(mode:LabState['mode'])=>{
 switch(mode){
  case'filter':return'가족에게 적어도 한 명이 아들인지 묻는 절차';
  case'child':return'가족을 고른 뒤 아이 한 명을 균등하게 관측하는 절차';
  case'informed':return'정답을 알고 항상 미선택 염소 문을 여는 절차';
  case'blind':return'정답을 모르고 미선택 문을 균등하게 여는 절차';
 }
};
const authoredMode=(topic:LabTopic,scene:string):LabState['mode']=>topic==='two-children'?(scene==='child'?'child':'filter'):(scene==='compare'?'blind':'informed');
export function mountPossibilityLab(topic:LabTopic,container:HTMLElement,options:{onChange?:()=>void}={}){
 let state=initialLabState(topic),scene='',active=true,playing=false,frame=0,lastTime=0,remainder=0;
 const relation=topic==='binary-relations';
 container.className='possibility-lab';
 const trials=`<div class="lab-trials"><button type="button" data-action="one">한 번 뽑기</button><button type="button" data-action="play">반복 재생</button><button type="button" data-count="10">10회</button><button type="button" data-count="100">100회</button><button type="button" data-count="1000">1,000회</button><label>시행 <input class="lab-count" type="range" min="0" max="10000" step="1" value="0"></label><label>시드 <input class="lab-seed" type="number" min="0" max="4294967295" value="42"></label></div>`;
 container.innerHTML=`<div class="lab-controls"><strong>${relation?'연결을 직접 바꿔 보세요':'정보가 생기는 과정을 골라 보세요'}</strong><button type="button" data-action="reset">실험 초기화</button></div><div class="lab-inputs"></div><div class="lab-stage-controls"><button type="button" data-action="branch">가능성 한 단계 펼치기</button><button type="button" data-action="animate">${relation?'트리':'계산'} 펼쳐 보기</button><span class="lab-stage"></span></div>${relation?`<div class="lab-visuals"><svg class="lab-tree" viewBox="0 0 600 210" role="img" aria-label="가능성 분기와 관측 결과"></svg><svg class="lab-chart" viewBox="0 0 600 190" role="img" aria-label="시행 횟수에 따른 관측 비율"></svg></div>${trials}<p class="lab-status" role="status" aria-live="polite"></p>`:`<div class="lab-ledger"></div><p class="lab-note"></p><details class="lab-sampling"><summary>표본 실험 (선택)</summary>${trials}<svg class="lab-chart" viewBox="0 0 600 190" role="img" aria-label="시행 횟수에 따른 관측 비율"></svg><p class="lab-status" role="status" aria-live="polite"></p><p class="lab-sample-note">표본 비율은 흔들리며, 매번 이론값에 더 가까워지지는 않습니다.</p></details>`}${relation?'<p class="lab-note"></p>':''}`;
 const el=<T extends Element=HTMLElement>(selector:string)=>container.querySelector<T>(selector)!;
  const inputs=el('.lab-inputs'),tree=container.querySelector<SVGSVGElement>('.lab-tree'),chart=el<SVGSVGElement>('.lab-chart');
  const chartLegend=document.createElement('p');chartLegend.className='lab-chart-legend';chart.after(chartLegend);
 if(topic==='binary-relations')inputs.innerHTML=['민 → 논리','민 → 확률','수 → 논리','수 → 확률'].map((label,i)=>`<button type="button" data-edge="${i}" aria-pressed="false">${label}</button>`).join('');
 else inputs.innerHTML=topic==='monty-hall'?`<label>공개 규칙 <select class="lab-mode"><option value="informed">정답을 알고 항상 오답 공개</option><option value="blind">모르고 미선택 문 무작위 공개</option></select></label><label>처음 고를 문 <select class="lab-choice"><option value="1">1번</option><option value="2">2번</option><option value="3">3번</option></select></label><button type="button" data-action="reveal">선택 후 문 열기</button>`:`<label>정보를 얻는 과정 <select class="lab-mode"><option value="filter">가족에게 적어도 한 명이 아들인지 질문</option><option value="child">아이 한 명을 균등하게 골라 아들 관측</option></select></label><button type="button" data-action="reveal">한 가족 살펴보기</button>`;
 const line=(x:number,y:number,x2:number,y2:number,color='#599782')=>`<path pathLength="1" d="M${x} ${y} L${x2} ${y2}" stroke="${color}" stroke-width="3" fill="none"/>`;
 const label=(x:number,y:number,text:string)=>`<text x="${x}" y="${y}" text-anchor="middle">${text}</text>`;
 const dot=(x:number,y:number,text:string,on=true)=>`<circle cx="${x}" cy="${y-5}" r="23" fill="${on?'#dceee4':'#f0efeb'}" stroke="#81a998"/>${label(x,y,text)}`;
 function stop(){delete container.dataset.unfolding;playing=false;cancelAnimationFrame(frame);lastTime=0;remainder=0;el('[data-action="play"]').textContent='반복 재생';}
 function render(){
  const summary=labSummary(state);
   el('.lab-trials').toggleAttribute('hidden',relation);chart.toggleAttribute('hidden',relation||!state.count);chartLegend.hidden=relation||!state.count;
  el('.lab-stage').textContent=`${relation?'분기':'계산'} ${state.stage} / 3`;
  el<HTMLButtonElement>('[data-action="branch"]').disabled=state.stage===3;
  el<HTMLInputElement>('.lab-count').value=String(state.count);el<HTMLInputElement>('.lab-seed').value=String(state.seed);
  if(relation){
   if(!tree)throw new TypeError('Binary relation tree is required');
   for(const b of container.querySelectorAll<HTMLButtonElement>('[data-edge]'))b.setAttribute('aria-pressed',String(Boolean(state.edges&(1<<Number(b.dataset.edge)))));
   const edges=[0,1,2,3].filter(i=>state.edges&(1<<i));
   tree.innerHTML=(state.stage>0?edges.map(i=>line(130,60+Math.floor(i/2)*90,460,60+i%2*90)).join(''):'')+dot(105,65,'민')+dot(105,155,'수')+dot(490,65,'논리')+dot(490,155,'확률');
   tree.insertAdjacentHTML('afterbegin','<defs><marker id="lab-edge-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#599782"/></marker></defs>');for(const edge of tree.querySelectorAll(':scope > path'))edge.setAttribute('marker-end','url(#lab-edge-arrow)');
   el('.lab-status').textContent=relationPairs(state.edges).join(' · ')||'빈 관계: 연결 없음';
   el('.lab-note').textContent=`행: 민·수 / 열: 논리·확률 → [${[0,1,2,3].map(i=>Number(Boolean(state.edges&(1<<i)))).join(', ')}]. ${isFunction(state.edges)?'각 입력에 출력이 정확히 하나: 함수입니다.':'각 입력에 출력이 정확히 하나여야 함수입니다.'}`;
  }else{
    el<HTMLSelectElement>('.lab-mode').value=state.mode;if(topic==='monty-hall')el<HTMLSelectElement>('.lab-choice').value=String(state.choice);
    const family=topic==='two-children',theory=family?(state.mode==='filter'?'1/3':'1/2'):(state.mode==='informed'?'2/3':'1/2');
    renderProbabilityLedger(el('.lab-ledger'),probabilityLedgerView(topic,state),state.stage);
   const points=summary.points.map(p=>`${45+510*p.count/Math.max(1,state.count)},${150-120*p.rate}`).join(' '),y=150-120*summary.theoretical;
    chart.innerHTML=line(45,20,45,150,'#a4aaa7')+line(45,150,560,150,'#a4aaa7')+`<path d="M45 ${y} H560" stroke="#ab7850" stroke-dasharray="6 4"/><polyline points="${points}" fill="none" stroke="#356bba" stroke-width="3"/>`+label(23,35,'1')+label(23,155,'0');
    chartLegend.textContent=`가로: 시도 0 → ${state.count.toLocaleString()}회 · 세로: 조건 충족 시행의 성공 비율 0 → 1 · 파란 실선: 표본 비율 · 갈색 점선: 정확한 이론값 ${theory}`;
   const trial=state.revealed?labTrial(state,Math.max(0,state.count-1)):null;
   el('.lab-status').textContent=`시도 ${summary.attempted.toLocaleString()}회 · 조건 충족 ${summary.accepted.toLocaleString()}회 · ${family?'둘 다 아들':'교환 승리'} ${summary.successes.toLocaleString()}회 · 관측 비율 ${percent(summary.rate)}${trial?` — ${trial.branch}, ${trial.detail}: ${trial.accepted?trial.success?'성공':'실패':'조건 불충족 (집계 제외)'}`:''}`;
     el('.lab-note').textContent=family?'독립·아들/딸 각각 1/2인 단순 모형입니다. B는 아들, G는 딸이며 순서를 구분합니다.':'처음 선택은 고정하고 상품은 세 문에 균등하게 배치합니다. 모든 시행에서 교환하는 전략을 비교합니다.';
  }
  container.dataset.scene=scene;
 }
 function change(next:LabState){validateLabState(next,topic);state={...next};render();options.onChange?.();}
 function tick(time:number){if(!playing||!active||document.hidden){stop();return;}if(lastTime){remainder+=time-lastTime;const steps=Math.floor(remainder/50);if(steps){remainder%=50;change({...state,count:Math.min(MAX_TRIALS,state.count+steps),revealed:true,stage:3});}}lastTime=time;if(state.count===MAX_TRIALS){stop();return;}frame=requestAnimationFrame(tick);}
  function sceneBaseline():LabState{return{...initialLabState(topic),mode:authoredMode(topic,scene),stage:3};}
 container.addEventListener('click',event=>{
  const button=(event.target as Element).closest<HTMLButtonElement>('button');if(!button)return;
  if(button.dataset.edge!==undefined){stop();change({...state,edges:state.edges^(1<<Number(button.dataset.edge)),stage:3});return;}
  if(button.dataset.count){stop();const target=Math.min(MAX_TRIALS,Number(button.dataset.count));change({...state,count:target,stage:3,revealed:true});return;}
  switch(button.dataset.action){
   case'reset':stop();change(sceneBaseline());break;
   case'branch':stop();change({...state,stage:Math.min(3,state.stage+1)});break;
   case'animate':{stop();container.dataset.unfolding='true';const base={...state,stage:0};change(base);const start=performance.now(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const unfold=(now:number)=>{if(!active||document.hidden)return;const stage=reduced?3:Math.min(3,Math.max(0,Math.floor((now-start)/400)));if(stage!==state.stage)change({...state,stage});if(state.stage<3)frame=requestAnimationFrame(unfold);else delete container.dataset.unfolding;};frame=requestAnimationFrame(unfold);break;}
   case'reveal':case'one':stop();change({...state,count:Math.min(MAX_TRIALS,state.count+1),stage:3,revealed:true});break;
   case'play':if(playing)stop();else{playing=true;button.textContent='일시정지';frame=requestAnimationFrame(tick);}break;
  }
 });
 el<HTMLInputElement>('.lab-count').addEventListener('input',()=>{stop();change({...state,count:Number(el<HTMLInputElement>('.lab-count').value),stage:3,revealed:true});});
 el<HTMLInputElement>('.lab-seed').addEventListener('change',()=>{const input=el<HTMLInputElement>('.lab-seed'),seed=Number(input.value);if(input.value===''||!Number.isInteger(seed)||seed<0||seed>0xffffffff){input.value=String(state.seed);return;}stop();change({...state,seed,count:0,revealed:false,processSelected:true});});
 el('.lab-mode')?.addEventListener('change',()=>{stop();change({...state,mode:el<HTMLSelectElement>('.lab-mode').value as LabState['mode'],count:0,revealed:false,processSelected:true});});
 el('.lab-choice')?.addEventListener('change',()=>{stop();change({...state,choice:Number(el<HTMLSelectElement>('.lab-choice').value),count:0,revealed:false,processSelected:true});});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 render();
 return{
  getState:()=>({...state}),validateState:(value:unknown)=>validateLabState(value,topic),setState(value:unknown){validateLabState(value,topic);stop();change(value);},
  setActive(value:boolean){active=value;if(!value)stop();},suggest(suggestion?:Scene['suggestion']){const next=suggestion&&'example'in suggestion?suggestion.example:'';if(scene!==next){stop();scene=next;if(!state.processSelected&&!state.count)state={...state,mode:sceneBaseline().mode,stage:state.stage||3};render();}},
  reset(){stop();change(sceneBaseline());},seek(ms:number){stop();change(labFrameAt(state,ms));},
  inspect(){const available=({
   'binary-relations':['question','pairs','functions','close'],
   'monty-hall':['strategy','compare'],
    'two-children':['filter','child']
   }[topic]).includes(scene);const expected=authoredMode(topic,scene);return{customized:available&&topic!=='binary-relations'&&(state.count>0||state.mode!==expected||topic==='monty-hall'&&state.choice!==1),available,state:{...state},summary:labSummary(state),playing};},describe(scene:Scene){
    if(topic==='binary-relations')return{status:'adapted',text:`현재 관계는 ${relationPairs(state.edges).join(' · ')||'빈 관계'}입니다.`};
    const expected=authoredMode(topic,scene.id),summary=labSummary(state),sample=state.count?` 선택 사항인 표본 실험 ${summary.attempted.toLocaleString()}회에서 조건 충족 시행의 목표 성공 비율은 ${percent(summary.rate)}이며, 정확한 값과 구분합니다.`:'';
    const choice=topic==='monty-hall'&&state.choice!==1?` 처음 고른 문은 ${state.choice}번으로 바꾸었습니다.`:'';
    if(state.mode===expected)return{status:'adapted',text:`본문과 같은 ${modeLabel(expected)}입니다.${choice}${sample}`};
    const view=probabilityLedgerView(topic,state);
    const result=topic==='monty-hall'?`같은 확률의 여섯 칸 중 꽝을 본 칸만 남기고, 바꾸면 이기는 칸을 세면 ${probabilityEquation(view)}입니다.`:`남은 질량을 정규화하면 ${probabilityEquation(view)}입니다.`;
    return{status:'adapted',text:`본문의 ${modeLabel(expected)}와 달리, 현재 비교는 ${modeLabel(state.mode)}입니다.${choice} ${view.event} ${view.target} ${result}${sample}`};
   }
 };
}
