import test from 'node:test';
import assert from 'node:assert/strict';
import {DOORS, informedCase, openingRound, blindCases} from '../scenarios.js';

test('the opening hides a fixed seeded prize independently of the reader choice', () => {
  for (const seed of [0, 42, 123, 0xffffffff]) {
    const rounds = DOORS.map(choice => openingRound(choice, seed));
    assert.equal(new Set(rounds.map(row => row.prize)).size, 1);
    for (const row of rounds) {
      assert.notEqual(row.opened, row.choice);
      assert.notEqual(row.opened, row.prize);
      assert.notEqual(row.remaining, row.choice);
      assert.notEqual(row.remaining, row.opened);
    }
  }
});

test('three informed prize cases and six blind openings preserve the switching argument for every initial door', () => {
  for (const choice of DOORS) {
    const informed = DOORS.map(prize => informedCase(choice, prize));
    assert.equal(informed.filter(row => row.switchWins).length, 2);
    for (const row of informed) assert.equal(row.switchWins, row.prize !== choice);
    const blind = blindCases(choice);
    assert.equal(blind.length, 6);
    assert.equal(new Set(blind.map(row => `${row.prize}/${row.opened}`)).size, 6);
    const retained = blind.filter(row => row.accepted);
    assert.equal(retained.length, 4);
    assert.equal(retained.filter(row => row.switchWins).length, 2);
    assert.equal(retained.filter(row => row.prize === choice).length, 2);
    assert.ok(blind.filter(row => !row.accepted).every(row => row.opened === row.prize));
  }
});

test('unsupported doors and seeds are rejected instead of inventing a presentation', () => {
  for (const value of [0, 4, 1.5, NaN]) {
    assert.throws(() => openingRound(value, 42));
    assert.throws(() => informedCase(1, value));
    assert.throws(() => blindCases(value));
  }
  for (const seed of [-1, 0x100000000, 0.5, NaN]) assert.throws(() => openingRound(1, seed));
});

test('informed tree leaves have unequal masses while blind opening includes excluded prize paths', async () => {
  const {montyTree} = await import('../scenarios.js');
  for (const choice of DOORS) {
    const informed = montyTree(choice, 'informed').flatMap(group => group.paths);
    assert.deepEqual(informed.map(path => path.mass).sort(), [1/6, 1/6, 1/3, 1/3]);
    assert.equal(informed.filter(path => path.switchWins).reduce((sum, path) => sum + path.mass, 0), 2/3);
    assert.ok(informed.every(path => path.accepted));
    const blind = montyTree(choice, 'blind').flatMap(group => group.paths);
    assert.equal(blind.length, 6);
    assert.ok(blind.every(path => path.mass === 1/6 && path.chance === 1/2));
    assert.equal(blind.filter(path => !path.accepted).length, 2);
    assert.equal(blind.filter(path => path.accepted && path.switchWins).length, 2);
  }
});

test('paired draws retain every initially correct game and exclude only initially wrong games', async () => {
  const {pairedMontySample} = await import('../scenarios.js');
  const {initialLabState} = await import('../../../../packages/models/possibility-lab.js');
  for (const choice of DOORS) for (const seed of [0, 42, 123]) for (const count of [0, 1, 100, 1000]) {
    const state = {...initialLabState('monty-hall'), choice, seed, count};
    const sample = pairedMontySample(state);
    assert.equal(sample.informed.accepted, count);
    assert.equal(sample.blind.accepted, sample.initiallyCorrect + sample.wrongRetained);
    assert.equal(sample.initiallyCorrect + sample.wrongRetained + sample.excluded, count);
    assert.equal(sample.wrongRetained + sample.excluded, sample.informed.successes);
    assert.equal(sample.excluded, count - sample.blind.accepted);
    assert.equal(sample.blind.rate, sample.blind.accepted ? sample.wrongRetained / sample.blind.accepted : null);
    assert.deepEqual(pairedMontySample(state), sample);
    assert.equal(state.count, count);
  }
});
