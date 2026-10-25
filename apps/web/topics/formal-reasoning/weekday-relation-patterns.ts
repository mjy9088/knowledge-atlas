import type {WorldIndex} from '/packages/models/weekday-worlds.js';

/** Example frames, not definitions of complete frame classes. */
export const RELATION_EXAMPLES:Record<'K'|'D'|'T'|'B'|'S4'|'S5',{ids:WorldIndex[];edges:[WorldIndex,WorldIndex][]}>={
  K:{ids:[0,1],edges:[]},
  D:{ids:[0,1],edges:[[0,1],[1,0]]},
  T:{ids:[0,1],edges:[[0,0],[1,1]]},
  B:{ids:[0,1,2],edges:[[0,0],[1,1],[2,2],[0,1],[1,0],[1,2],[2,1]]},
  S4:{ids:[0,1,2],edges:[[0,0],[1,1],[2,2],[0,1],[1,2],[0,2]]},
  S5:{ids:[0,1,2],edges:[[0,0],[1,1],[2,2],[0,1],[1,0]]},
};
export function relationPattern(system:keyof typeof RELATION_EXAMPLES):string {
  const tip=`relation-tip-${system}`,example=RELATION_EXAMPLES[system];
  const x=(id:WorldIndex)=>example.ids.length===2?22+48*id:14+32*id;
  const edges=example.edges.map(([from,to])=>{
    const a=x(from),b=x(to),opposite=example.edges.some(([u,v])=>u===to&&v===from);
    const d=from===to?`M${a-3} 21C${a-18} 0 ${a+18} 0 ${a+3} 21`:Math.abs(from-to)>1?`M${a} 34Q46 60 ${b} 34`:`M${a+(to>from?6:-6)} ${opposite?from<to?25:33:29}L${b+(to>from?-6:6)} ${opposite?from<to?25:33:29}`;
    return `<path d="${d}" fill="none" stroke="#8d8d8d" stroke-width="2" ${system==='S4'&&from===0&&to===2?'stroke-dasharray="4 3"':''} marker-end="url(#${tip})"/>`;
  }).join('');
  return `<svg viewBox="0 0 92 58" role="img" aria-label="${system} 관계 조건의 한 예시"><defs><marker id="${tip}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#8d8d8d"/></marker></defs>${edges}${example.ids.map(id=>`<rect x="${x(id)-5}" y="24" width="10" height="10" fill="#fff" stroke="#0f62fe" stroke-width="2"/>`).join('')}</svg>`;
}
