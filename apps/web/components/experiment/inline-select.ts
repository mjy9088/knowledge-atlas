// Keep native select state/validation, but render its choices in the captured DOM.
let nextId=0;
export function mountInlineSelect(select:HTMLSelectElement){
  const doc=select.ownerDocument,popup=doc.createElement('div');popup.id=`inline-select-${++nextId}`;popup.className='inline-select-popup';popup.popover='auto';popup.setAttribute('role','listbox');popup.setAttribute('aria-label',select.getAttribute('aria-label')??'기준 선택');
  select.setAttribute('aria-controls',popup.id);select.setAttribute('aria-expanded','false');doc.body.append(popup);
  const opened=()=>popup.matches(':popover-open');
  function close(restore=false){if(opened())popup.hidePopover();select.setAttribute('aria-expanded','false');if(restore)select.focus({preventScroll:true});}
  function buttons(){return [...popup.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];}
  function open(){
    popup.replaceChildren();
    for(const child of select.children){
      if(child instanceof HTMLOptGroupElement){const heading=doc.createElement('p');heading.className='inline-select-group';heading.textContent=child.label;popup.append(heading);for(const option of child.children)if(option instanceof HTMLOptionElement)add(option);}
      else if(child instanceof HTMLOptionElement)add(child);
    }
    function add(option:HTMLOptionElement){const button=doc.createElement('button');button.type='button';button.setAttribute('role','option');button.setAttribute('aria-selected',String(option.selected));button.textContent=option.textContent;button.disabled=option.disabled;button.style.cssText=option.style.cssText;button.dataset.value=option.value;popup.append(button);button.addEventListener('click',()=>{close();select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));select.focus({preventScroll:true});});}
    const fitted=doc.documentElement.dataset.desktopScale!==undefined,scale=Number(doc.documentElement.dataset.desktopScale??1),r=select.getBoundingClientRect(),frame=doc.body.getBoundingClientRect(),viewportLeft=frame.left/scale,viewportWidth=frame.width/scale,viewportHeight=fitted?540:doc.documentElement.clientHeight,width=Math.min(330,viewportWidth-24),height=Math.min(280,viewportHeight-24),left=r.left/scale,top=r.top/scale,bottom=r.bottom/scale,below=viewportHeight-bottom;
    popup.style.width=`${width}px`;popup.style.maxHeight=`${height}px`;popup.style.left=`${Math.max(viewportLeft+12,Math.min(left,viewportLeft+viewportWidth-width-12))}px`;popup.style.top=`${below>=Math.min(height,160)?bottom+4:Math.max(12,top-height-4)}px`;
    if(!opened())popup.showPopover();popup.style.top=`${Math.max(12,Math.min(parseFloat(popup.style.top),viewportHeight-popup.getBoundingClientRect().height/scale-12))}px`;select.setAttribute('aria-expanded','true');
    (popup.querySelector<HTMLButtonElement>('button[aria-selected=true]:not(:disabled)')??buttons()[0])?.focus({preventScroll:true});
  }
  const pointer=(event:PointerEvent)=>event.preventDefault(),click=(event:MouseEvent)=>{event.preventDefault();open();};
  const key=(event:KeyboardEvent)=>{if(['Enter',' ','ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open();}else if(event.key==='Escape')close();};
  const menuKey=(event:KeyboardEvent)=>{event.stopPropagation();const options=buttons(),index=options.indexOf(doc.activeElement as HTMLButtonElement);if(event.key==='Escape'){event.preventDefault();close(true);}else if(event.key==='Tab')close(true);else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next]?.focus({preventScroll:true});}};
  const toggled=()=>{select.setAttribute('aria-expanded',String(opened()));};
  const resize=()=>{if(opened())close(true);};
  select.addEventListener('pointerdown',pointer);select.addEventListener('click',click);select.addEventListener('keydown',key);popup.addEventListener('keydown',menuKey);popup.addEventListener('toggle',toggled);addEventListener('resize',resize);
  return {close,destroy(){close();select.removeEventListener('pointerdown',pointer);select.removeEventListener('click',click);select.removeEventListener('keydown',key);removeEventListener('resize',resize);popup.remove();}};
}
