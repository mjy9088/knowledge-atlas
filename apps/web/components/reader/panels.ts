import {eventElement} from '../dom.js';
// Evidence and further reading stay available without extending the reading viewport.
export function mountReaderPanels(entries:{element:HTMLElement|null;title:string}[]){
  const panels:{element:HTMLElement;dialog:HTMLDialogElement;open:(trigger?:HTMLElement)=>void}[]=[];
  for(const {element,title}of entries){
    if(!element)continue;
    const dialog=document.createElement('dialog');dialog.className='reader-panel';dialog.setAttribute('aria-label',title);
    const close=document.createElement('button');close.type='button';close.className='reader-panel-close';close.textContent='닫기 ×';
    let opener:HTMLElement|undefined;
    close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());
    dialog.append(close,element);document.body.append(dialog);
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    const open=(trigger?:HTMLElement)=>{opener=trigger;for(const menu of document.querySelectorAll<HTMLDetailsElement>('.reader-menu'))menu.open=false;for(const other of document.querySelectorAll<HTMLDialogElement>('dialog[open]'))if(other!==dialog)other.close();if(!dialog.open)dialog.showModal();};
    panels.push({element,dialog,open});
  }
  function openHash(hash:string,trigger?:HTMLElement){
    let target;try{target=document.getElementById(decodeURIComponent(hash.replace(/^#/,'')));}catch{return false;}
    const panel=panels.find(panel=>target&&(panel.element===target||panel.element.contains(target)));
    if(!panel)return false;
    panel.open(trigger);return true;
  }
  document.addEventListener('click',event=>{const link=eventElement(event)?.closest<HTMLAnchorElement>('a[href^="#"]');if(link&&openHash(link.hash,link))event.preventDefault();});
  return {openHash};
}
