import type {Scene} from '../../../../packages/content/types.js';

export function physicsHistorySuggestion(suggestion?:Scene['suggestion']):Scene['suggestion']|undefined{
  if(!suggestion||'n' in suggestion)return suggestion;
  if(suggestion.example==='orbital-density')return {n:2,basis:'px',Z:1,mode:'cloud'};
  if(suggestion.example==='orbital-phase')return {n:2,basis:'px',Z:1,mode:'slice'};
  return undefined;
}
