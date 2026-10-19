import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import article from '../content/number-systems/rational-density/article.ko.json';
import page from '../content/number-systems/rational-density/page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/number-systems/rational-density/${name}`, import.meta.url), 'utf8');

const readTopicStyles = (): string =>
  readFileSync(new URL('../apps/web/topics/number-systems/rational-density.css', import.meta.url), 'utf8');

const semanticGroup = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[0];
};

const panelVerticalBounds = (svg: string, id: string): readonly [top: number, bottom: number] => {
  const panel = semanticGroup(svg, id).match(/<rect\b[^>]*y="(\d+)"[^>]*height="(\d+)"/);
  assert.ok(panel, `missing panel geometry ${id}`);
  const top = Number(panel[1]);
  return [top, top + Number(panel[2])];
};

const connectorVerticalBounds = (svg: string, id: string): readonly [top: number, bottom: number] => {
  const connector = semanticGroup(svg, id);
  const line = connector.match(/<line\b[^>]*y1="(\d+)"[^>]*y2="(\d+)"/);
  const arrowhead = connector.match(/<polygon\b[^>]*points="([\d ,]+)"/);
  assert.ok(line && arrowhead, `missing explicit connector geometry ${id}`);
  const values = [Number(line[1]), Number(line[2]), ...arrowhead[1].split(/[ ,]+/).filter(Boolean).map(Number)];
  const vertical = values.filter((_, index) => index < 2 || index % 2 === 1);
  return [Math.min(...vertical), Math.max(...vertical)];
};

type Fraction = Readonly<{ numerator: number; denominator: number }>;

const compare = (left: Fraction, right: Fraction): number =>
  Math.sign(left.numerator * right.denominator - right.numerator * left.denominator) *
  Math.sign(left.denominator * right.denominator);

test('floor plus one selects the first integer strictly right of negative and integer inputs', () => {
  // Given negative, zero, positive, integer, and noninteger nx fixtures.
  const values = [-2, -1.2, 0, 1.2, 3] as const;
  // When m is constructed independently from the floor definition.
  const observed = values.map((nx) => ({ nx, floor: Math.floor(nx), m: Math.floor(nx) + 1 }));
  // Then floor(nx) <= nx < m <= nx+1, including exact integer boundaries.
  for (const { nx, floor, m } of observed) {
    assert.ok(floor <= nx);
    assert.ok(nx < m);
    assert.ok(m <= nx + 1);
    assert.ok(Number.isInteger(m));
  }
  assert.deepEqual(observed.map(({ m }) => m), [-1, -1, 1, 2, 4]);
});

test('strict mesh rejects the coarse endpoint hit and accepts the fine interior point exactly', () => {
  // Given x=1, y=11/10 and the two authored positive mesh denominators.
  const x: Fraction = { numerator: 1, denominator: 1 };
  const y: Fraction = { numerator: 11, denominator: 10 };
  const fixtures = [10, 20] as const;
  // When each m=floor(nx)+1 grid point and mesh width are calculated.
  const observed = fixtures.map((n) => {
    const m = Math.floor(n * x.numerator / x.denominator) + 1;
    return {
      n,
      point: { numerator: m, denominator: n },
      strictMesh: compare({ numerator: 1, denominator: n }, { numerator: 1, denominator: 10 }) < 0,
    };
  });
  // Then n=10 reaches y, while n=20 satisfies the strict mesh and lies inside.
  assert.equal(compare(observed[0]?.point ?? x, y), 0);
  assert.equal(observed[0]?.strictMesh, false);
  assert.ok(compare(x, observed[1]?.point ?? x) < 0);
  assert.ok(compare(observed[1]?.point ?? y, y) < 0);
  assert.equal(observed[1]?.strictMesh, true);
});

test('opening evidence and pre-definition grid notation stay aligned', () => {
  // Given the opening block introduces the rational-endpoint midpoint before m is defined.
  const opening = article.blocks[0];
  const gridPlan = semanticGroup(readFigure('figure-grid-plan.svg'), 'first-point-right-of-x');
  // When claim coverage and selected-point semantics are inspected.
  assert.equal(opening?.id, 'block:number-systems.rational-density.opening-gap');
  // Then both the midpoint result and stronger theorem are linked, while the figure stays notation-neutral.
  assert.deepEqual(opening.claimRefs, [
    'claim:number-systems.rational.density',
    'claim:number-systems.rational-density.theorem',
  ]);
  assert.ok(page.claimRefs.includes('claim:number-systems.rational.density'));
  assert.match(gridPlan, /data-label-stage="pre-m-definition"/);
});

test('division preserves the floor chain only for the stated positive n premise', () => {
  // Given nx<m<=nx+1 fixtures and positive or negative divisors.
  const fixtures = [
    { nx: -2.4, m: -2, n: 3 },
    { nx: 2, m: 3, n: 2 },
    { nx: -2.4, m: -2, n: -3 },
  ] as const;
  // When the divided chain is checked in its authored left-to-right order.
  const observed = fixtures.map(({ nx, m, n }) => nx / n < m / n && m / n <= (nx + 1) / n);
  // Then both positive-n cases preserve order and the negative-n case does not.
  assert.deepEqual(observed, [true, true, false]);
});

test('grid-plan figure marks the selected point as the first uniform grid point right of x', () => {
  // Given an illustrative uniform grid whose selected point is identified semantically.
  const svg = readFigure('figure-grid-plan.svg');
  const grid = semanticGroup(svg, 'uniform-grid');
  const selection = semanticGroup(svg, 'first-point-right-of-x');
  // When exact tick coordinates and the x/selected coordinates are decoded.
  const ticks = [...grid.matchAll(/data-grid-index="(-?\d+)"[^>]*data-x="(\d+)"/g)].map((match) => Number(match[2]));
  const selected = selection.match(/data-x-coordinate="(\d+)"[^>]*data-selected-coordinate="(\d+)"/);
  assert.ok(selected);
  // Then ticks are uniformly spaced and the selected tick is immediately right of x.
  const gaps = ticks.slice(1).map((value, index) => value - (ticks[index] ?? value));
  assert.ok(gaps.length >= 3);
  assert.ok(gaps.every((gap) => gap === gaps[0]));
  assert.ok(Number(selected[1]) < Number(selected[2]));
  assert.ok(Number(selected[2]) - Number(selected[1]) < (gaps[0] ?? 0));
});

test('floor figure uses one scale for a negative noninteger and an exact integer boundary', () => {
  // Given two floor cases in the authored construction figure.
  const svg = readFigure('figure-first-grid-point.svg');
  const negative = semanticGroup(svg, 'negative-noninteger-case');
  const integer = semanticGroup(svg, 'integer-boundary-case');
  // When their exact values and pixel coordinates are inspected.
  assert.match(negative, /data-nx="-2\.4"[^>]*data-floor="-3"[^>]*data-m="-2"/);
  assert.match(integer, /data-nx="2"[^>]*data-floor="2"[^>]*data-m="3"/);
  const coordinates = [...svg.matchAll(/data-scale-value="(-?\d+)"[^>]*data-x="(\d+)"/g)].map((match) => ({
    value: Number(match[1]),
    x: Number(match[2]),
  }));
  const slopes = coordinates.slice(1).map((point, index) => {
    const prior = coordinates[index];
    assert.ok(prior);
    return (point.x - prior.x) / (point.value - prior.value);
  });
  // Then one affine scale governs every integer tick and both cases retain strict nx<m.
  assert.ok(slopes.length >= 4);
  assert.ok(slopes.every((slope) => slope === slopes[0]));
});

test('coarse and fine comparison shares endpoints and places 21/20 halfway inside', () => {
  // Given paired exact-fraction rows on one interval scale.
  const svg = readFigure('figure-mesh-comparison.svg');
  const coarse = semanticGroup(svg, 'coarse-mesh');
  const fine = semanticGroup(svg, 'fine-mesh');
  // When endpoint and selected-point coordinates are read independently of labels.
  const coarseGeometry = coarse.match(/data-left-x="(\d+)"[^>]*data-selected-x="(\d+)"[^>]*data-right-x="(\d+)"/);
  const fineGeometry = fine.match(/data-left-x="(\d+)"[^>]*data-selected-x="(\d+)"[^>]*data-right-x="(\d+)"/);
  assert.ok(coarseGeometry && fineGeometry);
  const coarseValues = coarseGeometry.slice(1).map(Number);
  const fineValues = fineGeometry.slice(1).map(Number);
  // Then coarse selection equals y, while fine selection is the exact midpoint on the same endpoints.
  assert.deepEqual([coarseValues[0], coarseValues[2]], [fineValues[0], fineValues[2]]);
  assert.equal(coarseValues[1], coarseValues[2]);
  assert.equal((fineValues[1] ?? 0) - (fineValues[0] ?? 0), (fineValues[2] ?? 0) - (fineValues[1] ?? 0));
  assert.match(coarse, /data-point="11\/10"[^>]*data-status="endpoint"/);
  assert.match(fine, /data-point="21\/20"[^>]*data-status="strict-interior"/);
  assert.match(coarse, /data-axis-y="104"[^>]*data-label-baseline="141"[^>]*data-max-marker-radius="11"/);
  assert.match(fine, /data-axis-y="210"[^>]*data-label-baseline="251"[^>]*data-max-marker-radius="11"/);
  assert.ok(141 - 22 - (104 + 11) >= 4);
  assert.ok(251 - 22 - (210 + 11) >= 4);
  assert.doesNotMatch(svg, /data-decimal-guess=/);
});

test('boundary comparison clears labels and shows directed floor-plus-one movement', () => {
  // Given the integer-boundary comparison uses one upper axis and one explicit lower movement.
  const svg = readFigure('figure-boundary-choice.svg');
  const ceiling = semanticGroup(svg, 'ceiling-choice');
  const movement = semanticGroup(svg, 'floor-plus-one-movement');
  // When authored bounds and arrow geometry are decoded.
  const upper = ceiling.match(/data-axis-end="(\d+)"[^>]*data-outcome-left="(\d+)"[^>]*data-formula-bottom="(\d+)"[^>]*data-marker-top="(\d+)"/);
  const arrow = movement.match(/data-from-clear="(\d+)"[^>]*data-head-tip="(\d+)"[^>]*data-to-clear="(\d+)"/);
  assert.ok(upper && arrow);
  // Then labels clear the axis and marker, and the complete arrow stays between both markers.
  assert.ok(Number(upper[1]) + 4 <= Number(upper[2]));
  assert.ok(Number(upper[3]) + 4 <= Number(upper[4]));
  assert.ok(Number(arrow[1]) <= Number(arrow[2]));
  assert.ok(Number(arrow[2]) <= Number(arrow[3]));
  assert.doesNotMatch(movement, /<marker\b|marker-end=/);
  assert.match(movement, /<polygon\b[^>]*points=/);
});

test('mobile exact-square cards and compact Korean units keep authored reading flow', () => {
  // Given the two exact-square scenes and the canonical article prose.
  const styles = readTopicStyles();
  const prose = article.blocks.map((block) => block.text).join(' ');
  // When topic-scoped narrow-flow and nonbreaking units are inspected.
  const units = ['x\u00a0바로\u00a0오른쪽의', 'm\u2060=\u2060⌊nx⌋\u2060+\u20601로\u00a0두면', 'k는\u00a0정수이고', '두\u00a0정수의\u00a0비이므로', '확인할\u00a0수\u00a0있습니다', '이는\u00a0열린\u00a0구간의\u00a0답이\u00a0아닙니다', '사용함을\u00a0보여\u00a0줍니다'] as const;
  // Then cards form one compact column without connector dots and only the named units stay joined.
  assert.match(styles, /:is\(#irrational-lower,#irrational-upper\) \.concept-diagram\{[^}]*flex-direction:column;[^}]*flex-wrap:nowrap;[^}]*gap:8px/);
  assert.match(styles, /:is\(#irrational-lower,#irrational-upper\) \.concept-diagram>\.concept-connector\{display:none\}/);
  assert.match(styles, /font-size:20px/);
  assert.ok(units.every((unit) => prose.includes(unit)));
});

test('divide-chain arrowheads remain in panel gaps instead of scaling across formulas', () => {
  // Given the three proof panels and their two explicit connectors.
  const svg = readFigure('figure-divide-chain.svg');
  const integerPanel = panelVerticalBounds(svg, 'integer-chain');
  const dividedPanel = panelVerticalBounds(svg, 'divided-chain');
  const strictPanel = panelVerticalBounds(svg, 'strict-mesh-link');
  // When complete line and arrowhead extents are decoded from authored SVG geometry.
  const divideConnector = connectorVerticalBounds(svg, 'divide-positive-connector');
  const appendConnector = connectorVerticalBounds(svg, 'append-strict-connector');
  // Then neither connector enters a panel and SVG marker scaling cannot enlarge its arrowhead.
  assert.doesNotMatch(svg, /<marker\b|marker-end=/);
  assert.ok(divideConnector[0] >= integerPanel[1] + 4);
  assert.ok(divideConnector[1] <= dividedPanel[0] - 4);
  assert.ok(appendConnector[0] >= dividedPanel[1] + 4);
  assert.ok(appendConnector[1] <= strictPanel[0] - 4);
});

test('critical static figures are wired to the mechanism-bearing scenes', () => {
  // Given the canonical thirteen-scene order.
  const figures = new Map(page.scenes.map((scene) => [scene.id, scene.figure?.src]));
  // When figure ownership is inspected.
  // Then only mechanism-bearing comparisons replace cards, while all IDs and order remain stable.
  assert.deepEqual([...figures], [
    ['opening-gap', '/content/number-systems/rational-density/figure-midpoint-scope.svg'],
    ['grid-plan', '/content/number-systems/rational-density/figure-grid-plan.svg'],
    ['choose-mesh', undefined],
    ['mesh-points', '/content/number-systems/rational-density/figure-mesh-points.svg'],
    ['first-grid-point', '/content/number-systems/rational-density/figure-first-grid-point.svg'],
    ['divide-chain', '/content/number-systems/rational-density/figure-divide-chain.svg'],
    ['strict-result', undefined],
    ['ceiling-boundary', '/content/number-systems/rational-density/figure-boundary-choice.svg'],
    ['floor-escape', '/content/number-systems/rational-density/figure-boundary-choice.svg'],
    ['irrational-lower', undefined],
    ['irrational-upper', undefined],
    ['coarse-mesh', '/content/number-systems/rational-density/figure-mesh-comparison.svg'],
    ['fine-mesh', '/content/number-systems/rational-density/figure-mesh-comparison.svg'],
  ]);
});
