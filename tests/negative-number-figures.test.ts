import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import page from '../content/number-systems/negative-numbers/page.js';

const readFigure = (name: string): string =>
  readFileSync(new URL(`../content/number-systems/negative-numbers/${name}`, import.meta.url), 'utf8');

type Tick = Readonly<{ value: number; x: number }>;
type Step = Readonly<{ from: number; to: number; x1: number; x2: number }>;

const ticks = (svg: string): readonly Tick[] =>
  [...svg.matchAll(/<line\b[^>]*data-tick="(-?\d+)"[^>]*x1="(\d+)"/g)].map((match) => ({
    value: Number(match[1]),
    x: Number(match[2]),
  }));

const steps = (svg: string): readonly Step[] =>
  [...svg.matchAll(/<line\b[^>]*data-step="\d+"[^>]*data-from="(-?\d+)"[^>]*data-to="(-?\d+)"[^>]*x1="(\d+)"[^>]*x2="(\d+)"/g)].map(
    (match) => ({ from: Number(match[1]), to: Number(match[2]), x1: Number(match[3]), x2: Number(match[4]) }),
  );

const differences = (values: readonly number[]): readonly number[] =>
  values.slice(1).map((value, index) => value - (values[index] ?? value));

const assertUniformTicks = (actual: readonly Tick[]): void => {
  assert.ok(actual.length >= 6);
  assert.ok(differences(actual.map(({ x }) => x)).every((interval) => interval === differences(actual.map(({ x }) => x))[0]));
  assert.ok(differences(actual.map(({ value }) => value)).every((interval) => interval === 1));
};

test('question number line encodes five equal leftward steps from 2 to negative 3', () => {
  // Given the authored coordinate figure.
  const svg = readFigure('figure-five-steps.svg');
  const figureTicks = ticks(svg);
  // When its tick and step geometry is independently decoded.
  const figureSteps = steps(svg);
  // Then five unit moves cross zero and land at the exact requested endpoint.
  assertUniformTicks(figureTicks);
  assert.equal(figureSteps.length, 5);
  assert.deepEqual(figureSteps.map(({ from, to }) => [from, to]), [[2, 1], [1, 0], [0, -1], [-1, -2], [-2, -3]]);
  assert.ok(figureSteps.every(({ x1, x2 }) => x1 - x2 === 80));
});

test('automatic marker rotation makes every step arrowhead point left rather than double-reversing it',()=>{
  const svg=readFigure('figure-five-steps.svg');
  const marker=svg.match(/<marker\b[^>]*orient="auto"[^>]*>\s*<path d="([^"]+)"/);
  assert.ok(marker);
  const coordinates=(marker[1].match(/-?\d+(?:\.\d+)?/g)??[]).map(Number);
  assert.equal(coordinates.length,6);
  const xs=[coordinates[0],coordinates[2],coordinates[4]];
  const tip=xs.find(value=>xs.filter(x=>x===value).length===1);
  const base=xs.find(value=>xs.filter(x=>x===value).length===2);
  assert.ok(tip!==undefined&&base!==undefined);
  for(const step of steps(svg))assert.ok(Math.sign(step.x2-step.x1)*(tip-base)<0);
});

test('inverse number line maps equal distances around zero and preserves order geometry', () => {
  // Given a number line carrying an explicitly marked opposite pair and order pair.
  const svg = readFigure('figure-additive-inverse.svg');
  const figureTicks = ticks(svg);
  const opposite = svg.match(/<path\b[^>]*data-opposite-from="3"[^>]*data-opposite-to="-3"[^>]*data-zero-x="(\d+)"[^>]*data-from-x="(\d+)"[^>]*data-to-x="(\d+)"/);
  assert.ok(opposite);
  // When distances and positions are computed from authored coordinates.
  const [, zeroX, positiveX, negativeX] = opposite.map(Number);
  const byValue = new Map(figureTicks.map((tick) => [tick.value, tick.x]));
  // Then ±3 are symmetric, their sum is identified as zero, and −2 is right of −5.
  assertUniformTicks(figureTicks);
  assert.equal((positiveX ?? 0) - (zeroX ?? 0), (zeroX ?? 0) - (negativeX ?? 0));
  assert.match(svg, /data-sum-left="3"[^>]*data-sum-right="-3"[^>]*data-sum-result="0"/);
  assert.ok((byValue.get(-2) ?? 0) > (byValue.get(-5) ?? 0));
});

test('subtraction figure replaces the subtrahend with its inverse before four rightward steps', () => {
  // Given the worked subtraction transformation.
  const svg = readFigure('figure-subtraction-inverse.svg');
  const transformation = svg.match(/data-operation="add-inverse"[^>]*data-minuend="-2"[^>]*data-subtrahend="-4"[^>]*data-added="4"[^>]*data-result="2"/);
  // When the transformation metadata and movement geometry are decoded.
  const figureSteps = steps(svg);
  // Then the inverse of −4 is +4 and the path visibly moves from −2 to 2 in four units.
  assert.ok(transformation);
  assertUniformTicks(ticks(svg));
  assert.deepEqual(figureSteps.map(({ from, to }) => [from, to]), [[-2, -1], [-1, 0], [0, 1], [1, 2]]);
  assert.ok(figureSteps.every(({ x1, x2 }) => x2 - x1 === 80));
});

test('reasoning figures are wired only to the three geometry-dependent scenes', () => {
  // Given the canonical five-scene page.
  const figures = new Map(page.scenes.map((scene) => [scene.id, scene.figure?.src]));
  // When scene-to-figure wiring is inspected.
  // Then question, inverse, and subtraction use figures while the two scoped card scenes remain static cards.
  assert.deepEqual([...figures], [
    ['question', '/content/number-systems/negative-numbers/figure-five-steps.svg'],
    ['construction', undefined],
    ['inverse', '/content/number-systems/negative-numbers/figure-additive-inverse.svg'],
    ['subtraction', '/content/number-systems/negative-numbers/figure-subtraction-inverse.svg'],
    ['transfer', undefined],
  ]);
});
