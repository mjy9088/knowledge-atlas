import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/photoelectric-evidence/page.js';

const readOwned = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/photoelectric-evidence/${name}`, import.meta.url), 'utf8');

const attribute = (svg: string, selector: string, name: string): number => {
  const element = svg.match(new RegExp(`<[^>]+data-fixture="${selector}"[^>]*>`))?.[0];
  assert.ok(element, `missing fixture ${selector}`);
  const value = element.match(new RegExp(`${name}="(-?[0-9.]+)"`))?.[1];
  assert.ok(value, `missing ${name} on ${selector}`);
  return Number(value);
};

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing group ${id}`);
  return match[1] ?? '';
};

type Point = Readonly<{x: number; y: number}>;
type Box = Readonly<{left: number; top: number; right: number; bottom: number}>;

const pointKey = ({x, y}: Point): string => `${x},${y}`;

const nodePoint = (svg: string, name: string): Point => {
  const match = svg.match(new RegExp(`<circle\\b[^>]*data-node="${name}"[^>]*cx="([0-9.]+)"[^>]*cy="([0-9.]+)"`));
  assert.ok(match, `missing circuit node ${name}`);
  return {x: Number(match[1]), y: Number(match[2])};
};

const wireGraph = (svg: string): ReadonlyMap<string, ReadonlySet<string>> => {
  const mutable = new Map<string, Set<string>>();
  for (const match of svg.matchAll(/<line\b[^>]*data-wire="[^"]+"[^>]*x1="([0-9.]+)"[^>]*y1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*y2="([0-9.]+)"/g)) {
    const start = pointKey({x: Number(match[1]), y: Number(match[2])});
    const end = pointKey({x: Number(match[3]), y: Number(match[4])});
    if (!mutable.has(start)) mutable.set(start, new Set());
    if (!mutable.has(end)) mutable.set(end, new Set());
    mutable.get(start)?.add(end);
    mutable.get(end)?.add(start);
  }
  return mutable;
};

const connectedByWires = (svg: string, startName: string, endName: string): boolean => {
  const graph = wireGraph(svg);
  const start = pointKey(nodePoint(svg, startName));
  const end = pointKey(nodePoint(svg, endName));
  const pending = [start];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined || visited.has(current)) continue;
    if (current === end) return true;
    visited.add(current);
    pending.push(...(graph.get(current) ?? []));
  }
  return false;
};

const wireCrossesHorizontalGap = (svg: string, leftName: string, rightName: string): boolean => {
  const left = nodePoint(svg, leftName);
  const right = nodePoint(svg, rightName);
  return [...svg.matchAll(/<line\b[^>]*data-wire="[^"]+"[^>]*x1="([0-9.]+)"[^>]*y1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*y2="([0-9.]+)"/g)].some((match) => {
    const [x1, y1, x2, y2] = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
    return y1 === left.y && y2 === right.y && Math.min(x1, x2) <= left.x && Math.max(x1, x2) >= right.x;
  });
};

const numericTagAttribute = (tag: string, name: string): number => {
  const value = tag.match(new RegExp(`${name}="([0-9.]+)"`))?.[1];
  assert.ok(value, `missing ${name} on ${tag}`);
  return Number(value);
};

const tagBounds = (tag: string): Box => {
  if (tag.startsWith('<circle')) {
    const radius = numericTagAttribute(tag, 'r');
    const centerX = numericTagAttribute(tag, 'cx');
    const centerY = numericTagAttribute(tag, 'cy');
    return {left: centerX - radius, top: centerY - radius, right: centerX + radius, bottom: centerY + radius};
  }
  if (tag.startsWith('<line')) {
    const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((name) => numericTagAttribute(tag, name));
    return {left: Math.min(x1 ?? 0, x2 ?? 0), top: Math.min(y1 ?? 0, y2 ?? 0), right: Math.max(x1 ?? 0, x2 ?? 0), bottom: Math.max(y1 ?? 0, y2 ?? 0)};
  }
  const x = numericTagAttribute(tag, 'x');
  const y = numericTagAttribute(tag, 'y');
  return {left: x, top: y, right: x + numericTagAttribute(tag, 'width'), bottom: y + numericTagAttribute(tag, 'height')};
};

const boxesIntersect = (left: Box, right: Box): boolean =>
  left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;

const PLANCK_EV_SECONDS = 4.136e-15;
const WORK_FUNCTION_EV = 2.3;

test('worked energies are independent calculations with no physical negative kinetic energy', () => {
  // Given the two authored frequencies and one independently fixed work function.
  const belowFrequencyHz = 4e14;
  const aboveFrequencyHz = 8e14;
  // When photon energy, shortfall, and permitted excess are calculated.
  const belowEnergyEv = PLANCK_EV_SECONDS * belowFrequencyHz;
  const aboveEnergyEv = PLANCK_EV_SECONDS * aboveFrequencyHz;
  const shortfallEv = WORK_FUNCTION_EV - belowEnergyEv;
  const kineticEnergyEv = aboveEnergyEv - WORK_FUNCTION_EV;
  // Then the figures encode those inputs and separate blocked emission from positive kinetic energy.
  assert.equal(belowEnergyEv, 1.6544);
  assert.equal(shortfallEv, 0.6455999999999997);
  assert.equal(aboveEnergyEv, 3.3088);
  assert.equal(Number(kineticEnergyEv.toFixed(4)), 1.0088);
  const below = readOwned('figure-below-threshold.svg');
  const above = readOwned('figure-above-threshold.svg');
  assert.equal(attribute(below, 'photon-energy', 'data-energy-ev'), belowEnergyEv);
  assert.equal(attribute(below, 'work-function', 'data-energy-ev'), WORK_FUNCTION_EV);
  assert.equal(attribute(below, 'shortfall', 'data-energy-ev'), Number(shortfallEv.toFixed(4)));
  assert.doesNotMatch(below, /data-electron-arrow=/);
  assert.doesNotMatch(below, /data-kinetic-energy-ev="-/);
  assert.equal(attribute(above, 'photon-energy', 'data-energy-ev'), aboveEnergyEv);
  assert.equal(attribute(above, 'kinetic-energy', 'data-energy-ev'), Number(kineticEnergyEv.toFixed(4)));
  assert.match(above, /data-electron-arrow="emitted"/);
});

test('complete apparatus connects electrodes, adjustable source, series ammeter, and parallel voltmeter', () => {
  // Given explicit component terminals and the visible wire-segment coordinates.
  const apparatus = readOwned('figure-apparatus.svg');
  // When wire-only reachability is reconstructed independently of component metadata.
  // Then each meter/source terminal reaches the intended electrode side and no wire shorts a component symbol.
  assert.equal(connectedByWires(apparatus, 'emitter-metal', 'emitter-node'), true);
  assert.equal(connectedByWires(apparatus, 'collector-metal', 'collector-node'), true);
  assert.equal(connectedByWires(apparatus, 'collector-node', 'ammeter-in'), true);
  assert.equal(connectedByWires(apparatus, 'ammeter-out', 'source-right'), true);
  assert.equal(connectedByWires(apparatus, 'source-left', 'emitter-node'), true);
  assert.equal(connectedByWires(apparatus, 'emitter-node', 'voltmeter-left'), true);
  assert.equal(connectedByWires(apparatus, 'collector-node', 'voltmeter-right'), true);
  assert.equal(connectedByWires(apparatus, 'voltmeter-right', 'ammeter-out'), false);
  for (const [left, right] of [['ammeter-in', 'ammeter-out'], ['voltmeter-left', 'voltmeter-right'], ['source-left', 'source-right']] as const) {
    assert.equal(wireCrossesHorizontalGap(apparatus, left, right), false, `${left}–${right} is visually shorted`);
  }
  assert.match(apparatus, /data-component="ammeter" data-role="series" data-terminal-a="ammeter-in" data-terminal-b="ammeter-out"/);
  assert.match(apparatus, /data-component="voltmeter" data-role="parallel" data-terminal-a="voltmeter-left" data-terminal-b="voltmeter-right"/);
  assert.match(apparatus, /data-component="adjustable-dc-bias" data-terminal-a="source-left" data-terminal-b="source-right"/);
  for (const electrode of ['emitter', 'collector'] as const) {
    assert.match(apparatus, new RegExp(`data-label-leader="${electrode}"`));
  }
  const labelNames = ['emitter-metal', 'collector-metal', 'emitter-polarity', 'collector-polarity', 'ammeter', 'voltmeter', 'source'] as const;
  const labelTags = labelNames.map((name) => {
    const tag = apparatus.match(new RegExp(`<rect\\b[^>]*data-label-band="${name}"[^>]*>`))?.[0];
    assert.ok(tag, `missing label band ${name}`);
    return tag;
  });
  const obstacleTags = [
    ...apparatus.matchAll(/<line\b(?=[^>]*(?:data-wire|data-obstacle-line)="[^"]+")[^>]*>/g),
    ...apparatus.matchAll(/<(?:rect|circle)\b[^>]*data-obstacle-component="[^"]+"[^>]*>/g),
  ].map((match) => match[0]);
  for (const labelTag of labelTags) {
    for (const obstacleTag of obstacleTags) assert.equal(boxesIntersect(tagBounds(labelTag), tagBounds(obstacleTag)), false, `${labelTag} intersects ${obstacleTag}`);
  }
});

test('generic retarding polarity has no worked-example voltage and opposes a right-moving electron', () => {
  // Given a generic apparatus polarity and the separate numerical worked example.
  const collectorVoltageV = -1.0088;
  const electronChargeSign = -1;
  // When the stopping-potential magnitude and force direction are derived.
  const stoppingMagnitudeV = Math.abs(collectorVoltageV);
  const electricFieldDirection = 1;
  const forceDirection = electronChargeSign * electricFieldDirection;
  // Then only the worked example carries −1.0088 V while both drawings preserve E-right and force-left.
  assert.equal(stoppingMagnitudeV, 1.0088);
  assert.equal(forceDirection, -1);
  const apparatus = readOwned('figure-apparatus.svg');
  assert.doesNotMatch(apparatus, /1\.0088|data-voltage-v=/);
  assert.match(apparatus, /data-polarity="collector-negative"/);
  for (const svg of [apparatus, readOwned('figure-above-threshold.svg')]) {
    assert.equal(attribute(svg, 'electric-field', 'data-direction-x'), electricFieldDirection);
    assert.equal(attribute(svg, 'electron-force', 'data-direction-x'), forceDirection);
  }
  assert.equal(attribute(readOwned('figure-above-threshold.svg'), 'collector-voltage', 'data-voltage-v'), collectorVoltageV);
});

test('qualitative current curves share a screen intercept and order plateaus without physical ratios', () => {
  // Given two same-frequency qualitative current-voltage curves.
  const observations = readOwned('figure-observations.svg');
  const low = group(observations, 'low-intensity-curve');
  const high = group(observations, 'high-intensity-curve');
  // When their stopping points and plateau screen heights are inspected.
  const lowStopX = attribute(low, 'stopping-intercept', 'cx');
  const highStopX = attribute(high, 'stopping-intercept', 'cx');
  const lowPlateauY = attribute(low, 'saturation-plateau', 'y1');
  const highPlateauY = attribute(high, 'saturation-plateau', 'y1');
  // Then both stop at one negative-axis position and higher intensity is only relationally higher.
  assert.equal(highStopX, lowStopX);
  assert.ok(highPlateauY < lowPlateauY);
  assert.match(observations, /data-current-kind="magnitude"/);
  assert.match(observations, /data-figure-kind="qualitative-schematic"/);
  assert.doesNotMatch(observations, /data-error-bar|data-measured-point|data-voltage-v|data-relative-current/);
});

test('single-photon ledger separates blocked, exact-threshold, and positive-energy cases', () => {
  // Given the single-photon model and a material-dependent cutoff.
  const model = readOwned('figure-single-photon-model.svg');
  const limit = readOwned('figure-regime-limit.svg');
  // When semantic states and scope are inspected.
  const blocked = group(model, 'blocked-branch');
  const threshold = group(model, 'threshold-branch');
  const permitted = group(model, 'permitted-branch');
  // Then equality has ideal Kmax zero without an emission arrow or guaranteed measurable current.
  assert.match(model, /id="blocked-branch" data-emission="blocked"/);
  assert.doesNotMatch(blocked, /data-electron-arrow=/);
  assert.match(model, /id="threshold-branch" data-emission="not-guaranteed"[^>]*data-kinetic-energy-ev="0"/);
  assert.doesNotMatch(threshold, /data-electron-arrow=/);
  assert.match(model, /id="permitted-branch" data-emission="conditional"[^>]*data-kinetic-energy-sign="positive"/);
  assert.match(permitted, /data-electron-arrow="emitted"/);
  assert.match(model, /data-threshold-cases="less-equal-greater"/);
  assert.match(model, /data-comparator="simple-continuous-accumulation"/);
  assert.match(model, /data-observation="below-cutoff-no-ordinary-photocurrent"/);
  assert.match(limit, /data-regime="single-photon-low-intensity"/);
  assert.match(limit, /data-regime="multiphoton-strong-field"[^>]*data-scope="excluded"/);
  assert.match(limit, /data-limit="not-all-classical-theories"/);
  assert.match(limit, /data-limit="not-all-quantum-mechanics"/);
});

test('fixed-frequency transfer changes arrivals and current but not per-photon energy or stopping magnitude', () => {
  // Given two transfer panels at one frequency with all collection conditions held fixed.
  const transfer = readOwned('figure-transfer.svg');
  const before = group(transfer, 'before-intensity-change');
  const after = group(transfer, 'after-intensity-change');
  // When machine-readable conditions and outcomes are compared.
  const fixed = ['data-frequency-hz', 'data-photon-energy-ev', 'data-kinetic-energy-ev', 'data-stopping-magnitude-v'];
  // Then physical energy values remain fixed while arrivals and current use relational order only.
  for (const name of fixed) assert.equal(attribute(before, 'conditions', name), attribute(after, 'conditions', name));
  assert.match(before, /data-arrival-order="lower"[^>]*data-current-order="lower"/);
  assert.match(after, /data-arrival-order="higher"[^>]*data-current-order="higher"/);
  assert.match(before, /data-arrival-cue="lower"/);
  assert.match(after, /data-arrival-cue="higher"/);
  assert.doesNotMatch(transfer, /data-photon="arrival"|data-arrival-rate|data-relative-current/);
  assert.match(transfer, /hf 3\.31 eV/g);
  assert.match(transfer, /Kmax 1\.01 eV/g);
});

test('essential labels use 24-unit type and corrected energy panels keep units and bounds', () => {
  // Given every owned SVG and the below/above worked panels.
  const names = ['figure-apparatus.svg', 'figure-observations.svg', 'figure-single-photon-model.svg', 'figure-below-threshold.svg', 'figure-above-threshold.svg', 'figure-regime-limit.svg', 'figure-transfer.svg'];
  // When font sizes, units, and below-panel geometry are inspected.
  for (const name of names) {
    const svg = readOwned(name);
    const sizes = [...svg.matchAll(/font-size="([0-9.]+)"/g)].map((match) => Number(match[1]));
    assert.ok(sizes.length > 0 && sizes.every((size) => size >= 24), `${name} contains sub-24 label text`);
  }
  const below = readOwned('figure-below-threshold.svg');
  const frameBottom = attribute(below, 'plot-frame', 'y') + attribute(below, 'plot-frame', 'height');
  const bannerBottom = attribute(below, 'result-banner', 'y') + attribute(below, 'result-banner', 'height');
  assert.ok(bannerBottom <= frameBottom);
  const above = readOwned('figure-above-threshold.svg');
  assert.match(above, /φ=2\.30 eV/);
});

test('all seven original figures use bounded user-space markers and page wiring preserves scene order', () => {
  // Given the seven-scene static article contract.
  const figures = new Map([
    ['question', 'figure-apparatus.svg'],
    ['observations', 'figure-observations.svg'],
    ['single-photon-model', 'figure-single-photon-model.svg'],
    ['below-threshold-case', 'figure-below-threshold.svg'],
    ['above-threshold-case', 'figure-above-threshold.svg'],
    ['regime-limit', 'figure-regime-limit.svg'],
    ['transfer', 'figure-transfer.svg'],
  ]);
  // When figure metadata and marker definitions are inspected.
  for (const name of figures.values()) {
    const svg = readOwned(name);
    assert.match(svg, /<title>[^<]+<\/title>/);
    assert.match(svg, /<desc>[^<]+<\/desc>/);
    for (const marker of svg.matchAll(/<marker\b[^>]*>/g)) {
      assert.match(marker[0], /markerUnits="userSpaceOnUse"/);
      assert.ok(Number(marker[0].match(/markerWidth="([0-9.]+)"/)?.[1] ?? 13) <= 12);
      assert.ok(Number(marker[0].match(/markerHeight="([0-9.]+)"/)?.[1] ?? 13) <= 12);
    }
  }
  // Then every stable scene keeps its ID/order and has one planned original figure.
  assert.deepEqual(page.scenes.map((scene) => scene.id), [...figures.keys()]);
  assert.deepEqual(new Map(page.scenes.map((scene) => [scene.id, scene.figure?.src])), new Map([...figures].map(([id, name]) => [id, `/content/physics-discovery/photoelectric-evidence/${name}`])));
  assert.ok(page.scenes.every((scene) => (scene.figure?.alt.length ?? 0) > 0 && (scene.figure?.caption.length ?? 0) > 0));
});
