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

const itemCount = (content: string): number => (content.match(/<circle\b[^>]*data-item=/g) ?? []).length;

const rectGeometry = (content: string): readonly number[] => {
  const match = content.match(/<rect\b[^>]*x="(\d+)"[^>]*y="(\d+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/);
  assert.ok(match, 'missing collection boundary geometry');
  return match.slice(1).map(Number);
};

test('question figure maps the same box from three actual marbles to an empty count', () => {
  // Given the authored before/after collection geometry.
  const svg = readFigure('figure-counting-empty.svg');
  const populated = group(svg, 'box-with-three');
  const empty = group(svg, 'box-with-none');
  // When the item geometry and container geometry are inspected independently.
  const observed = {
    populatedItems: itemCount(populated),
    emptyItems: itemCount(empty),
    sameBox: rectGeometry(populated).join(',') === rectGeometry(empty).join(','),
  };
  // Then the visible collections, not only their labels, establish counts 3 and 0.
  assert.deepEqual(observed, { populatedItems: 3, emptyItems: 0, sameBox: true });
  assert.match(group(svg, 'count-three'), /data-count="3"[\s\S]*>3<\/text>/);
  assert.match(group(svg, 'count-zero'), /data-count="0"[\s\S]*>0<\/text>/);
});

test('empty-set figure maps a set object to a separate cardinality number', () => {
  // Given distinct set, relation, and number groups.
  const svg = readFigure('figure-empty-cardinality.svg');
  const setObject = group(svg, 'empty-set-object');
  const relation = group(svg, 'cardinality-map');
  const numberObject = group(svg, 'cardinality-number');
  // When their geometry and semantic roles are inspected.
  const setX = rectGeometry(setObject)[0];
  const numberX = rectGeometry(numberObject)[0];
  // Then an empty collection maps left-to-right to numeric 0 without becoming the numeral.
  assert.equal(itemCount(setObject), 0);
  assert.match(setObject, /data-kind="set"/);
  assert.match(numberObject, /data-kind="number"[^>]*data-count="0"[\s\S]*>0<\/text>/);
  assert.match(relation, /data-relation="cardinality"[\s\S]*marker-end=/);
  assert.ok(typeof setX === 'number' && typeof numberX === 'number' && setX < numberX);
  assert.doesNotMatch(relation, />\s*=\s*</);
});

test('identity figure preserves five item geometries when an empty group is added', () => {
  // Given input, empty-addend, and result collection groups.
  const svg = readFigure('figure-add-zero.svg');
  const start = group(svg, 'five-start');
  const addend = group(svg, 'zero-addend');
  const result = group(svg, 'five-result');
  // When actual item circles and operation geometry are counted.
  const counts = [itemCount(start), itemCount(addend), itemCount(result)];
  // Then five plus an empty collection visibly yields the same cardinality five.
  assert.deepEqual(counts, [5, 0, 5]);
  assert.match(group(svg, 'plus-operation'), /data-operation="plus"[\s\S]*>\+<\/text>/);
  assert.match(group(svg, 'equals-operation'), /data-operation="equals"[\s\S]*>=<\/text>/);
  assert.match(group(svg, 'identity-equation'), /data-equation="5\+0=5"[\s\S]*>5 \+ 0 = 5<\/text>/);
});

test('subtraction figure represents a deficit rather than a negative physical collection',()=>{
  const svg=readFigure('figure-subtraction-deficit.svg');
  const available=group(svg,'available-items');
  const required=group(svg,'required-items');
  const balance=group(svg,'signed-balance');
  assert.equal(itemCount(available),4);
  assert.equal(itemCount(required),6);
  assert.equal((required.match(/data-unfilled="true"/g)??[]).length,2);
  assert.match(balance,/data-kind="signed-balance"[^>]*data-value="-2"/);
  assert.equal(itemCount(balance),0);
});
