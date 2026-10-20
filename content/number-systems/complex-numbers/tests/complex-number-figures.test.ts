import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { chromium } from '@playwright/test';

type Pair = readonly [real: number, imaginary: number];

const multiply = (left: Pair, right: Pair): Pair => [
  left[0] * right[0] - left[1] * right[1],
  left[0] * right[1] + left[1] * right[0],
];

const rotateByI = (value: Pair): Pair => multiply([0, 1], value);
const squaredLength = ([x, y]: Pair): number => x * x + y * y;
const orientation = (from: Pair, to: Pair): number => from[0] * to[1] - from[1] * to[0];

const readFigure = (name: string): string =>
  readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

const semanticGroup = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[0];
};

const vectorGeometry = (svg: string, id: string): readonly [Pair, Pair] => {
  const group = semanticGroup(svg, id);
  const line = group.match(/<(?:line|path)\b[^>]*data-x1="([0-9.-]+)"[^>]*data-y1="([0-9.-]+)"[^>]*data-x2="([0-9.-]+)"[^>]*data-y2="([0-9.-]+)"/);
  assert.ok(line, `missing visible vector geometry ${id}`);
  return [[Number(line[1]), Number(line[2])], [Number(line[3]), Number(line[4])]];
};

test('pair multiplication reconstructs i squared, the conjugate product, and the real embedding', () => {
  // Given the pair-product definition and independent representative inputs.
  const fixtures = [
    { left: [0, 1], right: [0, 1], expected: [-1, 0] },
    { left: [1, 1], right: [1, -1], expected: [2, 0] },
    { left: [3, 0], right: [-4, 0], expected: [-12, 0] },
  ] satisfies readonly { readonly left: Pair; readonly right: Pair; readonly expected: Pair }[];
  // When every product is calculated directly from its real and imaginary coordinates.
  const observed = fixtures.map(({ left, right }) => multiply(left, right));
  // Then the defining examples and a nontrivial real embedding all agree coordinatewise.
  assert.deepEqual(observed, fixtures.map(({ expected }) => expected));
});

test('multiplication by i preserves squared length and is positive quarter-turn except at zero', () => {
  // Given zero and nonzero vectors in positive, negative, and mixed quadrants.
  const fixtures = [[0, 0], [2, -1], [-3, 2], [0, -4], [-5, 0]] as const satisfies readonly Pair[];
  // When each pair is multiplied by i using only the pair-product definition.
  const observed = fixtures.map((value) => ({ value, rotated: rotateByI(value) }));
  // Then zero is fixed; every nonzero vector keeps length and has positive 90-degree orientation.
  for (const { value, rotated } of observed) {
    assert.equal(rotated[0] + 0, -value[1] + 0);
    assert.equal(rotated[1] + 0, value[0] + 0);
    assert.equal(squaredLength(rotated), squaredLength(value));
    assert.equal(value[0] * rotated[0] + value[1] * rotated[1], 0);
    assert.equal(orientation(value, rotated), squaredLength(value));
  }
  assert.deepEqual(observed[0]?.rotated, [0, 0]);
  assert.ok(observed.slice(1).every(({ value, rotated }) => orientation(value, rotated) > 0));
});

for (const name of ['figure-i-rotation.svg', 'figure-transfer-rotation.svg'] as const) {
  test(`${name} draws actual common-origin vectors with a positive screen quarter-turn`, () => {
    // Given the two visible vectors in one authored coordinate system.
    const svg = readFigure(name);
    const [inputStart, inputEnd] = vectorGeometry(svg, 'input-vector');
    const [outputStart, outputEnd] = vectorGeometry(svg, 'output-vector');
    // When their screen-coordinate displacements are measured instead of trusting metadata labels.
    const input: Pair = [inputEnd[0] - inputStart[0], inputEnd[1] - inputStart[1]];
    const output: Pair = [outputEnd[0] - outputStart[0], outputEnd[1] - outputStart[1]];
    // Then both share an origin and the output is the exact counterclockwise quarter-turn on one scale.
    assert.deepEqual(outputStart, inputStart);
    assert.deepEqual(output, [input[1], -input[0]]);
    assert.equal(squaredLength(output), squaredLength(input));
    assert.match(svg, /data-turn="counterclockwise-quarter"/);
  });
}

test('worked transfer figure encodes the actual points and both independent squared lengths', () => {
  // Given the authored worked geometry for z=2-i.
  const svg = readFigure('figure-transfer-rotation.svg');
  const input = semanticGroup(svg, 'input-vector');
  const output = semanticGroup(svg, 'output-vector');
  // When its mathematical coordinates and length calculations are inspected.
  // Then the geometry records (2,-1)->(1,2), with 2²+(-1)²=1²+2²=5.
  assert.match(input, /data-complex-point="2,-1"[^>]*data-squared-length="5"/);
  assert.match(output, /data-complex-point="1,2"[^>]*data-squared-length="5"/);
  assert.equal(squaredLength([2, -1]), 5);
  assert.equal(squaredLength([1, 2]), 5);
  assert.deepEqual(rotateByI([2, -1]), [1, 2]);
});

test('ordered-field proof figure keeps both trichotomy branches and their rule dependencies', () => {
  // Given a proposed total ordered-field order extending the standard real order.
  const svg = readFigure('figure-order-contradiction.svg');
  const positiveI = semanticGroup(svg, 'branch-positive-i');
  const positiveNegativeI = semanticGroup(svg, 'branch-positive-negative-i');
  // When the exhaustive branches and positive-product consequences are inspected.
  // Then each branch independently derives -1>0 before meeting the inherited -1<0 fact.
  assert.match(semanticGroup(svg, 'ordered-field-assumption'), /data-order="total"[^>]*data-extends="standard-real-order"/);
  assert.match(semanticGroup(svg, 'nonzero-step'), /data-reason="i-squared-is-negative-one"/);
  assert.match(positiveI, /data-premise="i&gt;0"[^>]*data-square="i\^2=-1"[^>]*data-conclusion="-1&gt;0"/);
  assert.match(positiveNegativeI, /data-premise="-i&gt;0"[^>]*data-square="\(-i\)\^2=-1"[^>]*data-conclusion="-1&gt;0"/);
  assert.match(semanticGroup(svg, 'real-order-contradiction'), /data-real-order="-1&lt;0"[^>]*data-branch-result="-1&gt;0"/);
  for (const branch of ['positive-i', 'positive-negative-i']) {
    assert.match(svg, new RegExp(`data-from="${branch}"[^>]*data-to="minus-one-positive"[^>]*data-rule="positive-product"`));
  }
});

test('both ordered-field branches contradict the inherited real order by the same algebraic square', () => {
  // Given trichotomy's two positive factors, i and -i, represented by their real scalar multiples.
  const branchFactors = [1, -1] as const;
  // When each factor is squared around i²=-1 and ordered-field positivity is applied.
  const branchResults = branchFactors.map((factor) => ({ algebraicSquare: factor * factor * -1, productMustBePositive: factor * factor > 0 }));
  // Then both products equal -1 while positivity would require them to exceed zero, contrary to -1<0 in R.
  assert.deepEqual(branchResults, [
    { algebraicSquare: -1, productMustBePositive: true },
    { algebraicSquare: -1, productMustBePositive: true },
  ]);
  assert.ok(branchResults.every(({ algebraicSquare, productMustBePositive }) => productMustBePositive && algebraicSquare < 0));
});

test('browser-rendered essential labels stay inside every complex-number SVG view box', async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    for (const name of [
      'figure-i-rotation.svg',
      'figure-transfer-rotation.svg',
      'figure-order-contradiction.svg',
    ] as const) {
      await page.setContent(readFigure(name));
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        assertSvg(svg);
        const viewBox = svg.viewBox.baseVal;
        const imaginaryAxis = svg.querySelector<SVGLineElement>('#axes line:nth-of-type(2)');
        const footerLabel = svg.querySelector<SVGTextElement>('#length-and-zero text[data-essential-label]');
        return {
          viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height },
          imaginaryAxisToFooterGap: imaginaryAxis === null || footerLabel === null
            ? null
            : footerLabel.getBBox().y - imaginaryAxis.y1.baseVal.value,
          labels: Array.from(svg.querySelectorAll<SVGTextElement>('text[data-essential-label]'), (label) => {
            const bounds = label.getBBox();
            return {
              text: label.textContent ?? '',
              x: bounds.x,
              y: bounds.y,
              right: bounds.x + bounds.width,
              bottom: bounds.y + bounds.height,
            };
          }),
        };

        function assertSvg(element: SVGSVGElement | null): asserts element is SVGSVGElement {
          if (element === null) throw new Error('missing SVG root');
        }
      });
      const { x, y, width, height } = geometry.viewBox;
      for (const label of geometry.labels) {
        assert.ok(label.x >= x, `${name}: "${label.text}" crosses the left view-box edge`);
        assert.ok(label.y >= y, `${name}: "${label.text}" crosses the top view-box edge`);
        assert.ok(label.right <= x + width, `${name}: "${label.text}" crosses the right view-box edge`);
        assert.ok(label.bottom <= y + height, `${name}: "${label.text}" crosses the bottom view-box edge`);
      }
      if (name === 'figure-i-rotation.svg') {
        assert.ok(geometry.imaginaryAxisToFooterGap !== null, `${name}: missing imaginary axis or footer label`);
        assert.ok(
          geometry.imaginaryAxisToFooterGap >= 8,
          `${name}: imaginary axis needs at least 8 view-box units above the footer label`,
        );
      }
    }
  } finally {
    await browser.close();
  }
});
