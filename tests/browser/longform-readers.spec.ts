import { expect, test } from "@playwright/test";
import { sceneText } from "../../content/catalog.js";
import { activeWork, skippableSections, expectLongformScene, readingSceneIds, sectionBounds, openMainWorkScene, type MainWorkSlug } from "./support/main-work.js";

const slugs=['newton-to-quantum','number-structures'] as const satisfies readonly MainWorkSlug[];

for(const slug of slugs)test(`${slug}: long-form progress, natural scrolling, restoration, and section continuation follow metadata`,async({page},testInfo)=>{
  // Given current authored metadata rather than historical scene counts or IDs.
  const work=activeWork(slug),mainline=readingSceneIds(work),opening=mainline[0],branch=skippableSections(work)[0];
  if(!opening||!branch)throw new TypeError(`Incomplete navigation metadata: ${slug}`);
  const longScene=work.page.scenes.filter(scene=>mainline.includes(scene.id)).reduce((longest,scene)=>sceneText(work.article,scene).length>sceneText(work.article,longest).length?scene:longest);
  await openMainWorkScene(page,work,opening);
  await expect(page.locator('.reader-scene:visible>.reader-dialogue>.eyebrow')).toHaveText(`본문 1 / ${mainline.length}`);
  await expectLongformScene(page,work,opening);
  // When a long mainline scene scrolls natively and the first declared detour is traversed.
  await openMainWorkScene(page,work,longScene.id);
  const beforeSpace=await page.evaluate(()=>window.__atlasRelated.getState()),canScroll=await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight);
  await page.evaluate(()=>scrollTo(0,0));await page.keyboard.press('Space');
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(beforeSpace);
  if(canScroll)await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);else expect(await page.evaluate(()=>scrollY)).toBe(0);
  await testInfo.attach(`${slug}-long-scene`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  const bounds=sectionBounds(work,branch);
  await openMainWorkScene(page,work,bounds.before);
  await page.locator('#reader-next').click();
  await expect(page.locator('.reader-scene:visible>.reader-dialogue>.eyebrow')).toHaveText(`본문 ${mainline.indexOf(branch.sceneIds[0])+1} / ${mainline.length}`);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'payoff'}));await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  for(const sceneId of branch.sceneIds){await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',sceneId);await expectLongformScene(page,work,sceneId);await page.locator('#reader-next').click();}
  // Then current progress totals, source prose, native scrolling, exact restoration, and return target hold.
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',bounds.after);
});

test('bounded readers keep Space navigation from their cover into the explanation',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.related-reader')).toHaveAttribute('data-presentation','bounded');
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).overflowY)).toBe('hidden');
  expect((await page.evaluate(()=>window.__atlasRelated.getState())).cover).toBe(true);
  await page.keyboard.press('Space');
  expect((await page.evaluate(()=>window.__atlasRelated.getState())).cover).toBe(false);
  await expect(page.locator('.reader-cover')).toBeHidden();
});
