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
