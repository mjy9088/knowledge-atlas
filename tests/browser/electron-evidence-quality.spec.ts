import {expect, test} from '@playwright/test';

const scenes = ['question', 'apparatus', 'ratio', 'repeat', 'limit', 'transfer'] as const;
const figureScenes = new Set(['apparatus', 'ratio', 'limit', 'transfer']);
const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`electron evidence: six scenes retain full copy, geometry, controls, anchors, and state at ${viewport.name}`, async ({page}) => {
    // Given the built static reader at a supported viewport.
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/knowledge/electron-evidence/');
    await page.waitForFunction(() => window.__atlasRelated);

    // When a saved terminal scene is reset, restored, and challenged with invalid state.
    await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'transfer'}));
    const saved = await page.evaluate(() => window.__atlasRelated.getState());
    await page.evaluate(() => window.__atlasRelated.reset());
    expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual({sceneId: 'question'});
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
    // Then generic reader state remains deterministic and invalid input is rejected atomically.
    expect(invalidStateWasAtomic).toBe(true);

    for (const sceneId of scenes) {
      await test.step(sceneId, async () => {
        // Given a direct scene anchor rather than hidden prior interaction.
        await page.evaluate((id) => {
          location.hash = `#${id}`;
        }, sceneId);
        await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', sceneId);
        await expect.poll(() => page.evaluate(() => window.__atlasRelated.getState().sceneId)).toBe(sceneId);

        // When visible content, scroll extents, figures, and controls are measured.
        const quality = await page.evaluate(() => {
          const issues: string[] = [];
          const root = document.documentElement;
          if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) {
            issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
          }
          const visible = document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
          const copy = visible?.querySelector<HTMLElement>('.reader-copy');
          const prose = visible?.querySelector<HTMLElement>('.scene-prose');
          const targets = [
            visible,
            visible?.querySelector<HTMLElement>('.reader-dialogue'),
            copy,
            prose,
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
          if (!prose?.textContent?.trim()) issues.push('missing full scene prose');
          const controls = Array.from(document.querySelectorAll<HTMLElement>('#reader-prev,#reader-next,#reader-reset,.reader-menu summary'))
            .filter((element) => element.checkVisibility());
          const controlIssues = controls.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            const center = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
            const sized = bounds.width >= 44 && bounds.height >= 44;
            return sized && (center === element || center && element.contains(center))
              ? []
              : [`${element.id || element.className}: ${bounds.width}×${bounds.height}, center=${center?.id || center?.className}`];
          });
          return {
            issues,
            controlIssues,
            visibleScene: visible?.id,
            fontSize: prose ? Number.parseFloat(getComputedStyle(prose).fontSize) : 0,
            figureAlt: visible?.querySelector<HTMLImageElement>('.scene-figure img')?.alt ?? null,
            figureCaption: visible?.querySelector<HTMLElement>('.scene-figure figcaption')?.textContent?.trim() ?? null,
          };
        });

        // Then the complete scene stays visible, readable, and operable without topic-specific state.
        expect(quality.visibleScene).toBe(sceneId);
        expect(quality.issues).toEqual([]);
        expect(quality.controlIssues).toEqual([]);
        expect(quality.fontSize).toBeGreaterThanOrEqual(13);
        if (figureScenes.has(sceneId)) {
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
