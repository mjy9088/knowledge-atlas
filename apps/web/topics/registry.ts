import {mountLambdaExperiment} from './computing/typed-lambda.js';
import {mountOrbitalExperiment} from './quantum/orbitals.js';
import type {OrbitalExperimentState} from './quantum/orbitals.js';
import type {LambdaState} from './computing/typed-lambda.js';
import type {Scene} from '/packages/content/types.js';

export type TopicState=OrbitalExperimentState|LambdaState;
export type TopicInspection=ReturnType<ReturnType<typeof mountOrbitalExperiment>['inspect']>|ReturnType<ReturnType<typeof mountLambdaExperiment>['inspect']>;
export interface TopicInteraction {
  getState():TopicState;
  validateState?(state:TopicState):void;
  setState(state:TopicState):void;
  validateState?(state:TopicState):void;
  suggest(suggestion?:Scene['suggestion']):void;
  reset():void;
  seek(ms:number):void;
  inspect():TopicInspection;
  describe(scene:Scene):{status:string;text:string};
}

// Explicitly registered topic adapters; source metadata cannot execute arbitrary modules.
const interactions:Record<string,(container:HTMLElement,options:{onChange?:()=>void})=>TopicInteraction>={'hydrogenic-orbitals':mountOrbitalExperiment,'typed-lambda':mountLambdaExperiment};
export function mountTopicInteraction(id:string,container:HTMLElement,options:{onChange?:()=>void}={}):TopicInteraction{
  if(!Object.hasOwn(interactions,id))throw new RangeError('Unknown topic interaction');
  return interactions[id](container,options);
}
