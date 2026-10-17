import {deducedWeekdayModal,type ModalFrame} from '/packages/models/weekday-modal.js';
import {weekdayDeductions,WEEKDAYS,worldSymbol,CONTEXT_KEYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {WORLD_COLORS,worldText,worldLabel} from './weekday-world-style.js';

export function mountWeekdayModal(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-modal-diagram';container.setAttribute('role','group');container.setAttribute('aria-label','가능세계에서 가능성과 필연성 확인');
  const make=(tag:string,text:string,cls:string)=>{const node=doc.createElement(tag);worldText(node,text);node.className=cls;return node;};
  return {render(input:WeekdayInterpretation,frame:ModalFrame){
    const result=deducedWeekdayModal(input,frame),worlds=weekdayDeductions(input).worlds;container.replaceChildren();
    const summary=make('p',`지시어 기준 세계 · R(${worldSymbol(frame.evaluationWorld)}) = {${result.accessible.map(worldSymbol).join(', ')}}`,'weekday-modal-frame');
    const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 55 600 150');svg.setAttribute('role','img');svg.setAttribute('aria-label',`기준 세계의 접근 화살표 ${frame.access.map(e=>e.map(worldLabel).join(' → ')).join(', ')||'없음'}. 화살표는 살펴볼 세계의 범위를 나타냅니다.`);
    const shape=(tag:string,attrs:Record<string,string|number>,text?:string,parent:Element=svg)=>{const node=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,String(value));if(text)node.textContent=text;parent.append(node);return node;};
    const defs=shape('defs',{}),marker=shape('marker',{id:'weekday-modal-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'},undefined,defs);shape('path',{d:'M0,0 L10,5 L0,10 Z',fill:'#6d8c83'},undefined,marker);
    const positions=worlds.length===1?[[300,130]]:worlds.length===2?[[150,130],[450,130]]:worlds.length===3?[[90,130],[300,130],[510,130]]:[[60,130],[220,130],[380,130],[540,130]];
    for(const [from,to]of frame.access){const a=worlds.findIndex(w=>w.id===from),b=worlds.findIndex(w=>w.id===to),[x,y]=positions[a],[u,v]=positions[b];
      let d:string;
      if(a===b)d=`M ${x-20} ${y-30} C ${x-75} ${y-55}, ${x+75} ${y-55}, ${x+20} ${y-30}`;
      else{const dx=u-x,dy=v-y,len=Math.hypot(dx,dy),nx=dx/len,ny=dy/len,bend=Math.abs(a-b)>1?(Math.abs(a-b)%2?-130:130):frame.access.some(e=>e[0]===to&&e[1]===from)?20:0;d=`M ${x+nx*39} ${y+ny*39} Q ${(x+u)/2-ny*bend} ${(y+v)/2+nx*bend} ${u-nx*42} ${v-ny*42}`;}
      shape('path',{d,fill:'none',stroke:'#6d8c83','stroke-width':2,'marker-end':'url(#weekday-modal-arrow)'});
    }
    worlds.forEach((w,i)=>{const [x,y]=positions[i],accessible=result.accessible.includes(w.id),color=WORLD_COLORS[w.id];shape('circle',{cx:x,cy:y,r:37,fill:color.tint,stroke:color.stroke,'stroke-width':frame.evaluationWorld===w.id?5:2,'data-world':w.id});if(accessible)shape('circle',{cx:x,cy:y,r:42,fill:'none',stroke:color.stroke,'stroke-width':1.5,'stroke-dasharray':'4 3'});shape('text',{x,y:y-12,'text-anchor':'middle',class:'weekday-modal-label'},worldLabel(w.id));shape('text',{x,y:y+6,'text-anchor':'middle',class:'weekday-modal-day'},w.days[1].length===1?WEEKDAYS[w.days[1][0]]:w.days[1].length?'미정':'해 없음');const roles=CONTEXT_KEYS.flatMap((key,index)=>input.contexts[key]===w.id?['①②③④'[index]]:[]).join('·');shape('text',{x,y:y+23,'text-anchor':'middle',class:'weekday-modal-value'},roles?roles+' 기준':'기준 미배정');});
    const truth=(value:boolean|null)=>value===null?'미정':value?'참':'거짓';
    const translation=make('div',`P: 이 세계의 오늘은 ${WEEKDAYS[input.target]}`,'weekday-modal-proposition');
    const note=make('p',result.consistent?`P: ${truth(result.actual)} · ◇P: ${truth(result.diamond)} · □P: ${truth(result.box)}`:'조건을 만족하는 달력 없음 · 양상 판정 중지','weekday-modal-verdict');
    const limit=make('p',result.accessible.length===0?'접근 세계 없음: ◇P는 거짓, □P는 공허한 참 (달력 해가 있을 때)': '◇ 하나 이상 · □ 전부 · 미정은 가능한 달력들 사이에 판정이 다른 경우','weekday-modal-limit');container.append(summary,svg,translation,note,limit);
  }};
}
