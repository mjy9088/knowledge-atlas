import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

const semanticGroup = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[0];
};

const directedEdges = (svg: string): ReadonlySet<string> => {
  const edges = new Set<string>();
  const pattern = /<path\b[^>]*data-from="([^"]+)"[^>]*data-to="([^"]+)"[^>]*data-rule="([^"]+)"[^>]*>/g;
  for (const match of svg.matchAll(pattern)) {
    const [, from, to, rule] = match;
    assert.ok(from && to && rule, 'dependency edge must identify both endpoints and its rule');
    edges.add(`${from}->${to}:${rule}`);
  }
  return edges;
};

const assertEdges = (svg: string, expected: readonly string[]): void => {
  const observed = directedEdges(svg);
  for (const edge of expected) assert.ok(observed.has(edge), `missing directed dependency ${edge}`);
};

test('first-parity figure owns the odd branch locally and discharges it into p even', () => {
  // Given the static first-parity proof ledger.
  const svg = readFigure('figure-first-parity.svg');
  // When its assumption ownership and directed dependencies are inspected.
  const oddAssumption = semanticGroup(svg, 'odd-assumption');
  const oddSquare = semanticGroup(svg, 'odd-square');
  // Then the local branch conflicts with the prior even result before it is discharged.
  assert.match(oddAssumption, /data-owner="local-odd-case"[^>]*data-assumption="p-odd"/);
  assert.match(oddSquare, /data-owner="local-odd-case"[^>]*data-parity="odd"/);
  assert.match(semanticGroup(svg, 'prior-equation'), /data-parity="even"/);
  assert.match(semanticGroup(svg, 'p-even'), /data-status="discharged-conclusion"/);
  assertEdges(svg, [
    'prior-equation->p-square-even:factor-two',
    'odd-assumption->odd-square:expand-odd-square',
    'p-square-even->parity-contradiction:even-claim',
    'odd-square->parity-contradiction:odd-claim',
    'parity-contradiction->p-even:discharge-odd-assumption',
    'p-even->p-two-k:even-definition',
  ]);
});

test('odd-square algebra covers negative, zero-adjacent, and positive parity boundaries', () => {
  // Given representative odd integers on both sides of zero.
  const oddValues = [-5, -3, -1, 1, 3, 5] as const;
  // When each p is written as 2j+1 and the authored expansion is evaluated.
  const observations = oddValues.map((p) => {
    const j = (p - 1) / 2;
    return { p, square: p * p, expansion: 2 * (2 * j * j + 2 * j) + 1 };
  });
  // Then the expansion is equal to p² and every result has odd remainder 1.
  for (const value of observations) {
    assert.equal(value.square, value.expansion);
    assert.equal(Math.abs(value.square % 2), 1);
  }
  assert.equal(0 * 0 % 2, 0);
});

test('second-parity figure carries substitution into q even and converges on the coprime assumption', () => {
  // Given the second-parity dependency ledger.
  const svg = readFigure('figure-second-parity.svg');
  // When retained assumptions, substitution, and final conflict are inspected.
  const coprime = semanticGroup(svg, 'coprime-assumption');
  // Then the contradiction belongs to gcd(p,q)=1 and not to an unlabeled formula error.
  assert.match(coprime, /data-owner="global-rational-assumption"[^>]*data-assumption="coprime"/);
  assert.match(semanticGroup(svg, 'shared-factor'), /data-common-factor="2"/);
  assert.match(semanticGroup(svg, 'gcd-contradiction'), /data-conflicts-with="coprime-assumption"/);
  assertEdges(svg, [
    'original-equation->substituted-equation:substitution-target',
    'p-two-k->substituted-equation:substitute-p',
    'substituted-equation->q-square-equation:divide-by-two',
    'q-square-equation->q-even:parity-lemma',
    'p-even->shared-factor:factor-two',
    'q-even->shared-factor:factor-two',
    'coprime-assumption->gcd-contradiction:requires-gcd-one',
    'shared-factor->gcd-contradiction:common-factor-two',
  ]);
});

test('substitution equations preserve the same integer equality condition', () => {
  // Given integer boundary and non-solution pairs for k and q.
  const pairs = [[0, 0], [1, 1], [1, 2], [-2, 3], [3, -4]] as const;
  // When both sides of 4k²=2q² and q²=2k² are reduced to residuals.
  const residuals = pairs.map(([k, q]) => ({
    original: 4 * k * k - 2 * q * q,
    simplified: 2 * k * k - q * q,
  }));
  // Then division by two preserves exactly which integer pairs satisfy the equation.
  for (const residual of residuals) {
    assert.equal(residual.original, 2 * residual.simplified);
    assert.equal(residual.original === 0, residual.simplified === 0);
  }
});

test('transfer figure attaches nonzero rational division to the route back to sqrt2', () => {
  // Given the worked sqrt8 transfer ladder and the established sqrt2 result.
  const svg = readFigure('figure-transfer.svg');
  // When its condition-bearing edge and contradiction convergence are inspected.
  const divisionEdge = svg.match(/<path\b[^>]*data-from="sqrt8-rational"[^>]*data-to="quotient-rational"[^>]*>/);
  // Then division by 2 is explicit and the prior theorem, not a repeated parity proof, closes the argument.
  assert.ok(divisionEdge);
  assert.match(divisionEdge[0], /data-condition="nonzero-rational-divisor"/);
  assert.match(semanticGroup(svg, 'divisor-two'), /data-rational="true"[^>]*data-nonzero="true"/);
  assert.match(semanticGroup(svg, 'sqrt2-irrational'), /data-status="prior-proved-result"/);
  assertEdges(svg, [
    'sqrt8-rational->quotient-rational:divide-by-two',
    'divisor-two->quotient-rational:nonzero-rational-condition',
    'quotient-rational->sqrt2-rational:sqrt8-identity',
    'sqrt2-rational->theorem-contradiction:rational-claim',
    'sqrt2-irrational->theorem-contradiction:prior-theorem',
    'theorem-contradiction->sqrt8-irrational:discharge-sqrt8-assumption',
  ]);
});

test('division by nonzero rational two preserves representative rational values', () => {
  // Given rationals represented by integer numerator and nonzero denominator.
  const rationals = [[0, 1], [3, 5], [-7, 4], [12, -5]] as const;
  // When each value is divided by the nonzero rational 2/1.
  const quotients = rationals.map(([numerator, denominator]) => ({
    numerator,
    denominator: denominator * 2,
  }));
  // Then every quotient still has integer components and a nonzero denominator.
  for (const quotient of quotients) {
    assert.ok(Number.isInteger(quotient.numerator));
    assert.ok(Number.isInteger(quotient.denominator));
    assert.notEqual(quotient.denominator, 0);
  }
});
