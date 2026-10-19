import assert from 'node:assert/strict';
import test from 'node:test';
import page from '../content/physics-discovery/nuclear-constituents/page.js';
import {
  NUCLEAR_EVIDENCE_DURATION_MS,
  NUCLEAR_EVIDENCE_STEPS,
  createNuclearEvidenceCursor,
  nuclearEvidenceAvailability,
  nuclearEvidenceFrameAt,
} from '../packages/projection/nuclear-evidence.js';

test('process frames separate setup, unresolved interaction, observation, and inference', () => {
  // Given the authored process boundaries.
  const times = [0, 1_599, 1_600, 3_199, 3_200, 4_799, 4_800, 99_000];

  // When each boundary is projected independently.
  const frames = times.map(nuclearEvidenceFrameAt);

  // Then the scientific roles and visible evidence advance only at declared cuts.
  assert.deepEqual(frames.map(frame => frame.stage), [
    'setup', 'setup', 'contact', 'contact', 'emission', 'emission', 'inference', 'inference',
  ]);
  assert.deepEqual(frames.map(frame => frame.role), [
    'setup', 'setup', 'unresolved', 'unresolved', 'observation', 'observation', 'inference', 'inference',
  ]);
  assert.equal(frames[3]?.reactionResolved, false);
  assert.equal(frames[4]?.hydrogenNucleusVisible, true);
  assert.equal(frames[6]?.tentativeInferenceVisible, true);
  assert.equal(frames.at(-1)?.timeMs, NUCLEAR_EVIDENCE_DURATION_MS);
});

test('unordered seeking is deterministic and detached from prior cursor use', () => {
  // Given a cursor already moved to the end.
  const cursor = createNuclearEvidenceCursor();
  cursor.seek(NUCLEAR_EVIDENCE_DURATION_MS);

  // When earlier and later times are requested out of order.
  const earlier = cursor.seek(1_600);
  cursor.seek(4_800);
  const repeated = cursor.seek(1_600);

  // Then the same time yields the same complete presentation frame.
  assert.deepEqual(repeated, earlier);
  Reflect.set(earlier, 'stage', 'inference');
  assert.equal(cursor.seek(1_600).stage, 'contact');
  assert.deepEqual(NUCLEAR_EVIDENCE_STEPS, [0, 1_600, 3_200, 4_800]);
});

test('saved presentation state rejects invalid values atomically and resets', () => {
  // Given an accepted noninitial state.
  const cursor = createNuclearEvidenceCursor();
  cursor.seek(3_200);
  const before = cursor.getState();

  // When malformed, foreign, or out-of-range snapshots are submitted.
  for (const invalid of [
    null,
    {},
    {...before, version: 2},
    {...before, timeMs: -1},
    {...before, timeMs: NUCLEAR_EVIDENCE_DURATION_MS + 1},
    {...before, timeMs: Number.NaN},
    {...before, playing: true},
  ]) {
    assert.throws(() => cursor.setState(invalid));
    // Then no partial mutation replaces the previous accepted state.
    assert.deepEqual(cursor.getState(), before);
  }
  assert.equal(cursor.reset().stage, 'setup');
  assert.deepEqual(cursor.getState(), {version: 1, timeMs: 0});
});

test('article wiring makes the process available only for the proton scene', () => {
  // Given the seven-scene nuclear-constituents page.
  const proton = page.scenes.find(scene => scene.id === 'proton');
  const others = page.scenes.filter(scene => scene.id !== 'proton');

  // When adapter availability is derived from each authored suggestion.
  const availability = page.scenes.map(scene => nuclearEvidenceAvailability(scene.suggestion));

  // Then only proton mounts the process and all static scene representations remain untouched.
  assert.equal(page.interactive, 'nuclear-evidence');
  assert.deepEqual(page.styles, ['/topics/physics/nuclear-evidence.css']);
  assert.deepEqual(proton?.suggestion, {example: 'proton'});
  assert.deepEqual(availability, [false, true, false, false, false, false, false]);
  assert.ok(others.every(scene => scene.suggestion === undefined && (scene.cards.length > 0 || scene.figure !== undefined)));
});
