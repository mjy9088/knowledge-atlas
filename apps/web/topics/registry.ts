import {mountPossibilityLab} from './statistics/possibility-lab.js';
import type {LabState} from '/packages/models/possibility-lab.js';
import {mountWeekdayWorldsExperiment,type WeekdayWorldsState} from './formal-reasoning/weekday-worlds.js';
import {mountOrbitalExperiment} from './quantum/orbitals.js';
import type {OrbitalExperimentState} from './quantum/orbitals.js';
import {mountPhysicsHistory} from './physics/physics-history.js';
import type {Scene} from '/packages/content/types.js';

export type TopicState=OrbitalExperimentState|WeekdayWorldsState|LabState;
export type TopicInspection=ReturnType<ReturnType<typeof mountPossibilityLab>['inspect']>|ReturnType<ReturnType<typeof mountOrbitalExperiment>['inspect']>|ReturnType<ReturnType<typeof mountPhysicsHistory>['inspect']>|ReturnType<ReturnType<typeof mountWeekdayWorldsExperiment>['inspect']>;
export interface TopicInteraction {
  getState():TopicState;
  setActive?(active:boolean):void;
  afterRender?():void;
  beforeNext?():boolean;
  validateState(state:unknown):void;
  setState(state:unknown):void;
  suggest(suggestion?:Scene['suggestion']):void;
  reset():void;
  seek(ms:number):void;
  inspect():TopicInspection;
  describe(scene:Scene):{status:string;text:string};
}

// Explicitly registered topic adapters; source metadata cannot execute arbitrary modules.
const interactions:Record<string,(container:HTMLElement,options:{onChange?:()=>void;onSceneRequest?:(sceneId:string)=>void})=>TopicInteraction>={'monty-hall':(c,o)=>mountPossibilityLab('monty-hall',c,o),'two-children':(c,o)=>mountPossibilityLab('two-children',c,o),'physics-history':mountPhysicsHistory,'weekday-worlds':mountWeekdayWorldsExperiment};
export function mountTopicInteraction(id:string,container:HTMLElement,options:{onChange?:()=>void;onSceneRequest?:(sceneId:string)=>void}={}):TopicInteraction{
  if(!Object.hasOwn(interactions,id))throw new RangeError('Unknown topic interaction');
  return interactions[id](container,options);
}
