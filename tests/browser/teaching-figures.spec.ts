import {expect,test} from '@playwright/test';
import {activeWork,expectLongformScene,openMainWorkScene,type MainWorkSlug} from './support/main-work.js';

const slugs=['newton-to-quantum','number-structures'] as const satisfies readonly MainWorkSlug[];

for(const slug of slugs)test(`${slug}: every owned teaching figure loads with canonical lead content`,async({page})=>{
  // Given every current scene whose metadata owns a teaching figure.
  const work=activeWork(slug),figureScenes=work.page.scenes.filter(scene=>scene.figure);
  expect(figureScenes.length).toBeGreaterThan(0);
  // When each figure scene is opened from the built active work.
  for(const scene of figureScenes){
    await test.step(scene.id,async()=>{
      await openMainWorkScene(page,work,scene.id);
      await expectLongformScene(page,work,scene.id);
      const image=page.locator('.reader-scene:visible .scene-figure img');
      const source=await (await page.request.get(scene.figure?.src??'')).text();
      // Then the current source asset, canonical prose, metadata alt/caption, and proportional image are real.
      expect(source).toContain('<svg');
      const ratios=await image.evaluate(node=>{if(!(node instanceof HTMLImageElement))throw new TypeError('Expected teaching image');const bounds=node.getBoundingClientRect();return{rendered:bounds.width/bounds.height,intrinsic:node.naturalWidth/node.naturalHeight};});
      expect(Math.abs(ratios.rendered-ratios.intrinsic)).toBeLessThan(0.02);
    });
  }
});
