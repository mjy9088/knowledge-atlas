import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/quark-evidence/page.js';

const readOwned = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/quark-evidence/${name}`, import.meta.url), 'utf8');

const semanticGroup = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

type Point = Readonly<{x: number; y: number}>;
type Box = Readonly<{x: number; y: number; width: number; height: number}>;

const arrow = (svg: string, role: string): readonly [Point, Point] => {
  const match = svg.match(new RegExp(`<line\\b[^>]*data-arrow="${role}"[^>]*x1="([0-9.]+)"[^>]*y1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*y2="([0-9.]+)"`));
  assert.ok(match, `missing arrow ${role}`);
  return [{x: Number(match[1]), y: Number(match[2])}, {x: Number(match[3]), y: Number(match[4])}];
};

const length = ([start, end]: readonly [Point, Point]): number => Math.hypot(end.x - start.x, end.y - start.y);

const box = (svg: string, role: string): Box => {
  const match = svg.match(new RegExp(`<rect\\b[^>]*data-geometry="${role}"[^>]*x="([0-9.]+)"[^>]*y="([0-9.]+)"[^>]*width="([0-9.]+)"[^>]*height="([0-9.]+)"`));
  assert.ok(match, `missing geometry ${role}`);
  return {x: Number(match[1]), y: Number(match[2]), width: Number(match[3]), height: Number(match[4])};
};

const overlaps = (left: Box, right: Box): boolean =>
  left.x < right.x + right.width && left.x + left.width > right.x && left.y < right.y + right.height && left.y + left.height > right.y;

const contains = (outer: Box, inner: Box): boolean =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;

const cubic = (svg: string, role: string): readonly [Point, Point, Point, Point] => {
  const match = svg.match(new RegExp(`<path\\b[^>]*data-role="${role}"[^>]*d="M([0-9.]+) ([0-9.]+)C([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+)"`));
  assert.ok(match, `missing cubic curve ${role}`);
  return [
    {x: Number(match[1]), y: Number(match[2])},
    {x: Number(match[3]), y: Number(match[4])},
    {x: Number(match[5]), y: Number(match[6])},
    {x: Number(match[7]), y: Number(match[8])},
  ];
};

const cubicY = ([start, control1, control2, end]: readonly [Point, Point, Point, Point], t: number): number =>
  (1 - t) ** 3 * start.y + 3 * (1 - t) ** 2 * t * control1.y + 3 * (1 - t) * t ** 2 * control2.y + t ** 3 * end.y;

const textBounds = (svg: string, role: string): Box => {
  const match = svg.match(new RegExp(`<text\\b[^>]*data-fit="${role}"[^>]*x="([0-9.]+)"[^>]*y="([0-9.]+)"[^>]*font-size="([0-9.]+)"[^>]*>([^<]+)<\\/text>`));
  assert.ok(match, `missing fitted text ${role}`);
  const size = Number(match[3]);
  const width = [...(match[4] ?? '')].reduce((sum, character) => sum + (character === ' ' ? 0.5 : 1), 0) * size;
  return {x: Number(match[1]), y: Number(match[2]) - size, width, height: size * 1.25};
};

test('epistemic pipeline has four ordered stages joined by nondegenerate arrows', () => {
  // Given a source-bounded measurement-to-inference overview.
  const svg = readOwned('figure-pipeline.svg');
  const stages = [...svg.matchAll(/data-stage="([^"]+)" data-order="(\d+)"/g)]
    .map((match) => ({name: match[1], order: Number(match[2])}));
  // When stage order and actual arrow geometry are inspected.
  const arrows = ['measured-to-processed', 'processed-to-conditional', 'conditional-to-inferred'].map((role) => length(arrow(svg, role)));
  // Then the chain is complete and no connector collapses to a point.
  assert.deepEqual(stages, [
    {name: 'measured', order: 1},
    {name: 'processed', order: 2},
    {name: 'conditional', order: 3},
    {name: 'inferred', order: 4},
  ]);
  assert.ok(arrows.every((value) => value >= 24));
});

test('all arrow markers use bounded user-space geometry', () => {
  // Given every owned teaching figure.
  const figures = page.scenes.flatMap((scene) => scene.figure?.src ? [readOwned(scene.figure.src.split('/').at(-1) ?? '')] : []);
  // When SVG markers are parsed.
  const markers = figures.flatMap((svg) => [...svg.matchAll(/<marker\b([^>]*)>/g)].map((match) => match[1] ?? ''));
  // Then every marker has an explicit user-space box no larger than 12 units.
  assert.ok(markers.length > 0);
  for (const marker of markers) {
    assert.match(marker, /markerUnits="userSpaceOnUse"/);
    const width = Number(marker.match(/markerWidth="([0-9.]+)"/)?.[1]);
    const height = Number(marker.match(/markerHeight="([0-9.]+)"/)?.[1]);
    assert.ok(width > 0 && width <= 12);
    assert.ok(height > 0 && height <= 12);
  }
});

test('kinematics distinguishes measured inputs from derived event quantities and DIS selection', () => {
  // Given the event-kinematics figure.
  const svg = readOwned('figure-kinematics.svg');
  const measured = semanticGroup(svg, 'measured-inputs');
  const derived = semanticGroup(svg, 'derived-event-quantities');
  // When semantic roles are inspected.
  // Then E, E-prime, and theta are measured while nu and Q-squared are derived with units and region selection.
  assert.deepEqual([...measured.matchAll(/data-variable="([^"]+)"/g)].map((match) => match[1]), ['E', 'E-prime', 'theta']);
  assert.deepEqual([...derived.matchAll(/data-variable="([^"]+)"/g)].map((match) => match[1]), ['nu', 'Q-squared']);
  assert.match(svg, /data-unit="GeV"/);
  assert.match(svg, /data-selection="large-Q2-and-W2"/);
  assert.match(svg, /data-sign-convention="Q2-equals-minus-qmu-qmu"/);
  assert.match(svg, /data-frame="proton-rest-laboratory"/);
  assert.match(svg, /data-hadronic-mass="W"/);
  assert.match(svg, /data-proton-mass="M"/);
  assert.doesNotMatch(svg, /data-role="beam-energy"[^>]*data-role="resolution"/);
});

test('Mott processing preserves same-kinematics division and does not call raw cross section scaling', () => {
  // Given the processing ledger.
  const svg = readOwned('figure-mott-processing.svg');
  const operation = semanticGroup(svg, 'same-kinematics-division');
  // When numerator, denominator, and output roles are compared.
  // Then the measured cross section is divided by the known Mott factor at matched kinematics and yields a combination.
  assert.match(operation, /data-role="measured-cross-section"/);
  assert.match(operation, /data-role="known-mott-factor"/);
  assert.match(operation, /data-condition="same-kinematics"/);
  assert.match(operation, /data-output="structure-function-combination"/);
  assert.match(operation, /data-combination="W2-plus-2W1-tan2-theta-over-2"/);
  assert.doesNotMatch(svg, /data-output="(?:raw-scaling|unique-W2)"/);
});

test('conditional extraction keeps two function-valued unknowns and model extremes', () => {
  // Given the small-angle extraction dependency map.
  const svg = readOwned('figure-conditional-extraction.svg');
  const unknowns = [...svg.matchAll(/data-unknown="([^"]+)" data-kind="function"/g)].map((match) => match[1]);
  // When unknowns and assumptions are counted.
  // Then W1 and W2 remain functions across kinematics and R supplies bounded assumptions.
  assert.deepEqual(unknowns, ['W1', 'W2']);
  assert.match(svg, /data-warning="not-two-constants"/);
  assert.deepEqual([...svg.matchAll(/data-r-bound="([^"]+)"/g)].map((match) => match[1]), ['zero', 'infinity']);
  assert.deepEqual([...svg.matchAll(/data-extraction="([^"]+)"/g)].map((match) => match[1]), ['transverse-dominance', 'longitudinal-dominance']);
  assert.doesNotMatch(svg, /data-role="measured-uncertainty"/);
});

test('fixed-W comparison and R cases preserve distinct invariants and outcomes', () => {
  // Given source-bounded residual and conditional comparisons.
  const residual = readOwned('figure-residual-pattern.svg');
  const conditional = readOwned('figure-scaling-condition.svg');
  // When fixed quantities and extraction outcomes are inspected.
  const curve = box(residual, 'orange-curve');
  const label = box(residual, 'orange-label');
  const deepCurve = box(residual, 'deep-curve');
  const deepLabel = box(residual, 'deep-label');
  const upperRow = box(conditional, 'upper-row');
  const upperLabel = box(conditional, 'upper-label');
  const upperCurve = box(conditional, 'upper-curve');
  const upperRange = box(conditional, 'upper-range');
  const lowerRow = box(conditional, 'lower-row');
  const lowerLabel = box(conditional, 'lower-label');
  const lowerCurve = box(conditional, 'lower-curve');
  const lowerTrend = box(conditional, 'lower-trend');
  const trendLines = ['lower-trend-condition', 'lower-trend-result'].map((role) => textBounds(conditional, role));
  const stronger = cubic(residual, 'elastic-resonance');
  const weaker = cubic(residual, 'deep-continuum');
  const curveGaps = Array.from({length: 101}, (_, index) => cubicY(stronger, index / 100) - cubicY(weaker, index / 100));
  // Then the residual comparison holds hadronic W fixed, labels do not collide, and only R=0 collapses conservatively.
  assert.match(residual, /data-held-fixed="hadronic-W"/);
  assert.match(residual, /data-varied="positive-Q2"/);
  assert.equal(overlaps(curve, label), false);
  assert.equal(overlaps(deepCurve, deepLabel), false);
  assert.equal(overlaps(upperLabel, upperCurve), false);
  assert.equal(overlaps(upperRange, upperCurve), false);
  assert.equal(overlaps(lowerLabel, lowerCurve), false);
  assert.equal(overlaps(lowerTrend, lowerCurve), false);
  assert.ok(curveGaps.every((gap) => gap >= 24));
  assert.ok([upperLabel, upperCurve, upperRange].every((region) => contains(upperRow, region)));
  assert.ok([lowerLabel, lowerCurve, lowerTrend].every((region) => contains(lowerRow, region)));
  assert.ok(trendLines.every((line) => contains(lowerRow, line)));
  assert.match(conditional, /data-r-case="zero"[^>]*data-behavior="universal-compatible"/);
  assert.match(conditional, /data-r-case="infinity"[^>]*data-behavior="rises-with-Q2-at-fixed-omega"/);
  assert.match(conditional, /data-range-Q2="greater-than-1-GeV2"/);
  assert.match(conditional, /data-range-omega="greater-than-4"/);
});

test('qualitative comparisons cannot masquerade as historical plots or datasets', () => {
  // Given the residual and conditional-pattern figures.
  const figures = [readOwned('figure-residual-pattern.svg'), readOwned('figure-scaling-condition.svg')];
  // When their semantic metadata and graphical vocabulary are inspected.
  // Then they identify qualitative roles, use nu-W2, and contain no data points, histograms, percentages, or uncertainty bands.
  for (const svg of figures) {
    assert.match(svg, /data-representation="qualitative-schematic"/);
    assert.match(svg, /data-source-data="none"/);
    assert.doesNotMatch(svg, /data-point=|data-histogram=|data-uncertainty=|\b\d+(?:\.\d+)?%/);
  }
  assert.match(figures[1] ?? '', /data-quantity="nu-W2"/);
  assert.doesNotMatch(figures[1] ?? '', /data-quantity="W2"/);
});

test('inference boundary avoids constituent counting and narrows quark identification', () => {
  // Given three inference figures with different evidence roles.
  const parton = readOwned('figure-parton-inference.svg');
  const quark = readOwned('figure-quark-convergence.svg');
  const gluon = readOwned('figure-gluon-boundary.svg');
  // When model marks and evidence boundaries are inspected.
  // Then hard charged partons remain non-countable interpretation, quark identity stays source-bounded, and gluons are not direct photon charge centers.
  assert.match(parton, /data-epistemic-role="model-interpretation"/);
  assert.match(parton, /data-image-claim="none"/);
  assert.equal((parton.match(/data-illustrative-center=/g) ?? []).length, 1);
  assert.match(parton, /data-count="unspecified"/);
  assert.doesNotMatch(quark, /data-evidence-lane=/);
  assert.match(quark, /data-source-boundary="nobel-later-identification"/);
  assert.match(gluon, /data-direct-photon-center="charged-quark"/);
  assert.match(gluon, /data-direct-photon-center="not-gluon"/);
  assert.match(gluon, /data-evidence-role="Q2-dependent-scaling-violations"/);
});

test('all figure labels remain legible and transfer strike stays outside protected concepts', () => {
  // Given every owned SVG and the transfer failure mark.
  const figures = page.scenes.map((scene) => readOwned(scene.figure?.src.split('/').at(-1) ?? ''));
  const transfer = readOwned('figure-transfer.svg');
  // When visible type sizes and geometry boxes are measured.
  const typeSizes = figures.flatMap((svg) => [...svg.matchAll(/font-size="([0-9.]+)"/g)].map((match) => Number(match[1])));
  const strike = box(transfer, 'failure-strike');
  const quantities = box(transfer, 'derived-quantities');
  const classification = box(transfer, 'region-classification');
  // Then every label meets the 24-unit floor and the strike obscures neither required concept.
  assert.ok(typeSizes.length > 0 && typeSizes.every((size) => size >= 24));
  assert.equal(overlaps(strike, quantities), false);
  assert.equal(overlaps(strike, classification), false);
});

test('topic captions preserve the 13-pixel floor in every profile', () => {
  // Given the topic-owned stylesheet.
  const css = readFileSync(new URL('../apps/web/topics/physics/quark-evidence.css', import.meta.url), 'utf8');
  // When caption rules are inspected.
  // Then the minimum applies outside media queries and is not reduced inside them.
  assert.match(css, /\.scene-figure figcaption\s*\{[^}]*font-size:\s*max\(13px,/s);
  assert.doesNotMatch(css, /@media[\s\S]*figcaption[^}]*font-size:\s*(?:[0-9]|1[0-2])px/);
});

test('page preserves all ten IDs and gives every scene a source-bounded figure', () => {
  // Given the stable ten-scene article contract.
  const ids = ['question', 'measurement', 'factoring', 'factored-pattern', 'conditional-extraction', 'conditional-pattern', 'parton-inference', 'quark-identification', 'gluon-limit', 'transfer'];
  // When scene wiring is inspected.
  // Then IDs stay ordered and every figure has owned path, alternative text, and caption.
  assert.deepEqual(page.scenes.map((scene) => scene.id), ids);
  assert.ok(page.scenes.every((scene) => scene.figure?.src.startsWith('/content/physics-discovery/quark-evidence/')));
  assert.ok(page.scenes.every((scene) => (scene.figure?.alt.length ?? 0) > 20 && (scene.figure?.caption.length ?? 0) > 10));
  assert.deepEqual(page.styles, ['/topics/physics/quark-evidence.css']);
});
