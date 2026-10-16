// Reviewed independently of the model author; do not rewrite these semantic
// expectations merely to accommodate implementation changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveProof, parseFormula} from '../packages/models/propositional.js';

function evaluate(node: ReturnType<typeof parseFormula>, values: Record<string,boolean>): boolean {
  if (node.type === 'atom') return values[node.name];
  if (node.type === 'bottom') return false;
  if (node.type === 'not') return !evaluate(node.operand, values);
  const left = evaluate(node.left, values), right = evaluate(node.right, values);
  if (node.type === 'and') return left && right;
  if (node.type === 'or') return left || right;
  if (node.type === 'implies') return !left || right;
  throw new Error(`Unknown AST: ${node.type}`);
}

test('independent semantic audit: derived formulas follow from the selected premises', () => {
  const formulas = ['A', 'B', '¬A', '¬B', 'A ∧ B', 'A ∨ B', 'A → B', 'B → A', '¬(A ∧ B)', '(A ∧ B) → C'];
  for (const first of formulas) for (const second of formulas) {
    for (const goal of ['A', 'B', 'C', 'A ∧ B', 'B ∨ C']) {
      const input = {premises: [first, second], goal};
      const proof = deriveProof(input);
      const assumptions = input.premises.map(parseFormula);
      const results = proof.lines.map(line => parseFormula(line.formula));
      for (let bits = 0; bits < 8; bits++) {
        const values = {A: !!(bits & 1), B: !!(bits & 2), C: !!(bits & 4)};
        if (assumptions.every(formula => evaluate(formula, values))) {
          assert.ok(results.every(formula => evaluate(formula, values)), JSON.stringify(input));
        }
      }
      const ids = new Set();
      for (const line of proof.lines) {
        assert.ok(line.dependsOn.every(id => ids.has(id)), 'references must precede the step');
        if (line.rule !== 'premise') assert.ok(line.dependsOn.length > 0, 'no unsupported free conclusions');
        ids.add(line.id);
      }
    }
  }
});

test('reviewed boundary: search failure is not falsity, and no converse or disjunction extraction is allowed', () => {
  for (const input of [
    {premises: ['A → B', 'B'], goal: 'A'},
    {premises: ['A ∨ B'], goal: 'B'},
    {premises: [], goal: 'A → A'}, // valid, but requires an unsupported introduction rule
  ]) {
    const proof = deriveProof(input);
    assert.equal(proof.goalReached, false);
    assert.equal(proof.exhausted, true);
    assert.ok(proof.limitations!.some(text => text.includes('거짓')));
  }
});
