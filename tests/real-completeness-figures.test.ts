import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

type Rational = readonly [numerator: number, denominator: number];

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/number-systems/real-completeness/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[0];
};

const compare = (left: Rational, right: Rational): number =>
  Math.sign(left[0] * right[1] - right[0] * left[1]) * Math.sign(left[1] * right[1]);

const squareComparedWithTwo = ([numerator, denominator]: Rational): number =>
  Math.sign(numerator * numerator - 2 * denominator * denominator);

const pointOrder = (svg: string): readonly { readonly role: string; readonly x: number }[] =>
  [...svg.matchAll(/data-point-role="([^"]+)"[^>]*data-x="(\d+)"/g)].map((match) => ({
    role: match[1] ?? '',
    x: Number(match[2]),
  }));

test('question figure proves nonemptiness and the authored upper bound with the set conditions', () => {
  // Given the opening set ledger and common order line.
  const svg = readFigure('figure-question.svg');
  // When the witness and bound obligations are inspected.
  const witness = group(svg, 'nonempty-witness');
  const bound = group(svg, 'upper-bound-two');
  // Then membership uses both defining conditions and the bound covers every element.
  assert.match(witness, /data-value="1"[^>]*data-positive="true"[^>]*data-square-less-than-two="true"/);
  assert.match(bound, /data-value="2"[^>]*data-role="upper-bound"[^>]*data-quantifier="forall-q-in-A"/);
  assert.match(bound, /data-reason="q&lt;sqrt2&lt;2"/);
  assert.deepEqual(pointOrder(svg), [
    { role: 'member-one', x: 120 },
    { role: 'sqrt2-boundary', x: 330 },
    { role: 'upper-bound-two', x: 500 },
  ]);
});

test('bounds figure separates upper bound, least upper bound, and maximum membership', () => {
  // Given three definition rows in a named ambient ordered set.
  const svg = readFigure('figure-bound-definitions.svg');
  // When their quantified and membership requirements are read.
  const upper = group(svg, 'upper-bound-definition');
  const least = group(svg, 'least-upper-bound-definition');
  const maximum = group(svg, 'maximum-definition');
  // Then upper-bound coverage, leastness, and set membership remain distinct.
  assert.match(upper, /data-subset="A-subset-U"[^>]*data-condition="forall-q-in-A:q&lt;=u"[^>]*data-membership="u-in-U"/);
  assert.match(least, /data-upper-bound="true"[^>]*data-condition="forall-v-in-U-if-v-upper-bound:u&lt;=v"[^>]*data-membership="u-in-U"/);
  assert.match(maximum, /data-condition="forall-q-in-A:q&lt;=m"[^>]*data-membership="m-in-A"/);
  assert.doesNotMatch(least, /data-membership="u-in-A"/);
});

test('gap figure makes the three rational candidate cases exhaustive and ordered', () => {
  // Given a rational candidate r compared with the real boundary sqrt2.
  const svg = readFigure('figure-rational-gap.svg');
  // When each authored case and its witness are inspected.
  const below = group(svg, 'case-below');
  const equal = group(svg, 'case-equal');
  const above = group(svg, 'case-above');
  // Then every comparison case has the condition needed to reject least-upper-bound status.
  assert.match(below, /data-case="r&lt;sqrt2"[^>]*data-nonpositive-excluded-by="1-in-A"/);
  assert.match(below, /data-witness-order="r&lt;q&lt;sqrt2"[^>]*data-witness-membership="q-in-A"/);
  assert.match(equal, /data-case="r=sqrt2"[^>]*data-rejection="sqrt2-not-in-Q"/);
  assert.match(above, /data-case="r&gt;sqrt2"[^>]*data-witness-order="sqrt2&lt;s&lt;r"/);
  assert.match(above, /data-upper-bound-reason="forall-q-in-A:q&lt;sqrt2&lt;s"[^>]*data-conclusion="s-is-smaller-upper-bound"/);
  assert.deepEqual(pointOrder(svg), [
    { role: 'A-elements', x: 70 },
    { role: 'sqrt2-boundary', x: 180 },
    { role: 'smaller-upper-bound-s', x: 310 },
    { role: 'candidate-r', x: 470 },
  ]);
});

test('exact rational fixtures witness both non-upper-bound and smaller-upper-bound cases', () => {
  // Given rational candidates and witnesses chosen without decimal arithmetic.
  const belowFixtures: readonly { readonly r: Rational; readonly q: Rational }[] = [
    { r: [0, 1], q: [1, 1] },
    { r: [7, 5], q: [141, 100] },
    { r: [4, 3], q: [7, 5] },
  ];
  const aboveFixtures: readonly { readonly s: Rational; readonly r: Rational }[] = [
    { s: [10, 7], r: [3, 2] },
    { s: [17, 12], r: [10, 7] },
  ];
  // When exact cross-products and exact squares are evaluated.
  // Then below witnesses lie in A above r, while above witnesses exceed sqrt2 but remain below r.
  for (const { r, q } of belowFixtures) {
    assert.ok(compare(r, q) < 0);
    assert.ok(q[0] * q[1] > 0);
    assert.ok(squareComparedWithTwo(q) < 0);
  }
  for (const { s, r } of aboveFixtures) {
    assert.ok(squareComparedWithTwo(s) > 0);
    assert.ok(compare(s, r) < 0);
  }
});

test('ambient comparison proves the real least upper bound instead of assuming it from Q', () => {
  // Given the same cut displayed in Q and R.
  const svg = readFigure('figure-ambient-comparison.svg');
  // When each ambient panel's result and obligations are inspected.
  const rationals = group(svg, 'ambient-Q');
  const reals = group(svg, 'ambient-R');
  // Then Q records failure, while R separately records upper-bound status and leastness.
  assert.match(rationals, /data-cut="positive-square-below-two"[^>]*data-result="no-lub"/);
  assert.match(reals, /data-cut="positive-square-below-two"[^>]*data-result="sup=sqrt2"/);
  assert.match(reals, /data-upper-bound="forall-q-in-A:q&lt;sqrt2"/);
  assert.match(reals, /data-leastness="forall-real-r-below-sqrt2:r-is-not-upper-bound"/);
  assert.match(reals, /data-nonpositive-case="r&lt;=0:1-in-A-above-r"/);
  assert.match(reals, /data-positive-case="0&lt;r&lt;sqrt2:density-gives-r&lt;q&lt;sqrt2-and-q-in-A"/);
});

test('transfer midpoint gives an element of B above every rational r below three', () => {
  // Given representative rational lower candidates, including negative values.
  const candidates: readonly Rational[] = [[5, 2], [0, 1], [-7, 3], [299, 100]];
  // When q=(r+3)/2 is formed exactly.
  const observations = candidates.map(([numerator, denominator]) => {
    const q: Rational = [numerator + 3 * denominator, 2 * denominator];
    return { r: [numerator, denominator] satisfies Rational, q };
  });
  // Then every q lies strictly between r and 3 and therefore belongs to B.
  for (const { r, q } of observations) {
    assert.ok(compare(r, q) < 0);
    assert.ok(compare(q, [3, 1]) < 0);
  }

  const svg = readFigure('figure-transfer.svg');
  const upperBound = group(svg, 'upper-bound-three');
  const midpoint = group(svg, 'transfer-midpoint');
  assert.match(upperBound, /data-ambient="Q"[^>]*data-set="B"[^>]*data-role="upper-bound"/);
  assert.match(midpoint, /data-domain="Q"[^>]*data-formula="q=\(r\+3\)\/2"/);
  assert.match(midpoint, /data-order="r&lt;q&lt;3"[^>]*data-membership="q-in-B"/);
  assert.deepEqual(pointOrder(svg), [
    { role: 'candidate-r', x: 110 },
    { role: 'midpoint-q', x: 300 },
    { role: 'supremum-three', x: 490 },
  ]);
});

test('all essential figure labels retain the authored mobile legibility floor', () => {
  // Given every topic-owned figure in this correction.
  const figures = ['figure-question.svg', 'figure-bound-definitions.svg', 'figure-rational-gap.svg', 'figure-ambient-comparison.svg', 'figure-transfer.svg'] as const;
  // When essential source font sizes are collected.
  const sizes = figures.flatMap((name) => [...readFigure(name).matchAll(/font-size="(\d+)"[^>]*data-essential-label/g)].map((match) => Number(match[1])));
  // Then every figure exposes essential labels and none falls below 24px on the 600px view box.
  assert.ok(sizes.length >= figures.length);
  assert.ok(sizes.every((size) => size >= 24));
});
