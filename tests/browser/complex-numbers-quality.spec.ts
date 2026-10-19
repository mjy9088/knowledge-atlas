import { expect, test, type Page } from '@playwright/test';

const scenes = [
  { id: 'question', visual: 'cards' },
  { id: 'definition', visual: 'cards' },
  { id: 'i-square', visual: 'cards' },
  { id: 'rotation', visual: 'figure' },
  { id: 'order', visual: 'figure' },
  { id: 'transfer', visual: 'figure' },
] as const;

const viewports = [
  { name: 'fhd', width: 1920, height: 1080 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const expectFrame = async (page: Page): Promise<void> => {
  const result = await page.evaluate(() => {
    const issues: string[] = [];
    const root = document.documentElement;
    if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) issues.push('document overflow');
    for (const element of document.querySelectorAll<HTMLElement>('.reader-scene:not([hidden]),.reader-scene:not([hidden]) .reader-dialogue,.reader-scene:not([hidden]) .reader-copy,.reader-scene:not([hidden]) .concept-diagram,#reader-controls')) {
      const bounds = element.getBoundingClientRect();
      if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) issues.push(`internal overflow: ${element.className}`);
      if (bounds.left < 0 || bounds.right > innerWidth || bounds.top < 0 || bounds.bottom > innerHeight) issues.push(`outside viewport: ${element.className}`);
    }
    const controls = Array.from(document.querySelectorAll<HTMLElement>('#reader-controls button,.reader-menu summary')).filter((element) => element.checkVisibility());
    for (const control of controls) {
      const bounds = control.getBoundingClientRect();
      if (bounds.width < 44 || bounds.height < 44) issues.push(`small control: ${control.id || control.className}`);
      const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      if (hit !== control && !control.contains(hit)) issues.push(`obscured control: ${control.id || control.className}`);
    }
    return issues;
  });
  expect(result).toEqual([]);
};

const expectReadableFigure = async (page: Page): Promise<void> => {
  const figure = page.locator('.reader-scene:not([hidden]) .scene-figure');
  await expect(figure).toBeVisible();
  await expect(figure.locator('img')).toHaveAttribute('alt', /.+/);
  await expect(figure.locator('figcaption')).toBeVisible();
  const metrics = await figure.locator('img').evaluate(async (image) => {
    if (!(image instanceof HTMLImageElement)) throw new TypeError('Expected a figure image');
    const source = await fetch(image.currentSrc || image.src).then((response) => response.text());
    const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
    const viewBox = svg.getAttribute('viewBox')?.split(/\s+/).map(Number) ?? [];
    const width = viewBox[2] ?? 0;
    const sourceSizes = Array.from(svg.querySelectorAll<SVGTextElement>('[data-essential-label]')).map((label) => Number(label.getAttribute('font-size')));
    return {
      loaded: image.complete && image.naturalWidth > 0,
      minimumRenderedLabel: Math.min(...sourceSizes) * image.getBoundingClientRect().width / width,
      essentialLabelCount: sourceSizes.length,
    };
  });
  expect(metrics.loaded).toBe(true);
  expect(metrics.essentialLabelCount).toBeGreaterThan(0);
  expect(metrics.minimumRenderedLabel).toBeGreaterThanOrEqual(13);
};

for (const viewport of viewports) {
  test(`complex numbers captures all six scenes with stable state and bounds at ${viewport.name}`, async ({ page }, testInfo) => {
    // Given the actual complex-number reader at the target supported viewport.
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/knowledge/complex-numbers/#question');
    await page.waitForFunction(() => window.__atlasRelated);

    for (const scene of scenes) {
      // When each authored scene is restored directly, reset, and restored again.
      await page.evaluate((sceneId) => window.__atlasRelated.setState({ sceneId }), scene.id);
      const visible = page.locator('.reader-scene:not([hidden])');
      await expect(visible).toHaveAttribute('id', scene.id);
      await expect(visible.locator('h2')).toBeVisible();
      await expect(visible.locator('.scene-prose')).not.toBeEmpty();
      if (scene.visual === 'figure') await expectReadableFigure(page);
      else await expect(visible.locator('.concept-diagram>span:not(.concept-connector)')).not.toHaveCount(0);
      const saved = await page.evaluate(() => window.__atlasRelated.getState());
      await page.evaluate(() => window.__atlasRelated.reset());
      await page.evaluate((state) => window.__atlasRelated.setState(state), saved);

      // Then scene identity, content geometry, controls, and screenshot evidence remain complete.
      expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);
      await expectFrame(page);
      await testInfo.attach(`${viewport.name}-${scene.id}`, { body: await page.screenshot(), contentType: 'image/png' });
    }

    // When an unsupported scene is submitted at the state boundary.
    const rejectedAtomically = await page.evaluate(() => {
      const before = window.__atlasRelated.getState();
      try {
        window.__atlasRelated.setState({ sceneId: 'missing-complex-scene' });
      } catch {
        return JSON.stringify(window.__atlasRelated.getState()) === JSON.stringify(before);
      }
      return false;
    });
    // Then the invalid state is rejected without changing the last valid scene.
    expect(rejectedAtomically).toBe(true);
    expect(errors).toEqual([]);
  });
}
