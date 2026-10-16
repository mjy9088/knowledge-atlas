export interface ExplosionState {hasP:boolean;hasNotP:boolean;conclusion:string}
/**
 * Pure illustrative model for a specific natural deduction proof path.
 * NOT a general-purpose theorem prover or a semantic truth evaluator.
 */
export const CONCLUSIONS = Object.freeze(['Q', 'R', 'S']);
export const MODEL_ID = 'model:logic.explosion';

export function assertState(state:ExplosionState) {
  if (typeof state !== 'object' || state === null) throw new TypeError('State must be an object');
  if (typeof state.hasP !== 'boolean' || typeof state.hasNotP !== 'boolean') {
    throw new TypeError('Both premise flags must be booleans');
  }
  if (!CONCLUSIONS.includes(state.conclusion)) {
    throw new RangeError(`Conclusion must be one of ${CONCLUSIONS.join(', ')}`);
  }
  return Object.freeze({hasP: state.hasP, hasNotP: state.hasNotP, conclusion: state.conclusion});
}

export function deriveExplosion(state:ExplosionState) {
  const {hasP, hasNotP, conclusion} = assertState(state);
  const steps:{symbol:string;rule:string;semanticId:string}[] = [];
  if (hasP) steps.push({symbol: 'P', rule: '전제', semanticId: 'premise-p'});
  if (hasNotP) steps.push({symbol: '¬P', rule: '전제', semanticId: 'premise-not-p'});
  const contradiction = hasP && hasNotP;
  if (contradiction) {
    steps.push({symbol: '⊥', rule: '모순 도출', semanticId: 'derived-contradiction'});
    steps.push({symbol: conclusion, rule: '⊥ 제거 (폭발)', semanticId: 'derived-conclusion'});
  }
  return {
    modelId: MODEL_ID,
    contradiction,
    thisProofPathExists: contradiction,
    // This output is NOT a claim that the conclusion is true or that
    // no other proof path exists when this particular path fails.
    epistemicMeaning: contradiction ? 'derivable-under-specified-rules' : 'this-path-not-derivable',
    conclusion, steps,
  };
}
