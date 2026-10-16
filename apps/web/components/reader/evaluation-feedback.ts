export interface EvaluationFeedback {available:boolean;summary:string;detail:string}
// Domain-neutral availability UI. The caller owns evaluation and explanatory copy.
export function mountEvaluationFeedback({content,message}:{content:HTMLElement;message:HTMLElement}){
  const initial={available:true,summary:'',detail:''};
  let state=initial;
  const getState=()=>({...state});
  function setState(next:EvaluationFeedback){
    if(typeof next?.available!=='boolean'||typeof next.summary!=='string'||typeof next.detail!=='string')throw new TypeError('Invalid evaluation feedback');
    if(!next.available&&!next.summary)throw new TypeError('Unavailable content needs a reason');
    state={available:next.available,summary:next.summary,detail:next.detail};
    content.hidden=!state.available;content.setAttribute('aria-disabled',String(!state.available));
    message.hidden=!state.summary;
    message.classList.add('evaluation-feedback');message.dataset.availability=state.available?'available':'unavailable';
    message.setAttribute('role','status');message.setAttribute('aria-live','polite');
    const doc=message.ownerDocument,summary=doc.createElement('strong'),detail=doc.createElement('span');
    summary.textContent=state.summary;detail.textContent=state.detail;message.replaceChildren(summary,detail);
  }
  setState(initial);
  return {getState,setState,reset:()=>setState(initial)};
}
