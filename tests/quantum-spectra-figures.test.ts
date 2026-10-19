import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/quantum-spectra/page.js';

const readOwned = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/quantum-spectra/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

const numericAttribute = (content: string, selector: string, attribute: string): number => {
  const match = content.match(new RegExp(`${selector}[^>]*${attribute}="(-?[0-9.]+)"`));
  assert.ok(match, `missing ${attribute} for ${selector}`);
  return Number(match[1]);
};

const openingTag = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>`));
  assert.ok(match, `missing opening tag ${id}`);
  return match[0];
};

const photonEnergyEv = (wavelengthNm: number): number => 1239.841984 / wavelengthNm;
const hydrogenEnergyEv = (principalQuantumNumber: number): number => -13.6 / principalQuantumNumber ** 2;
const hydrogenTransitionWavelengthNm = (upper: number, lower: number): number =>
  1239.841984 / Math.abs(hydrogenEnergyEv(upper) - hydrogenEnergyEv(lower));

test('air-wavelength markers use one linear numeric axis rather than categorical spacing', () => {
  // Given the four rounded NIST Balmer air wavelengths and the authored axis endpoints.
  const wavelengths = [410.2, 434.0, 486.1, 656.3] as const;
  const svg = readOwned('figure-balmer-lines.svg');
  const axis = group(svg, 'linear-air-wavelength-axis');
  const axisTag = openingTag(svg, 'linear-air-wavelength-axis');
  const start = numericAttribute(axisTag, 'data-axis-min="400"', 'data-x');
  const end = numericAttribute(axisTag, 'data-axis-max="670"', 'data-axis-end-x');
  // When expected and rendered positions are independently calculated.
  const expected = wavelengths.map((wavelength) => start + (wavelength - 400) / 270 * (end - start));
  const rendered = wavelengths.map((wavelength) =>
    numericAttribute(axis, `data-wavelength-nm="${wavelength.toFixed(1)}"`, 'x1'));
  // Then every marker follows the same scale and the intervals remain nonuniform.
  rendered.forEach((position, index) => assert.ok(Math.abs(position - (expected[index] ?? position)) < 0.6));
  const intervals = rendered.slice(1).map((position, index) => position - (rendered[index] ?? position));
  assert.ok((intervals[0] ?? 0) < (intervals[1] ?? 0));
  assert.ok((intervals[1] ?? 0) < (intervals[2] ?? 0));
  assert.doesNotMatch(svg, /linearGradient|radialGradient|data-brightness|data-intensity/);
});

test('nearby Balmer labels use staggered leaders with readable clearance', () => {
  // Given all four labels on the shared wavelength axis.
  const svg = readOwned('figure-balmer-lines.svg');
  const labels = ['410.2', '434.0', '486.1', '656.3'].map((wavelength) => {
    const match = svg.match(new RegExp(`data-label-for="${wavelength.replace('.', '\\.')}"[^>]*x="([0-9.]+)" y="([0-9.]+)"`));
    assert.ok(match, `missing label for ${wavelength}`);
    return {wavelength, y: Number(match[2])};
  });
  // When their baselines and leader associations are inspected.
  const firstGap = Math.abs((labels[0]?.y ?? 0) - (labels[1]?.y ?? 0));
  const secondGap = Math.abs((labels[1]?.y ?? 0) - (labels[2]?.y ?? 0));
  // Then both crowded pairs occupy separate rows and every label owns a leader.
  assert.ok(firstGap >= 32);
  assert.ok(secondGap >= 32);
  assert.equal((svg.match(/data-leader-for="(?:410\.2|434\.0|486\.1|656\.3)"/g) ?? []).length, 4);
});

test('every essential SVG label is at least 24 user units', () => {
  // Given the five figures rendered in a 600-unit-wide view box.
  const figures = [
    'figure-balmer-lines.svg',
    'figure-energy-conversion.svg',
    'figure-transition-conditions.svg',
    'figure-hydrogen-levels.svg',
    'figure-transfer.svg',
  ] as const;
  // When explicit text sizes are collected.
  for (const figure of figures) {
    const sizes = [...readOwned(figure).matchAll(/<text\b[^>]*font-size="([0-9.]+)"/g)].map((match) => Number(match[1]));
    // Then no visible label falls below the projection legibility floor.
    assert.ok(sizes.length > 0, `${figure} has no sized labels`);
    assert.ok(sizes.every((size) => size >= 24), `${figure} contains a label below 24 units`);
  }
});

test('wavelength conversion separates exact air relation from the near-unity approximation', () => {
  // Given two NIST air wavelengths and an independent hc constant.
  const fixture = [
    {wavelengthNm: 410.2, roundedEnergyEv: 3.02},
    {wavelengthNm: 656.3, roundedEnergyEv: 1.89},
  ] as const;
  const svg = readOwned('figure-energy-conversion.svg');
  // When photon energies are computed independently under n_air approximately one.
  const computed = fixture.map(({wavelengthNm}) => Number(photonEnergyEv(wavelengthNm).toFixed(2)));
  // Then the rounded results and structured exact/approximate stages agree.
  assert.deepEqual(computed, fixture.map(({roundedEnergyEv}) => roundedEnergyEv));
  assert.match(svg, /data-relation="exact-photon"/);
  assert.match(svg, /data-relation="exact-air-vacuum"/);
  assert.match(svg, /data-relation="approx-air-index"/);
  assert.match(svg, /data-source-scope="individual-line-deduction"/);
  for (const {wavelengthNm, roundedEnergyEv} of fixture) {
    assert.match(svg, new RegExp(`data-wavelength-nm="${wavelengthNm.toFixed(1)}"[^>]*data-energy-ev="${roundedEnergyEv.toFixed(2)}"`));
  }
});

test('reader-facing energy notation keeps the absolute relation atomic and the air index typographic', () => {
  // Given every topic-owned text surface that renders the energy relation or air refractive index.
  const exactPhotonRelation = '|\u2060ΔE\u2060|\u2060=\u2060hν\u2060=\u2060hc\u2060/\u2060λvac';
  const surfaces = [
    readOwned('article.ko.json'),
    readOwned('claims.json'),
    readOwned('figure-energy-conversion.svg'),
    JSON.stringify(page.scenes),
  ];
  // When the machine-consumed display tokens are inspected.
  // Then the complete absolute-value relation has no internal line-break opportunity and source-style underscores stay out of rendered text.
  assert.match(surfaces[0] ?? '', new RegExp(exactPhotonRelation));
  for (const surface of surfaces) {
    assert.doesNotMatch(surface, /n_air/);
    assert.match(surface, /nₐᵢᵣ/);
  }
});

test('transition condition geometry keeps energy, probability, and population as separate inputs', () => {
  // Given a one-photon energy match plus transition and upper-population conditions.
  const svg = readOwned('figure-transition-conditions.svg');
  const dependencies = group(svg, 'line-power-dependencies');
  // When incoming dependency edges are counted by their semantic source.
  const incoming = [...dependencies.matchAll(/data-dependency="([^"]+)"/g)].map((match) => match[1]);
  // Then no energy-only edge replaces transition probability or population.
  assert.deepEqual(incoming.sort(), ['energy-match', 'transition-probability', 'upper-population']);
  assert.match(svg, /data-transition-type="E1"/);
  assert.match(svg, /data-transition-type="M1"/);
  assert.match(svg, /data-transition-type="E2"/);
  assert.match(svg, /data-factor="Aki"/);
  assert.match(svg, /data-factor="Nk"/);
});

test('transition figure encodes local emissivity quantities and observational dependencies', () => {
  // Given the NIST equation 13 local-emissivity representation.
  const svg = readOwned('figure-transition-conditions.svg');
  // When its machine-readable quantities and boundary are inspected.
  // Then Aki is a rate, Nk is a number density, and the result is not observed brightness.
  assert.match(svg, /data-quantity="Aki"[^>]*data-unit="s-1"/);
  assert.match(svg, /data-quantity="Nk"[^>]*data-unit="m-3"/);
  assert.match(svg, /data-quantity="local-line-emissivity"[^>]*data-unit="W m-3 sr-1"/);
  assert.match(svg, /data-observed-dependencies="opacity geometry instrument-response"/);
});

test('idealized hydrogen levels scale with minus 13.6 over n squared and map two Balmer transitions', () => {
  // Given principal quantum numbers 2 through 6 and a declared linear energy-coordinate scale.
  const svg = readOwned('figure-hydrogen-levels.svg');
  const levels = group(svg, 'idealized-hydrogen-levels');
  const scale = numericAttribute(openingTag(svg, 'idealized-hydrogen-levels'), 'data-energy-zero-y="48"', 'data-energy-scale');
  // When each level coordinate is predicted from the independent idealized energy formula.
  for (const n of [2, 3, 4, 5, 6] as const) {
    const energy = hydrogenEnergyEv(n);
    const renderedEnergy = numericAttribute(levels, `data-n="${n}"`, 'data-energy-ev');
    const renderedY = numericAttribute(levels, `data-n="${n}"`, 'y1');
    assert.ok(Math.abs(renderedEnergy - energy) < 0.006);
    assert.ok(Math.abs(renderedY - (48 - energy * scale)) < 0.6);
  }
  // Then approximate model wavelengths are independently rounded without implying false precision.
  const transitions = [
    {upper: 3, lower: 2, modelVacuumNm: 656, tableAirNm: 656.3},
    {upper: 6, lower: 2, modelVacuumNm: 410, tableAirNm: 410.2},
  ] as const;
  for (const transition of transitions) {
    assert.equal(
      Math.round(hydrogenTransitionWavelengthNm(transition.upper, transition.lower)),
      transition.modelVacuumNm,
    );
    assert.match(
      svg,
      new RegExp(`data-transition="${transition.upper}-${transition.lower}"[^>]*data-model-vacuum-wavelength-nm="${transition.modelVacuumNm}"[^>]*data-table-air-wavelength-nm="${transition.tableAirNm.toFixed(1)}"`),
    );
  }
  assert.doesNotMatch(svg, /<circle|<ellipse|data-orbit|classical-path/);
});

test('all SVG markers use bounded user-space geometry', () => {
  // Given every authored figure that contains arrow markers.
  const figures = [
    'figure-energy-conversion.svg',
    'figure-transition-conditions.svg',
    'figure-hydrogen-levels.svg',
    'figure-transfer.svg',
  ] as const;
  // When marker definitions are inspected.
  for (const figure of figures) {
    const svg = readOwned(figure);
    const markers = [...svg.matchAll(/<marker\b([^>]*)>/g)].map((match) => match[1] ?? '');
    // Then every marker is user-space sized at no more than 12 units.
    assert.ok(markers.length > 0, `${figure} has no markers`);
    for (const marker of markers) {
      assert.match(marker, /markerUnits="userSpaceOnUse"/);
      const width = marker.match(/markerWidth="([0-9.]+)"/);
      const height = marker.match(/markerHeight="([0-9.]+)"/);
      assert.ok(width && height);
      assert.ok(Number(width[1]) <= 12);
      assert.ok(Number(height[1]) <= 12);
    }
  }
});

test('page preserves seven scene IDs and wires only the five planned figures', () => {
  // Given the stable article scene contract and planned static representations.
  const expected = new Map([
    ['pattern', '/content/physics-discovery/quantum-spectra/figure-balmer-lines.svg'],
    ['energy', '/content/physics-discovery/quantum-spectra/figure-energy-conversion.svg'],
    ['transition-limit', '/content/physics-discovery/quantum-spectra/figure-transition-conditions.svg'],
    ['bohr', '/content/physics-discovery/quantum-spectra/figure-hydrogen-levels.svg'],
    ['transfer', '/content/physics-discovery/quantum-spectra/figure-transfer.svg'],
  ]);
  // When IDs, figure wiring, and stylesheet ownership are inspected.
  const figures = new Map(page.scenes.filter((scene) => scene.figure).map((scene) => [scene.id, scene.figure?.src]));
  // Then question/limit remain cards and all stable IDs survive in order.
  assert.deepEqual(page.scenes.map((scene) => scene.id), ['question', 'pattern', 'energy', 'transition-limit', 'bohr', 'limit', 'transfer']);
  assert.deepEqual(figures, expected);
  assert.deepEqual(page.styles, ['/topics/physics/quantum-spectra.css']);
  assert.ok(page.scenes.filter((scene) => !expected.has(scene.id)).every((scene) => scene.cards.length > 0));
});
