import {familyObservation,montyObservation} from './finite-observations.js';

export type LabTopic='binary-relations'|'monty-hall'|'two-children';
export interface LabState {topic:LabTopic;seed:number;count:number;stage:number;edges:number;choice:number;mode:'informed'|'blind'|'filter'|'child';revealed:boolean;processSelected:boolean}
export const MAX_TRIALS=10000;
const LAB_STATE_KEYS=['topic','seed','count','stage','edges','choice','mode','revealed','processSelected'] as const;
function isRecord(value:unknown):value is Record<string,unknown>{return Boolean(value)&&typeof value==='object'&&!Array.isArray(value);}
export function initialLabState(topic:LabTopic):LabState{return{topic,seed:42,count:0,stage:0,edges:11,choice:1,mode:topic==='two-children'?'filter':'informed',revealed:false,processSelected:false};}
export function validateLabState(value:unknown,topic:LabTopic):asserts value is LabState{
 if(!isRecord(value)||Object.keys(value).some(key=>!LAB_STATE_KEYS.some(allowed=>allowed===key)))throw new RangeError('Invalid lab state');
 const seed=value['seed'],count=value['count'],stage=value['stage'],edges=value['edges'],choice=value['choice'],mode=value['mode'];
 if(value['topic']!==topic||typeof seed!=='number'||!Number.isInteger(seed)||seed<0||seed>0xffffffff||typeof count!=='number'||!Number.isInteger(count)||count<0||count>MAX_TRIALS||typeof stage!=='number'||!Number.isInteger(stage)||stage<0||stage>3||typeof edges!=='number'||!Number.isInteger(edges)||edges<0||edges>15||typeof choice!=='number'||!Number.isInteger(choice)||choice<1||choice>3||typeof value['revealed']!=='boolean'||typeof value['processSelected']!=='boolean'||typeof mode!=='string'||!(topic==='two-children'?['filter','child']:['informed','blind']).includes(mode))throw new RangeError('Invalid lab state');
}
// Counter-based draws make every prefix and sampled frame independent of playback history.
export function draw(seed:number,index:number,lane:number){let x=(seed^Math.imul(index+1,0x9e3779b9)^Math.imul(lane+1,0x85ebca6b))>>>0;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return((x^(x>>>16))>>>0)/4294967296;}
export function labTrial(s:LabState,index:number){
 if(s.topic==='two-children'){
  const family=['BB','BG','GB','GG'][Math.floor(draw(s.seed,index,0)*4)],child=Math.floor(draw(s.seed,index,1)*2),accepted=s.mode==='filter'?family.includes('B'):family[child]==='B';
  return{branch:family,detail:s.mode==='filter'?'가족에 질문':`${child+1}번째 아이 관측`,accepted,success:family==='BB'};
 }
 const prize=1+Math.floor(draw(s.seed,index,0)*3),unchosen=[1,2,3].filter(d=>d!==s.choice),available=s.mode==='informed'?unchosen.filter(d=>d!==prize):unchosen,opened=available[Math.floor(draw(s.seed,index,1)*available.length)];
 return{branch:`상품 ${prize}번`,detail:`${opened}번 공개`,accepted:opened!==prize,success:prize!==s.choice};
}
export function labSummary(s:LabState){
 validateLabState(s,s.topic);let accepted=0,successes=0;const points:{count:number;rate:number}[]=[];
 for(let i=0;i<s.count;i++){const trial=labTrial(s,i);if(trial.accepted){accepted++;if(trial.success)successes++;}if(accepted&&(i<20||(i+1)%Math.max(1,Math.floor(s.count/100))===0||i===s.count-1))points.push({count:i+1,rate:successes/accepted});}
 const theoretical=s.topic==='two-children'?familyObservation(s.mode as 'filter'|'child')[0].posterior:montyObservation(s.mode as 'informed'|'blind').switchProbability!;
 return{attempted:s.count,accepted,successes,rate:accepted?successes/accepted:null,theoretical,points,last:s.count?labTrial(s,s.count-1):null};
}
/** 20 attempts/second; seeking is absolute, finite and independent of previous frames. */
export function labFrameAt(state:LabState,ms:number):LabState{validateLabState(state,state.topic);if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid lab time');const count=Math.min(MAX_TRIALS,Math.floor(ms/50));return{...state,count,stage:Math.min(3,Math.floor(ms/400)),revealed:count>0};}
export function relationPairs(edges:number){return ['민 → 논리','민 → 확률','수 → 논리','수 → 확률'].filter((_,i)=>edges&(1<<i));}
export function isFunction(edges:number){return[0,2].every(offset=>Number(Boolean(edges&(1<<offset)))+Number(Boolean(edges&(1<<(offset+1))))===1);}
