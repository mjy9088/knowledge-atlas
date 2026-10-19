import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/electron-evidence/page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/electron-evidence/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

type Vector = Readonly<{x: number; y: number; z: number}>;
type Point = Readonly<{x: number; y: number}>;
type Dimensions = Readonly<{mass: number; length: number; time: number; charge: number}>;

const cross = (left: Vector, right: Vector): Vector => ({
  x: left.y * right.z - left.z * right.y,
  y: left.z * right.x - left.x * right.z,
  z: left.x * right.y - left.y * right.x,
});

const scale = (factor: number, vector: Vector): Vector => ({
  x: factor * vector.x,
  y: factor * vector.y,
  z: factor * vector.z,
});

const vectorLine = (content: string, role: string): readonly [Point, Point] => {
  const match = content.match(new RegExp(`<line\\b[^>]*data-vector="${role}"[^>]*x1="([0-9.]+)"[^>]*y1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*y2="([0-9.]+)"`));
  assert.ok(match, `missing vector ${role}`);
  return [{x: Number(match[1]), y: Number(match[2])}, {x: Number(match[3]), y: Number(match[4])}];
};

const screenVector = ([start, end]: readonly [Point, Point]): Vector => ({
  x: end.x - start.x,
  y: start.y - end.y,
  z: 0,
});

const addDimensions = (left: Dimensions, right: Dimensions): Dimensions => ({
  mass: left.mass + right.mass,
  length: left.length + right.length,
  time: left.time + right.time,
  charge: left.charge + right.charge,
});

const subtractDimensions = (left: Dimensions, right: Dimensions): Dimensions => ({
  mass: left.mass - right.mass,
  length: left.length - right.length,
  time: left.time - right.time,
  charge: left.charge - right.charge,
});

test('crossed fields show independently correct forces for a negative charge', () => {
  // Given the declared +x velocity, +y electric field, +z magnetic field, and negative charge.
  const velocity = {x: 1, y: 0, z: 0};
  const electricField = {x: 0, y: 1, z: 0};
  const magneticField = {x: 0, y: 0, z: 1};
  const expectedElectricForce = scale(-1, electricField);
  const expectedMagneticForce = scale(-1, cross(velocity, magneticField));
  // When the actual figure vectors are interpreted in mathematical coordinates.
  const apparatus = readFigure('figure-crossed-fields.svg');
  const forces = group(apparatus, 'force-vectors');
  // Then electric force points down and magnetic force points up with separate velocity/force markers.
  assert.equal(expectedElectricForce.y, -1);
  assert.equal(expectedMagneticForce.y, 1);
  assert.ok(screenVector(vectorLine(forces, 'electric-force')).y < 0);
  assert.ok(screenVector(vectorLine(forces, 'magnetic-force')).y > 0);
  assert.match(apparatus, /data-field="magnetic"[^>]*data-direction="out-of-page"/);
  assert.match(apparatus, /B · 종이 밖/);
  assert.match(apparatus, /q ≠ 0 · B &gt; 0/);
  assert.match(apparatus, /v ⟂ B · 균일장 · 저속/);
  assert.match(apparatus, /marker-end="url\(#velocity-arrow\)"/);
  assert.match(apparatus, /marker-end="url\(#force-arrow\)"/);
});

test('magnetic-only curvature has tangent velocity, inward force, and a geometric radius', () => {
  // Given a negative charge entering a +z magnetic field toward +x.
  const expectedForce = scale(-1, cross({x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1}));
  // When the curvature construction is read from its authored geometry.
  const ratio = readFigure('figure-curvature-ratio.svg');
  const geometry = group(ratio, 'curvature-geometry');
  const centerMatch = geometry.match(/<circle[^>]*data-point="center"[^>]*cx="([0-9.]+)"[^>]*cy="([0-9.]+)"/);
  const particleMatch = geometry.match(/<circle[^>]*data-point="particle"[^>]*cx="([0-9.]+)"[^>]*cy="([0-9.]+)"/);
  assert.ok(centerMatch && particleMatch);
  const center = {x: Number(centerMatch[1]), y: Number(centerMatch[2])};
  const particle = {x: Number(particleMatch[1]), y: Number(particleMatch[2])};
  const radius = vectorLine(geometry, 'radius');
  // Then the center is above the particle, the force is inward/up, and radius endpoints join them.
  assert.ok(expectedForce.y > 0);
  assert.ok(center.y < particle.y);
  assert.deepEqual(radius, [particle, center]);
  assert.ok(screenVector(vectorLine(geometry, 'velocity')).x > 0);
  assert.ok(screenVector(vectorLine(geometry, 'magnetic-force')).y > 0);
  assert.match(ratio, /MODEL/);
  assert.match(ratio, /측정 궤적 아님/);
});

test('charge-to-mass expression has charge per mass dimensions', () => {
  // Given SI dimensions for speed, magnetic field, and radius.
  const speed = {mass: 0, length: 1, time: -1, charge: 0};
  const magneticField = {mass: 1, length: 0, time: -1, charge: -1};
  const radius = {mass: 0, length: 1, time: 0, charge: 0};
  // When dimensions of v/(Br) are calculated independently.
  const result = subtractDimensions(speed, addDimensions(magneticField, radius));
  // Then they equal charge divided by mass.
  assert.deepEqual(result, {mass: -1, length: 0, time: 0, charge: 1});
  assert.match(readFigure('figure-curvature-ratio.svg'), /\|q\|\/m = v\/\(Br\)/);
});

test('one ratio permits unequal charge-mass pairs', () => {
  // Given two independently chosen positive pairs, neither copied from the figure.
  const pairs = [{charge: 2, mass: 5}, {charge: 6, mass: 15}] as const;
  // When their charge-to-mass ratios are compared.
  const ratios = pairs.map(({charge, mass}) => charge / mass);
  // Then the ratio agrees although both charge and mass differ.
  assert.equal(ratios[0], ratios[1]);
  assert.notEqual(pairs[0].charge, pairs[1].charge);
  assert.notEqual(pairs[0].mass, pairs[1].mass);
  const limit = readFigure('figure-ratio-limit.svg');
  assert.match(limit, /\(\|q\|, m\)/);
  assert.match(limit, /\(λ\|q\|, λm\)/);
  assert.match(limit, /독립 전하 측정\/보정/);
  assert.match(limit, /빔 사진만으로는 부족/);
});

test('all markers and essential labels obey the bounded static-figure contract', () => {
  // Given every planned electron-evidence figure.
  const figures = ['figure-crossed-fields.svg', 'figure-curvature-ratio.svg', 'figure-ratio-limit.svg', 'figure-field-cases.svg'].map(readFigure);
  // When marker boxes and essential label typography are inspected.
  const markers = figures.flatMap((svg) => [...svg.matchAll(/<marker\b([^>]*)>/g)].map((match) => match[1] ?? ''));
  const labels = figures.flatMap((svg) => [...svg.matchAll(/<text\b[^>]*data-essential-label[^>]*font-size="([0-9.]+)"[^>]*font-weight="([0-9.]+)"/g)]);
  // Then every marker uses explicit user-space units and every essential label is large and weighted.
  assert.ok(markers.length > 0);
  for (const marker of markers) {
    assert.match(marker, /markerUnits="userSpaceOnUse"/);
    assert.ok(Number(marker.match(/markerWidth="([0-9.]+)"/)?.[1]) <= 12);
    assert.ok(Number(marker.match(/markerHeight="([0-9.]+)"/)?.[1]) <= 12);
  }
  assert.ok(labels.length > 0);
  assert.ok(labels.every((match) => Number(match[1]) >= 24 && Number(match[2]) >= 600 || Number(match[1]) >= 22 && Number(match[2]) >= 560));
});

test('page preserves six IDs and wires only the four planned static figures', () => {
  // Given the stable six-scene article contract.
  const expected = new Map([
    ['apparatus', '/content/physics-discovery/electron-evidence/figure-crossed-fields.svg'],
    ['ratio', '/content/physics-discovery/electron-evidence/figure-curvature-ratio.svg'],
    ['limit', '/content/physics-discovery/electron-evidence/figure-ratio-limit.svg'],
    ['transfer', '/content/physics-discovery/electron-evidence/figure-field-cases.svg'],
  ]);
  // When IDs and figure wiring are inspected.
  const figures = new Map(page.scenes.filter((scene) => scene.figure).map((scene) => [scene.id, scene.figure?.src]));
  // Then framing and repeatability remain cards while four reasoning scenes use figures.
  assert.deepEqual(page.scenes.map((scene) => scene.id), ['question', 'apparatus', 'ratio', 'repeat', 'limit', 'transfer']);
  assert.deepEqual(figures, expected);
  assert.ok(page.scenes.filter((scene) => !expected.has(scene.id)).every((scene) => scene.cards.length > 0));
  assert.ok(page.scenes.filter((scene) => scene.figure).every((scene) => /모형|개념도/.test(scene.figure?.caption ?? '')));
  assert.ok(page.scenes.filter((scene) => scene.figure).every((scene) => /측정 궤적|역사 장치 재구성|빔 사진/.test(scene.figure?.alt ?? '')));
});
