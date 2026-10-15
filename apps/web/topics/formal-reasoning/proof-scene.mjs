import {assertState, deriveExplosion} from '../../../../packages/models/explosion.mjs';
import projection from '../../../../content/formal-logic/explosion/projection.json' with {type: 'json'};

export const SCENE_ID = 'scene:logic.explosion.proof';
export const INITIAL_STATE = Object.freeze({hasP: true, hasNotP: true, conclusion: 'Q'});

// Replay the existing draft storyboard; its timing is a placeholder, not a video render.
// reset restores the interactive default; seek(0) restores the storyboard's opening state.
export const PROOF_DURATION_MS = Math.max(...projection.segments.map(segment => segment.startMs + segment.durationMs));
export const PROOF_TIMELINE = Object.freeze(projection.segments
  .filter(segment => segment.sceneRef === SCENE_ID)
  .map(segment => Object.freeze({timeMs: segment.startMs, state: assertState(segment.state)})));

function validateState(next) {
  const validated = assertState(next);
  const keys = Object.keys(next);
  if (Array.isArray(next) || keys.length !== 3 || keys.some(key => !Object.hasOwn(INITIAL_STATE, key))) {
    throw new TypeError('Scene state must contain only hasP, hasNotP and conclusion');
  }
  return validated;
}

export function createProofScene({onChange} = {}) {
  if (onChange !== undefined && typeof onChange !== 'function') {
    throw new TypeError('onChange must be a function');
  }
  let state = INITIAL_STATE;

  function getState() { return {...state}; }

  function getInspectionSnapshot() {
    const result = deriveExplosion(state);
    return {
      sceneId: SCENE_ID,
      state: getState(),
      result,
      displayedValues: {
        hasP: state.hasP,
        hasNotP: state.hasNotP,
        conclusion: state.conclusion,
        steps: result.steps.map(step => ({...step})),
        proofStatus: result.epistemicMeaning,
      },
      warnings: [result.contradiction
        ? '이 추론 규칙 아래에서의 도출이며, 결론의 현실적 참을 판정한 것은 아닙니다.'
        : '이 모순 폭발 증명 경로는 완성되지 않습니다. 다른 증명의 불가능성을 주장하는 것은 아닙니다.'],
    };
  }

  function describeState() {
    const {result, warnings} = getInspectionSnapshot();
    const semanticElements = {};
    for (const [id, symbol] of [
      ['premise-p', 'P'], ['premise-not-p', '¬P'],
      ['derived-contradiction', '⊥'], ['derived-conclusion', state.conclusion],
    ]) {
      const step = result.steps.find(item => item.semanticId === id);
      semanticElements[id] = {symbol, present: Boolean(step), rule: step?.rule ?? null};
    }
    semanticElements['proof-status'] = {
      thisProofPathExists: result.thisProofPathExists,
      epistemicMeaning: result.epistemicMeaning,
      description: warnings[0],
    };
    return {semanticElements};
  }

  function setState(next) {
    state = validateState(next);
    onChange?.(getInspectionSnapshot());
  }

  function reset() { setState(INITIAL_STATE); }

  function seek(timeMs) {
    if (typeof timeMs !== 'number' || !Number.isFinite(timeMs) || timeMs < 0) {
      throw new RangeError('Seek time must be a finite, non-negative number of milliseconds');
    }
    // Select a full state from time alone, never replay over prior user input.
    const event = PROOF_TIMELINE.findLast(item => item.timeMs <= timeMs);
    setState(event.state);
  }

  function dispatch(action) {
    if (!action || typeof action !== 'object') throw new TypeError('Action must be an object');
    switch (action.type) {
      case 'set-premise':
        if (!['hasP', 'hasNotP'].includes(action.premise)) throw new RangeError('Unsupported premise');
        setState({...state, [action.premise]: action.value});
        break;
      case 'set-conclusion': setState({...state, conclusion: action.value}); break;
      case 'reset': reset(); break;
      default: throw new RangeError('Unsupported scene action');
    }
  }

  return {getState, setState, reset, seek, dispatch, describeState, getInspectionSnapshot};
}
