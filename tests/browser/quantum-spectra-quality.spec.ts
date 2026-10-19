import {expect, test} from '@playwright/test';

const scenes = [
  'question',
  'pattern',
  'energy',
  'transition-limit',
  'bohr',
  'limit',
  'transfer',
] as const;

const figureScenes = new Set(['pattern', 'energy', 'transition-limit', 'bohr', 'transfer']);

const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`quantum spectra: all scenes fit with complete copy and atomic state at ${viewport.name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/knowledge/quantum-spectra/');
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
          const bounded = [
            visible,
            visible?.querySelector<HTMLElement>('.reader-dialogue'),
            visible?.querySelector<HTMLElement>('.reader-copy'),
            visible?.querySelector<HTMLElement>('.scene-prose'),
            visible?.querySelector<HTMLElement>('.concept-diagram'),
            visible?.querySelector<HTMLElement>('.scene-figure'),
            document.querySelector<HTMLElement>('#reader-controls'),
          ].filter((element): element is HTMLElement => element !== null && element !== undefined);

          for (const element of bounded) {
            const bounds = element.getBoundingClientRect();
            if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) {
              issues.push(`internal overflow: ${element.className || element.id}`);
            }
            if (bounds.left < 0 || bounds.top < 0 || bounds.right > innerWidth || bounds.bottom > innerHeight) {
              issues.push(`outside viewport: ${element.className || element.id}`);
            }
          }

          const interactive = Array.from(document.querySelectorAll<HTMLElement>('#reader-prev,#reader-next,.reader-menu summary,.reader-menu a'))
            .filter((element) => element.checkVisibility());
          const controls = interactive.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            const center = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
            const findings: string[] = [];
            if (bounds.width < 44 || bounds.height < 44) {
              findings.push(`undersized ${element.id || element.className}: ${bounds.width}×${bounds.height}`);
            }
            if (center !== element && !element.contains(center)) {
              findings.push(`blocked center: ${element.id || element.className}`);
            }
            return findings;
          });

          const copy = visible?.querySelector<HTMLElement>('.scene-prose');
          const figure = visible?.querySelector<HTMLElement>('.scene-figure');
          const figureBounds = figure?.getBoundingClientRect();
          const visibleBounds = visible?.getBoundingClientRect();
          const figureCentered = figureBounds === undefined || visibleBounds === undefined
            ? null
            : Math.abs((figureBounds.left + figureBounds.right) / 2 - (visibleBounds.left + visibleBounds.right) / 2) <= 2;

          return {
            issues,
            controls,
            visibleScene: visible?.id,
            fullCopy: copy?.textContent?.trim() ?? '',
            figureAlt: visible?.querySelector<HTMLImageElement>('.scene-figure img')?.alt ?? null,
            figureCaption: visible?.querySelector<HTMLElement>('.scene-figure figcaption')?.textContent?.trim() ?? null,
            figureCentered,
          };
        });

        expect(quality.visibleScene).toBe(sceneId);
        expect(quality.fullCopy.length).toBeGreaterThan(0);
        expect(quality.issues).toEqual([]);
        expect(quality.controls).toEqual([]);
        if (figureScenes.has(sceneId)) {
          expect(quality.figureAlt).toMatch(/.+/);
          expect(quality.figureCaption).toMatch(/.+/);
          expect(quality.figureCentered).toBe(true);
        } else {
          expect(quality.figureAlt).toBeNull();
          expect(quality.figureCaption).toBeNull();
          expect(quality.figureCentered).toBeNull();
        }
      });
    }

    expect(errors).toEqual([]);
  });
}
