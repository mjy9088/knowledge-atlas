import {weekdayModal,type ModalFrame} from '/packages/models/weekday-modal.js';
import {interpretWeekdayWorlds,WEEKDAYS,worldSymbol,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {WORLD_COLORS,worldText,worldLabel} from './weekday-world-style.js';
export function mountWeekdayModal(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-modal-diagram';container.setAttribute('role','group');container.setAttribute('aria-label','접근 관계와 진리 양상 평가');
  const make=(tag:string,text:string,cls:string)=>{const node=doc.createElement(tag);worldText(node,text);node.className=cls;return node;};
  return {render(input:WeekdayInterpretation,frame:ModalFrame){
    const result=weekdayModal(input,frame),worlds=interpretWeekdayWorlds(input).worldDays;container.replaceChildren();
    const summary=make('p',`R(${worldSymbol(frame.evaluationWorld)}) = {${result.accessible.map(worldSymbol).join(', ')}} · P: 오늘이 ${WEEKDAYS[input.target]}`,'weekday-modal-frame');
    const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',worlds.length<4?'0 55 600 150':'0 0 600 260');svg.setAttribute('role','img');svg.setAttribute('aria-label',`접근 화살표 ${frame.access.map(e=>e.map(worldLabel).join(' → ')).join(', ')||'없음'}. P가 참인 세계: ${result.valuation.map(worldLabel).join(', ')||'없음'}`);
    const shape=(tag:string,attrs:Record<string,string|number>,text?:string,parent:Element=svg)=>{const node=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,String(value));if(text)node.textContent=text;parent.append(node);return node;};
    const defs=shape('defs',{}),marker=shape('marker',{id:'weekday-modal-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto'},undefined,defs);shape('path',{d:'M0,0 L10,5 L0,10 Z',fill:'#6d8c83'},undefined,marker);
    const positions=worlds.length===1?[[300,130]]:worlds.length===2?[[150,130],[450,130]]:worlds.length===3?[[90,130],[300,130],[510,130]]:[[135,65],[465,65],[135,195],[465,195]];
    for(const [from,to]of frame.access){const a=worlds.findIndex(w=>w.id===from),b=worlds.findIndex(w=>w.id===to),[x,y]=positions[a],[u,v]=positions[b];
      let d:string;
      if(a===b)d=`M ${x-20} ${y-30} C ${x-75} ${y-55}, ${x+75} ${y-55}, ${x+20} ${y-30}`;
      else{const dx=u-x,dy=v-y,len=Math.hypot(dx,dy),nx=dx/len,ny=dy/len,bend=frame.access.some(e=>e[0]===to&&e[1]===from)?20:0;d=`M ${x+nx*39} ${y+ny*39} Q ${(x+u)/2-ny*bend} ${(y+v)/2+nx*bend} ${u-nx*42} ${v-ny*42}`;}
      shape('path',{d,fill:'none',stroke:'#6d8c83','stroke-width':2,'marker-end':'url(#weekday-modal-arrow)'});
    }
    worlds.forEach((w,i)=>{const [x,y]=positions[i],truth=result.valuation.includes(w.id),accessible=result.accessible.includes(w.id),color=WORLD_COLORS[w.id];shape('circle',{cx:x,cy:y,r:37,fill:color.tint,stroke:color.stroke,'stroke-width':frame.evaluationWorld===w.id?5:2,'data-world':w.id});if(accessible)shape('circle',{cx:x,cy:y,r:42,fill:'none',stroke:color.stroke,'stroke-width':1.5,'stroke-dasharray':'4 3'});shape('text',{x,y:y-12,'text-anchor':'middle',class:'weekday-modal-label'},worldLabel(w.id));shape('text',{x,y:y+6,'text-anchor':'middle',class:'weekday-modal-day'},WEEKDAYS[w.days[1]]);shape('text',{x,y:y+23,'text-anchor':'middle',class:'weekday-modal-value'},`P ${truth?'참':'거짓'}`);});
    const verdicts=make('div','','weekday-modal-verdicts');for(const [formula,truth]of [['P',result.actual],['◇P',result.diamond],['□P',result.box]] as const){const box=make('p',`${formula}: ${truth?'참':'거짓'}`,'weekday-modal-verdict');box.dataset.formula=formula;box.dataset.truth=String(truth);verdicts.append(box);}
    const note=make('p',result.accessible.length===0?'접근 세계 0개: ◇P 거짓, □P 공허한 참':result.reflexive?'굵은 테두리: 평가점 · 점선 고리: 접근 가능':'점선: 접근 가능 · 비반사적 R: □P→P 보장 안 됨','weekday-modal-note');
    const limit=make('p','사용자가 정한 M의 평가 · 원문의 반사실/Γ 추론과 구별','weekday-modal-limit');container.append(summary,svg,verdicts,note,limit);
  }};
}
