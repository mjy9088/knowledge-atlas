import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/nuclear-constituents/page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/nuclear-constituents/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

const numberAttribute = (content: string, selector: string, attribute: string): number => {
  const match = content.match(new RegExp(`<[^>]+${selector}[^>]+${attribute}="([0-9.]+)"`));
  assert.ok(match, `missing ${attribute} for ${selector}`);
  return Number(match[1]);
};

test('neutral comparison holds incident mass and speed while drawn penetration differs qualitatively', () => {
  // Given two aligned qualitative lanes with the comparison conditions encoded independently.
  const svg = readFigure('figure-neutral-penetration.svg');
  const proton = group(svg, 'proton-lane');
  const neutral = group(svg, 'beryllium-radiation-lane');

  // When the actual lane conditions and drawn path endpoints are read.
  const conditions = [proton, neutral].map((lane) => ({
    mass: numberAttribute(lane, 'data-projectile', 'data-mass'),
    speed: numberAttribute(lane, 'data-projectile', 'data-speed'),
  }));
  const endpoints = [proton, neutral].map((lane) => numberAttribute(lane, 'data-path', 'x2'));

  // Then charge is the encoded difference and the neutral-radiation path extends farther without a thickness scale.
  assert.deepEqual(conditions, [{mass: 1, speed: 1}, {mass: 1, speed: 1}]);
  assert.deepEqual([
    numberAttribute(proton, 'data-projectile', 'data-charge'),
    numberAttribute(neutral, 'data-projectile', 'data-charge'),
  ], [1, 0]);
  assert.ok((endpoints[1] ?? 0) > (endpoints[0] ?? 0));
  assert.doesNotMatch(svg, /data-thickness|\b(?:cm|mm)\b/);
});

test('collision model draws an initially stationary target and one collinear head-on maximum-recoil setup', () => {
  // Given the before/after geometry for the scoped elastic-collision model.
  const svg = readFigure('figure-collision-model.svg');
  const initial = group(svg, 'initial-state');
  const final = group(svg, 'maximum-recoil-state');

  // When projectile, target, and velocity-arrow coordinates are inspected.
  const projectileY = numberAttribute(initial, 'data-role="unseen-projectile"', 'cy');
  const targetY = numberAttribute(initial, 'data-role="stationary-target"', 'cy');
  const incidentY1 = numberAttribute(initial, 'data-velocity="incident"', 'y1');
  const incidentY2 = numberAttribute(initial, 'data-velocity="incident"', 'y2');
  const recoilY1 = numberAttribute(final, 'data-velocity="maximum-recoil"', 'y1');
  const recoilY2 = numberAttribute(final, 'data-velocity="maximum-recoil"', 'y2');

  // Then every role lies on one collision axis and the target begins at rest.
  assert.deepEqual([projectileY, targetY, incidentY1, incidentY2, recoilY1, recoilY2], [156, 156, 156, 156, 252, 252]);
  assert.equal(numberAttribute(initial, 'data-role="stationary-target"', 'data-initial-speed'), 0);
  assert.match(svg, /data-model="head-on-elastic"/);
  assert.match(svg, /data-equation="u-max=2MV\/\(M\+A\)"/);
  assert.doesNotMatch(svg, /data-force=/);
});

test('before and after target positions agree with the depicted positive recoil direction',()=>{
  const svg=readFigure('figure-collision-model.svg');
  const initial=group(svg,'initial-state'),final=group(svg,'maximum-recoil-state');
  const beforeX=numberAttribute(initial,'data-initial-speed="0"','cx');
  const afterX=numberAttribute(final,'data-role="observed-charged-recoil"','cx');
  const x1=numberAttribute(final,'data-velocity="maximum-recoil"','x1');
  const x2=numberAttribute(final,'data-velocity="maximum-recoil"','x2');
  assert.ok(x2>x1&&afterX>beforeX);
});

test('two-target geometry and reported velocities independently reproduce the historical mass estimate', () => {
  // Given hydrogen and nitrogen rows sharing one encoded incident-speed condition.
  const svg = readFigure('figure-recoil-mass.svg');
  const hydrogen = group(svg, 'hydrogen-case');
  const nitrogen = group(svg, 'nitrogen-case');

  // When target masses, maximum recoil observations, and the ratio solution are calculated from figure data.
  const targetMasses = [hydrogen, nitrogen].map((row) => numberAttribute(row, 'data-target', 'data-mass'));
  const speeds = [hydrogen, nitrogen].map((row) => numberAttribute(row, 'data-observation', 'data-recoil-speed'));
  const commonSpeeds = [hydrogen, nitrogen].map((row) => numberAttribute(row, 'data-projectile', 'data-speed'));
  const ratio = (speeds[0] ?? 0) / (speeds[1] ?? 1);
  const mass = (14 - ratio) / (ratio - 1);

  // Then two distinct targets at common V carry the exact historical values and imply about 0.89 proton masses.
  assert.deepEqual(targetMasses, [1, 14]);
  assert.deepEqual(commonSpeeds, [1, 1]);
  assert.deepEqual(speeds, [3_700_000_000, 470_000_000]);
  assert.ok(Math.abs(mass - 0.89) < 0.01);
  assert.match(svg, /data-solution="M=\(14-r\)\/\(r-1\)"/);
});

test('page wires only the three neutron reasoning figures while preserving proton interaction and static endpoints', () => {
  // Given the seven-scene topic page.
  const expectedFigures = new Map([
    ['neutral', '/content/physics-discovery/nuclear-constituents/figure-neutral-penetration.svg'],
    ['collision-model', '/content/physics-discovery/nuclear-constituents/figure-collision-model.svg'],
    ['recoil', '/content/physics-discovery/nuclear-constituents/figure-recoil-mass.svg'],
  ]);

  // When scene representations are inspected.
  const figures = new Map(page.scenes.filter((scene) => scene.figure).map((scene) => [scene.id, scene.figure?.src]));
  const proton = page.scenes.find((scene) => scene.id === 'proton');
  const staticEndpoints = page.scenes.filter((scene) => ['question', 'limit', 'transfer'].includes(scene.id));

  // Then the three replacements are figures, proton alone remains interactive, and the other static cards remain present.
  assert.deepEqual(figures, expectedFigures);
  assert.deepEqual(proton?.suggestion, {example: 'proton'});
  assert.ok(staticEndpoints.every((scene) => scene.figure === undefined && scene.cards.length > 0));
  assert.ok(page.scenes.filter((scene) => expectedFigures.has(scene.id)).every((scene) => scene.suggestion === undefined && scene.cards.length === 0));
});
