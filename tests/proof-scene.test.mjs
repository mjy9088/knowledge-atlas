import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveExplosion} from '../packages/models/explosion.mjs';
import projection from '../content/formal-logic/explosion/projection.json' with {type: 'json'};
import sceneContract from '../content/formal-logic/explosion/scenes/proof.json' with {type: 'json'};
import {
  createProofScene, INITIAL_STATE, SCENE_ID, PROOF_TIMELINE, PROOF_DURATION_MS,
} from '../apps/web/topics/formal-reasoning/proof-scene.mjs';

test('scene initializes from the existing scene contract and exposes stable semantic elements', () => {
  const scene = createProofScene();
  assert.deepEqual(INITIAL_STATE, sceneContract.initialState);
  assert.deepEqual(scene.getState(), INITIAL_STATE);
  assert.equal(SCENE_ID, sceneContract.id);
  assert.equal(scene.getInspectionSnapshot().sceneId, SCENE_ID);
  assert.deepEqual(Object.keys(scene.describeState().semanticElements), sceneContract.semanticElements);
});

test('all supported scene states delegate their displayed proof to the unchanged model', () => {
  const scene = createProofScene();
  for (const hasP of [false, true]) {
    for (const hasNotP of [false, true]) {
      for (const conclusion of ['Q', 'R', 'S']) {
        const state = {hasP, hasNotP, conclusion};
        scene.setState(state);
        const snapshot = scene.getInspectionSnapshot();
        assert.deepEqual(snapshot.state, state);
        assert.deepEqual(snapshot.result, deriveExplosion(state));
        assert.deepEqual(snapshot.displayedValues.steps, snapshot.result.steps);
        assert.equal(scene.describeState().semanticElements['derived-conclusion'].present, hasP && hasNotP);
        assert.equal(snapshot.warnings.length, 1);
      }
    }
  }
});

test('reset and state restoration reproduce the full inspection snapshot', () => {
  const scene = createProofScene();
  const initial = scene.getInspectionSnapshot();
  scene.setState({hasP: false, hasNotP: true, conclusion: 'S'});
  const saved = scene.getInspectionSnapshot();
  scene.reset();
  assert.deepEqual(scene.getInspectionSnapshot(), initial);
  scene.setState(saved.state);
  assert.deepEqual(scene.getInspectionSnapshot(), saved);
});

test('seek boundaries and out-of-order calls are independent of interaction history', () => {
  const scene = createProofScene();
  const fresh = createProofScene();
  assert.deepEqual(PROOF_TIMELINE.map(event => event.timeMs), projection.segments.map(segment => segment.startMs));
  assert.equal(PROOF_DURATION_MS, 30000);
  for (const timeMs of [24000, 0, 18000, 5999.5, 6000, 11999, 12000, 23999, 30000, 1e9, 0]) {
    scene.setState({hasP: false, hasNotP: false, conclusion: 'S'});
    scene.seek(timeMs);
    fresh.reset();
    fresh.seek(timeMs);
    assert.deepEqual(scene.getInspectionSnapshot(), fresh.getInspectionSnapshot());
    assert.deepEqual(scene.getState(), PROOF_TIMELINE.findLast(event => event.timeMs <= timeMs).state);
  }
  scene.seek(PROOF_DURATION_MS + 1);
  assert.deepEqual(scene.getState(), PROOF_TIMELINE.at(-1).state);
  scene.seek(0);
  assert.deepEqual(scene.getState(), {hasP: false, hasNotP: false, conclusion: 'Q'});
  scene.reset();
  assert.deepEqual(scene.getState(), INITIAL_STATE);
});

test('dispatched actions replay and notify with detached inspection snapshots', () => {
  const changes = [];
  const scene = createProofScene({onChange: snapshot => changes.push(snapshot)});
  assert.equal(changes.length, 0);
  const actions = [
    {type: 'set-premise', premise: 'hasP', value: false},
    {type: 'set-conclusion', value: 'R'},
    {type: 'set-premise', premise: 'hasNotP', value: false},
  ];
  for (const action of actions) scene.dispatch(action);
  const replay = createProofScene();
  for (const action of actions) replay.dispatch(action);
  assert.deepEqual(scene.getInspectionSnapshot(), replay.getInspectionSnapshot());
  assert.equal(changes.length, 3);
  changes.at(-1).state.conclusion = 'S';
  changes.at(-1).result.steps.push({symbol: 'invalid'});
  assert.deepEqual(scene.getState(), {hasP: false, hasNotP: false, conclusion: 'R'});
  assert.deepEqual(scene.getInspectionSnapshot().result.steps, []);
  scene.dispatch({type: 'reset'});
  assert.deepEqual(scene.getState(), INITIAL_STATE);
});

test('returned and supplied state objects cannot mutate the scene', () => {
  const scene = createProofScene();
  const supplied = {hasP: false, hasNotP: true, conclusion: 'R'};
  scene.setState(supplied);
  supplied.hasP = true;
  scene.getState().hasNotP = false;
  scene.describeState().semanticElements['premise-not-p'].present = false;
  assert.deepEqual(scene.getState(), {hasP: false, hasNotP: true, conclusion: 'R'});
  assert.equal(scene.describeState().semanticElements['premise-not-p'].present, true);
});

test('unsupported inputs leave the previous state and notification count intact', () => {
  let changes = 0;
  const scene = createProofScene({onChange: () => changes++});
  const initial = scene.getInspectionSnapshot();
  for (const state of [null, {}, {hasP: 1, hasNotP: true, conclusion: 'Q'},
    {...INITIAL_STATE, conclusion: 'T'}, {...INITIAL_STATE, extra: true}]) {
    assert.throws(() => scene.setState(state));
  }
  for (const timeMs of [-1, NaN, Infinity, '3000', null, undefined]) {
    assert.throws(() => scene.seek(timeMs));
  }
  for (const action of [null, {}, {type: 'unknown'},
    {type: 'set-premise', premise: 'unknown', value: true},
    {type: 'set-premise', premise: 'hasP', value: 'true'},
    {type: 'set-conclusion', value: 'T'}]) {
    assert.throws(() => scene.dispatch(action));
  }
  assert.throws(() => createProofScene({onChange: true}));
  assert.deepEqual(scene.getInspectionSnapshot(), initial);
  assert.equal(changes, 0);
});
