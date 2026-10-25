import { expect, test } from "@playwright/test";
import { activeWork, expectLongformScene, readingSceneIds } from "./support/main-work.js";

test('an article can read and restore scenes without installing an experiment adapter',async({page})=>{
  const work=activeWork('number-structures'),mainline=readingSceneIds(work),nextScene=mainline[1];if(!nextScene)throw new TypeError('Missing second number-structures mainline scene');
  await page.goto('/knowledge/number-structures/');await page.waitForFunction(()=>window.__atlasRelated);await expectLongformScene(page,work,mainline[0]??'question');
  const initial=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('#reader-next').click();
  const state=await page.evaluate(()=>window.__atlasRelated.getState());
  expect(state).toEqual({...initial,sceneId:nextScene});
  await page.evaluate(()=>window.__atlasRelated.reset());
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',mainline[0]??'question');
  await page.evaluate(state=>window.__atlasRelated.setState(state),state);
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',nextScene);
});
