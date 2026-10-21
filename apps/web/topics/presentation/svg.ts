import type {SequenceDefinition} from '../../components/reader/presentation-contract.js';

export const text=(x:number,y:number,value:string):string=>`<text x="${x}" y="${y}">${value}</text>`;
export const line=(x:number,y:number,x2:number,y2:number):string=>`<path d="M ${x} ${y} L ${x2} ${y2}" fill="none" stroke="#536d7e" stroke-width="3"/>`;
export const point=(x:number,y:number,color='#087f72'):string=>`<circle cx="${x}" cy="${y}" r="12" fill="${color}"/>`;
export function sequence(id:string,draw:(progress:number)=>string):SequenceDefinition{
  return {id,durationMs:4000,posterMs:4000,mount(host){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 600 360');svg.setAttribute('role','img');
    svg.setAttribute('aria-label','수식과 위치의 변화를 함께 보여 주는 설명');host.append(svg);
    return {renderAt(timeMs){const t=Math.max(0,Math.min(1,timeMs/4000));svg.innerHTML=`<rect width="600" height="360" rx="16" fill="#f7f8fb"/><g font-family="system-ui,sans-serif" font-size="25" fill="#172033">${draw(t)}</g>`;},dispose(){svg.remove();}};
  }};
}
