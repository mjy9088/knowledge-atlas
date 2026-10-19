import {expect, test} from '@playwright/test';

const scenes = [
  'question',
  'measurement',
  'factoring',
  'factored-pattern',
  'conditional-extraction',
  'conditional-pattern',
  'parton-inference',
  'quark-identification',
  'gluon-limit',
  'transfer',
] as const;

const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'fhd', width: 1920, height: 1080},
] as const;

for (const viewport of viewports) {
  test(`quark evidence: all ten scenes fit and preserve the reader contract at ${viewport.name}`, async ({page}) => {
    // Given the built reader at a supported viewport.
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/knowledge/quark-evidence/');
    await page.waitForFunction(() => window.__atlasRelated);

    for (const sceneId of scenes) {
      await test.step(sceneId, async () => {
        // When each stable scene is opened directly and its state is round-tripped.
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

        // Then prose, figure, caption, and controls remain complete, visible, and operable.
        const quality = await page.evaluate(() => {
          const issues: string[] = [];
          const root = document.documentElement;
          const visible = document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
          if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) {
            issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
          }

          const targets = [
            visible,
            visible?.querySelector<HTMLElement>('.reader-dialogue'),
            visible?.querySelector<HTMLElement>('.reader-copy'),
            visible?.querySelector<HTMLElement>('.scene-prose'),
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
          const controlIssues = controls.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            const center = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
            const tooSmall = bounds.width < 44 || bounds.height < 44;
            const centerBlocked = center !== element && !element.contains(center);
            return tooSmall || centerBlocked
              ? [`${element.id || element.className}: ${bounds.width}×${bounds.height}, center=${center?.tagName ?? 'none'}`]
              : [];
          });

          const image = visible?.querySelector<HTMLImageElement>('.scene-figure img');
          const caption = visible?.querySelector<HTMLElement>('.scene-figure figcaption');
          return {
            issues,
            controlIssues,
            visibleScene: visible?.id,
            figureAlt: image?.alt.trim() ?? null,
            figureLoaded: image?.complete === true && (image?.naturalWidth ?? 0) > 0,
            figureCaption: caption?.textContent?.trim() ?? null,
          };
        });

        expect(quality.visibleScene).toBe(sceneId);
        expect(quality.issues).toEqual([]);
        expect(quality.controlIssues).toEqual([]);
        expect(quality.figureAlt).toMatch(/.+/);
        expect(quality.figureLoaded).toBe(true);
        expect(quality.figureCaption).toMatch(/.+/);
      });
    }

    expect(errors).toEqual([]);
  });
}
