import {initialLabState,validateLabState,labFrameAt,labSummary,labTrial,relationPairs,isFunction,MAX_TRIALS,type LabState,type LabTopic} from '/packages/models/possibility-lab.js';
import type {Scene} from '/packages/content/types.js';

const percent=(n:number|null)=>n===null?'아직 없음':(n*100).toFixed(1)+'%';
export function mountPossibilityLab(topic:LabTopic,container:HTMLElement,options:{onChange?:()=>void}={}){
 let state=initialLabState(topic),scene='',active=true,playing=false,frame=0,lastTime=0,remainder=0;
 container.className='possibility-lab';
 container.innerHTML=`<div class="lab-controls"><strong>${topic==='binary-relations'?'연결을 직접 바꿔 보세요':'정보가 생기는 과정을 골라 보세요'}</strong><button type="button" data-action="reset">실험 초기화</button></div><div class="lab-inputs"></div><div class="lab-stage-controls"><button type="button" data-action="branch">가능성 한 단계 펼치기</button><button type="button" data-action="animate">트리 펼쳐 보기</button><span class="lab-stage"></span></div><div class="lab-visuals"><svg class="lab-tree" viewBox="0 0 600 210" role="img" aria-label="가능성 분기와 관측 결과"></svg><svg class="lab-chart" viewBox="0 0 600 190" role="img" aria-label="시행 횟수에 따른 관측 비율"></svg></div><div class="lab-trials"><button type="button" data-action="one">한 번 뽑기</button><button type="button" data-action="play">반복 재생</button><button type="button" data-count="10">10회</button><button type="button" data-count="100">100회</button><button type="button" data-count="1000">1,000회</button><label>시행 <input class="lab-count" type="range" min="0" max="10000" step="1" value="0"></label><label>시드 <input class="lab-seed" type="number" min="0" max="4294967295" value="42"></label></div><p class="lab-status" role="status" aria-live="polite"></p><p class="lab-note"></p>`;
 const el=<T extends Element=HTMLElement>(selector:string)=>container.querySelector<T>(selector)!;
 const inputs=el('.lab-inputs'),tree=el<SVGSVGElement>('.lab-tree'),chart=el<SVGSVGElement>('.lab-chart');
 if(topic==='binary-relations')inputs.innerHTML=['민 → 논리','민 → 확률','수 → 논리','수 → 확률'].map((label,i)=>`<button type="button" data-edge="${i}" aria-pressed="false">${label}</button>`).join('');
 else inputs.innerHTML=topic==='monty-hall'?`<label>공개 규칙 <select class="lab-mode"><option value="informed">정답을 알고 항상 오답 공개</option><option value="blind">모르고 미선택 문 무작위 공개</option></select></label><label>처음 고를 문 <select class="lab-choice"><option value="1">1번</option><option value="2">2번</option><option value="3">3번</option></select></label><button type="button" data-action="reveal">선택 후 문 열기</button>`:`<label>정보를 얻는 과정 <select class="lab-mode"><option value="filter">가족에게 적어도 한 명이 아들인지 질문</option><option value="child">아이 한 명을 균등하게 골라 아들 관측</option></select></label><button type="button" data-action="reveal">한 가족 살펴보기</button>`;
 const line=(x:number,y:number,x2:number,y2:number,color='#599782')=>`<path d="M${x} ${y} L${x2} ${y2}" stroke="${color}" stroke-width="3" fill="none"/>`;
 const label=(x:number,y:number,text:string)=>`<text x="${x}" y="${y}" text-anchor="middle">${text}</text>`;
 const dot=(x:number,y:number,text:string,on=true)=>`<circle cx="${x}" cy="${y-5}" r="23" fill="${on?'#dceee4':'#f0efeb'}" stroke="#81a998"/>${label(x,y,text)}`;
 function stop(){playing=false;cancelAnimationFrame(frame);lastTime=0;remainder=0;el('[data-action="play"]').textContent='반복 재생';}
 function render(){
  const relation=topic==='binary-relations',summary=labSummary(state);
  el('.lab-trials').toggleAttribute('hidden',relation);chart.toggleAttribute('hidden',relation||!state.count);
  el('.lab-stage').textContent=`분기 ${state.stage} / 3`;
  el<HTMLButtonElement>('[data-action="branch"]').disabled=state.stage===3;
  el<HTMLInputElement>('.lab-count').value=String(state.count);el<HTMLInputElement>('.lab-seed').value=String(state.seed);
  if(relation){
   for(const b of container.querySelectorAll<HTMLButtonElement>('[data-edge]'))b.setAttribute('aria-pressed',String(Boolean(state.edges&(1<<Number(b.dataset.edge)))));
   const edges=[0,1,2,3].filter(i=>state.edges&(1<<i));
   tree.innerHTML=(state.stage>0?edges.map(i=>line(130,60+Math.floor(i/2)*90,460,60+i%2*90)).join(''):'')+dot(105,65,'민')+dot(105,155,'수')+dot(490,65,'논리')+dot(490,155,'확률');
   el('.lab-status').textContent=relationPairs(state.edges).join(' · ')||'빈 관계: 연결 없음';
   el('.lab-note').textContent=`행: 민·수 / 열: 논리·확률 → [${[0,1,2,3].map(i=>Number(Boolean(state.edges&(1<<i)))).join(', ')}]. ${isFunction(state.edges)?'각 입력에 출력이 정확히 하나: 함수입니다.':'각 입력에 출력이 정확히 하나여야 함수입니다.'}`;
  }else{
   el<HTMLSelectElement>('.lab-mode').value=state.mode;if(topic==='monty-hall')el<HTMLSelectElement>('.lab-choice').value=String(state.choice);
   const family=topic==='two-children',names=family?['BB','BG','GB','GG']:['상품 1','상품 2','상품 3'],xs=names.map((_,i)=>60+i*480/(names.length-1)),theory=family?(state.mode==='filter'?'1/3':'1/2'):(state.mode==='informed'?'2/3':'1/2');
   const latest=state.count&&state.revealed?labTrial(state,state.count-1):null;
   tree.innerHTML=label(300,22,family?'가족 균등 추출 · B 아들 / G 딸':`상품 균등 배치 · 처음 선택 ${state.choice}번`)+(state.stage>=1?names.map((n,i)=>{const chosen=latest?.branch===(family?n:`상품 ${i+1}번`);return line(300,30,xs[i],70,chosen?'#c17a31':'#599782')+dot(xs[i],88,n,!latest||chosen)+label(xs[i],126,family?'사전 1/4':'사전 1/3');}).join(''):'')+(state.stage>=2?names.map((_,i)=>line(xs[i],137,xs[i],157)+label(xs[i],179,family?`관측 우도 ${i===3?'0':state.mode==='filter'||i===0?'1':'1/2'}`:`오답 우도 ${state.mode==='informed'||i+1===state.choice?'1':'1/2'}`)).join(''):'')+(state.stage>=3?label(300,207,`${family?'둘 다 아들':'항상 교환'} | 관측 조건 → 이론값 ${theory}`):'');
   const points=summary.points.map(p=>`${45+510*p.count/Math.max(1,state.count)},${150-120*p.rate}`).join(' '),y=150-120*summary.theoretical;
   chart.innerHTML=line(45,20,45,150,'#a4aaa7')+line(45,150,560,150,'#a4aaa7')+`<path d="M45 ${y} H560" stroke="#ab7850" stroke-dasharray="6 4"/><polyline points="${points}" fill="none" stroke="#356bba" stroke-width="3"/>`+label(300,184,`시도 0 → ${state.count.toLocaleString()}회 · 파랑: 관측 비율 · 점선: 이론값 ${theory}`)+label(23,35,'1')+label(23,155,'0');
   const trial=state.revealed?labTrial(state,Math.max(0,state.count-1)):null;
   el('.lab-status').textContent=`시도 ${summary.attempted.toLocaleString()}회 · 조건 충족 ${summary.accepted.toLocaleString()}회 · ${family?'둘 다 아들':'교환 승리'} ${summary.successes.toLocaleString()}회 · 관측 비율 ${percent(summary.rate)}${trial?` — ${trial.branch}, ${trial.detail}: ${trial.accepted?trial.success?'성공':'실패':'조건 불충족 (집계 제외)'}`:''}`;
   el('.lab-note').textContent=family?'독립·아들/딸 각각 1/2인 단순 모형. 조건을 충족한 가족만 분모에 포함합니다.':'교환 전략 고정. 공개한 문이 오답인 시행에 조건을 겁니다. 공개 번호 자체에는 조건을 걸지 않습니다. 오답 둘 중 하나는 균등 선택합니다.';
   if(state.count)el('.lab-note').textContent+=' 표본 비율은 흔들리며, 매번 이론값에 더 가까워지지는 않습니다.';
  }
  container.dataset.scene=scene;
 }
 function change(next:LabState){validateLabState(next,topic);state={...next};render();options.onChange?.();}
 function tick(time:number){if(!playing||!active||document.hidden){stop();return;}if(lastTime){remainder+=time-lastTime;const steps=Math.floor(remainder/50);if(steps){remainder%=50;change({...state,count:Math.min(MAX_TRIALS,state.count+steps),revealed:true,stage:3});}}lastTime=time;if(state.count===MAX_TRIALS){stop();return;}frame=requestAnimationFrame(tick);}
 container.addEventListener('click',event=>{
  const button=(event.target as Element).closest<HTMLButtonElement>('button');if(!button)return;
  if(button.dataset.edge!==undefined){stop();change({...state,edges:state.edges^(1<<Number(button.dataset.edge)),stage:3});return;}
  if(button.dataset.count){stop();const target=Math.min(MAX_TRIALS,Number(button.dataset.count));change({...state,count:target,stage:3,revealed:true});return;}
  switch(button.dataset.action){
   case'reset':stop();change(initialLabState(topic));break;
   case'branch':stop();change({...state,stage:Math.min(3,state.stage+1)});break;
   case'animate':{stop();const base={...state,stage:0};change(base);const start=performance.now(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const unfold=(now:number)=>{if(!active||document.hidden)return;const stage=reduced?3:Math.min(3,Math.floor((now-start)/400));if(stage!==state.stage)change({...state,stage});if(state.stage<3)frame=requestAnimationFrame(unfold);};frame=requestAnimationFrame(unfold);break;}
   case'reveal':case'one':stop();change({...state,count:Math.min(MAX_TRIALS,state.count+1),stage:3,revealed:true});break;
   case'play':if(playing)stop();else{playing=true;button.textContent='일시정지';frame=requestAnimationFrame(tick);}break;
  }
 });
 el<HTMLInputElement>('.lab-count').addEventListener('input',()=>{stop();change({...state,count:Number(el<HTMLInputElement>('.lab-count').value),stage:3,revealed:true});});
 el<HTMLInputElement>('.lab-seed').addEventListener('change',()=>{const input=el<HTMLInputElement>('.lab-seed'),seed=Number(input.value);if(input.value===''||!Number.isInteger(seed)||seed<0||seed>0xffffffff){input.value=String(state.seed);return;}stop();change({...state,seed,count:0,revealed:false});});
 el('.lab-mode')?.addEventListener('change',()=>{stop();change({...state,mode:el<HTMLSelectElement>('.lab-mode').value as LabState['mode'],count:0,revealed:false});});
 el('.lab-choice')?.addEventListener('change',()=>{stop();change({...state,choice:Number(el<HTMLSelectElement>('.lab-choice').value),count:0,revealed:false});});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 render();
 return{
  getState:()=>({...state}),validateState:(value:unknown)=>validateLabState(value,topic),setState(value:unknown){validateLabState(value,topic);stop();change(value);},
  setActive(value:boolean){active=value;if(!value)stop();},suggest(suggestion?:Scene['suggestion']){const next=suggestion&&'example'in suggestion?suggestion.example:'';if(scene!==next){stop();scene=next;render();}},
  reset(){stop();change(initialLabState(topic));},seek(ms:number){stop();change(labFrameAt(state,ms));},
  inspect(){const available=({
   'binary-relations':['question','pairs','functions','close'],
   'monty-hall':['strategy','compare'],
   'two-children':['model','filter','child']
  }[topic]).includes(scene);return{customized:available&&topic!=='binary-relations',available,state:{...state},summary:labSummary(state),playing};},describe(scene:Scene){
   const family=topic==='two-children',mode=state.mode,summary=labSummary(state);
   const text=family?`${scene.id==='model'?'독립이고 아들·딸 확률이 각각 1/2인 단순 모형에서, 출생순 BB·BG·GB·GG는 각각 1/4입니다. ':''}${mode==='filter'?'가족을 균등 추출하고, 적어도 한 명이 아들인 가족을 남깁니다. BB·BG·GB의 관측 우도는 모두 1이므로 둘 다 아들일 이론 확률은 1/3입니다.':'가족을 균등 추출한 뒤 아이 한 명을 균등 선택합니다. 아들을 관측할 우도는 BB에서 1, BG·GB에서 1/2이므로, 둘 다 아들일 이론 확률은 1/2입니다.'}`:`${scene.id==='compare'?'정답을 알고 항상 오답을 공개하는 경우와 모르고 무작위로 공개한 경우는 관측 우도가 다릅니다. ':''}현재 실험은 ${mode==='informed'?'정답을 알고 항상 미선택 오답을 공개하는 규칙입니다. 처음 틀린 2/3의 경우에 교환하면 이기므로 교환 이론 승률은 2/3입니다.':'정답을 모르고 미선택 문 하나를 균등하게 엽니다. 상품이 나온 시행을 제외하고 오답 관측에 조건을 걸면 교환 이론 승률은 1/2입니다.'}`;
   return{status:'adapted',text:text+` 반복 실험의 표본 비율은 ${percent(summary.rate)}이며, 이론값과 구분합니다.`};
  }
 };
}
