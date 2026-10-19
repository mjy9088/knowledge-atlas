import {expect, test} from '@playwright/test';

const scenes = [
  'question',
  'apparatus',
  'pattern',
  'inference',
  'empty-space-limit',
  'history-limit',
  'transfer',
] as const;

const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`nuclear scattering: all seven scenes fit, restore, and reject invalid state at ${viewport.name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/knowledge/nuclear-scattering/');
    await page.waitForFunction(() => window.__atlasRelated);

    for (const sceneId of scenes) {
      await test.step(sceneId, async () => {
        await page.evaluate((scene) => window.__atlasRelated.setState({sceneId: scene}), sceneId);
        await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', sceneId);

        const saved = await page.evaluate(() => window.__atlasRelated.getState());
        await page.evaluate(() => window.__atlasRelated.reset());
        await page.evaluate((state) => window.__atlasRelated.setState(state), saved);
        expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);

        const invalidStateWasAtomic = await page.evaluate(() => {
          const before = window.__atlasRelated.getState();
          try {
            window.__atlasRelated.setState({sceneId: 'scene:invalid'});
          } catch {
            return JSON.stringify(window.__atlasRelated.getState()) === JSON.stringify(before);
          }
          return false;
        });
        expect(invalidStateWasAtomic).toBe(true);

        const quality = await page.evaluate(() => {
          const issues: string[] = [];
          const root = document.documentElement;
          if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) {
            issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
          }

          const visible = document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
          const targets = [
            visible,
            visible?.querySelector<HTMLElement>('.reader-dialogue'),
            visible?.querySelector<HTMLElement>('.reader-copy'),
            visible?.querySelector<HTMLElement>('.scene-prose'),
            visible?.querySelector<HTMLElement>('.concept-diagram'),
            visible?.querySelector<HTMLElement>('.scene-figure'),
            document.querySelector<HTMLElement>('#reader-controls'),
          ].filter((element): element is HTMLElement => element !== null && element !== undefined);

          for (const element of targets) {
            const bounds = element.getBoundingClientRect();
            if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) {
              issues.push(`internal overflow: ${element.className || element.id}`);
            }
            if (bounds.left < 0 || bounds.top < 0 || bounds.right > innerWidth || bounds.bottom > innerHeight) {
              issues.push(`outside viewport: ${element.className || element.id}`);
            }
          }

          const controls = Array.from(document.querySelectorAll<HTMLElement>('#reader-prev,#reader-next,.reader-menu summary'))
            .filter((element) => element.checkVisibility());
          const undersized = controls.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            return bounds.width < 44 || bounds.height < 44
              ? [`${element.id || element.className}: ${bounds.width}×${bounds.height}`]
              : [];
          });

          return {
            issues,
            undersized,
            visibleScene: visible?.id,
            figureAlt: visible?.querySelector<HTMLImageElement>('.scene-figure img')?.alt ?? null,
            figureCaption: visible?.querySelector<HTMLElement>('.scene-figure figcaption')?.textContent?.trim() ?? null,
          };
        });

        expect(quality.visibleScene).toBe(sceneId);
        expect(quality.issues).toEqual([]);
        expect(quality.undersized).toEqual([]);
        if (['apparatus', 'pattern', 'inference', 'transfer'].includes(sceneId)) {
          expect(quality.figureAlt).toMatch(/.+/);
          expect(quality.figureCaption).toMatch(/.+/);
        } else {
          expect(quality.figureAlt).toBeNull();
          expect(quality.figureCaption).toBeNull();
        }
      });
    }

    expect(errors).toEqual([]);
  });
}
