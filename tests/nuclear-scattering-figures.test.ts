import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import page from '../content/physics-discovery/nuclear-scattering/page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/physics-discovery/nuclear-scattering/${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

type Point = Readonly<{x: number; y: number}>;
type Box = Readonly<{x: number; top: number; right: number; bottom: number}>;

const textBox = (svg: string, label: string): Box => {
  const match = svg.match(new RegExp(`<text[^>]*data-essential-label="${label}"[^>]*x="([0-9.]+)"[^>]*y="([0-9.]+)"[^>]*font-size="([0-9.]+)"([^>]*)>([^<]+)</text>`));
  assert.ok(match, `missing text ${label}`);
  const x = Number(match[1]);
  const baseline = Number(match[2]);
  const fontSize = Number(match[3]);
  const explicitLength = match[4]?.match(/textLength="([0-9.]+)"/)?.[1];
  const width = explicitLength === undefined ? Array.from(match[5] ?? '').length * fontSize * 0.9 : Number(explicitLength);
  return {x, top: baseline - fontSize, right: x + width, bottom: baseline + fontSize * 0.25};
};

const pathYCoordinates = (data: string): readonly number[] =>
  (data.match(/-?[0-9.]+/g) ?? []).map(Number).filter((_, index) => index % 2 === 1);

const ray = (content: string, event: string): readonly [Point, Point] => {
  const match = content.match(new RegExp(`<line\\b[^>]*data-event="${event}"[^>]*x1="([0-9.]+)"[^>]*y1="([0-9.]+)"[^>]*x2="([0-9.]+)"[^>]*y2="([0-9.]+)"`));
  assert.ok(match, `missing ray ${event}`);
  return [{x: Number(match[1]), y: Number(match[2])}, {x: Number(match[3]), y: Number(match[4])}];
};

const angle = ([start, end]: readonly [Point, Point]): number => {
  const degrees = Math.atan2(start.y - end.y, end.x - start.x) * 180 / Math.PI;
  return degrees < 0 ? degrees + 360 : degrees;
};

const points = (content: string, role: string): readonly Point[] => {
  const match = content.match(new RegExp(`<polyline\\b[^>]*data-path="${role}"[^>]*points="([^"]+)"`));
  assert.ok(match, `missing path ${role}`);
  return (match[1] ?? '').trim().split(/\s+/).map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    assert.ok(x !== undefined && y !== undefined);
    return {x, y};
  });
};

const turn = (path: readonly Point[]): number => {
  const first = path[0];
  const second = path[1];
  const beforeLast = path.at(-2);
  const last = path.at(-1);
  assert.ok(first && second && beforeLast && last);
  const incoming = Math.atan2(second.y - first.y, second.x - first.x);
  const outgoing = Math.atan2(last.y - beforeLast.y, last.x - beforeLast.x);
  return Math.abs((outgoing - incoming) * 180 / Math.PI);
};

const distanceToSegment = (point: Point, start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const denominator = dx * dx + dy * dy;
  const fraction = denominator === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator));
  return Math.hypot(point.x - (start.x + fraction * dx), point.y - (start.y + fraction * dy));
};

const closestApproach = (path: readonly Point[], center: Point): number =>
  Math.min(...path.slice(1).map((end, index) => distanceToSegment(center, path[index] ?? end, end)));

test('refined apparatus defines angles with one rotatable microscope-screen assembly', () => {
  // Given a collimated beam, thin foil, and a refined 1912–1913 apparatus example.
  const apparatus = readFigure('figure-apparatus.svg');
  const coverage = group(apparatus, 'angular-coverage');
  // When angles are calculated from the actual ray endpoints.
  const angles = ['forward', 'side', 'backward'].map((event) => Math.round(angle(ray(coverage, event))));
  // Then 0° is forward, 90° is sideward, and the rear sample is beyond 90°.
  assert.deepEqual(angles.slice(0, 2), [0, 90]);
  assert.ok((angles[2] ?? 0) > 90 && (angles[2] ?? 0) < 180);
  assert.match(apparatus, /data-component="collimator"/);
  assert.match(apparatus, /data-component="thin-foil"/);
  assert.match(apparatus, /data-component="zinc-sulfide-screen"/);
  assert.match(apparatus, /data-component="microscope"/);
  assert.match(apparatus, /data-era="1912-1913-refined"/);
  assert.equal((apparatus.match(/data-detector-assembly="primary"/g) ?? []).length, 1);
  assert.equal((apparatus.match(/data-detector-position="ghost"/g) ?? []).length, 2);
  assert.match(apparatus, /data-component="rotation-arc"/);
  const rotation = apparatus.match(/data-component="rotation-arc" d="M([\d.]+) ([\d.]+)A([\d.]+) ([\d.]+)/);
  assert.ok(rotation);
  assert.ok(Number(rotation[2]) - Number(rotation[4]) >= textBox(apparatus, 'heading').bottom + 8);
});

test('qualitative pattern separates observed directions from model consequences without histogram data', () => {
  // Given one observation band and a separate model-comparison band.
  const pattern = readFigure('figure-angular-pattern.svg');
  const observed = group(pattern, 'observed-pattern');
  const models = group(pattern, 'model-consequences');
  // When event directions and epistemic labels are inspected.
  const observedAngles = [...observed.matchAll(/data-angle="(\d+)"/g)].map((match) => Number(match[1]));
  // Then forward, side, and backward examples are present without bins, counts, or percentages.
  assert.ok(observedAngles.some((value) => value === 0));
  assert.ok(observedAngles.some((value) => value === 90));
  assert.ok(observedAngles.some((value) => value > 90));
  assert.match(models, /data-model="diffuse-charge"/);
  assert.match(models, /data-model="localized-charge"/);
  assert.doesNotMatch(pattern, /data-count=|data-percent=|<histogram|\b\d+(?:\.\d+)?%/);
});

test('localized model paths clear both heading and result label bands', () => {
  // Given the localized-charge panel's heading, path, and result label.
  const pattern = readFigure('figure-angular-pattern.svg');
  const localized = pattern.slice(pattern.indexOf('data-model="localized-charge"'));
  const path = localized.match(/<path d="([^"]+)"/);
  assert.ok(path);
  // When path control and endpoint coordinates are compared with conservative text boxes.
  const yCoordinates = pathYCoordinates(path[1] ?? '');
  const heading = textBox(pattern, 'localized');
  const result = textBox(pattern, 'localized-result');
  // Then the path band has at least eight units of clearance above and below.
  assert.ok(Math.min(...yCoordinates) - 2 - heading.bottom >= 8);
  assert.ok(result.top - Math.max(...yCoordinates) - 2 >= 8);
});

test('positive-center model paths stay in their panel and bend away with distinct closest approaches', () => {
  // Given two dashed MODEL paths around the same authored center.
  const model = readFigure('figure-model-paths.svg');
  const paths = group(model, 'illustrative-paths');
  // When deflection is computed from the first and last segments.
  const far = points(paths, 'far');
  const near = points(paths, 'near');
  const farTurn = turn(far);
  const nearTurn = turn(near);
  const center = {x: 240, y: 190};
  const farExit = {x: (far.at(-1)?.x ?? 0) - (far.at(-2)?.x ?? 0), y: (far.at(-1)?.y ?? 0) - (far.at(-2)?.y ?? 0)};
  const nearExit = {x: (near.at(-1)?.x ?? 0) - (near.at(-2)?.x ?? 0), y: (near.at(-1)?.y ?? 0) - (near.at(-2)?.y ?? 0)};
  // Then the upper far path bends upward, the lower near path bends downward/back, and neither enters the ledger.
  assert.ok(farTurn > 0 && farTurn < 30);
  assert.ok(nearTurn > 90);
  assert.ok(far.every(({x, y}) => x >= 20 && x <= 360 && y >= 56 && y < center.y));
  assert.ok(near.every(({x, y}) => x >= 20 && x <= 360 && y > center.y && y <= 324));
  assert.ok(farExit.x > 0 && farExit.y < 0);
  assert.ok(nearExit.x < 0 && nearExit.y > 0);
  assert.ok(closestApproach(near, center) < closestApproach(far, center));
  assert.match(paths, /data-path="far"[^>]*marker-end=/);
  assert.match(paths, /data-path="near"[^>]*marker-end=/);
  assert.match(model, /MODEL/);
  assert.match(model, /측정 궤적 아님/);
  assert.match(model, /각도만으로 부호 결정 안 됨/);
});

test('near-path label clears the center and unchanged repulsive path', () => {
  // Given the near-path label, center circle, and authored near path.
  const model = readFigure('figure-model-paths.svg');
  const paths = group(model, 'illustrative-paths');
  const label = textBox(paths, 'near');
  const near = points(paths, 'near');
  // When conservative label-to-circle and label-to-path clearances are computed.
  const dx = Math.max(label.x - 240, 0, 240 - label.right);
  const dy = Math.max(label.top - 190, 0, 190 - label.bottom);
  const circleClearance = Math.hypot(dx, dy) - 23.5;
  const pathClearance = Math.min(...near.map(({y}) => y)) - 2.5 - label.bottom;
  // Then neither visual element enters the label box or its eight-unit margin.
  assert.ok(circleClearance >= 8);
  assert.ok(pathClearance >= 8);
});

test('narrow acceptance preserves rays from conceptual broad in-plane coverage', () => {
  // Given identical illustrative event IDs in full and forward-only panels.
  const transfer = readFigure('figure-angular-acceptance.svg');
  const full = group(transfer, 'full-acceptance');
  const narrow = group(transfer, 'narrow-forward-acceptance');
  const events = ['forward-a', 'forward-b', 'side', 'backward'] as const;
  // When each ray's geometry is compared across detector coverage.
  const fullRays = events.map((event) => ray(full, event));
  const narrowRays = events.map((event) => ray(narrow, event));
  // Then directions stay fixed while side and backward events become unseen, not zero.
  assert.deepEqual(narrowRays, fullRays);
  assert.deepEqual(events.map((event) => narrow.match(new RegExp(`data-event="${event}"[^>]*data-status="([^"]+)"`))?.[1]), ['seen', 'seen', 'unseen', 'unseen']);
  assert.match(transfer, /data-coverage="broad-in-plane"/);
  assert.doesNotMatch(transfer, /전체 각도 수용/);
  assert.match(transfer, /4π 검출기 아님/);
  assert.match(transfer, /보이지 않음 ≠ 사건 0/);
});

test('source locator separates angle sign-invariance from later positive-charge hints', () => {
  // Given the owned nuclear-inference claim and the consulted AIP passage bounds.
  const claims = readFigure('claims.json');
  // When its AIP locator is inspected.
  const inference = claims.slice(claims.indexOf('claim:physics-discovery.nuclear-scattering.nuclear-inference'));
  // Then it names sign-invariance, the additional hints, and the 1912–1913 discussion separately.
  assert.match(inference, /Rutherford entertained the possibility that the charged center is negative/);
  assert.match(inference, /Rutherford did see possible tests of the nature of the central charge/);
  assert.match(inference, /But these were only hints/);
  assert.match(inference, /Geiger and Marsden did indeed work systematically/);
});

test('page preserves seven scene IDs and wires only the four planned figures', () => {
  // Given the stable seven-scene article contract.
  const expected = new Map([
    ['apparatus', '/content/physics-discovery/nuclear-scattering/figure-apparatus.svg'],
    ['pattern', '/content/physics-discovery/nuclear-scattering/figure-angular-pattern.svg'],
    ['inference', '/content/physics-discovery/nuclear-scattering/figure-model-paths.svg'],
    ['transfer', '/content/physics-discovery/nuclear-scattering/figure-angular-acceptance.svg'],
  ]);
  // When IDs and figure wiring are inspected.
  const figures = new Map(page.scenes.filter((scene) => scene.figure).map((scene) => [scene.id, scene.figure?.src]));
  // Then static limit/history endpoints remain cards and all stable IDs survive.
  assert.deepEqual(page.scenes.map((scene) => scene.id), ['question', 'apparatus', 'pattern', 'inference', 'empty-space-limit', 'history-limit', 'transfer']);
  assert.deepEqual(figures, expected);
  assert.ok(page.scenes.filter((scene) => !expected.has(scene.id)).every((scene) => scene.cards.length > 0));
  assert.match(page.scenes[1]?.figure?.alt ?? '', /1912–1913/);
  assert.match(page.scenes[1]?.figure?.caption ?? '', /정교화/);
  assert.match(page.scenes[6]?.figure?.alt ?? '', /평면 내/);
  assert.match(page.scenes[6]?.figure?.caption ?? '', /평면 내/);
});
