import {deriveProof,LIMITS} from '../../packages/models/propositional.mjs';
import {bindFormulaInput,displayFormula} from './formula-display.mjs';
const copy=value=>structuredClone(value);

export function normalizeExperimentInput(input){
  if(!input||!Array.isArray(input.premises)||input.premises.length>LIMITS.premises||typeof input.goal!=='string')throw new TypeError('전제는 최대 8개, 목표는 명제식 문자열이어야 합니다.');
  const premises=input.premises.map(row=>{
    if(typeof row==='string')return {formula:displayFormula(row),enabled:true};
    if(!row||typeof row.formula!=='string'||typeof row.enabled!=='boolean')throw new TypeError('전제의 식과 포함 여부를 확인하세요.');
    return {formula:displayFormula(row.formula),enabled:row.enabled};
  });
  return {premises,goal:displayFormula(input.goal)};
}
export function evaluateExperimentInput(input){
  const draft=normalizeExperimentInput(input),premises=draft.premises.filter(row=>row.enabled).map(row=>row.formula.trim()),goal=draft.goal.trim();
  try{
    if(!goal||premises.some(formula=>!formula))throw new SyntaxError('포함한 전제와 목표의 식을 완성하세요.');
    const proof=deriveProof({premises,goal});
    return {valid:true,premises,goal:proof.goal,proof,error:null};
  }catch(error){return {valid:false,premises,goal,proof:null,error:displayFormula(error.message)};}
}
export function createPremiseExperiment({suggestion,onChange}={}){
  let baseline=normalizeExperimentInput(suggestion),input=copy(baseline),customized=false;
  const getState=()=>({...copy(input),customized});
  const inspect=()=>({...evaluateExperimentInput(input),input:copy(input),suggestion:copy(baseline),customized});
  const notify=()=>onChange?.(inspect());
  return {getState,inspect,
    setState(next){const checked=normalizeExperimentInput(next);if(next.customized!==undefined&&typeof next.customized!=='boolean')throw new TypeError('customized must be boolean');input=checked;customized=next.customized??true;notify();},
    suggest(next){baseline=normalizeExperimentInput(next);if(!customized)input=copy(baseline);notify();},
    reset(){input=copy(baseline);customized=false;notify();}
  };
}

// Shared input view. Both the explanatory page and the dedicated lab own the result view.
export function mountPremiseEditor({container,goalInput,addButton,syntaxId,onInput=()=>{},readOnly=false}){
  const doc=container.ownerDocument;let number=0;
  const notify=event=>onInput(event);
  const updateLimit=()=>{if(addButton)addButton.disabled=readOnly||container.children.length>=LIMITS.premises;};
  function addRow(value='',enabled=true){
    if(container.children.length>=LIMITS.premises)return;
    const id=++number,row=doc.createElement('div');row.className='premise-row';
    const label=doc.createElement('label');label.className='premise-enabled';
    const check=doc.createElement('input');check.type='checkbox';check.checked=enabled;check.disabled=readOnly;check.setAttribute('aria-label',`전제 ${id} 포함`);
    const marker=doc.createElement('span');marker.textContent='전제';label.append(check,marker);
    const input=doc.createElement('input');input.type='text';input.value=displayFormula(value);input.disabled=!enabled;input.readOnly=readOnly;input.autocomplete='off';input.spellcheck=false;input.maxLength=LIMITS.characters;input.placeholder='예: P → Q';input.setAttribute('aria-label',`전제 ${id} 명제식`);if(syntaxId)input.setAttribute('aria-describedby',syntaxId);
    row.classList.toggle('excluded',!enabled);row.append(label,input);
    if(!readOnly){
      const remove=doc.createElement('button');remove.type='button';remove.className='remove-premise';remove.textContent='×';remove.setAttribute('aria-label',`전제 ${id} 삭제`);
      remove.addEventListener('click',()=>{row.remove();updateLimit();notify();addButton?.focus();});row.append(remove);
      check.addEventListener('change',()=>{row.classList.toggle('excluded',!check.checked);input.disabled=!check.checked;notify();});
      bindFormulaInput(input);input.addEventListener('input',notify);input.addEventListener('compositionend',notify);
    }
    container.append(row);updateLimit();return input;
  }
  const getState=()=>({premises:[...container.children].map(row=>({formula:row.querySelector('input[type=text]').value,enabled:row.querySelector('input[type=checkbox]').checked})),goal:goalInput.value});
  goalInput.readOnly=readOnly;
  if(!readOnly){bindFormulaInput(goalInput);goalInput.addEventListener('input',notify);goalInput.addEventListener('compositionend',notify);}
  addButton?.addEventListener('click',()=>{const input=addRow();notify();input?.focus();});
  if(addButton&&readOnly)addButton.hidden=true;
  return {getState,addRow,setState(next){const checked=normalizeExperimentInput(next);container.replaceChildren();number=0;checked.premises.forEach(row=>addRow(row.formula,row.enabled));goalInput.value=checked.goal;updateLimit();}};
}

let experimentInstance=0;
export function mountPremiseExperiment(container,{suggestion,onChange=()=>{},idPrefix=container.id||('experiment-'+(++experimentInstance))}={}){
  const doc=container.ownerDocument,make=(tag,text)=>{const node=doc.createElement(tag);if(text)node.textContent=text;return node;};
  container.classList.add('premise-experiment');
  const heading=make('div');heading.className='experiment-heading';
  const label=make('strong','전제'),add=make('button','+ 전제');add.type='button';heading.append(label,add);
  const rows=make('div');rows.className='experiment-premises';
  const goalLabel=make('label','목표'),goal=make('input');goal.type='text';goal.autocomplete='off';goal.spellcheck=false;goal.maxLength=LIMITS.characters;goal.setAttribute('aria-label','목표 명제식');goalLabel.append(goal);goalLabel.className='experiment-goal';
  const reset=make('button','장면 예시로');reset.type='button';reset.className='experiment-reset';
  const status=make('p');status.className='experiment-mode';status.setAttribute('role','status');
  const syntax=make('p','P, Q… · ¬ ∧ ∨ → · 괄호 ( )');syntax.className='experiment-syntax';syntax.id=`${idPrefix}-syntax`;
  container.replaceChildren(heading,rows,goalLabel,reset,status,syntax);
  let editor;
  const model=createPremiseExperiment({suggestion,onChange(info){status.textContent=info.customized?'내 실험 · 장면을 넘겨도 입력 유지':'장면이 제안하는 예시';reset.disabled=!info.customized;onChange(info);}});
  editor=mountPremiseEditor({container:rows,goalInput:goal,addButton:add,syntaxId:syntax.id,onInput(){model.setState(editor.getState());}});
  const sync=()=>editor.setState(model.getState());
  reset.addEventListener('click',()=>{model.reset();sync();});
  sync();
  return {getState:model.getState,inspect:model.inspect,
    setState(state){model.setState(state);sync();},
    suggest(state){model.suggest(state);if(!model.getState().customized)sync();},
    reset(){model.reset();sync();}
  };
}
