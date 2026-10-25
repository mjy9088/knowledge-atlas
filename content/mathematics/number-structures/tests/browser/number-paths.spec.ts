import {expect,test} from '@playwright/test';
import {activeWork,skippableSections,sectionBounds,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('number-structures');

test('number sections are included normally and explicit skips preserve history and reverse traversal',async({page})=>{
  for(const section of skippableSections(work)){
    await test.step(section.id,async()=>{
      const bounds=sectionBounds(work,section);
      await openMainWorkScene(page,work,bounds.before);
      await page.locator('#reader-next').click();
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',section.sceneIds[0]);
      await page.goBack();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',bounds.before);
      await page.goForward();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',section.sceneIds[0]);
      await page.locator('#reader-skip').click();
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',bounds.after);
      await page.locator('#reader-prev').click();
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',section.sceneIds.at(-1)!);
    });
  }
});
