import {freshWeekdayChallenge,validateWeekdayChallenge,advanceWeekdayChallenge,answerWeekdayChallenge,weekdayChallengeAt,type WeekdayChallenge} from '/packages/experiments/weekday-challenge.js';
import {mountWeekdayChallenge} from './weekday-challenge.js';
import type {Scene} from '/packages/content/types.js';
import {WEEKDAYS,PRESET_CONTEXTS,CONTEXT_KEYS,interpretWeekdayWorlds,weekdayDeductions,validateWeekdayInterpretation,worldSymbol,type WeekdayInterpretation,type WeekdayContexts,type WeekdayRule,type WorldIndex,type CalendarWorld} from '/packages/models/weekday-worlds.js';
import {weekdayModal,type ModalFrame} from '/packages/models/weekday-modal.js';
import {mountWorldComparison} from '../../components/worlds/comparison.js';
import {mountWeekdaySentence,type WeekdayRepresentation,type WeekdayLogicMode} from './weekday-sentence.js';
import {weekdayClassicalProof} from '/packages/models/weekday-classical.js';
import {mountWeekdayBridge} from './weekday-bridge.js';
import {mountWeekdayIntro} from './weekday-intro.js';
import {mountWeekdayLogic} from './weekday-logic.js';
import {mountWeekdayFrameSystems} from './weekday-systems.js';
import {modalFrameSystems} from '/packages/models/modal-frame-systems.js';
import {mountWeekdayModal} from './weekday-modal.js';
import {WORLD_COLORS,colorWorld,worldText,worldLabel} from './weekday-world-style.js';
import {mountSemanticAlignment} from '../../components/alignment/semantic-alignment.js';
import {WEEKDAY_ALIGNMENT} from './weekday-alignment.js';
import {mountInlineSelect} from '../../components/experiment/inline-select.js';
// Version 3 sample-day fields remain readable for saved-state compatibility, not as UI premises.
export interface WeekdayWorldsState extends WeekdayInterpretation,ModalFrame {version:3;worlds:CalendarWorld[];example:string;customized:boolean;representation:WeekdayRepresentation;logicMode:WeekdayLogicMode;selectionScope:'all'|'accessible';narrowPanel:'inputs'|'reasoning';modeSource:'scene'|'manual';challenge:WeekdayChallenge}
const EXAMPLES:Record<string,{actual:number;target:number;rule:WeekdayRule}>={'modal-systems':{actual:6,target:4,rule:'actual-yesterday'},'frame-system':{actual:6,target:4,rule:'actual-yesterday'},'nonmodal-proof':{actual:6,target:4,rule:'actual-yesterday'},conditional:{actual:6,target:4,rule:'actual-yesterday'},inference:{actual:6,target:4,rule:'actual-yesterday'},'modal-comparison':{actual:6,target:4,rule:'actual-yesterday'},'modal-rules':{actual:6,target:4,rule:'actual-yesterday'},reason:{actual:6,target:4,rule:'actual-yesterday'},notation:{actual:6,target:4,rule:'actual-yesterday'},alethic:{actual:6,target:4,rule:'actual-yesterday'},question:{actual:6,target:4,rule:'actual-yesterday'},contexts:{actual:6,target:4,rule:'actual-yesterday'},sunday:{actual:6,target:4,rule:'actual-yesterday'},wednesday:{actual:2,target:4,rule:'imagined-yesterday'},literal:{actual:6,target:4,rule:'same-context'},transfer:{actual:6,target:0,rule:'actual-yesterday'},conclusion:{actual:6,target:4,rule:'actual-yesterday'}};
const bridgeScenes=new Set(['conditional','notation','inference','nonmodal-proof','modal-rules','modal-systems']);
const introScenes=new Set(['question','reason','sunday','wednesday']);
const modalScenes=new Set(['alethic','modal-rules','modal-systems','frame-system','transfer','literal','conclusion']);
const sceneMode=(scene:string):WeekdayLogicMode=>modalScenes.has(scene)?'alethic':'calendar';
const LABELS:Record<keyof WeekdayContexts,string>={yesterday:'① 어제의 기준',tomorrow:'② 내일의 기준',consequent:'③ 그럼 오늘의 기준',question:'④ 묻는 오늘의 기준'};
const PRESET_LABELS:Record<WeekdayRule,string>={'actual-yesterday':'A · 현실 어제 고정','imagined-yesterday':'B · 현실 내일 고정','same-context':'C · 가능세계 없이'};
const WORLD_IDS=[0,1,2,3] as const,CONTEXT_NUMBERS=['①','②','③','④'] as const;
const defaultAccess=():[WorldIndex,WorldIndex][]=>[[0,0],[0,1],[1,1]];
function record(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null;}
const clone=(s:WeekdayWorldsState):WeekdayWorldsState=>({...s,challenge:{...s.challenge},contexts:{...s.contexts},worlds:s.worlds.map(w=>({...w})),access:s.access.map(([a,b])=>[a,b])});
export function normalizeWeekdayState(value:unknown):WeekdayWorldsState{
  if(!record(value)||typeof value.actual!=='number'||typeof value.target!=='number'||typeof value.example!=='string'||!Object.hasOwn(EXAMPLES,value.example)||typeof value.customized!=='boolean')throw new TypeError('Invalid weekday state');
  let contexts:WeekdayContexts;
  if(value.version===2||value.version===3){
    if('rule'in value||!record(value.contexts)||!CONTEXT_KEYS.every(key=>record(value.contexts)&&typeof value.contexts[key]==='number'))throw new TypeError('Invalid weekday contexts');
    const c=value.contexts as unknown as WeekdayContexts;contexts={yesterday:c.yesterday,tomorrow:c.tomorrow,consequent:c.consequent,question:c.question};
  }else{
    if(value.version!==undefined||typeof value.rule!=='string'||!Object.hasOwn(PRESET_CONTEXTS,value.rule))throw new TypeError('Unknown weekday state version');contexts={...PRESET_CONTEXTS[value.rule as WeekdayRule]};
  }
  if(value.representation!==undefined&&value.representation!=='sentence'&&value.representation!=='symbols'||value.logicMode!==undefined&&value.logicMode!=='calendar'&&value.logicMode!=='alethic'||value.selectionScope!==undefined&&value.selectionScope!=='all'&&value.selectionScope!=='accessible'||value.narrowPanel!==undefined&&value.narrowPanel!=='inputs'&&value.narrowPanel!=='reasoning')throw new TypeError('Unknown weekday presentation');
  if(value.modeSource!==undefined&&value.modeSource!=='scene'&&value.modeSource!=='manual')throw new TypeError('Unknown mode source');
  let worlds:CalendarWorld[],access:[WorldIndex,WorldIndex][],evaluationWorld:WorldIndex=0;
  if(value.version===3){
    if(!Array.isArray(value.worlds)||!Array.isArray(value.access)||typeof value.evaluationWorld!=='number')throw new TypeError('Invalid world configuration');
    worlds=value.worlds.map(w=>{if(!record(w)||typeof w.id!=='number'||typeof w.today!=='number')throw new TypeError('Invalid world');return {id:w.id as WorldIndex,today:w.today};});
    access=value.access.map(e=>{if(!Array.isArray(e)||e.length!==2||!e.every(n=>typeof n==='number'))throw new TypeError('Invalid access edge');return [e[0] as WorldIndex,e[1] as WorldIndex];});evaluationWorld=value.evaluationWorld as WorldIndex;
  }else{
    const legacy=interpretWeekdayWorlds({actual:value.actual,target:value.target,contexts});worlds=[{id:0,today:value.actual},{id:1,today:legacy.imaginedDays?.[1]??value.actual}];access=defaultAccess();
  }
  const next:WeekdayWorldsState={version:3,actual:value.actual,target:value.target,contexts,worlds,access,evaluationWorld,example:value.example,customized:value.customized,representation:value.representation??'sentence',logicMode:value.logicMode??'calendar',selectionScope:value.selectionScope??'all',narrowPanel:value.narrowPanel??'reasoning',modeSource:value.modeSource??'manual',challenge:value.challenge===undefined?freshWeekdayChallenge():validateWeekdayChallenge(value.challenge)};
  validateWeekdayInterpretation(next);weekdayModal(next,next);return next;
}
export function mountWeekdayWorldsExperiment(container:HTMLElement,{onChange=()=>{},onSceneRequest=()=>{}}:{onChange?:()=>void;onSceneRequest?:(sceneId:string)=>void}={}){
  const doc=container.ownerDocument;
  const make=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{const node=doc.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;};
  container.className='weekday-experiment';
  const left=make('div',undefined,'weekday-input-panel'),quote=make('div'),sentence=mountWeekdaySentence(quote),settings=make('div',undefined,'weekday-settings');
  const presets=make('div',undefined,'weekday-presets');presets.setAttribute('role','group');presets.setAttribute('aria-label','해석 프리셋');const buttons=new Map<WeekdayRule,HTMLButtonElement>();
  for(const id of Object.keys(PRESET_LABELS) as WeekdayRule[]){const button=make('button',PRESET_LABELS[id]);button.type='button';button.dataset.preset=id;button.title='세계와 관계를 해당 예시로 복원';presets.append(button);buttons.set(id,button);}
  function options(input:HTMLSelectElement,values:[string,string][],selected:string){input.replaceChildren();for(const [value,text]of values){const o=make('option',text);o.value=value;input.append(o);}input.value=selected;}
  function worldOptions(input:HTMLSelectElement){colorWorld(input,Number(input.value) as WorldIndex);for(const option of input.options)colorWorld(option,Number(option.dataset.createWorld??option.value) as WorldIndex);}
  function creationOptions(input:HTMLSelectElement){
    const missing=WORLD_IDS.filter(id=>!state.worlds.some(w=>w.id===id));if(!missing.length)return;
    const group=doc.createElement('optgroup');group.label='새 세계 추가';
    for(const id of missing){const option=make('option',`${worldLabel(id)} (선택하여 추가)`);option.value=`new:${id}`;option.dataset.createWorld=String(id);group.append(option);}input.append(group);
  }
  function worldName(id:WorldIndex,except?:keyof WeekdayContexts){
    const references=CONTEXT_KEYS.flatMap((key,index)=>key!==except&&state.contexts[key]===id?[CONTEXT_NUMBERS[index]]:[]);
    return `${worldLabel(id)}${references.length?` (${references.join('·')}의 기준)`:''}`;
  }
  function select(parent:HTMLElement,label:string,values:[string,string][]=[]){const wrap=make('label',label),input=make('select');input.setAttribute('aria-label',label);options(input,values,values[0]?.[0]??'');wrap.append(input);parent.append(wrap);return input;}
  const contextControls=CONTEXT_KEYS.map(key=>{const input=make('select');input.setAttribute('aria-label',LABELS[key]);input.className='weekday-context-select';const popup=mountInlineSelect(input);return {key,input,popup};});
  const toolbar=make('div',undefined,'weekday-world-toolbar'),worldCount=make('span'),add=make('button','세계 추가'),configure=make('button','세계 · 접근 관계');add.type=configure.type='button';toolbar.append(worldCount,add,configure);
  const basis=make('div',undefined,'weekday-basis'),evaluation=select(basis,'평가·접근 기준'),scope=select(basis,'세계 선택 목록',[['all','전체 세계'],['accessible','접근 가능한 세계']]);
  const relationSummary=make('p',undefined,'weekday-relation-summary');settings.setAttribute('aria-label','기준과 세계 선택');settings.tabIndex=0;
  const target=make('select');target.className='weekday-target-select';target.setAttribute('aria-label','문장 속 목표 요일');options(target,WEEKDAYS.map((d,i)=>[String(i),d]),'4');const targetPopup=mountInlineSelect(target);
  const settingsTitle=make('h2','선택:', 'weekday-settings-heading');const presetRow=make('div',undefined,'weekday-preset-row');presetRow.append(settingsTitle,presets);settings.append(presetRow,toolbar,basis,relationSummary);
  const footer=make('div',undefined,'weekday-footer'),hint=make('span','새 세계는 선택하여 추가 · 프리셋은 세계·관계도 복원'),reset=make('button','장면 예시로');reset.type='button';footer.append(hint,reset);left.append(quote,settings,footer);
  const right=make('div',undefined,'weekday-reasoning-panel'),visual=make('div',undefined,'weekday-visual'),diagram=make('div'),viewer=mountWorldComparison(diagram),modalDiagram=make('div'),modal=mountWeekdayModal(modalDiagram),logicDiagram=make('div'),logic=mountWeekdayLogic(logicDiagram),result=make('p',undefined,'weekday-result');result.setAttribute('aria-live','polite');visual.append(diagram,modalDiagram,logicDiagram);right.append(visual,result);container.append(left,right);
  const frameStatus=make('section'),frameSystems=mountWeekdayFrameSystems(frameStatus);visual.append(frameStatus);
  const introSource=make('section'),introReasoning=make('div'),intro=mountWeekdayIntro(introSource,introReasoning);left.prepend(introSource);visual.prepend(introReasoning);
  const challengePanel=make('div'),quiz=mountWeekdayChallenge(challengePanel,{
    onStart(){stopClock();commit({...state,challenge:{...freshWeekdayChallenge(),phase:'running',playback:'live',promptTarget:state.target}});onSceneRequest('question');},
    onAnswer(day){captureChallenge();const challenge=answerWeekdayChallenge(state.challenge,day);if(challenge.phase!=='answered'&&challenge.phase!=='expired')return;stopClock(false);commit({...state,challenge});onSceneRequest('question');},
  });introSource.append(challengePanel);
  const comparison=make('section',undefined,'weekday-interpretation-comparison');comparison.setAttribute('aria-label','양상 논리 사용 전후의 읽기 비교');visual.insertBefore(comparison,logicDiagram);
  const bridgeContainer=make('div'),bridge=mountWeekdayBridge(bridgeContainer);left.prepend(bridgeContainer);
  const alignment=mountSemanticAlignment(container,WEEKDAY_ALIGNMENT,sentence.alignmentStatus,{instruction:''});
  const dialog=make('dialog',undefined,'reader-panel weekday-world-dialog'),close=make('button','설정 닫기'),dialogAdd=make('button','설정에서 세계 추가'),dialogWorlds=make('div',undefined,'weekday-dialog-worlds'),matrix=make('div',undefined,'weekday-access-matrix');close.type=dialogAdd.type='button';close.className='reader-panel-close';dialog.append(close,make('h2','세계와 직접 접근 관계'),make('p','최대 4세계. 삭제된 세계를 참조한 표현·평가기준은 현실로 옮깁니다. 새 세계는 평가점에서 접근하도록 연결합니다.'),dialogAdd,dialogWorlds,make('h3','행에서 열로 접근 (R)'),matrix);doc.body.append(dialog);close.addEventListener('click',()=>dialog.close());configure.addEventListener('click',()=>dialog.showModal());
  let baseline='question',state:WeekdayWorldsState={version:3,actual:6,target:4,contexts:{...PRESET_CONTEXTS['actual-yesterday']},worlds:[{id:0,today:6},{id:1,today:4}],access:defaultAccess(),evaluationWorld:0,example:'question',customized:false,representation:'symbols',logicMode:'calendar',selectionScope:'all',narrowPanel:'reasoning',modeSource:'scene',challenge:freshWeekdayChallenge()};
  let active=false,anchor:number|null=null,timer:number|undefined;
  function captureChallenge(){if(anchor===null||state.challenge.phase!=='running'||state.challenge.playback!=='live')return;const now=doc.defaultView!.performance.now();state={...state,challenge:advanceWeekdayChallenge(state.challenge,Math.max(0,now-anchor))};anchor=now;}
  function stopClock(capture=true){if(capture)captureChallenge();if(timer!==undefined)doc.defaultView!.clearInterval(timer);timer=undefined;anchor=null;}
  function syncClock(){
    if(active&&baseline==='question'&&state.challenge.phase==='running'&&state.challenge.playback==='live'){
      if(anchor!==null)return;anchor=doc.defaultView!.performance.now();timer=doc.defaultView!.setInterval(()=>{captureChallenge();quiz.render(state.challenge,baseline);if(state.challenge.phase==='expired'){stopClock(false);onChange();onSceneRequest('question');}},100);
    }else stopClock();
  }
  function skipChallenge(){captureChallenge();if(state.challenge.phase==='ready'||state.challenge.phase==='running'){stopClock(false);commit({...state,challenge:{...state.challenge,phase:'skipped',playback:'paused',promptTarget:state.challenge.promptTarget??state.target}});}onSceneRequest('question');}
  let worldSignature='';const edgeControls=new Map<string,HTMLInputElement>();
  function commit(next:WeekdayWorldsState){state=normalizeWeekdayState(next);sync();onChange();}
  function syncDialog(){
    const signature=state.worlds.map(w=>w.id).join(',');
    if(signature!==worldSignature){worldSignature=signature;dialogWorlds.replaceChildren();matrix.replaceChildren();edgeControls.clear();matrix.style.gridTemplateColumns=`auto repeat(${state.worlds.length},minmax(44px,1fr))`;matrix.append(make('span','R'));
      for(const w of state.worlds){const heading=make('strong',worldLabel(w.id),'weekday-world-reference');colorWorld(heading,w.id);matrix.append(heading);}
      for(const w of state.worlds){const row=make('div',undefined,'weekday-dialog-world');row.append(make('strong',worldLabel(w.id)));
        colorWorld(row,w.id);const remove=make('button',`${worldLabel(w.id)} 삭제`);colorWorld(remove,w.id);remove.type='button';remove.disabled=w.id===0;remove.addEventListener('click',()=>{const contexts={...state.contexts};for(const key of CONTEXT_KEYS)if(contexts[key]===w.id)contexts[key]=0;commit({...state,contexts,worlds:state.worlds.filter(v=>v.id!==w.id),access:state.access.filter(e=>!e.includes(w.id)),evaluationWorld:state.evaluationWorld===w.id?0:state.evaluationWorld,customized:true});});row.append(remove);dialogWorlds.append(row);
        const heading=make('strong',worldLabel(w.id),'weekday-world-reference');colorWorld(heading,w.id);matrix.append(heading);for(const v of state.worlds){const label=make('label'),check=make('input');label.style.background=`linear-gradient(135deg,${WORLD_COLORS[w.id].tint} 0% 50%,${WORLD_COLORS[v.id].tint} 50% 100%)`;label.style.setProperty('--world-stroke',WORLD_COLORS[w.id].stroke);const checkTitle=`${worldLabel(w.id)} → ${worldLabel(v.id)}`;label.title=checkTitle;label.dataset.from=String(w.id);label.dataset.to=String(v.id);check.type='checkbox';check.setAttribute('aria-label',checkTitle);edgeControls.set(`${w.id},${v.id}`,check);check.addEventListener('change',()=>commit({...state,access:check.checked?[...state.access,[w.id,v.id]]:state.access.filter(e=>e[0]!==w.id||e[1]!==v.id),customized:true}));label.append(check);matrix.append(label);}
      }
    }

    for(const [key,check]of edgeControls)check.checked=state.access.some(e=>e.join(',')===key);dialogAdd.disabled=state.worlds.length>=4;
  }
  function sync(){
    for(const {popup}of contextControls)popup.close();targetPopup.close();
    container.dataset.lessonStage=baseline;frameStatus.hidden=baseline!=='frame-system';frameSystems.render(state,state);const bridgeStage=bridgeScenes.has(baseline),early=introScenes.has(baseline),formal=!early&&!bridgeStage&&baseline!=='contexts',effectiveMode=sceneMode(baseline);container.dataset.disclosure=bridgeStage?'bridge':early?'intro':formal?'formal':'worlds';bridgeContainer.hidden=!bridgeStage;bridge.render(state,baseline);
    comparison.replaceChildren();
    const accessible=weekdayModal(state,state).accessible,terms=accessible.map(id=>`P(${worldSymbol(id)})`),card=make('div');card.append(make('h3','양상 논리 없이 풀어 쓰기 ↔ 양상 논리로 표현'));
    for(const [name,expanded,modal]of [['하나 이상',terms.join(' ∨ ')||'⊥','◇P'],['모두',terms.join(' ∧ ')||'⊤','□P']]){const row=make('p');row.dataset.modalExpansion=modal;worldText(row,`${name}: ${expanded} ↔ ${modal}`);card.append(row);}
    card.append(make('small',`P(w): 그 세계의 오늘은 ${WEEKDAYS[state.target]} · 지금 접근하는 세계들에 대해 전개. 같은 뜻을 세계가 늘어도 같은 연산자로 표현합니다.`));comparison.append(card);
    intro.render((baseline==='question'||baseline==='reason')&&state.challenge.promptTarget!==null?{...state,target:state.challenge.promptTarget}:state,baseline);introSource.dataset.opening=baseline==='question'&&['answered','expired','skipped'].includes(state.challenge.phase)?'reflection':'challenge';quiz.render(state.challenge,baseline);introSource.hidden=!early;introReasoning.hidden=!early||baseline==='question'||baseline==='reason';quote.hidden=early||bridgeStage;quote.setAttribute('aria-label',formal?'문장과 논리 기호의 대응':'문장 속 날짜의 기준');settings.hidden=!formal;footer.hidden=early||bridgeStage;hint.hidden=!formal;right.hidden=bridgeStage||early&&(baseline==='question'||baseline==='reason');logicDiagram.hidden=!formal||baseline==='frame-system';comparison.hidden=baseline!=='modal-comparison';result.hidden=early||bridgeStage||baseline==='frame-system';
    if(!formal&&dialog.open)dialog.close();
    const value=weekdayDeductions(state),m=weekdayModal(state,state),c=state.contexts;container.dataset.narrow=state.narrowPanel;container.dataset.representation=state.representation;container.dataset.logicMode=effectiveMode;
    comparison.hidden=baseline!=='modal-comparison';
    const focused=doc.activeElement;sentence.render(state,state.representation,effectiveMode,Object.fromEntries(contextControls.map(({key,input})=>[key,input])),target,baseline==='modal-comparison');if(focused instanceof HTMLElement&&(focused===target||contextControls.some(({input})=>input===focused)))focused.focus({preventScroll:true});quote.querySelector<HTMLElement>('.weekday-symbol-section')!.hidden=!formal&&baseline!=='contexts';logic.render(state,effectiveMode==='alethic');modal.render(state,state);diagram.hidden=early||bridgeStage||baseline==='modal-comparison'||effectiveMode==='alethic';modalDiagram.hidden=!formal||effectiveMode!=='alethic';target.value=String(state.target);reset.disabled=!state.customized&&state.modeSource==='scene';
    const names=state.worlds.map(w=>[String(w.id),worldName(w.id)] as [string,string]);options(evaluation,names,String(state.evaluationWorld));creationOptions(evaluation);worldOptions(evaluation);scope.value=state.selectionScope;
    for(const {key,input}of contextControls){const available=state.worlds.filter(w=>state.selectionScope==='all'||m.accessible.includes(w.id)).map(w=>[String(w.id),worldName(w.id,key)] as [string,string]);options(input,available,String(c[key]));if(!available.some(([id])=>id===String(c[key]))){const outside=make('option',`${worldName(c[key],key)} · 범위 밖 (기존 선택)`);outside.value=String(c[key]);outside.disabled=true;input.append(outside);input.value=String(c[key]);}creationOptions(input);}
    for(const {input}of contextControls)worldOptions(input);
    for(const [id,button]of buttons)button.setAttribute('aria-pressed',String(CONTEXT_KEYS.every(key=>c[key]===PRESET_CONTEXTS[id][key])));
    worldCount.textContent=`세계 ${state.worlds.length}/4`;add.disabled=state.worlds.length>=4;worldText(relationSummary,`${worldLabel(state.evaluationWorld)}에서 접근: ${m.accessible.map(worldLabel).join(', ')||'없음'} · 필터는 기존 참조를 보존`);
    const labels=['어제','오늘','내일'];viewer.render({worlds:value.worlds.map(w=>({title:worldLabel(w.id),context:w.days[1].length===1?`추론된 오늘: ${WEEKDAYS[w.days[1][0]]}`:w.days[1].length?'오늘 미정 · 7가지 가능':'조건을 만족하는 달력 없음',cells:labels.map((label,i)=>({label,value:w.days[i].length===1?WEEKDAYS[w.days[i][0]]:w.days[i].length?'미정':'해 없음',linked:i===0&&c.yesterday===w.id||i===2&&c.tomorrow===w.id}))})),relation:'',note:'두 조건으로 계산 · 화살표만으로 날짜가 정해지지는 않음'});
    diagram.querySelectorAll<HTMLElement>('.world-card').forEach((card,i)=>colorWorld(card,value.worlds[i].id));
    const answer=value.questionCandidates.map(d=>WEEKDAYS[d]).join(', '),status=value.kind==='direct'?'조건의 재확인':value.kind==='reversed'?'다른 세계의 답':'현실 답';
    result.textContent=value.kind==='impossible'?'조건을 만족하는 달력 없음 · 요일 답 추출 중지':value.kind==='underdetermined'?`질문 세계의 가능한 요일 ${value.questionCandidates.length}개 · 답을 하나로 정할 수 없음`:`${status}: ${answer} · 두 조건을 만족하는 모든 경우에 성립`;
    syncDialog();if(doc.activeElement instanceof HTMLElement&&container.contains(doc.activeElement)&&!doc.activeElement.checkVisibility())doc.activeElement.blur();alignment.refresh();syncClock();
  }
  function load(example:string){const e=EXAMPLES[example],contexts={...PRESET_CONTEXTS[e.rule]},base=interpretWeekdayWorlds({actual:e.actual,target:e.target,contexts});state={...state,actual:e.actual,target:e.target,contexts,worlds:e.rule==='same-context'?[{id:0,today:e.actual}]:[{id:0,today:e.actual},{id:1,today:base.imaginedDays?.[1]??e.actual}],access:e.rule==='same-context'?[[0,0]]:defaultAccess(),evaluationWorld:0,selectionScope:'all',example,customized:false,logicMode:state.modeSource==='scene'?sceneMode(baseline):state.logicMode};sync();}
  function withAddedWorld(id:WorldIndex):WeekdayWorldsState{
    if(id===0||state.worlds.some(w=>w.id===id))throw new RangeError('World already exists');
    return {...state,worlds:[...state.worlds,{id,today:state.target}].sort((a,b)=>a.id-b.id),access:[...state.access,[id,id],[state.evaluationWorld,id]],customized:true};
  }
  function chosenWorld(value:string){
    const creation=/^new:([1-3])$/.exec(value),id=Number(creation?.[1]??value);
    if(!/^[0-3]$/.test(creation?.[1]??value)||!WORLD_IDS.includes(id as WorldIndex))throw new RangeError('Unknown world choice');
    const next=creation?withAddedWorld(id as WorldIndex):state;
    if(!next.worlds.some(w=>w.id===id))throw new RangeError('World must be created explicitly');
    return {next,id:id as WorldIndex};
  }
  for(const {key,input}of contextControls)input.addEventListener('change',()=>{const {next,id}=chosenWorld(input.value);commit({...next,contexts:{...next.contexts,[key]:id},customized:true});});
  target.addEventListener('change',()=>commit({...state,target:Number(target.value),customized:true}));
  evaluation.addEventListener('change',()=>{const {next,id}=chosenWorld(evaluation.value);commit({...next,evaluationWorld:id,customized:true});});scope.addEventListener('change',()=>commit({...state,selectionScope:scope.value as 'all'|'accessible'}));
  function addWorld(){const id=WORLD_IDS.find(id=>!state.worlds.some(w=>w.id===id));if(id!==undefined)commit(withAddedWorld(id));}
  add.addEventListener('click',addWorld);dialogAdd.addEventListener('click',addWorld);
  for(const [id,button]of buttons)button.addEventListener('click',()=>{const e=EXAMPLES[id==='imagined-yesterday'?'wednesday':id==='same-context'?'literal':'sunday'],targetDay=state.target,actualDay=id==='same-context'?state.actual:interpretWeekdayWorlds({actual:state.actual,target:targetDay,contexts:PRESET_CONTEXTS[id]}).actualCandidates[0];const example=state.example;load(id==='imagined-yesterday'?'wednesday':id==='same-context'?'literal':'sunday');const delta=targetDay-e.target;commit({...state,example,target:targetDay,actual:actualDay,worlds:state.worlds.map(w=>({id:w.id,today:id==='same-context'?actualDay:((w.today+delta)%7+7)%7})),customized:true});});
  reset.addEventListener('click',()=>{state={...state,modeSource:'scene'};load(baseline);onChange();});sync();
  return {
    getState(){captureChallenge();return clone(state);},setActive(next:boolean){active=next;syncClock();},beforeNext(){if(baseline==='question'&&(state.challenge.phase==='ready'||state.challenge.phase==='running')){skipChallenge();return true;}return false;},validateState(next:unknown){normalizeWeekdayState(next);},setState(next:unknown){const normalized=normalizeWeekdayState(next);stopClock(false);state=normalized;sync();onChange();},
    suggest(suggestion?:Scene['suggestion']){if(suggestion&&!('example'in suggestion))throw new TypeError('Expected weekday example');const example=suggestion?.example??baseline;if(!Object.hasOwn(EXAMPLES,example))throw new RangeError('Unknown weekday example');baseline=example;if(!state.customized&&state.example!==example)load(example);else{if(state.modeSource==='scene')state={...state,logicMode:sceneMode(example)};sync();}},
    reset(){stopClock(false);state={...state,modeSource:'scene',challenge:freshWeekdayChallenge()};load(baseline);},seek(ms:number){const challenge=weekdayChallengeAt(ms,state.target);stopClock(false);state={...state,challenge};sync();onChange();},inspect(){captureChallenge();return {...clone(state),result:interpretWeekdayWorlds(state),modal:weekdayModal(state,state),frameSystems:modalFrameSystems(state.worlds.map(w=>w.id),state),alignment:alignment.getState()};},
    describe(scene:Scene){const value=interpretWeekdayWorlds(state);
      if(scene.id==='reason')return {status:'adapted',text:'왜 그 요일이라고 생각했나요? 어떤 날을 기준으로 삼았는지 떠올려 보세요. 이유를 적어도 좋고 머릿속으로만 정리해도 좋습니다. 아직 정답은 판정하지 않습니다.'};
      if(introScenes.has(scene.id))return {status:'adapted',text:scene.id==='question'?'시작을 누르고 20초 안에 요일을 골라 보세요. 답을 고르거나 시간이 끝나면 생각한 이유를 돌아봅니다.':value.questionCandidates.length===1?`지금 선택한 조건으로 물은 오늘은 ${WEEKDAYS[value.questionCandidates[0]]}입니다. 오른쪽에서 요일을 차례로 따라가 보세요.`:value.questionCandidates.length?'지금 선택한 조건으로는 물은 오늘의 요일을 하나로 정할 수 없습니다.':'지금 선택한 조건에 맞는 날짜가 없습니다.'};
      if(scene.id==='contexts')return {status:'adapted',text:'세계별 오늘을 다른 변수로 두고 날짜 조건을 연결했습니다. 양상 연산자 없이도 가능세계를 모델링할 수 있습니다. 표현을 눌러 기준을 바꿀 수 있으며 앞서 고른 설정은 유지됩니다.'};
      if(scene.id==='frame-system'){const result=modalFrameSystems(state.worlds.map(w=>w.id),state);return {status:'adapted',text:'가능세계 자체가 특정 체계에 속하는 것은 아닙니다. 기본 관계는 반사적·전이적이라 S4 조건을 만족합니다. 현재 관계가 만족하는 체계 조건: '+Object.entries(result.systems).filter(([,yes])=>yes).map(([name])=>name).join(' · ')+'. 편집기는 임의의 관계를 허용하므로 공통 보장은 K입니다.'};}
      if(scene.id==='modal-systems')return {status:'adapted',text:'공통 바탕은 고전 논리·K 공리·전건 긍정·필연화입니다. D·T·B·S4·S5는 접근 관계에 조건을 더합니다. 하나의 모형에서 P가 참인지와, 모든 명제값 배정에 대해 공리가 보장되는지는 구별합니다.'};
      if(scene.id==='nonmodal-proof'){const proof=weekdayClassicalProof(state);return {status:'adapted',text:proof.supported?'문제가 묻는 A인 경우를 가정하여 전건 긍정으로 B를 얻습니다. 날짜 대응을 ≡₇로 표현하고 덧셈·대칭·추이 규칙을 적용하면 현실의 오늘은 '+WEEKDAYS[proof.answer!]+'입니다. 문제의 가정 아래에서 얻은 답이며, 양상 연산자는 쓰지 않았습니다.':'현재 기준 선택에는 기본 t·h 풀이를 그대로 적용하지 않습니다. '+(proof.answer===null?'질문의 요일을 하나로 추출하지 않습니다.':'현재 조건의 질문 답은 '+WEEKDAYS[proof.answer]+'입니다.')};}
      if(bridgeScenes.has(scene.id))return {status:'adapted',text:scene.id==='conditional'?'설명의 편의를 위해 “만약 어제가 내일이라면, 오늘이 '+WEEKDAYS[state.target]+'이다.”로 단순화합니다. 그 가정 아래 요일을 계산해 봅시다.':scene.id==='notation'?'세계별 오늘과 날짜 대응을 식 A·B로 나타냈습니다. A → B에 추론 규칙을 적용할 수 있으며, 문장과 식을 가리키면 대응 부분이 함께 강조됩니다.':scene.id==='inference'?'전건 긍정·후건 부정·논리곱 도입/제거·선언 삼단논법처럼 여러 규칙이 있습니다. 다음 풀이에서는 전건 긍정과 날짜의 대입·계산을 사용합니다.':'K 공리와 필연화는 정규 양상 논리의 기본 도구입니다. 필연화는 가정 없이 증명한 정리에만 적용합니다. T 같은 추가 공리는 접근 관계에 조건을 요구합니다.'};
      if(scene.id==='modal-comparison')return {status:'adapted',text:'현재 접근 세계의 P들을 ∨로 연결하면 ◇P, ∧로 연결하면 □P와 같은 뜻입니다. 세계 수가 바뀌어도 양상 연산자는 그대로입니다. 원문 전체의 번역이 아니라 요일 명제의 의미를 비교합니다.'};
      if(value.kind==='impossible')return {status:'adapted',text:'지금 선택한 두 조건은 같은 달력에서 성립할 수 없습니다. 고전 논리에서는 모순 폭발로 어떤 요일 명제도 도출됩니다. 현실의 사실을 확인한 것은 아니며, 계산기는 해가 없어 답 추출을 멈춥니다. 접근 관계 자체는 날짜의 등식을 추가하지 않습니다.'};
      if(value.kind==='underdetermined')return {status:'adapted',text:`질문 세계 ${worldLabel(state.contexts.question)}의 요일은 ${value.questionCandidates.length}개가 가능합니다. 새 세계를 추가하는 것만으로 그 세계와 기존 달력 사이의 날짜 대응이 생기지는 않습니다.`};
      if(sceneMode(scene.id)==='alethic')return {status:'adapted',text:'이 세계의 오늘이 목표 요일이라는 명제 P를 봅시다. ◇P는 접근 세계 하나 이상에서 P, □P는 전부에서 P입니다. 세계의 요일은 두 달력 조건으로 계산하며, 접근 화살표를 바꾸면 양상 판정 범위가 달라집니다.'};
      const answer=WEEKDAYS[value.questionCandidates[0]];return {status:'adapted',text:value.kind==='direct'?`질문의 오늘과 목표의 오늘이 같은 기준이어서 ${answer}은 조건의 재확인입니다.`:value.kind==='reversed'?`지금은 ${worldLabel(state.contexts.question)}의 오늘을 묻고 있으며 답은 ${answer}입니다. 현실 오늘을 묻는 질문과 구별하세요.`:`선택한 두 조건을 만족하는 모든 달력에서 현실 오늘은 ${answer}로 도출됩니다. `+(scene.id==='contexts'?'날짜의 기준과 양상 접근 관계는 별개의 선택입니다.':'식의 각 항과 원문의 네 표현을 대응해 보세요.')};
    },
  };
}
