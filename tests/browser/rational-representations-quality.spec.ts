import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const scenes = [
  'opening-case',
  'stable-grouping',
  'cross-product-domain',
  'cross-product-chain',
  'self-and-direction',
  'middle-link',
  'equivalence-name',
  'proof-setup',
  'proof-products',
  'integer-cancellation',
  'proof-result',
  'zero-pair-links',
  'zero-pair-failure',
  'counterexample-scope',
  'transfer-checks',
  'transfer-result',
] as const;

test('rational representations: all sixteen scenes fit, restore, and capture on FHD and mobile', async ({ page }, testInfo) => {
  test.skip(!['fhd', 'mobile'].includes(testInfo.project.name), 'quality capture is owned by FHD and mobile projects');
  // Given the complete static article and the exact build consumed by the reader.
  const build = createHash('sha256').update(readFileSync('dist/build-manifest.json')).digest('hex');
  const directory = path.resolve(
    'test-results/content-quality/latest',
    build,
    testInfo.project.name,
    'rational-representations',
  );
  mkdirSync(directory, { recursive: true });
  const observations = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  for (const scene of scenes) {
    await page.goto(`/knowledge/rational-representations/#${scene}`);
    await page.waitForFunction(() => window.__atlasRelated);
    const saved = await page.evaluate(() => window.__atlasRelated.getState());
    await page.evaluate(() => window.__atlasRelated.reset());
    await page.evaluate((state) => window.__atlasRelated.setState(state), saved);
    // When document bounds, visible content, captions, figures, and controls are measured.
    const observation = await page.evaluate(async () => {
      const visible = document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
      const copy = visible?.querySelector<HTMLElement>('.reader-copy');
      const prose = visible?.querySelector<HTMLElement>('.scene-prose');
      const controls = document.querySelector<HTMLElement>('#reader-controls');
      if (!visible || !copy || !prose || !controls) throw new Error('rational-representation scene is incomplete');
      const issues: string[] = [];
      const measured: HTMLElement[] = [visible, copy, prose, controls];
      const figure = visible.querySelector<HTMLElement>('.scene-figure');
      const caption = figure?.querySelector<HTMLElement>('figcaption');
      const image = figure?.querySelector<HTMLImageElement>('img');
      if (figure) measured.push(figure);
      if (caption) measured.push(caption);
      for (const element of measured) {
        const rect = element.getBoundingClientRect();
        if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
          issues.push(`internal overflow: ${element.className}`);
        if (rect.left < 0 || rect.right > innerWidth || rect.top < 0 || rect.bottom > innerHeight)
          issues.push(`outside viewport: ${element.className}`);
      }
      const root = document.documentElement;
      if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) issues.push('document overflow');
      const buttons = Array.from(controls.querySelectorAll<HTMLButtonElement>('button:not([hidden])'));
      const buttonMetrics = buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return { width: rect.width, height: rect.height, reachable: hit === button || Boolean(hit && button.contains(hit)) };
      });
      let figureMetrics = null;
      if (image && caption) {
        const imageRect = image.getBoundingClientRect();
        const captionRect = caption.getBoundingClientRect();
        const source = await fetch(image.currentSrc || image.src).then((response) => response.text());
        const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
        const viewBox = svg.getAttribute('viewBox')?.split(/\s+/).map(Number) ?? [];
        const viewBoxWidth = viewBox[2] ?? 0;
        const allLabels = Array.from(svg.querySelectorAll<SVGTextElement>('text[font-size]'));
        const essentialLabels = Array.from(svg.querySelectorAll<SVGTextElement>('text[data-essential-label="true"]'));
        const labelSizes = essentialLabels.map((label) => Number(label.getAttribute('font-size')));
        figureMetrics = {
          loaded: image.complete && image.naturalWidth > 0,
          captionGap: captionRect.top - imageRect.bottom,
          captionText: caption.textContent?.trim() ?? '',
          allLabelCount: allLabels.length,
          essentialLabelCount: labelSizes.length,
          classifiedLabelCount: essentialLabels.length + allLabels.filter((label) => Number(label.getAttribute('font-size')) === 18).length,
          minimumEssentialSourceSize: Math.min(...labelSizes),
          minimumRenderedEssentialLabel: Math.min(...labelSizes) * imageRect.width / viewBoxWidth,
        };
      }
      return {
        scene: visible.id,
        issues,
        buttons: buttonMetrics,
        figure: figureMetrics,
        state: window.__atlasRelated.getState(),
        viewport: { width: innerWidth, height: innerHeight },
      };
    });
    // Then each scene keeps its identity, has no hidden overflow, and exposes readable static evidence.
    expect(observation.scene).toBe(scene);
    expect(observation.state).toEqual(saved);
    expect(observation.issues, scene).toEqual([]);
    expect(observation.buttons.every((button) => button.width >= 44 && button.height >= 44 && button.reachable)).toBe(true);
    if (observation.figure) {
      expect(observation.figure.loaded).toBe(true);
      expect(observation.figure.captionGap).toBeGreaterThanOrEqual(0);
      expect(observation.figure.captionGap).toBeLessThanOrEqual(8);
      expect(observation.figure.captionText.length).toBeGreaterThan(0);
      expect(observation.figure.essentialLabelCount).toBeGreaterThan(0);
      expect(observation.figure.classifiedLabelCount).toBe(observation.figure.allLabelCount);
      expect(observation.figure.minimumEssentialSourceSize).toBeGreaterThanOrEqual(24);
      expect(observation.figure.minimumRenderedEssentialLabel).toBeGreaterThanOrEqual(13);
    }
    observations.push(observation);
    await page.screenshot({ path: path.join(directory, `${scene}.png`), fullPage: false });
  }

  // Given a valid final state, when an unknown scene is rejected, then no partial mutation survives.
  const invalidStateAtomic = await page.evaluate(() => {
    const before = window.__atlasRelated.getState();
    try {
      window.__atlasRelated.setState({ sceneId: 'missing-rational-representation-scene' });
    } catch {
      return JSON.stringify(before) === JSON.stringify(window.__atlasRelated.getState());
    }
    return false;
  });
  expect(invalidStateAtomic).toBe(true);
  expect(errors).toEqual([]);
  writeFileSync(
    path.join(directory, 'observations.json'),
    JSON.stringify({ buildManifestSha256: build, observations, invalidStateAtomic, pageErrors: errors }, null, 2),
  );
});
