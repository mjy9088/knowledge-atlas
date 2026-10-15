import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFormula, formatFormula, deriveProof, LIMITS, RULES} from '../packages/models/propositional.mjs';

test('parser normalizes aliases, operator precedence and right-associated implication safely', () => {
  assert.equal(formatFormula(parseFormula('!A & B | C -> D -> ~E')), '(((¬A ∧ B) ∨ C) → (D → ¬E))');
  assert.equal(formatFormula(parseFormula('¬(RAIN ∨ WET)')), '¬(RAIN ∨ WET)');
  assert.equal(formatFormula(parseFormula('⊥')), '⊥');
  for (const value of ['A', '¬¬A', 'A & (B -> C)', '(A | B) -> ¬C']) {
    const formatted = formatFormula(parseFormula(value));
    assert.equal(formatFormula(parseFormula(formatted)), formatted);
  }
  const chain = Array(12).fill('A').join(' -> ');
  const formattedChain = formatFormula(parseFormula(chain));
  assert.equal(formatFormula(parseFormula(formattedChain)), formattedChain);
});

test('proof follows implication chains with stable backward-only line references', () => {
  const input = {premises: ['A', 'A -> B', 'B -> C'], goal: 'C'};
  const proof = deriveProof(input);
  assert.equal(proof.goalReached, true);
  assert.equal(proof.lines.at(-1).formula, 'C');
  assert.equal(proof.lines.at(-1).rule, 'modus-ponens');
  assert.deepEqual(proof, deriveProof(input));
  assert.deepEqual(input.premises, ['A', 'A -> B', 'B -> C']);
  for (const [index, line] of proof.lines.entries()) {
    assert.equal(line.id, `line-${index + 1}`);
    assert.ok(RULES.some(rule => rule.id === line.rule));
    for (const dependency of line.dependsOn) {
      assert.ok(proof.lines.slice(0, index).some(previous => previous.id === dependency));
    }
  }
});

test('conjunction elimination and goal introduction expose separate justified lines', () => {
  const proof = deriveProof({premises: ['A & (B & C)'], goal: 'A & C'});
  assert.equal(proof.goalReached, true);
  assert.equal(proof.lines.at(-1).formula, '(A ∧ C)');
  assert.equal(proof.lines.at(-1).rule, 'and-introduction');
  assert.equal(proof.lines.at(-1).dependsOn.length, 2);
  assert.equal(deriveProof({premises: ['A'], goal: 'B | A'}).goalReached, true);
  assert.equal(deriveProof({premises: ['A', 'B'], goal: '(A & B) | C'}).goalReached, true);
});

test('contradiction and explosion work for compound formulas and arbitrary parsed goals', () => {
  const proof = deriveProof({premises: ['A & B', '!(A & B)'], goal: 'X -> (Y | Z)'});
  assert.equal(proof.goalReached, true);
  assert.equal(proof.lines.find(line => line.formula === '⊥').rule, 'contradiction');
  assert.equal(proof.lines.at(-1).rule, 'explosion');
  assert.equal(proof.lines.at(-1).formula, '(X → (Y ∨ Z))');
  assert.equal(deriveProof({premises: ['⊥'], goal: 'S'}).goalReached, true);
});

test('search does not infer the converse, affirm the consequent, split disjunctions or introduce implications', () => {
  for (const input of [
    {premises: ['B', 'A -> B'], goal: 'A'},
    {premises: ['A | B'], goal: 'A'},
    {premises: ['A -> B', 'B -> A'], goal: 'A'},
    {premises: [], goal: 'A -> A'},
    {premises: ['A'], goal: '¬¬A'},
    {premises: ['A', 'B', '(A & B) -> C'], goal: 'C'},
  ]) {
    const proof = deriveProof(input);
    assert.equal(proof.goalReached, false);
    assert.equal(proof.exhausted, true);
    assert.equal(proof.limitReached, false);
    assert.ok(proof.limitations.length >= 2);
  }
});

test('step limits, duplicate premises and malformed input have explicit outcomes', () => {
  const proof = deriveProof({premises: ['A', 'A -> B', 'B -> C'], goal: 'C', maxSteps: 3});
  assert.equal(proof.goalReached, false);
  assert.equal(proof.limitReached, true);
  assert.equal(proof.exhausted, false);
  assert.equal(proof.lines.length, 3);
  assert.equal(deriveProof({premises: ['A', 'A'], goal: 'A'}).lines.length, 1);
  for (const value of ['', 'a', 'A B', '(A', 'A)', 'A <-> B', 'A && B', 'A;process.exit()', '<script>', 'A=1']) {
    assert.throws(() => parseFormula(value));
  }
  assert.throws(() => parseFormula(null), TypeError);
  assert.throws(() => parseFormula('¬'.repeat(LIMITS.depth) + 'A'), RangeError);
  assert.throws(() => parseFormula('A'.repeat(LIMITS.characters + 1)), RangeError);
  assert.throws(() => parseFormula('A & '.repeat(70) + 'A'), RangeError);
  assert.throws(() => parseFormula('('.repeat(33) + 'A' + ')'.repeat(33)), RangeError);
  assert.throws(() => formatFormula({type: '__proto__'}), TypeError);
  assert.throws(() => deriveProof({premises: Array(9).fill('A'), goal: 'A'}), RangeError);
  assert.throws(() => deriveProof({premises: 'A', goal: 'A'}), TypeError);
  for (const maxSteps of [0, 65, 1.5, Infinity, '2']) {
    assert.throws(() => deriveProof({premises: [], goal: 'A', maxSteps}), RangeError);
  }
  const cyclic = {type: 'not'}; cyclic.operand = cyclic;
  assert.throws(() => formatFormula(cyclic), RangeError);
});

function truth(node, assignment) {
  switch (node.type) {
    case 'atom': return assignment[node.name];
    case 'bottom': return false;
    case 'not': return !truth(node.operand, assignment);
    case 'and': return truth(node.left, assignment) && truth(node.right, assignment);
    case 'or': return truth(node.left, assignment) || truth(node.right, assignment);
    case 'implies': return !truth(node.left, assignment) || truth(node.right, assignment);
    default: throw new Error('Unexpected test AST');
  }
}

test('each emitted line is semantically entailed by its cited dependencies across all valuations', () => {
  // Independent truth-table check of inference soundness, not a completeness claim.
  for (const input of [
    {premises: ['A', 'A -> B', 'B -> C'], goal: 'C'},
    {premises: ['A & B'], goal: '(B & A) | C'},
    {premises: ['¬B', 'A', 'A -> B'], goal: 'C'},
    {premises: ['¬(A | B)', 'A | B'], goal: 'C'},
  ]) {
    const proof = deriveProof(input);
    for (let bits = 0; bits < 8; bits++) {
      const assignment = {A: Boolean(bits & 1), B: Boolean(bits & 2), C: Boolean(bits & 4)};
      for (const line of proof.lines.filter(line => line.rule !== 'premise')) {
        const dependencies = line.dependsOn.map(id => proof.lines.find(candidate => candidate.id === id));
        if (dependencies.every(dependency => truth(parseFormula(dependency.formula), assignment))) {
          assert.equal(truth(parseFormula(line.formula), assignment), true, `${line.rule}: ${line.formula}`);
        }
      }
    }
  }
});
