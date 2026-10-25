import { expect, test } from '@playwright/test';
import montyPage from '../../page.js';

const scenes = montyPage.scenes.map(scene => scene.id);

test('monty-hall: every scene keeps prose, cases and navigation readable and reachable', async ({ page }, testInfo) => {
  for (const scene of scenes) {
    await page.goto(`/knowledge/monty-hall/${scene}/`);
    await page.waitForFunction(() => window.__atlasRelated);
    await page.evaluate(() => document.fonts.ready);
    const active = page.locator('.reader-scene:not([hidden])');
    await expect(active.locator('.scene-prose')).toBeVisible();
    if (scene !== 'protocol' && scene !== 'shortened' && scene !== 'close' && !scene.startsWith('specific')) {
      const order = await page.evaluate(() => {
        const prose = document.querySelector('.reader-scene:not([hidden]) .reader-dialogue')!;
        const experiment = document.querySelector('#reader-workbench')!;
        return {
          dom: Boolean(prose.compareDocumentPosition(experiment) & Node.DOCUMENT_POSITION_FOLLOWING),
          visual: prose.getBoundingClientRect().right <= experiment.getBoundingClientRect().left + 1 || prose.getBoundingClientRect().bottom <= experiment.getBoundingClientRect().top + 1,
        };
      });
      expect(order).toEqual({dom: true, visual: true});
    }
    expect(await active.evaluate(element => {
      const prose = element.querySelector('.reader-dialogue')!;
      const diagram = element.querySelector('.concept-diagram')!;
      return Boolean(prose.compareDocumentPosition(diagram) & Node.DOCUMENT_POSITION_FOLLOWING);
    })).toBe(true);
    const bounds = await page.evaluate(() => {
      const visible = Array.from(document.querySelectorAll<HTMLElement>('.reader-scene:not([hidden]) .scene-prose, .reader-scene:not([hidden]) .scene-figure, .monty-story, .monty-doors, .monty-tree, .monty-tree-level, .monty-tree-path, .monty-sampler, .monty-sample-card, .monty-sample-controls, .lab-ledger, .lab-inputs, .lab-normalization'))
        .filter(element => element.getClientRects().length > 0);
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        elements: visible.map(element => ({className: element.className, width: element.clientWidth, scrollWidth: element.scrollWidth, height: element.clientHeight, scrollHeight: element.scrollHeight})),
      };
    });
    expect(bounds.documentWidth).toBeLessThanOrEqual(bounds.viewportWidth + 1);
    if (scene !== 'experiment') {
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual((page.viewportSize()?.height ?? 0) + 1);
    }
    for (const element of bounds.elements) {
      expect(element.scrollWidth, element.className).toBeLessThanOrEqual(element.width + 1);
      expect(element.scrollHeight, element.className).toBeLessThanOrEqual(element.height + 1);
    }
    for (const id of ['#reader-prev', '#reader-next']) {
      const control = page.locator(id);
      if (!(await control.isVisible())) continue;
      await control.scrollIntoViewIfNeeded();
      const reachable = await control.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return Boolean(hit && element.contains(hit));
      });
      expect(reachable, `${scene} ${id}`).toBe(true);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await testInfo.attach(`monty-${scene}-${testInfo.project.name}`, {body: await page.screenshot({fullPage: true}), contentType: 'image/png'});
  }
});

test('monty-hall: reduced-motion calculation stays immediately available and restores a saved intermediate stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/knowledge/monty-hall/experiment/');
  await page.waitForFunction(() => window.__atlasRelated);
  await expect(page.locator('.lab-equation')).toContainText('4 ÷ 6 = 2/3');
  await page.getByRole('button', {name: '계산 펼쳐 보기', exact: true}).click();
  await expect(page.locator('.lab-ledger')).toHaveAttribute('data-stage', '3');
  const saved = await page.evaluate(() => window.__atlasRelated.getState());
  await page.evaluate(state => window.__atlasRelated.setState({...state, interaction: {...state.interaction, stage: 1}}), saved);
  await expect(page.locator('.lab-ledger')).toHaveAttribute('data-stage', '1');
  await expect(page.locator('.lab-prior').first()).toHaveText('2칸');
  await page.evaluate(state => window.__atlasRelated.setState(state), saved);
  await expect(page.locator('.lab-equation')).toContainText('4 ÷ 6 = 2/3');
});
