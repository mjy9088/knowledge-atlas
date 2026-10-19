import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import test from 'node:test';

test('proof arrowheads stay bounded independently of the connecting stroke weight', () => {
  const directory = new URL('../content/number-systems/rational-representations/', import.meta.url);
  const figures = readdirSync(directory).filter(name => name.endsWith('.svg'));
  let inspected = 0;
  for (const figure of figures) {
    const svg = readFileSync(new URL(figure, directory), 'utf8');
    for (const marker of svg.matchAll(/<marker\b([^>]*)>/g)) {
      const attributes = marker[1] ?? '';
      const units = attributes.match(/markerUnits="([^"]+)"/)?.[1];
      const width = Number(attributes.match(/markerWidth="([\d.]+)"/)?.[1]);
      const height = Number(attributes.match(/markerHeight="([\d.]+)"/)?.[1]);
      assert.equal(units, 'userSpaceOnUse', `${figure}: stroke-scaled heads can obscure neighboring labels`);
      assert.ok(width >= 6 && width <= 14 && height >= 6 && height <= 14, `${figure}: unbounded arrowhead viewport`);
      inspected += 1;
    }
  }
  assert.ok(inspected > 0);
});
