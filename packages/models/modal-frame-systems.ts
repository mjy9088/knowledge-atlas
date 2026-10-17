import type {WorldIndex} from './weekday-worlds.js';
import type {ModalFrame} from './weekday-modal.js';

// Frame guarantees for all valuations, independent of the riddle's calendar data.
// These are overlapping frame classes, not an exact logic of a single model.
export function modalFrameSystems(ids:readonly WorldIndex[],frame:ModalFrame){
  if(!frame||!ids.length||ids.length>4||new Set(ids).size!==ids.length||!ids.every(id=>Number.isInteger(id)&&id>=0&&id<=3)||!ids.includes(frame.evaluationWorld)||!Array.isArray(frame.access)||!frame.access.every(edge=>Array.isArray(edge)&&edge.length===2&&ids.includes(edge[0])&&ids.includes(edge[1]))||new Set(frame.access.map(edge=>edge.join(','))).size!==frame.access.length)throw new RangeError('Invalid modal frame');
  const edge=(a:WorldIndex,b:WorldIndex)=>frame.access.some(([from,to])=>from===a&&to===b);
  const serial=ids.every(a=>ids.some(b=>edge(a,b))),reflexive=ids.every(a=>edge(a,a));
  const symmetric=ids.every(a=>ids.every(b=>!edge(a,b)||edge(b,a)));
  const transitive=ids.every(a=>ids.every(b=>ids.every(c=>!edge(a,b)||!edge(b,c)||edge(a,c))));
  const euclidean=ids.every(a=>ids.every(b=>ids.every(c=>!edge(a,b)||!edge(a,c)||edge(b,c))));
  return {serial,reflexive,symmetric,transitive,euclidean,
    systems:{K:true,D:serial,T:reflexive,B:reflexive&&symmetric,S4:reflexive&&transitive,S5:reflexive&&symmetric&&transitive},
  };
}
