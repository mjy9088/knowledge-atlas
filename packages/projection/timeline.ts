import type {ProofResult} from '../models/types.js';
import type {Timeline,TimelineInput,TimelineLine,Cue} from './types.js';
export type {Timeline,TimelineInput,TimelineLine,Cue} from './types.js';
import {RULES} from '../models/propositional.js';
import {displayFormula} from '../experiments/formula-display.js';
import {expandedCues} from './expanded-timeline.js';
// Presentation of one frozen model result; this module never performs inference.
const clone = <T>(value:T):T => JSON.parse(JSON.stringify(value));
const freeze = <T>(value:T):T => {if (value && typeof value === 'object') {Object.values(value).forEach(freeze); Object.freeze(value);} return value;};
const label = (value:unknown) => typeof value === 'string' ? value : JSON.stringify(value);
const ruleLabel = (id:string) => RULES.find(rule => rule.id === id)?.label ?? id;
const lineLabel = (id:string|number) => String(id).replace(/^line-(\d+)$/,'$1행');
export function createVideoTimeline(input:TimelineInput,{expanded=false}={}):Timeline {
  const snapshot = clone(input), proof = snapshot.proof ?? {};
  const lines:TimelineLine[] = (proof.lines ?? []).map((line,index) => ({id:line.id ?? index+1,formula:displayFormula(label(line.formula ?? '')),rule:ruleLabel(line.rule ?? ''),dependsOn:[...(line.dependsOn ?? [])]}));
  const premises = (snapshot.premises ?? []).map(value=>displayFormula(label(value))), goal = displayFormula(label(snapshot.goal ?? ''));
  const cues:Cue[] = [{startMs:0,endMs:2500,activeLine:-1,text:`전제: ${premises.join(', ') || '없음'} · 목표: ${goal}`}];
  lines.forEach((line,index) => cues.push({startMs:2500+index*1800,endMs:4300+index*1800,activeLine:index,
    text:`${lineLabel(line.id)}. ${line.formula} · ${line.rule}${line.dependsOn.length ? ' · 참조 '+line.dependsOn.map(lineLabel).join(', ') : ''}`}));
  const endStart = 2500+lines.length*1800;
  cues.push({startMs:endStart,endMs:Math.max(10000,endStart+3000),activeLine:-1,text:proof.goalReached
    ? `목표 ${goal}에 도달했습니다. 지정한 규칙 아래의 도출이며 현실의 참/거짓 판정은 아닙니다.`
    : '이 탐색에서 목표에 도달하지 못했습니다. 일반적인 증명 불가능성을 뜻하지 않습니다.'});
  const presentation=expanded?expandedCues({lines,goal,proof:proof as Partial<ProofResult>}):{cues};
  return freeze({version:expanded?3:2,sceneId:'scene:logic.inference.lab',modelId:'model:logic.propositional.forward',width:960,height:540,snapshot,premises,goal,lines,...presentation,durationMs:presentation.cues.at(-1)!.endMs});
}
export function frameAt(timeline:Timeline,timeMs:number,{reducedMotion=false}={}) {
  if (typeof timeMs !== 'number' || !Number.isFinite(timeMs) || timeMs<0) throw new RangeError('Time must be finite and non-negative');
  const time = Math.min(timeMs,timeline.durationMs);
  const cue = timeline.cues.find(item => time>=item.startMs && time<item.endMs) ?? timeline.cues.at(-1)!;
  const presentation=cue.presentation??timeline;
  const transition = reducedMotion ? 1 : Math.min(1,(time-cue.startMs)/450);
  return {timeMs:time,presentation,activeLine:cue.activeLine,caption:cue.text,title:cue.title??'',cueId:cue.id??String(cue.startMs),phase:cue.phase??(cue.activeLine>=0?'step':time<2500?'intro':'outro'),transition,
    dependencyPulse:reducedMotion ? 1 : 0.5+0.5*Math.sin((time-cue.startMs)/180),
    visibleLines:cue.activeLine<0 ? ((cue.phase==='intro'||(!cue.phase&&time<2500)) ? [] : presentation.lines) : presentation.lines.slice(0,cue.activeLine+1)};
}
const timestamp = (ms:number) => {const sec=Math.floor(ms/1000); return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec/60)%60).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
export function timelineVtt(timeline:Timeline) {return 'WEBVTT\n\n'+timeline.cues.map((cue,index) => `${index+1}\n${timestamp(cue.startMs)} --> ${timestamp(cue.endMs)}\n${cue.text.replace(/-->/g,'→')}\n`).join('\n');}
