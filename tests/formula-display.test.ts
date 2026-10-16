import test from 'node:test';
import assert from 'node:assert/strict';
import {displayFormula, normalizedSelection} from '../packages/experiments/formula-display.js';
import {parseFormula, formatFormula} from '../packages/models/propositional.js';

test('display aliases preserve parsed meaning and are idempotent', () => {
  for (const formula of ['P -> Q', '!(A & B) | ~C', 'RAIN_1 -> (WET | COLD)', '¬A ∧ (B → C)']) {
    const displayed = displayFormula(formula);
    assert.equal(formatFormula(parseFormula(displayed)), formatFormula(parseFormula(formula)));
    assert.equal(displayFormula(displayed), displayed);
    assert.doesNotMatch(displayed, /->|[!~&|]/);
  }
});

test('normalization preserves caret and selection across shortened implication aliases', () => {
  assert.deepEqual(normalizedSelection('P -> Q', 4), {text: 'P → Q', start: 3, end: 3});
  assert.deepEqual(normalizedSelection('A -> B -> C', 5, 11), {text: 'A → B → C', start: 4, end: 9});
});

test('normalization does not repair invalid syntax or execute text', () => {
  assert.equal(displayFormula('P && Q'), 'P ∧∧ Q');
  assert.throws(() => parseFormula(displayFormula('P && Q')));
  assert.equal(displayFormula('<script>alert(1)</script>'), '<script>alert(1)</script>');
  assert.throws(() => displayFormula(null as never), TypeError);
});
