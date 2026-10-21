import {expect,test} from '@playwright/test';
import {activeWork,detours,expectLongformScene,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('number-structures');

test('number-structure detours use inline chapter entry, native history, and declared returns',async({page})=>{
  // Given every detour declared by the current number-structure metadata.
  for(const detour of detours(work)){
    await test.step(detour.id,async()=>{
      await openMainWorkScene(page,work,detour.parentSceneId);
    const entry=page.locator(`.reader-branch-links a[href$="/${detour.sceneIds[0]}/"]`);
      await expect(entry).toBeVisible();
      // When an inline branch link is followed, traversed by native history, and explicitly returned.
      await entry.click();
    await expect(page).toHaveURL(new RegExp(`/${detour.sceneIds[0]}/$`));
      await expectLongformScene(page,work,detour.sceneIds[0]??'');
      await page.goBack();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',detour.parentSceneId);
      await page.goForward();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',detour.sceneIds[0]??'');
    await page.locator(`.reader-scene:visible .reader-branch-links a[href$="/${detour.returnSceneId}/"]`).click();
      // Then the authored parent, first detour scene, and return target—not retired route chains—own navigation.
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',detour.returnSceneId);
    });
  }
});
