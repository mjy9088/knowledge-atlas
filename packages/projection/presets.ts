export const INFERENCE_PRESETS = Object.freeze({
  chain: {premises:['P', 'P → Q', 'Q → R'], goal:'R'},
  and: {premises:['P ∧ Q'], goal:'Q'},
  explosion: {premises:['P', '¬P'], goal:'R'},
  missing: {premises:['P → Q'], goal:'Q'},
  andIntro: {premises:['P', 'Q'], goal:'P ∧ Q'},
  orIntro: {premises:['P'], goal:'P ∨ Q'}
});
