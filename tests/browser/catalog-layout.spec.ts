import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../content/catalog.js";
import { activeWork, expectLongformScene } from "./support/main-work.js";
import { expectFrame } from "./support/frame.js";

test('knowledge index fits or scrolls naturally with accessible topic cards', async ({page}, testInfo) => {
  await page.goto('/knowledge/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  if(testInfo.project.name==='mobile'){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const card of await page.locator('a.knowledge-card').all()){await card.scrollIntoViewIfNeeded();await expect(card).toBeInViewport();}
  }else await expectFrame(page, {content: ['.knowledge-card'], controls: ['a.knowledge-card']});
});

test('home opens the knowledge catalog and links to an interactive article',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  await page.locator('a.knowledge-card[href="/knowledge/newton-to-quantum/"]').click();
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('#reader-controls')).toBeVisible();
  await expectLongformScene(page,activeWork('newton-to-quantum'),'question');
});
