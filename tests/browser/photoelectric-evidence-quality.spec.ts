import {expect, test} from '@playwright/test';

const scenes = [
  'question',
  'observations',
  'single-photon-model',
  'below-threshold-case',
  'above-threshold-case',
  'regime-limit',
  'transfer',
] as const;

const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`photoelectric evidence: seven complete static scenes fit and restore at ${viewport.name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/knowledge/photoelectric-evidence/');
    await page.waitForFunction(() => window.__atlasRelated);

    for (const sceneId of scenes) {
      await test.step(sceneId, async () => {
        await page.evaluate((id) => window.__atlasRelated.setState({sceneId: id}), sceneId);
        const scene = page.locator('.reader-scene:visible');
        await expect(scene).toHaveAttribute('id', sceneId);
        await expect(scene.locator('.scene-figure img')).toHaveAttribute('alt', /.+/);
        await expect(scene.locator('.scene-figure figcaption')).toHaveText(/.+/);

        const saved = await page.evaluate(() => window.__atlasRelated.getState());
        await page.evaluate(() => window.__atlasRelated.reset());
        await page.evaluate((state) => window.__atlasRelated.setState(state), saved);
        expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);

        const atomic = await page.evaluate(() => {
          const before = window.__atlasRelated.getState();
          try {
            window.__atlasRelated.setState({sceneId: 'invalid-photoelectric-scene'});
          } catch {
            return JSON.stringify(window.__atlasRelated.getState()) === JSON.stringify(before);
          }
          return false;
        });
        expect(atomic).toBe(true);

        const quality = await page.evaluate(() => {
          const issues: string[] = [];
          const root = document.documentElement;
          if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) issues.push('document overflow');
          const visible = document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
           const figure = visible?.querySelector<HTMLElement>('.scene-figure');
           const image = visible?.querySelector<HTMLImageElement>('.scene-figure img');
           const caption = visible?.querySelector<HTMLElement>('.scene-figure figcaption');
           const prose = visible?.querySelector<HTMLElement>('.scene-prose');
           const targets = [visible, figure, image, caption, prose, document.querySelector<HTMLElement>('#reader-controls')]
            .filter((element): element is HTMLElement => element !== null && element !== undefined);

          for (const element of targets) {
            const bounds = element.getBoundingClientRect();
            if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) issues.push(`internal overflow: ${element.className || element.id}`);
            if (bounds.left < 0 || bounds.top < 0 || bounds.right > innerWidth || bounds.bottom > innerHeight) issues.push(`outside viewport: ${element.className || element.id}`);
          }

          if (prose) {
            const range = document.createRange();
            range.selectNodeContents(prose);
            const textBounds = range.getBoundingClientRect();
            const proseBounds = prose.getBoundingClientRect();
            if (textBounds.top < proseBounds.top - 1 || textBounds.bottom > proseBounds.bottom + 1) issues.push('canonical copy clipped');
          }

           if (figure && image) {
            const figureBounds = figure.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();
            const figureCenter = figureBounds.left + figureBounds.width / 2;
            const imageCenter = imageBounds.left + imageBounds.width / 2;
             if (Math.abs(figureCenter - imageCenter) > 1) issues.push('figure center drift');
             if (!image.complete || image.naturalWidth === 0) issues.push('figure not loaded');
             if (image.naturalWidth > 0 && image.naturalHeight > 0) {
               const renderedRatio = imageBounds.width / imageBounds.height;
               const intrinsicRatio = image.naturalWidth / image.naturalHeight;
               if (Math.abs(renderedRatio - intrinsicRatio) > 0.01) issues.push('figure aspect ratio distortion');
             }
           }

           if (caption && getComputedStyle(caption).fontSize !== '13px') issues.push('caption type is not 13px');

          const controls = Array.from(document.querySelectorAll<HTMLElement>('#reader-prev,#reader-next,.reader-menu summary'))
            .filter((element) => element.checkVisibility());
          for (const control of controls) {
            const bounds = control.getBoundingClientRect();
            if (bounds.width < 44 || bounds.height < 44) issues.push(`undersized control: ${control.id || control.className}`);
          }

          return {issues, visibleId: visible?.id, anchorExists: document.getElementById(visible?.id ?? '') === visible, proseLength: prose?.innerText.trim().length ?? 0};
        });

        expect(quality.visibleId).toBe(sceneId);
        expect(quality.anchorExists).toBe(true);
        expect(quality.proseLength).toBeGreaterThan(40);
        expect(quality.issues).toEqual([]);
      });
    }

    expect(errors).toEqual([]);
  });
}
