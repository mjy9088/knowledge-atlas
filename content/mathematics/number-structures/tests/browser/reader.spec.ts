import { expect, test } from "@playwright/test";
import { activeWork, expectLongformScene, readingSceneIds } from "../../../../../tests/browser/support/main-work.js";

test('number-structures: every authored scene has complete long-form source and reachable controls', async ({page}) => {
  const work=activeWork('number-structures');await page.goto('/knowledge/number-structures/');await page.waitForFunction(()=>window.__atlasRelated);
  for(const scene of work.page.scenes){await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);await test.step(scene.id,()=>expectLongformScene(page,work,scene.id));}
  const finalMainline=readingSceneIds(work).at(-1);if(!finalMainline)throw new TypeError('Missing number-structures mainline');
  await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),finalMainline);
  await expect(page.locator('#reader-end-links')).toBeVisible();
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});
