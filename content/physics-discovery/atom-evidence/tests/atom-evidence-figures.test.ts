import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

type Estimate = Readonly<{method: string; value: number; x: number; labelX: number; leaderX: number}>;

const estimates = (svg: string): readonly Estimate[] =>
  [...svg.matchAll(/<g[^>]*data-estimate="([^"]+)" data-value="([0-9.]+)"[^>]*>\s*<line[^>]*x1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*>\s*<circle[^>]*cx="([0-9.]+)"[^>]*>\s*<text[^>]*x="([0-9.]+)"/g)]
    .map((match) => ({
      method: match[1] ?? '',
      value: Number(match[2]),
      leaderX: Number(match[3]),
      x: Number(match[5]),
      labelX: Number(match[6]),
    }));

test('historical estimates retain source order, unit basis, range, and normalized spread', () => {
  // Given the three numbers reported by the 1926 speech in molecules per two grams of hydrogen.
  const reported = [68.2, 68.8, 65] as const;
  // When their bounded descriptive comparison is calculated independently.
  const ordered = [...reported].sort((left, right) => left - right);
  const range = Math.max(...reported) - Math.min(...reported);
  const normalizedPercent = range / Math.min(...reported) * 100;
  // Then the source order and arithmetic remain distinct, exact, and unit-scoped.
  assert.deepEqual(reported, [68.2, 68.8, 65]);
  assert.deepEqual(ordered, [65, 68.2, 68.8]);
  assert.ok(Math.abs(range - 3.8) < 1e-12);
  assert.ok(Math.abs(normalizedPercent - 5.846153846153846) < 1e-12);

  const svg = readFigure('figure-historical-estimates.svg');
  assert.equal(svg.match(/data-axis-unit="([^"]+)"/)?.[1], '10^22-molecules-per-2g-hydrogen');
  assert.doesNotMatch(svg, /data-error|error-bar|standard-deviation|confidence-interval|6\.022/);
});

test('common-axis markers use proportional geometry and stay clear of their leaders', () => {
  // Given an independently chosen 64–70 axis and the three source-reported values.
  const axis = {minimum: 64, maximum: 70, start: 92, end: 548} as const;
  const svg = readFigure('figure-historical-estimates.svg');
  // When marker positions are read from rendered geometry rather than labels.
  const plotted = estimates(svg);
  const expectedX = (value: number): number =>
    axis.start + (value - axis.minimum) / (axis.maximum - axis.minimum) * (axis.end - axis.start);
  // Then numeric order and distances share one linear scale, with leader/label anchors aligned.
  assert.deepEqual(plotted.map(({value}) => value), [65, 68.2, 68.8]);
  for (const estimate of plotted) {
    assert.ok(Math.abs(estimate.x - expectedX(estimate.value)) <= 0.5);
    assert.equal(estimate.leaderX, estimate.x);
    assert.equal(estimate.labelX, estimate.x);
    assert.ok(estimate.x >= axis.start + 12 && estimate.x <= axis.end - 12);
  }
  assert.ok((plotted[2]?.x ?? 0) - (plotted[1]?.x ?? 0) >= 44);
});

test('translational bridge reconstructs the observable-to-Avogadro relation with compatible SI dimensions', () => {
  // Given the one-coordinate MSD, Einstein, Stokes, and gas-constant relations.
  const svg = readFigure('figure-measurement-pipeline.svg');
  // When the authored symbolic steps and output dimensions are inspected independently.
  const relations = [...svg.matchAll(/data-equation="([^"]+)" data-expression="([^"]+)"/g)]
    .map((match) => [match[1], match[2]]);
  const numerator = {mass: 1, length: 2, time: -2, amount: -1};
  const denominator = {mass: 1, length: 2, time: -2, amount: 0};
  const result = Object.fromEntries(Object.entries(numerator).map(([key, value]) => [key, value - denominator[key as keyof typeof denominator]]));
  // Then every substitution is reconstructable and RT/(eta*a*D) has mol^-1 dimensions.
  assert.deepEqual(relations, [
    ['msd-to-diffusion', 'D=MSD/(2*delta-t)'],
    ['einstein', 'D=kB*T/gamma'],
    ['stokes', 'gamma=6*pi*eta*a'],
    ['gas-constant', 'R=NA*kB'],
    ['avogadro', 'NA=R*T/(6*pi*eta*a*D)'],
  ]);
  assert.deepEqual(result, {mass: 0, length: 0, time: 0, amount: -1});
  assert.deepEqual([...svg.matchAll(/data-quantity="([^"]+)" data-unit="([^"]+)"/g)].map((match) => [match[1], match[2]]), [
    ['D', 'm2/s'], ['T', 'K'], ['eta', 'Pa*s'], ['a', 'm'], ['R', 'J/(mol*K)'], ['kB', 'J/K'], ['NA', '1/mol'],
  ]);
  assert.match(svg, /data-assumptions="one-coordinate,equilibrium,no-drift,no-boundaries,solid-sphere,incompressible-fluid,dilute-solution,stokes-applicability"/);
  assert.doesNotMatch(svg, /<histogram|data-sample|data-trajectory-batch|data-numeric-input/);
});

test('translational bridge stays compact and keeps caveats physically readable on narrow screens', () => {
  // Given every centered muted caveat line and the shared narrow figure box.
  const svg = readFigure('figure-measurement-pipeline.svg');
  const viewBox = svg.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
  assert.ok(viewBox);
  const width = Number(viewBox[1]);
  const height = Number(viewBox[2]);
  const narrowScale = Math.min(390 / width, 276 / height);
  const labelFontSizes = [...svg.matchAll(/<text[^>]*font-size="([0-9.]+)"/g)].map((match) => Number(match[1]));
  const caveats = [...svg.matchAll(/<text[^>]*x="([0-9.]+)" y="([0-9.]+)" text-anchor="middle" font-size="([0-9.]+)"[^>]*fill="#526b58"[^>]*>([^<]+)<\/text>/g)];
  // When conservative root bounds and the rendered font scale are calculated.
  const bounds = caveats.map((match) => {
    const x = Number(match[1]);
    const baseline = Number(match[2]);
    const fontSize = Number(match[3]);
    const textWidth = Array.from(match[4] ?? '').length * fontSize * 0.9;
    return {fontSize, left: x - textWidth / 2, right: x + textWidth / 2, top: baseline - fontSize, bottom: baseline + fontSize * 0.25};
  });
  // Then four complete lines fit a compact figure and remain at least 13 CSS pixels tall.
  assert.equal(height <= 480, true);
  assert.equal(bounds.length, 4);
  assert.ok(labelFontSizes.length > 0);
  assert.ok(labelFontSizes.every((fontSize) => fontSize >= 24 && fontSize * narrowScale >= 13));
  assert.ok(bounds.every(({fontSize, left, right, top, bottom}) => fontSize >= 24 && left >= 16 && right <= width - 16 && top >= 16 && bottom <= height - 16));
});

test('proxy figure declares its single path authored and nonmeasured', () => {
  // Given a visible colloid and unseen molecular-impact cues.
  const svg = readFigure('figure-visible-proxy.svg');
  // When the only irregular path is inspected.
  const paths = [...svg.matchAll(/data-path-role="([^"]+)"/g)].map((match) => match[1]);
  // Then it is one authored illustration, not a measurement or stochastic validation result.
  assert.deepEqual(paths, ['authored-illustration']);
  assert.match(svg, /data-visible="colloid"/);
  assert.match(svg, /data-unseen="water-molecules"/);
  assert.match(svg, /data-collision-model="not-observation"/);
  const label = svg.match(/data-label-region="colloid" x="([0-9.]+)" y="([0-9.]+)"/);
  assert.ok(label);
  assert.ok(Number(label[1]) >= 366);
  assert.doesNotMatch(svg, /data-measurement|data-stochastic-model|data-validation/);
});

test('ordered speech correspondence binds methods to values without claiming statistical independence', () => {
  // Given the speech's method order followed by its unlabeled ordered list of three values.
  const svg = readFigure('figure-historical-estimates.svg');
  // When source-order metadata is read separately from numeric axis order.
  const sourceOrder = [...svg.matchAll(/data-source-index="([0-9]+)" data-estimate="([^"]+)" data-value="([0-9.]+)"/g)]
    .map((match) => ({index: Number(match[1]), method: match[2], value: Number(match[3])}));
  // Then the correspondence is explicit and bounded to distinct methods rather than independent errors.
  assert.deepEqual(sourceOrder, [
    {index: 3, method: 'rotation', value: 65},
    {index: 1, method: 'sedimentation', value: 68.2},
    {index: 2, method: 'translation', value: 68.8},
  ]);
  assert.match(svg, /data-mapping-basis="ordered-speech-text-not-labeled-table"/);
  assert.doesNotMatch(svg, /data-independent|statistically-independent/);
});

test('historical plot separates unit and estimate label bands', () => {
  // Given explicit conservative boxes for the unit heading and every estimate label.
  const svg = readFigure('figure-historical-estimates.svg');
  const boxes = [...svg.matchAll(/data-text-box="([^"]+)" data-left="([0-9.]+)" data-top="([0-9.]+)" data-right="([0-9.]+)" data-bottom="([0-9.]+)"/g)]
    .map((match) => ({name: match[1] ?? '', left: Number(match[2]), top: Number(match[3]), right: Number(match[4]), bottom: Number(match[5])}));
  const unit = boxes.find(({name}) => name === 'unit');
  assert.ok(unit);
  // When pairwise overlap is computed from those authored layout bounds.
  const overlaps = boxes.filter(({name}) => name !== 'unit').filter((box) =>
    Math.max(unit.left, box.left) < Math.min(unit.right, box.right)
      && Math.max(unit.top, box.top) < Math.min(unit.bottom, box.bottom));
  // Then the unit heading occupies a distinct band from all method/value labels.
  assert.deepEqual(overlaps, []);
});

test('all SVG markers are bounded user-space markers', () => {
  // Given every atom-evidence teaching figure.
  const figures = ['figure-visible-proxy.svg', 'figure-measurement-pipeline.svg', 'figure-historical-estimates.svg'] as const;
  // When marker definitions are enumerated.
  const markers = figures.flatMap((name) => [...readFigure(name).matchAll(/<marker\b([^>]*)>/g)].map((match) => match[1] ?? ''));
  // Then no stroke-scaled or oversized arrowhead can cover a label.
  assert.ok(markers.length > 0);
  for (const marker of markers) {
    assert.match(marker, /markerUnits="userSpaceOnUse"/);
    const width = Number(marker.match(/markerWidth="([0-9.]+)"/)?.[1]);
    const height = Number(marker.match(/markerHeight="([0-9.]+)"/)?.[1]);
    assert.ok(width > 0 && width <= 12);
    assert.ok(height > 0 && height <= 12);
  }
});

test('page preserves seven scenes and wires figures only to observe, predict, and measure', () => {
  // Given the stable seven-scene article contract.
  const expected = new Map([
    ['observe', '/content/physics-discovery/atom-evidence/figure-visible-proxy.svg'],
    ['predict', '/content/physics-discovery/atom-evidence/figure-measurement-pipeline.svg'],
    ['measure', '/content/physics-discovery/atom-evidence/figure-historical-estimates.svg'],
  ]);
  // When IDs, sentence ranges, and figure wiring are inspected.
  const figures = new Map(page.scenes.filter((scene) => scene.figure).map((scene) => [scene.id, scene.figure?.src]));
  // Then uncertainty retains the caveat from sentence index 2 and no other scene gains a figure.
  assert.deepEqual(page.scenes.map((scene) => scene.id), ['question', 'observe', 'predict', 'measure', 'uncertainty', 'limit', 'transfer']);
  assert.deepEqual(figures, expected);
  assert.equal(page.scenes[3]?.to, 2);
  assert.equal(page.scenes[4]?.from, 2);
  assert.ok(page.scenes.filter((scene) => !expected.has(scene.id)).every((scene) => scene.cards.length > 0));
});
