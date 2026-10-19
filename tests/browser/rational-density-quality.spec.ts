import { expect, test, type Page } from '@playwright/test';

const scenes = [
  'opening-gap',
  'grid-plan',
  'choose-mesh',
  'mesh-points',
  'first-grid-point',
  'divide-chain',
  'strict-result',
  'ceiling-boundary',
  'floor-escape',
  'irrational-lower',
  'irrational-upper',
  'coarse-mesh',
  'fine-mesh',
] as const;

const figureScenes = new Set([
  'opening-gap',
  'grid-plan',
  'mesh-points',
  'first-grid-point',
  'divide-chain',
  'ceiling-boundary',
  'floor-escape',
  'coarse-mesh',
  'fine-mesh',
]);

const expectSceneBounds = async (page: Page): Promise<void> => {
  const issues = await page.evaluate(() => {
    const result: string[] = [];
    const root = document.documentElement;
    if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) result.push('document overflow');
    for (const element of document.querySelectorAll<HTMLElement>(
      '.reader-scene:not([hidden]) .reader-copy,.reader-scene:not([hidden]) .scene-figure,#reader-controls',
    )) {
      const bounds = element.getBoundingClientRect();
      if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) {
        result.push(`internal overflow: ${element.className}`);
      }
      if (bounds.left < 0 || bounds.top < 0 || bounds.right > innerWidth || bounds.bottom > innerHeight) {
        result.push(`outside viewport: ${element.className}`);
      }
    }
    for (const element of document.querySelectorAll<HTMLElement>('#reader-prev,#reader-next,.reader-menu summary')) {
      const bounds = element.getBoundingClientRect();
      const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      if (bounds.width < 44 || bounds.height < 44) result.push(`small control: ${element.id || element.className}`);
      if (!hit || (!element.contains(hit) && !hit.contains(element))) result.push(`obscured control: ${element.id || element.className}`);
    }
    return result;
  });
  expect(issues).toEqual([]);
};

for (const profile of [
  { name: 'FHD', viewport: { width: 1920, height: 1080 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
] as const) {
  test.describe(`rational density ${profile.name}`, () => {
    test.use({ viewport: profile.viewport });

    test('captures all thirteen scenes with bounded content, controls, and exact restoration', async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/knowledge/rational-density/#opening-gap');
      await page.waitForFunction(() => window.__atlasRelated);

      for (const scene of scenes) {
        await page.evaluate((sceneId) => window.__atlasRelated.setState({ sceneId }), scene);
        await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', scene);
        await expect(page).toHaveURL(new RegExp(`#${scene}$`));

        if (figureScenes.has(scene)) {
          const figure = page.locator('.reader-scene:visible .scene-figure');
          await expect(figure).toBeVisible();
          await expect(figure.locator('img')).toHaveAttribute('alt', /.+/);
          await expect(figure.locator('figcaption')).toBeVisible();
          expect(await figure.locator('img').evaluate((image) =>
            image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          )).toBe(true);
        }

        const saved = await page.evaluate(() => window.__atlasRelated.getState());
        await page.evaluate(() => window.__atlasRelated.reset());
        await page.evaluate((state) => window.__atlasRelated.setState(state), saved);
        expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);
        await expectSceneBounds(page);
        await testInfo.attach(`${profile.name}-${scene}`, { body: await page.screenshot(), contentType: 'image/png' });
      }

      expect(errors).toEqual([]);
    });
  });
}
