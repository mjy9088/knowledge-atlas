import {createAlignmentModel,type AlignmentNode,type AlignmentState} from '/packages/experiments/semantic-alignment.js';
export type AlignmentSide='source'|'symbol';
export function markAlignment<T extends HTMLElement>(node:T,id:string,side:AlignmentSide):T{
  node.dataset.alignmentNode=id;node.dataset.alignmentSide=side;node.classList.add('alignment-node');node.tabIndex=0;return node;
}

// Delegation supports repeated/discontinuous fragments and DOM refreshed by an adapter.
export function mountSemanticAlignment(root:HTMLElement,nodes:readonly AlignmentNode[],status:HTMLElement,{instruction='가리키거나 Tab으로 대응 경로를 확인하세요.',pathPrefix='대응 경로: '}:{instruction?:string;pathPrefix?:string}={}){
  const model=createAlignmentModel(nodes);let state:AlignmentState={activeId:null},pointer:string|null=null,focus:string|null=null;
  const elements=()=>[...root.querySelectorAll<HTMLElement>('[data-alignment-node][data-alignment-side]')];
  function paint(id:string|null){
    state={activeId:id};const path=id===null?[]:model.path(id);root.style.setProperty('--alignment-path-depth',String(Math.max(0,path.length-1)));
    for(const node of elements()){
      const depth=path.indexOf(node.dataset.alignmentNode!);node.toggleAttribute('data-alignment-on-path',depth>=0);node.toggleAttribute('data-alignment-current',node.dataset.alignmentNode===id);
      if(depth>=0)node.style.setProperty('--alignment-depth',String(depth));else node.style.removeProperty('--alignment-depth');
    }
    status.textContent=path.length?pathPrefix+path.map(model.label).join(' → '):instruction;
  }
  function closest(target:EventTarget|null){const node=target instanceof Element?target.closest<HTMLElement>('[data-alignment-node][data-alignment-side]'):null;return node&&root.contains(node)?node:null;}
  const activate=()=>{const id=pointer??focus;if(state.activeId!==id)paint(id);};
  function over(event:PointerEvent){pointer=closest(event.target)?.dataset.alignmentNode??null;activate();}
  function out(){pointer=null;activate();}
  function focused(event:FocusEvent){pointer=null;focus=closest(event.target)?.dataset.alignmentNode??null;activate();}
  function blurred(event:FocusEvent){focus=closest(event.relatedTarget)?.dataset.alignmentNode??null;activate();}
  function key(event:KeyboardEvent){if(!closest(event.target)||event.target instanceof Element&&event.target.closest('input,select,textarea,button'))return;if(event.key==='Escape'){event.preventDefault();reset();if(root.ownerDocument.activeElement instanceof HTMLElement)root.ownerDocument.activeElement.blur();}else if(event.key==='Enter'||event.key===' '){event.preventDefault();pointer=null;focus=closest(event.target)!.dataset.alignmentNode!;activate();}}
  function reset(){pointer=focus=null;paint(null);}
  root.addEventListener('pointermove',over);root.addEventListener('pointerleave',out);root.addEventListener('focusin',focused);root.addEventListener('focusout',blurred);root.addEventListener('keydown',key);
  return {
    getState:():AlignmentState=>({...state}),setState(value:unknown){const next=model.validate(value);pointer=focus=null;paint(next.activeId);},reset,
    refresh(){for(const node of elements()){const path=model.path(node.dataset.alignmentNode!);if(node.dataset.alignmentSide!=='source'&&node.dataset.alignmentSide!=='symbol')throw new TypeError('Unknown alignment side');node.title=path.map(model.label).join(' → ');node.setAttribute('aria-description',node.title);}reset();},
    destroy(){root.removeEventListener('pointermove',over);root.removeEventListener('pointerleave',out);root.removeEventListener('focusin',focused);root.removeEventListener('focusout',blurred);root.removeEventListener('keydown',key);reset();},
  };
}
