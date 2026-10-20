import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

type Pair = readonly [first: number, second: number];
type Point = Readonly<{ x: number; y: number }>;
type Box = Readonly<{ left: number; top: number; right: number; bottom: number }>;

const readFigure = (name: string): string =>
  readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

const readOwned = (name: string): string =>
  readFileSync(new URL(`../../../../${name}`, import.meta.url), 'utf8');

const semanticGroup = (svg: string, id: string): string => {
  const match = svg.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?<\\/g>`));
  assert.ok(match, `missing semantic group ${id}`);
  return match[0];
};

const edge = (svg: string, from: string, to: string): string => {
  const match = [...svg.matchAll(/<path\b[^>]*data-from="([^"]+)"[^>]*data-to="([^"]+)"[^>]*>/g)]
    .find((candidate) => candidate[1] === from && candidate[2] === to);
  assert.ok(match, `missing edge ${from}->${to}`);
  return match[0];
};

const related = (left: Pair, right: Pair): boolean => left[0] * right[1] === left[1] * right[0];

const attribute = (source: string, name: string): number => {
  const match = source.match(new RegExp(`${name}="([0-9]+)"`));
  assert.ok(match, `missing numeric ${name}`);
  return Number(match[1]);
};

const panelBox = (group: string): Box => {
  const rect = group.match(/<rect\b[^>]*>/)?.[0];
  assert.ok(rect, 'missing panel rectangle');
  const x = attribute(rect, 'x');
  const y = attribute(rect, 'y');
  return { left: x, top: y, right: x + attribute(rect, 'width'), bottom: y + attribute(rect, 'height') };
};

const textBoxes = (group: string): readonly Box[] => [...group.matchAll(/<text\b([^>]*)>([^<]+)<\/text>/g)].map((match) => {
  const attributes = match[1] ?? '';
  const content = match[2] ?? '';
  const size = attribute(attributes, 'font-size');
  const width = [...content].reduce((sum, character) => sum + (/^[\x00-\x7F]$/.test(character) ? size * 0.6 : size), 0);
  const x = attribute(attributes, 'x');
  const baseline = attribute(attributes, 'y');
  return { left: x - width / 2, top: baseline - size, right: x + width / 2, bottom: baseline };
});

const intersects = (left: Box, right: Box): boolean =>
  left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;

const expanded = (box: Box, amount: number): Box => ({
  left: box.left - amount,
  top: box.top - amount,
  right: box.right + amount,
  bottom: box.bottom + amount,
});

const pathSegments = (path: string): readonly (readonly [Point, Point])[] => {
  const points = [...path.matchAll(/[ML]\s*([0-9]+)[ ,]([0-9]+)/g)].map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
  return points.slice(1).map((point, index) => [points[index] ?? point, point] as const);
};

const segmentBox = ([start, end]: readonly [Point, Point]): Box => ({
  left: Math.min(start.x, end.x),
  top: Math.min(start.y, end.y),
  right: Math.max(start.x, end.x) + 0.01,
  bottom: Math.max(start.y, end.y) + 0.01,
});

const figureNames = [
  'figure-opening-group.svg',
  'figure-grouping-need.svg',
  'figure-chain-target.svg',
  'figure-property-roles.svg',
  'figure-middle-link.svg',
  'figure-common-product.svg',
  'figure-integer-cancellation.svg',
  'figure-proof-result.svg',
  'figure-zero-pair-counterexample.svg',
  'figure-transfer-chain.svg',
] as const;

test('common-product figure exposes both factor choices and one shared integer product', () => {
  // Given the two transitivity premises represented as aligned integer equations.
  const svg = readFigure('figure-common-product.svg');
  // When the visible operation rows and their convergence are inspected.
  const first = semanticGroup(svg, 'multiply-first-by-f');
  const second = semanticGroup(svg, 'multiply-second-by-b');
  const common = semanticGroup(svg, 'common-product');
  // Then each chosen factor creates the same bcf term before the outer equality is concluded.
  assert.match(first, /data-input="ad=bc"[^>]*data-factor="f"[^>]*data-output="adf=bcf"/);
  assert.match(second, /data-input="cf=de"[^>]*data-factor="b"[^>]*data-output="bcf=bde"/);
  assert.match(common, /data-shared-term="bcf"[^>]*data-chain="adf=bcf=bde"/);
  assert.match(edge(svg, 'multiply-first-by-f', 'common-product'), /data-rule="same-middle-product"/);
  assert.match(edge(svg, 'multiply-second-by-b', 'common-product'), /data-rule="same-middle-product"/);
});

test('integer-cancellation figure excludes the zero-factor branch without rational division', () => {
  // Given d(af-be)=0 in the integers and the domain condition d!=0.
  const svg = readFigure('figure-integer-cancellation.svg');
  // When the zero-product branches and retained conclusion are inspected.
  const split = semanticGroup(svg, 'zero-product-split');
  const condition = semanticGroup(svg, 'middle-denominator-condition');
  const excluded = semanticGroup(svg, 'excluded-d-zero');
  const retained = semanticGroup(svg, 'retained-difference-zero');
  // Then the zero-product property produces both branches before d!=0 excludes only the first.
  assert.match(split, /data-domain="integers"[^>]*data-branches="d=0\|af-be=0"/);
  assert.match(condition, /data-condition="d!=0"/);
  assert.match(excluded, /data-branch="d=0"[^>]*data-status="excluded"/);
  assert.match(retained, /data-status="retained"[^>]*data-result="af=be"/);
  assert.match(edge(svg, 'zero-product-split', 'excluded-d-zero'), /data-rule="zero-product-property"/);
  assert.match(edge(svg, 'zero-product-split', 'retained-difference-zero'), /data-rule="zero-product-property"/);
  assert.match(edge(svg, 'middle-denominator-condition', 'excluded-d-zero'), /data-rule="domain-excludes-d-zero"/);
  assert.doesNotMatch(svg, /data-rule="divide-in-Q"/);
});

test('relation figures use undirected links while proof transitions keep directed arrows', () => {
  // Given figures whose lines represent the symmetric relation and a figure whose arrows represent derivation.
  const relationFigures = [
    readFigure('figure-chain-target.svg'),
    readFigure('figure-zero-pair-counterexample.svg'),
    readFigure('figure-transfer-chain.svg'),
  ];
  const derivation = readFigure('figure-common-product.svg');
  // When their semantic paths are classified.
  const relationPaths = relationFigures.flatMap((svg) => [...svg.matchAll(/<path\b[^>]*data-kind="relation"[^>]*>/g)]);
  const derivationPaths = [...derivation.matchAll(/<path\b[^>]*data-rule="[^"]+"[^>]*>/g)];
  // Then every relation is direction-free, while actual proof steps retain arrowheads.
  assert.ok(relationPaths.length > 0);
  for (const [path] of relationPaths) {
    assert.match(path, /data-direction="undirected"/);
    assert.doesNotMatch(path, /marker-(?:start|end)=/);
  }
  assert.ok(derivationPaths.length > 0);
  for (const [path] of derivationPaths) assert.match(path, /marker-end=/);
});

test('predefinition grouping and staged property figures do not reveal later notation', () => {
  // Given the scene before the cross-product definition and the two property-introduction stages.
  const grouping = readFigure('figure-grouping-need.svg');
  const selfAndDirection = readFigure('figure-property-roles.svg');
  const middleLink = readFigure('figure-middle-link.svg');
  // When their semantic contracts are inspected.
  const groupingLinks = [...grouping.matchAll(/<path\b[^>]*data-kind="grouping"[^>]*>/g)];
  // Then the opening uses neutral grouping links, and transitivity appears only in its own derivation figure.
  assert.equal(groupingLinks.length, 3);
  assert.doesNotMatch(grouping, /data-products=|data-property="transitive"|data-rule="transitivity"/);
  assert.doesNotMatch(selfAndDirection, /data-property="transitive"|equivalence-relation/);
  assert.match(middleLink, /data-rule="transitivity"/);
});

test('corrected figure geometry keeps labels inside panels and derivation paths clear', () => {
  // Given the property summary panel and the cancellation rule, branches, condition, and note row.
  const propertySummary = semanticGroup(readFigure('figure-property-roles.svg'), 'next-step-panel');
  const cancellation = readFigure('figure-integer-cancellation.svg');
  const ruleLabel = semanticGroup(cancellation, 'zero-product-rule-label');
  const condition = semanticGroup(cancellation, 'middle-denominator-condition');
  const note = semanticGroup(cancellation, 'method-note');
  // When conservative source-coordinate boxes are computed for text and paths.
  const propertyPanel = panelBox(propertySummary);
  const propertyLabels = textBoxes(propertySummary);
  const roleResults = textBoxes(semanticGroup(readFigure('figure-property-roles.svg'), 'role-results'));
  const ruleBox = expanded(textBoxes(ruleLabel)[0] ?? { left: 0, top: 0, right: 0, bottom: 0 }, 8);
  const branchSegments = [
    ...pathSegments(edge(cancellation, 'zero-product-split', 'excluded-d-zero')),
    ...pathSegments(edge(cancellation, 'zero-product-split', 'retained-difference-zero')),
  ];
  // Then panel text has 12-unit inset, labels do not overlap, arrows clear the rule, and the note clears the condition panel.
  for (const label of propertyLabels) {
    assert.ok(label.left >= propertyPanel.left + 12 && label.right <= propertyPanel.right - 12);
    assert.ok(label.top >= propertyPanel.top + 12 && label.bottom <= propertyPanel.bottom - 12);
  }
  assert.equal(intersects(propertyLabels[0] ?? propertyPanel, propertyLabels[1] ?? propertyPanel), false);
  for (const label of roleResults) assert.equal(intersects(label, propertyPanel), false);
  for (const segment of branchSegments) assert.equal(intersects(segmentBox(segment), ruleBox), false);
  assert.equal(intersects(panelBox(condition), textBoxes(note)[0] ?? panelBox(condition)), false);
});

test('topic wrapping contracts cover concept cards and complete relation runs', () => {
  // Given the topic stylesheet and canonical Korean article source.
  const css = readOwned('apps/web/topics/number-systems/rational-representations.css');
  const article = readOwned('content/number-systems/rational-representations/article.ko.json');
  // When structural wrapping selectors and the complete mathematical units are inspected.
  // Then cards receive word-safe wrapping and relations retain their adjacent particles.
  assert.match(css, /\.concept-diagram>span:not\(\.concept-connector\)[^{]*\{[^}]*word-break:keep-all/);
  assert.match(css, /:is\(#cross-product-domain,#equivalence-name,#proof-setup,#counterexample-scope\) \.concept-diagram\{[^}]*flex-direction:column/);
  assert.match(article, /\(c,d\)\\u2060는/);
  assert.match(article, /\(1,2\)\\u2060~\\u2060\(3,6\)\\u2060을/);
  assert.match(article, /\(a,b\)\\u2060~\\u2060\(c,d\)\\u2060로/);
  assert.match(article, /\(2,3\)\\u2060~\\u2060\(10,15\)\\u2060입니다/);
});

test('integer transitivity fixtures include zero and negative representations', () => {
  // Given valid nonzero-denominator chains chosen independently of the authored SVG labels.
  const fixtures: readonly (readonly [Pair, Pair, Pair])[] = [
    [[1, 2], [2, 4], [3, 6]],
    [[-1, 2], [2, -4], [-3, 6]],
    [[0, 3], [0, -5], [0, 7]],
    [[5, -10], [-3, 6], [7, -14]],
  ];
  // When each inner and outer relation is calculated only with integer products.
  const observations = fixtures.map(([left, middle, right]) => ({
    denominatorsNonzero: left[1] !== 0 && middle[1] !== 0 && right[1] !== 0,
    leftToMiddle: related(left, middle),
    middleToRight: related(middle, right),
    leftToRight: related(left, right),
  }));
  // Then every valid two-link chain has the required outer edge.
  for (const observation of observations) {
    assert.deepEqual(observation, {
      denominatorsNonzero: true,
      leftToMiddle: true,
      middleToRight: true,
      leftToRight: true,
    });
  }
});

test('zero-pair figure preserves two valid inner edges and one invalid outer edge', () => {
  // Given the same three nodes throughout the expanded-domain counterexample.
  const svg = readFigure('figure-zero-pair-counterexample.svg');
  const left: Pair = [1, 1];
  const middle: Pair = [0, 0];
  const right: Pair = [1, 2];
  // When relation truth and visible edge status are checked independently.
  const observations = {
    leftToMiddle: related(left, middle),
    middleToRight: related(middle, right),
    leftToRight: related(left, right),
  };
  // Then the exact transitivity antecedent is true while its required endpoint relation is false.
  assert.deepEqual(observations, { leftToMiddle: true, middleToRight: true, leftToRight: false });
  assert.match(edge(svg, 'pair-1-1', 'pair-0-0'), /data-status="verified"[^>]*data-products="0=0"/);
  assert.match(edge(svg, 'pair-0-0', 'pair-1-2'), /data-status="verified"[^>]*data-products="0=0"/);
  assert.match(edge(svg, 'pair-1-1', 'pair-1-2'), /data-status="failed"[^>]*data-products="2!=1"/);
});

test('relation-chain geometry carries visible logical edges rather than metadata alone', () => {
  // Given the opening proof-target and zero-pair relation diagrams.
  const target = readFigure('figure-chain-target.svg');
  const failure = readFigure('figure-zero-pair-counterexample.svg');
  // When edge paths and their drawn lengths are inspected.
  const paths = [
    edge(target, 'one-half', 'two-fourths'),
    edge(target, 'two-fourths', 'three-sixths'),
    edge(target, 'one-half', 'three-sixths'),
    edge(failure, 'pair-1-1', 'pair-1-2'),
  ];
  // Then every semantic edge owns non-degenerate path geometry and a visible status label.
  for (const path of paths) {
    assert.match(path, /d="M\s*\d+[ ,]\d+[^\"]+"/);
    assert.match(path, /data-label="[^"]+"/);
  }
});

test('transfer figure keeps middle denominator six and independently verifies thirty equals thirty', () => {
  // Given the worked transfer chain from the authoring contract.
  const svg = readFigure('figure-transfer-chain.svg');
  const left: Pair = [2, 3];
  const middle: Pair = [4, 6];
  const right: Pair = [10, 15];
  // When the exact products and domain condition are recomputed.
  const observations = {
    leftInner: left[0] * middle[1] === left[1] * middle[0],
    rightInner: middle[0] * right[1] === middle[1] * right[0],
    middleDenominator: middle[1],
    outerProducts: [left[0] * right[1], left[1] * right[0]],
  };
  // Then both links hold, cancellation is allowed, and the endpoint products are independently equal.
  assert.deepEqual(observations, { leftInner: true, rightInner: true, middleDenominator: 6, outerProducts: [30, 30] });
  assert.match(semanticGroup(svg, 'middle-domain-condition'), /data-denominator="6"[^>]*data-nonzero="true"/);
  assert.match(edge(svg, 'pair-2-3', 'pair-10-15'), /data-status="verified"[^>]*data-products="30=30"/);
});

test('every essential SVG label is explicit and uses the 600-wide minimum source size', () => {
  // Given every authored figure, including labels smaller than an assumed safe threshold.
  const labels = figureNames.flatMap((name) =>
    [...readFigure(name).matchAll(/<text\b([^>]*)>/g)].map((match) => ({ name, attributes: match[1] ?? '' })),
  );
  // When each text node is classified by its explicit essential-label contract.
  const observations = labels.map(({ name, attributes }) => ({
    name,
    size: Number(attributes.match(/font-size="(\d+)"/)?.[1] ?? 0),
    essential: /data-essential-label="true"/.test(attributes),
  }));
  // Then all proof-bearing labels are marked and at least 24 units; only 18-unit scope notes may be supplementary.
  assert.ok(observations.length > 0);
  for (const label of observations) {
    if (label.essential) assert.ok(label.size >= 24, `${label.name} has an undersized essential label`);
    else assert.equal(label.size, 18, `${label.name} has an unclassified non-note label at ${label.size}`);
  }
});
