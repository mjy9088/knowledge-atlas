import type {Scene} from '/packages/content/types.js';
import {mountOrbitalExperiment,type OrbitalExperimentState} from '../quantum/orbitals.js';
import {physicsHistorySuggestion} from './physics-history-suggestion.js';
export {physicsHistorySuggestion} from './physics-history-suggestion.js';

const orbitalSceneIds=['orbital-density','orbital-phase'] as const;
function orbitalScene(scene:Scene):Scene{return {...scene,id:scene.id==='orbital-phase'?'phase':'density'};}

export function mountPhysicsHistory(container:HTMLElement,options:{onChange?:()=>void}={}){
  const orbital=mountOrbitalExperiment(container,options);
  let available=false;
  return {
    getState:orbital.getState,setState:orbital.setState,validateState:orbital.validateState,reset:orbital.reset,seek:orbital.seek,afterRender:orbital.afterRender,
    setActive(active:boolean){container.hidden=!active||!available;},
    suggest(suggestion?:Scene['suggestion']){
      const resolved=physicsHistorySuggestion(suggestion);available=Boolean(resolved);
      if(resolved)orbital.suggest(resolved);
      container.hidden=!available;
    },
    inspect(){return {...orbital.inspect(),available};},
    describe(scene:Scene){
      if(!orbitalSceneIds.some(id=>id===scene.id))return {status:'example',text:''};
      return orbital.describe(orbitalScene(scene));
    },
  } satisfies {
    getState():OrbitalExperimentState;setState(state:OrbitalExperimentState):void;validateState(state:OrbitalExperimentState):void;
    reset():void;seek(ms:number):void;afterRender():void;setActive(active:boolean):void;suggest(suggestion?:Scene['suggestion']):void;
    inspect():ReturnType<typeof orbital.inspect>&{available:boolean};describe(scene:Scene):{status:string;text:string};
  };
}
