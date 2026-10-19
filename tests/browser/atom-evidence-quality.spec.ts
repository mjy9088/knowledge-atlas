import {expect, test} from '@playwright/test';

const scenes = ['question', 'observe', 'predict', 'measure', 'uncertainty', 'limit', 'transfer'] as const;
const figureScenes = new Set(['observe', 'predict', 'measure']);
const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`atom evidence: seven scenes preserve full copy, geometry, and reader state at ${viewport.name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/knowledge/atom-evidence/');
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
            visible?.querySelector<HTMLElement>('.scene-figure figcaption'),
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
          const blockedCenters = controls.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
            return hit === element || element.contains(hit) ? [] : [element.id || element.className];
          });

          const figure = visible?.querySelector<HTMLElement>('.scene-figure');
          const image = figure?.querySelector<HTMLImageElement>('img');
          const caption = figure?.querySelector<HTMLElement>('figcaption');
          const figureAnchorGap = image && caption
            ? caption.getBoundingClientRect().top - image.getBoundingClientRect().bottom
            : null;
          const copy = visible?.querySelector<HTMLElement>('.reader-copy');

          return {
            blockedCenters,
            copyLength: copy?.innerText.trim().length ?? 0,
            figureAlt: image?.alt ?? null,
            figureAnchorGap,
            figureCaption: caption?.textContent?.trim() ?? null,
            figureLoaded: image ? image.complete && image.naturalWidth > 0 : null,
            issues,
            undersized,
            visibleScene: visible?.id,
          };
        });

        expect(quality.visibleScene).toBe(sceneId);
        expect(quality.copyLength).toBeGreaterThan(0);
        expect(quality.issues).toEqual([]);
        expect(quality.undersized).toEqual([]);
        expect(quality.blockedCenters).toEqual([]);
        if (figureScenes.has(sceneId)) {
          expect(quality.figureLoaded).toBe(true);
          expect(quality.figureAlt).toMatch(/.+/);
          expect(quality.figureCaption).toMatch(/.+/);
          expect(quality.figureAnchorGap).not.toBeNull();
          expect(quality.figureAnchorGap ?? -1).toBeGreaterThanOrEqual(0);
        } else {
          expect(quality.figureLoaded).toBeNull();
          expect(quality.figureAlt).toBeNull();
          expect(quality.figureCaption).toBeNull();
        }
      });
    }

    expect(errors).toEqual([]);
  });
}
