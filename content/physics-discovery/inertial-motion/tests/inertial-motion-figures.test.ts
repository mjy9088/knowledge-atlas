import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

const group = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>([\\s\\S]*?)<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[1] ?? '';
};

const positionXs = (content: string): readonly number[] =>
  [...content.matchAll(/<circle\b[^>]*data-position="\d+"[^>]*cx="(\d+)"/g)].map((match) => Number(match[1]));

const intervals = (positions: readonly number[]): readonly number[] =>
  positions.slice(1).map((position, index) => position - (positions[index] ?? position));

type Vector = Readonly<{ x: number; y: number }>;

const forceVector = (content: string, name: string): Vector => {
  const match = content.match(new RegExp(`<line\\b[^>]*data-force="${name}"[^>]*x1="(\\d+)"[^>]*y1="(\\d+)"[^>]*x2="(\\d+)"[^>]*y2="(\\d+)"`));
  assert.ok(match, `missing force geometry ${name}`);
  const [, x1, y1, x2, y2] = match.map(Number);
  return { x: (x2 ?? 0) - (x1 ?? 0), y: (y2 ?? 0) - (y1 ?? 0) };
};

const sum = (first: Vector, second: Vector): Vector => ({ x: first.x + second.x, y: first.y + second.y });

test('comparison aligns equal starts and intervals while resistance changes qualitative deceleration', () => {
  // Given three authored lanes observed at the same four qualitative time marks.
  const svg = readFigure('figure-resistance-comparison.svg');
  const rough = positionXs(group(svg, 'rough-lane'));
  const smooth = positionXs(group(svg, 'smooth-lane'));
  const air = positionXs(group(svg, 'air-supported-lane'));
  // When starts, first intervals, later spacing, and final ordering are computed from geometry.
  const laneIntervals = [rough, smooth, air].map(intervals);
  const finalPositions = [rough.at(-1), smooth.at(-1), air.at(-1)];
  // Then only the resistance condition changes the progressively weaker slowing pattern.
  assert.deepEqual([rough[0], smooth[0], air[0]], [96, 96, 96]);
  assert.deepEqual(laneIntervals.map((lane) => lane[0]), [64, 64, 64]);
  assert.deepEqual(laneIntervals, [[64, 44, 28], [64, 56, 48], [64, 60, 56]]);
  assert.deepEqual(finalPositions, [232, 264, 276]);
});

test('surface-condition labels stay above the first position marker rather than colliding with it',()=>{
  const svg=readFigure('figure-resistance-comparison.svg');
  for(const id of ['rough-lane','smooth-lane','air-supported-lane']){
    const lane=group(svg,id);
    const label=lane.match(/<text x="32" y="(\d+)" font-size="(\d+)"/);
    const marker=lane.match(/<circle[^>]*data-position="0"[^>]*cy="(\d+)" r="(\d+)"/);
    assert.ok(label&&marker);
    assert.ok(Number(label[1])+Number(label[2])*.3+4<=Number(marker[1])-Number(marker[2]));
  }
});

test('inference shows paired external forces with both zero and constant nonzero velocity', () => {
  // Given stationary and moving cases under the same balanced-force condition.
  const svg = readFigure('figure-net-force-velocity.svg');
  const stationary = group(svg, 'stationary-case');
  const moving = group(svg, 'constant-motion-case');
  // When force vectors and position marks are inspected independently.
  const stationaryNet = sum(forceVector(stationary, 'left'), forceVector(stationary, 'right'));
  const movingNet = sum(forceVector(moving, 'left'), forceVector(moving, 'right'));
  const movingIntervals = intervals(positionXs(moving));
  // Then balanced forces support rest or equally spaced straight motion, not an absence of forces.
  assert.deepEqual(stationaryNet, { x: 0, y: 0 });
  assert.deepEqual(movingNet, { x: 0, y: 0 });
  assert.deepEqual(positionXs(stationary), [148, 148, 148, 148]);
  assert.deepEqual(movingIntervals, [44, 44, 44]);
});

test('stationary inference marks equal positions at distinct observation times', () => {
  // Given the stationary case with four observations made at distinct times.
  const stationary = group(readFigure('figure-net-force-velocity.svg'), 'stationary-case');
  // When the semantic relation and rendered notation are inspected.
  const relation = stationary.match(/data-position-relation="([^"]+)"/)?.[1];
  // Then positions, rather than the observation times themselves, are equal.
  assert.equal(relation, 'x(t0)=x(t1)=x(t2)=x(t3)');
  assert.doesNotMatch(stationary, />\s*t₀=t₁=t₂=t₃ 위치\s*</);
});

test('stationary position formula clears the force glyph inside its case box',()=>{
  const stationary=group(readFigure('figure-net-force-velocity.svg'),'stationary-case');
  const box=stationary.match(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/);
  const force=stationary.match(/<line data-force="left"[^>]*y1="(\d+)"[^>]*x2="(\d+)"/);
  const formula=stationary.match(/<text x="(\d+)" y="(\d+)"(?: text-anchor="([^"]+)")? font-size="(\d+)" data-essential-label="stationary-positions"/);
  const forceLabel=stationary.match(/<text data-essential-label="stationary-forces" x="(\d+)"/);
  assert.ok(box&&force&&formula&&forceLabel);
  const boxBottom=Number(box[2])+Number(box[4]);
  const arrowY=Number(force[1]);
  const formulaX=Number(formula[1]);
  const formulaY=Number(formula[2]);
  const fontSize=Number(formula[4]);
  assert.equal(formula[3],'middle');
  assert.ok(formulaY-fontSize>=arrowY+18);
  assert.ok(formulaY+fontSize*.25<=boxBottom-4);
  assert.ok(Number(forceLabel[1])-formulaX>=200);
});

test('braking-bus comparison uses one scale for ground and bus positions at matched times', () => {
  // Given independently authored coordinate fixtures at the same three times.
  const fixture = [
    { time: 0, groundObject: 0, busOrigin: 0 },
    { time: 1, groundObject: 4, busOrigin: 3 },
    { time: 2, groundObject: 8, busOrigin: 4 },
  ] as const;
  const svg = readFigure('figure-braking-frames.svg');
  // When the numerical coordinate relations and rendered spatial intervals are computed separately.
  const relativePositions = fixture.map(({ groundObject, busOrigin }) => groundObject - busOrigin);
  const groundIntervals = intervals(fixture.map(({ groundObject }) => groundObject));
  const relativeIntervals = intervals(relativePositions);
  const renderedGroundIntervals = intervals(positionXs(group(svg, 'ground-object-positions')));
  const renderedBusIntervals = intervals(positionXs(group(svg, 'bus-origin-positions')));
  const renderedRelative = positionXs(group(svg, 'bus-relative-positions'));
  // Then subtraction gives an increasing relative gap while the ground motion remains uniform.
  assert.deepEqual(relativePositions, [0, 1, 4]);
  assert.deepEqual(groundIntervals, [4, 4]);
  assert.deepEqual(relativeIntervals, [1, 3]);
  assert.ok(relativeIntervals[1] > relativeIntervals[0]);
  assert.deepEqual(renderedGroundIntervals, [192, 192]);
  assert.deepEqual(renderedBusIntervals, [144, 48]);
  assert.deepEqual(renderedRelative.map(x => (x - 108) / 48), relativePositions);
  assert.deepEqual(intervals(renderedRelative), [48, 144]);
});

test('adjacent braking-bus labels leave a readable narrow-view gap', () => {
  // Given the two closest bus-origin events on the common scale.
  const bus = group(readFigure('figure-braking-frames.svg'), 'bus-origin-positions');
  const initial = bus.match(/data-essential-label="bus-t0" x="(\d+)" y="(\d+)" text-anchor="([^"]+)"/);
  const first = bus.match(/data-essential-label="bus-t1" x="(\d+)" y="(\d+)" text-anchor="([^"]+)"/);
  const second = bus.match(/data-essential-label="bus-t2" x="(\d+)" y="(\d+)" text-anchor="([^"]+)"/);
  // When their outward-facing label anchors are compared.
  assert.ok(initial && first && second);
  const secondAnchorGap = Number(second[1]) - Number(first[1]);
  // Then the full-size labels point away from each other with space between them.
  assert.equal(initial[3], 'start');
  assert.ok(Number(first[2]) - Number(initial[2]) >= 40);
  assert.equal(first[3], 'end');
  assert.equal(second[3], 'start');
  assert.ok(secondAnchorGap >= 72);
});

test('transfer free-body geometry pairs all four forces around a constant-velocity car', () => {
  // Given one car with horizontal and vertical external-force pairs.
  const car = group(readFigure('figure-car-force-balance.svg'), 'car-free-body');
  // When each opposed pair is summed from its actual endpoints.
  const horizontalNet = sum(forceVector(car, 'drive'), forceVector(car, 'resistance'));
  const verticalNet = sum(forceVector(car, 'normal'), forceVector(car, 'gravity'));
  // Then the diagram encodes two cancellations while retaining four nonzero forces.
  assert.deepEqual(horizontalNet, { x: 0, y: 0 });
  assert.deepEqual(verticalNet, { x: 0, y: 0 });
  for (const name of ['drive', 'resistance', 'normal', 'gravity']) {
    assert.notDeepEqual(forceVector(car, name), { x: 0, y: 0 });
  }
  assert.match(car, /<line\b[^>]*data-velocity="constant"[^>]*x1="\d+"[^>]*x2="\d+"/);
});

test('velocity annotations occupy a separate region from the vertical force stem',()=>{
  const car=group(readFigure('figure-car-force-balance.svg'),'car-free-body');
  const normal=car.match(/<line[^>]*data-force="normal" x1="(\d+)"/);
  const velocity=car.match(/<text x="(\d+)"[^>]*fill="#365c42"/);
  assert.ok(normal&&velocity);
  assert.ok(Number(velocity[1])-Number(normal[1])>=150);
});
