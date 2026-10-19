import { expect, test } from '@playwright/test';

const scenes = ['question', 'bounds', 'gap', 'property', 'scope', 'transfer'] as const;

test('real completeness keeps all six scenes reconstructable at FHD and mobile', async ({ page }, testInfo) => {
  test.skip(!['fhd', 'mobile'].includes(testInfo.project.name), 'Quality capture is scoped to requested FHD and mobile projects');

  await test.step('Given the actual static reader and its default state', async () => {
    await page.goto('/knowledge/real-completeness/#question');
    await page.waitForFunction(() => window.__atlasRelated);
    await expect(page.locator('main[data-page]')).toHaveAttribute('data-page', 'real-completeness');
  });

  for (const scene of scenes) {
    await test.step(`When scene ${scene} is selected`, async () => {
      await page.evaluate((sceneId) => window.__atlasRelated.setState({ sceneId }), scene);
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', scene);
    });

    await test.step(`Then scene ${scene} fits, exposes its content, and is captured`, async () => {
      const visibleScene = page.locator('.reader-scene:visible');
      await expect(visibleScene.locator('.scene-prose')).toBeVisible();
      await expect(visibleScene.locator('.scene-prose')).toHaveText(/.+/);
      expect(await visibleScene.locator('.scene-prose').evaluate(element => getComputedStyle(element).wordBreak)).toBe('keep-all');
      const conceptDiagram = visibleScene.locator('.concept-diagram');
      await expect(conceptDiagram).toBeVisible();
      if (scene === 'scope') {
        await expect(conceptDiagram.locator(':scope > span:not(.concept-connector)')).toHaveCount(3);
        expect(await conceptDiagram.locator('.concept-connector').evaluateAll(elements => elements.every(element => !element.checkVisibility()))).toBe(true);
      } else {
        const figure = visibleScene.locator('.scene-figure');
        await expect(figure).toBeVisible();
        await expect(figure.locator('img')).toHaveAttribute('alt', /.+/);
        await expect(figure.locator('figcaption')).toBeVisible();
      }

      const inspection = await page.evaluate(async () => {
        const problems: string[] = [];
        const root = document.documentElement;
        if (root.scrollWidth > innerWidth || root.scrollHeight > innerHeight) problems.push('document overflow');
        const selectors = '.concept-diagram,.concept-diagram > *,.reader-scene:not([hidden]) .reader-copy,.reader-scene:not([hidden]) .scene-prose,.reader-scene:not([hidden]) .scene-figure,.reader-scene:not([hidden]) .scene-figure img,.reader-scene:not([hidden]) .scene-figure figcaption,#reader-controls';
        for (const element of document.querySelectorAll<HTMLElement>(selectors)) {
          if (!element.checkVisibility()) continue;
          const bounds = element.getBoundingClientRect();
          if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) problems.push(`internal overflow: ${element.className}`);
          if (bounds.left < 0 || bounds.right > innerWidth || bounds.top < 0 || bounds.bottom > innerHeight) problems.push(`outside viewport: ${element.className}`);
        }
        const image = document.querySelector<HTMLImageElement>('.reader-scene:not([hidden]) .scene-figure img');
        if (!image) return { problems, minimumRenderedEssential: null };
        if (!image.complete || image.naturalWidth <= 0) problems.push('figure image did not load');
        const source = await fetch(image.currentSrc || image.src).then((response) => response.text());
        const parsed = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
        const svg = document.importNode(parsed, true);
        if (!(svg instanceof SVGSVGElement)) throw new TypeError('Expected an SVG figure root');
        svg.setAttribute('style', 'position:absolute;left:-10000px;top:0;width:600px;height:auto;visibility:hidden');
        document.body.append(svg);
        const viewBox = svg.viewBox.baseVal;
        for (const label of svg.querySelectorAll<SVGTextElement>('text')) {
          const bounds = label.getBBox();
          if (bounds.x < viewBox.x || bounds.y < viewBox.y || bounds.x + bounds.width > viewBox.x + viewBox.width || bounds.y + bounds.height > viewBox.y + viewBox.height) problems.push(`SVG text outside viewBox: ${label.textContent ?? ''}`);
          const panel = label.parentElement?.querySelector(':scope > rect');
          if (panel instanceof SVGGraphicsElement) {
            const panelBounds = panel.getBBox();
            if (bounds.x < panelBounds.x || bounds.y < panelBounds.y || bounds.x + bounds.width > panelBounds.x + panelBounds.width || bounds.y + bounds.height > panelBounds.y + panelBounds.height) problems.push(`SVG text outside panel: ${label.textContent ?? ''}`);
          }
        }
        const renderedWidth = image.getBoundingClientRect().width;
        const essentialSizes = [...svg.querySelectorAll<SVGTextElement>('[data-essential-label]')].map((label) => Number(label.getAttribute('font-size')) * renderedWidth / viewBox.width);
        svg.remove();
        return { problems, minimumRenderedEssential: Math.min(...essentialSizes) };
      });
      expect(inspection.problems).toEqual([]);
      if (inspection.minimumRenderedEssential !== null) expect(inspection.minimumRenderedEssential).toBeGreaterThanOrEqual(13);
      await testInfo.attach(`${testInfo.project.name}-${scene}`, { body: await page.screenshot(), contentType: 'image/png' });
    });
  }
});

test('real completeness restores state, rejects invalid state atomically, and keeps 44px controls', async ({ page }, testInfo) => {
  test.skip(!['fhd', 'mobile'].includes(testInfo.project.name), 'Quality behavior is scoped to requested FHD and mobile projects');

  await test.step('Given a changed valid scene state', async () => {
    await page.goto('/knowledge/real-completeness/#gap');
    await page.waitForFunction(() => window.__atlasRelated);
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', 'gap');
  });

  await test.step('When reset and restoration are applied', async () => {
    const saved = await page.evaluate(() => window.__atlasRelated.getState());
    await page.evaluate(() => window.__atlasRelated.reset());
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', 'question');
    await page.evaluate((state) => window.__atlasRelated.setState(state), saved);
    expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);
  });

  await test.step('Then invalid state is rejected without mutation and controls remain reachable', async () => {
    const atomic = await page.evaluate(() => {
      const before = window.__atlasRelated.getState();
      try {
        window.__atlasRelated.setState({ sceneId: 'missing-real-completeness-scene' });
      } catch {
        return JSON.stringify(before) === JSON.stringify(window.__atlasRelated.getState());
      }
      return false;
    });
    expect(atomic).toBe(true);

    const controls = await page.locator('.reader-menu summary,#reader-controls button').evaluateAll((elements) =>
      elements.filter((element) => element.checkVisibility()).map((element) => {
        const bounds = element.getBoundingClientRect();
        const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        return { width: bounds.width, height: bounds.height, reachable: hit === element || element.contains(hit) };
      }),
    );
    expect(controls.length).toBeGreaterThanOrEqual(3);
    for (const control of controls) {
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(control.reachable).toBe(true);
    }
  });
});
