import {mountOrbitalExperiment} from './quantum/orbitals.mjs';

// Explicitly registered topic adapters; source metadata cannot execute arbitrary modules.
const interactions={'hydrogenic-orbitals':mountOrbitalExperiment};
export function mountTopicInteraction(id,container,options){
  if(!Object.hasOwn(interactions,id))throw new RangeError('Unknown topic interaction');
  return interactions[id](container,options);
}
