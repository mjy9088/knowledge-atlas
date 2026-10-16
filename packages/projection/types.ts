import type {ProofResult,ProofLine} from '../models/types.js';
import type {ExperimentInput} from '../experiments/premise-state.js';
export interface TimelineInput {premises?:unknown[];goal?:unknown;proof?:Partial<Omit<ProofResult,'lines'>> & {lines?:Partial<ProofLine>[]}}
export interface TimelineLine {id:string|number;formula:string;rule:string;dependsOn:string[]}
export interface Cue {id?:string;startMs:number;endMs:number;activeLine:number;text:string;title?:string;phase?:string;claimRefs?:string[];presentation?:Timeline}
export interface Timeline {version:number;sceneId:string;modelId:string;width:number;height:number;snapshot:TimelineInput;premises:string[];goal:string;lines:TimelineLine[];cues:readonly Cue[];durationMs:number;lessonId?:string;controlState?:ExperimentInput;projectionId?:string;title?:string;sourceRefs?:string[]}
