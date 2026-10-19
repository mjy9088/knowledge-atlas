import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/number-systems/rational-numbers/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

const coverageGeometry = (content: string): readonly number[] => {
  const match = content.match(
    /<rect\b[^>]*data-coverage="half"[^>]*x="(\d+)"[^>]*y="(\d+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/,
  );
  assert.ok(match, 'missing half-coverage geometry');
  return match.slice(1).map(Number);
};

const partitionPositions = (content: string): readonly number[] =>
  [...content.matchAll(/data-boundary-position="(\d+)"/g)].map((match) => Number(match[1]));

type Fraction = readonly [numerator: number, denominator: number];

const compareFractions = (left: Fraction, right: Fraction): number => {
  const difference=left[0]*right[1]-right[0]*left[1];
  return difference===0?0:Math.sign(difference)*Math.sign(left[1]*right[1]);
};

const midpointAndGaps = (endpoints: readonly [Fraction, Fraction]): {
  readonly midpoint: Fraction;
  readonly leftGap: Fraction;
  readonly rightGap: Fraction;
} => {
  const [left, right] = endpoints;
  const midpoint: Fraction = [left[0] * right[1] + right[0] * left[1], 2 * left[1] * right[1]];
  return {
    midpoint,
    leftGap: [midpoint[0] * left[1] - left[0] * midpoint[1], midpoint[1] * left[1]],
    rightGap: [right[0] * midpoint[1] - midpoint[0] * right[1], right[1] * midpoint[1]],
  };
};

test('question figure uses one whole with aligned halves and quarters', () => {
  // Given two authored partition views of the same whole.
  const svg = readFigure('figure-equivalent-halves.svg');
  const halves = group(svg, 'partition-halves');
  const quarters = group(svg, 'partition-quarters');
  // When coverage and internal boundary positions are inspected independently.
  const observed = {
    halfCoverage: coverageGeometry(halves),
    quarterCoverage: coverageGeometry(quarters),
    halfBoundaries: partitionPositions(halves),
    quarterBoundaries: partitionPositions(quarters),
  };
  // Then both representations cover the same half-area and share the midpoint boundary.
  assert.deepEqual(observed, {
    halfCoverage: [60, 76, 240, 72],
    quarterCoverage: [60, 186, 240, 72],
    halfBoundaries: [300],
    quarterBoundaries: [180, 300, 420],
  });
  assert.match(halves, /data-whole="shared-unit"[^>]*data-denominator="2"/);
  assert.match(quarters, /data-whole="shared-unit"[^>]*data-denominator="4"/);
});

test('zero-denominator figure distinguishes impossible and non-unique branches', () => {
  // Given the two exhaustive cases for the numerator a.
  const svg = readFigure('figure-zero-denominator-cases.svg');
  const nonzero = group(svg, 'case-nonzero');
  const zero = group(svg, 'case-zero');
  // When their equation roles and solution cardinalities are inspected.
  const observed = {
    nonzeroCase: /data-condition="a!=0"/.test(nonzero),
    nonzeroSolutions: nonzero.match(/data-solution-count="([^"]+)"/)?.[1],
    zeroCase: /data-condition="a=0"/.test(zero),
    zeroSolutions: zero.match(/data-solution-count="([^"]+)"/)?.[1],
    uniqueValue: zero.match(/data-unique-value="([^"]+)"/)?.[1],
  };
  // Then a nonzero numerator has no solution, while zero has all x but no unique quotient.
  assert.deepEqual(observed, {
    nonzeroCase: true,
    nonzeroSolutions: 'none',
    zeroCase: true,
    zeroSolutions: 'all-x',
    uniqueValue: 'false',
  });
  assert.match(nonzero, /data-equation="0\*x=a"/);
  assert.match(zero, /data-equation="0\*x=0"/);
  assert.doesNotMatch(svg, /data-quotient="0\/0=0"/);
});

test('density figure balances two visibly positive half-gaps under rational strict-order conditions', () => {
  // Given the authored general midpoint construction, independent of its example labels.
  const svg = readFigure('figure-rational-midpoint.svg');
  const conditions = group(svg, 'rational-strict-order');
  const midpoint = group(svg, 'rational-midpoint');
  const leftGap = group(svg, 'left-positive-gap');
  const rightGap = group(svg, 'right-positive-gap');
  // When the domain, closure, signs, and authored segment coordinates are inspected.
  const observed = {
    conditions: conditions.match(/data-endpoints="([^"]+)"[^>]*data-order="([^"]+)"/)?.slice(1).map((value) => value.replaceAll('&lt;', '<')),
    midpoint: midpoint.match(/data-formula="([^"]+)"[^>]*data-result-domain="([^"]+)"/)?.slice(1),
    leftGap: leftGap.match(/data-expression="([^"]+)"[^>]*data-sign="([^"]+)"[^>]*data-from-x="(\d+)"[^>]*data-to-x="(\d+)"/)?.slice(1),
    rightGap: rightGap.match(/data-expression="([^"]+)"[^>]*data-sign="([^"]+)"[^>]*data-from-x="(\d+)"[^>]*data-to-x="(\d+)"/)?.slice(1),
  };
  // Then rational endpoints and strict order are explicit, and equal positive gaps have equal geometry.
  assert.deepEqual(observed, {
    conditions: ['x,y in Q', 'x<y'],
    midpoint: ['m=(x+y)/2', 'Q'],
    leftGap: ['m-x=(y-x)/2', 'positive', '120', '300'],
    rightGap: ['y-m=(y-x)/2', 'positive', '300', '480'],
  });
  assert.equal(Number(observed.leftGap?.[3]) - Number(observed.leftGap?.[2]), Number(observed.rightGap?.[3]) - Number(observed.rightGap?.[2]));
  const leftDrawn=leftGap.match(/x1="([0-9.]+)"[^>]*x2="([0-9.]+)"/);
  const rightDrawn=rightGap.match(/x1="([0-9.]+)"[^>]*x2="([0-9.]+)"/);
  assert.ok(leftDrawn&&rightDrawn);
  assert.ok(Number(leftDrawn[2])>Number(leftDrawn[1]));
  assert.equal(Number(leftDrawn[2]),Number(rightDrawn[1]));
  assert.equal(Number(leftDrawn[2])-Number(leftDrawn[1]),Number(rightDrawn[2])-Number(rightDrawn[1]));
  assert.match(midpoint, /data-divisor="2"[^>]*data-divisor-nonzero="true"/);
  assert.doesNotMatch(svg, /data-endpoints="arbitrary-real"/);
});

test('rational midpoint fixtures have equal positive gaps across positive, negative, and zero-crossing pairs', () => {
  // Given exact-rational endpoint pairs, including negative-denominator representations.
  const fixtures: readonly (readonly [Fraction, Fraction])[] = [
    [[1, 3], [1, 2]],
    [[-3, 4], [-1, 4]],
    [[-2, 3], [1, 3]],
    [[1, -3], [1, 2]],
    [[3, -4], [1, -4]],
  ];
  // When each midpoint and its two differences are calculated by integer arithmetic.
  const observed = fixtures.map((endpoints) => midpointAndGaps(endpoints));
  // Then every midpoint is strictly internal and both exact gaps are positive and equal.
  observed.forEach(({ midpoint, leftGap, rightGap }, index) => {
    const endpoints = fixtures[index];
    assert.ok(endpoints);
    assert.ok(compareFractions(endpoints[0], midpoint) < 0);
    assert.ok(compareFractions(midpoint, endpoints[1]) < 0);
    assert.ok(leftGap[0] * leftGap[1] > 0);
    assert.ok(rightGap[0] * rightGap[1] > 0);
    assert.equal(compareFractions(leftGap, rightGap), 0);
  });
});

test('strict midpoint premise excludes equal or reversed rational endpoints', () => {
  // Given endpoint pairs outside the claim's strict x<y assumption.
  const fixtures: readonly (readonly [Fraction, Fraction])[] = [
    [[2, 5], [2, 5]],
    [[3, 4], [2, 3]],
  ];
  // When strict order is checked with exact cross-products.
  const observed = fixtures.map(([left, right]) => compareFractions(left, right) < 0);
  // Then neither pair enters the strict-density midpoint fixture scope.
  assert.deepEqual(observed, [false, false]);
});

test('transfer figure separates cross-products from an exact uniform midpoint line', () => {
  // Given independent expected numerators and uniformly spaced authored coordinates.
  const svg = readFigure('figure-transfer-midpoint.svg');
  const comparison = group(svg, 'cross-product-comparison');
  const construction = group(svg, 'midpoint-construction');
  const numberLine = group(svg, 'common-number-line');
  const points = [...numberLine.matchAll(/data-point="([^"]+)"[^>]*data-numerator="(\d+)"[^>]*data-denominator="(\d+)"[^>]*data-x="(\d+)"/g)]
    .map((match) => ({ name: match[1], numerator: Number(match[2]), denominator: Number(match[3]), x: Number(match[4]) }));
  // When the three exact fractions and their coordinates are read from the visible line.
  // Then 17/24 is centered between 16/24 and 18/24, independently of labels elsewhere.
  assert.deepEqual(points, [
    { name: 'left', numerator: 16, denominator: 24, x: 120 },
    { name: 'midpoint', numerator: 17, denominator: 24, x: 300 },
    { name: 'right', numerator: 18, denominator: 24, x: 480 },
  ]);
  assert.equal(points[1]?.x - points[0]?.x, points[2]?.x - points[1]?.x);
  assert.match(comparison, /data-left-product="8"[^>]*data-right-product="9"[^>]*data-relation="not-equal"/);
  assert.match(construction, /data-average-step="\(16\/24\+18\/24\)\/2=17\/24"/);
  assert.doesNotMatch(numberLine, /data-decimal=/);
});
