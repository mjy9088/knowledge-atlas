import {expect,test} from '@playwright/test';
import {sceneText} from '../../content/catalog.js';
import {activeWork,detours,expectLongformScene,mainlineSceneIds,openMainWorkScene,type MainWorkSlug} from './support/main-work.js';

const slugs=['newton-to-quantum','number-structures'] as const satisfies readonly MainWorkSlug[];

test('orbital detour displays a substantial canvas in every rendering mode',async({page})=>{
  // Given the actual optional orbital reader, not a standalone viewer harness.
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');
  await page.waitForFunction(()=>window.__atlasRelated);
  // When each supported representation is selected.
  for(const mode of ['cloud','slice','surface']){
    await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption(mode);
    const canvas=page.locator('.field-canvas');
    await canvas.scrollIntoViewIfNeeded();
    // Then both the displayed box and its drawn field remain visible at reading size.
    const geometry=await canvas.evaluate(element=>{
      if(!(element instanceof HTMLCanvasElement))throw new TypeError('Expected visible canvas');
      const bounds=element.getBoundingClientRect(),context=element.getContext('2d');
      if(!context)throw new TypeError('Missing visible canvas context');
      const {data}=context.getImageData(0,0,element.width,element.height);
      let fieldPixels=0;
      for(let i=0;i<data.length;i+=4)if(data[i]>55||data[i+1]>65||data[i+2]>75)fieldPixels++;
      return{width:bounds.width,height:bounds.height,fieldPixels};
    });
    expect(geometry.width).toBeGreaterThan(250);
    expect(geometry.height).toBeGreaterThanOrEqual(240);
    expect(geometry.fieldPixels).toBeGreaterThan(100);
  }
});

for(const slug of slugs)test(`${slug}: long-form progress, natural scrolling, restoration, and branch return follow metadata`,async({page},testInfo)=>{
  // Given current authored metadata rather than historical scene counts or IDs.
  const work=activeWork(slug),mainline=mainlineSceneIds(work),opening=mainline[0],branch=detours(work)[0];
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
  await openMainWorkScene(page,work,branch.parentSceneId);
  await page.locator(`.reader-branch-links a[href="#${branch.sceneIds[0]}"]`).click();
  await expect(page.locator('.reader-scene:visible>.reader-dialogue>.eyebrow')).toHaveText(`선택 1 / ${branch.sceneIds.length}`);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'payoff'}));await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  for(const sceneId of branch.sceneIds){await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',sceneId);await expectLongformScene(page,work,sceneId);await page.locator('#reader-next').click();}
  // Then current progress totals, source prose, native scrolling, exact restoration, and return target hold.
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',branch.returnSceneId);
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

test('customized optional orbital input preserves canonical prose when returning to the mainline',async({page})=>{
  // Given the main argument and its optional orbital chapter.
  const work=activeWork('newton-to-quantum');
  const branch=detours(work).find(chapter=>chapter.id==='orbital-laboratory');
  if(!branch)throw new TypeError('Missing orbital detour');
  await openMainWorkScene(page,work,branch.parentSceneId);
  await page.locator('.reader-scene:visible .reader-branch-links a').click();
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',branch.sceneIds[0]);
  // When the reader edits the optional scientific input and explicitly returns.
  await page.getByRole('combobox',{name:'핵전하 Z',exact:true}).selectOption('2');
  const sourceScene=work.page.scenes.find(scene=>scene.id===branch.sceneIds[0]);
  if(!sourceScene)throw new TypeError('Missing orbital source scene');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText(sceneText(work.article,sourceScene));
  const edited=await page.evaluate(()=>window.__atlasRelated.getState().interaction);
  await page.locator('.reader-scene:visible .reader-branch-links a').click();
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',branch.returnSceneId);
  // Then the inactive adapter cannot replace the mainline's complete manuscript.
  await expectLongformScene(page,work,branch.returnSceneId);
  await expect(page.locator('#reader-workbench')).toBeHidden();
  expect(await page.evaluate(()=>window.__atlasRelated.getState().interaction)).toEqual(edited);
});
