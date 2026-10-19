import {mountLambdaExperiment} from './computing/typed-lambda.js';
import {mountPossibilityLab} from './statistics/possibility-lab.js';
import type {LabState} from '/packages/models/possibility-lab.js';
import {mountWeekdayWorldsExperiment,type WeekdayWorldsState} from './formal-reasoning/weekday-worlds.js';
import {mountBinarySearchExperiment} from './computing/binary-search.js';
import {mountSphereSlicesExperiment} from './geometry/sphere-slices.js';
import {mountBaseRatesExperiment} from './statistics/base-rates.js';
import type {BinarySearchState} from './computing/binary-search.js';
import type {SphereSlicesState} from './geometry/sphere-slices.js';
import type {BaseRatesState} from './statistics/base-rates.js';
import {mountOrbitalExperiment} from './quantum/orbitals.js';
import type {OrbitalExperimentState} from './quantum/orbitals.js';
import type {LambdaState} from './computing/typed-lambda.js';
import type {Scene} from '/packages/content/types.js';

export type TopicState=OrbitalExperimentState|LambdaState|BinarySearchState|SphereSlicesState|BaseRatesState|WeekdayWorldsState|LabState;
export type TopicInspection=ReturnType<ReturnType<typeof mountPossibilityLab>['inspect']>|ReturnType<ReturnType<typeof mountOrbitalExperiment>['inspect']>|ReturnType<ReturnType<typeof mountLambdaExperiment>['inspect']>|ReturnType<ReturnType<typeof mountBinarySearchExperiment>['inspect']>|ReturnType<ReturnType<typeof mountSphereSlicesExperiment>['inspect']>|ReturnType<ReturnType<typeof mountBaseRatesExperiment>['inspect']>|ReturnType<ReturnType<typeof mountWeekdayWorldsExperiment>['inspect']>;
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
const interactions:Record<string,(container:HTMLElement,options:{onChange?:()=>void;onSceneRequest?:(sceneId:string)=>void})=>TopicInteraction>={'binary-relations':(c,o)=>mountPossibilityLab('binary-relations',c,o),'monty-hall':(c,o)=>mountPossibilityLab('monty-hall',c,o),'two-children':(c,o)=>mountPossibilityLab('two-children',c,o),'hydrogenic-orbitals':mountOrbitalExperiment,'typed-lambda':mountLambdaExperiment,'binary-search':mountBinarySearchExperiment,'sphere-slices':mountSphereSlicesExperiment,'base-rates':mountBaseRatesExperiment,'weekday-worlds':mountWeekdayWorldsExperiment};
export function mountTopicInteraction(id:string,container:HTMLElement,options:{onChange?:()=>void;onSceneRequest?:(sceneId:string)=>void}={}):TopicInteraction{
  if(!Object.hasOwn(interactions,id))throw new RangeError('Unknown topic interaction');
  return interactions[id](container,options);
}
