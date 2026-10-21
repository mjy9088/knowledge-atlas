import {expect,test} from '@playwright/test';

test('authored motion supports independent seek, atomic restore and immediate navigation',async({page})=>{
  await page.goto('/knowledge/number-structures/integers/');
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.scene-motion')).toBeVisible();
  await page.evaluate(()=>window.__atlasRelated.seek(2000));
  const middle=await page.locator('.scene-motion svg').innerHTML();
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>{window.__atlasRelated.seek(3900);window.__atlasRelated.seek(2000);});
  expect(await page.locator('.scene-motion svg').innerHTML()).toBe(middle);
  const rejected=await page.evaluate(()=>{
    const api=window.__atlasRelated,before=JSON.stringify(api.getState());
    try{api.setState({...api.getState(),sceneId:'rotation',presentation:{version:1,positions:{unknown:0}}});}catch{return before===JSON.stringify(api.getState());}
    return false;
  });
  expect(rejected).toBe(true);
  const historyLength=await page.evaluate(()=>history.length);
  await page.evaluate(state=>window.__atlasRelated.setState({...state,sceneId:'rotation'}),saved);
  expect(await page.evaluate(()=>history.length)).toBe(historyLength);
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  await page.locator('.scene-motion [data-play]').click();
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/rationals\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/integers\/$/);
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.locator('.scene-motion svg').innerHTML()).toBe(middle);
  await page.locator('#reader-prev').click();
  await page.goBack();
  await expect(page.locator('.scene-motion')).toBeVisible();
});

test('reduced motion is paused and the selected scene is readable without JavaScript',async({browser,page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/knowledge/newton-to-quantum/bohr/');
  await page.waitForFunction(()=>window.__atlasRelated);
  const before=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>new Promise(resolve=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(null)));
  }));
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(before);
  const context=await browser.newContext({javaScriptEnabled:false});
  try{
    const staticPage=await context.newPage();
    await staticPage.goto('http://127.0.0.1:4190/knowledge/newton-to-quantum/bohr/');
    await expect(staticPage.locator('.reader-scene:not([hidden])')).toHaveCount(1);
    await expect(staticPage.locator('#bohr .scene-prose')).toBeVisible();
    await expect(staticPage.locator('#bohr .scene-figure img')).toBeVisible();
    await staticPage.goto('http://127.0.0.1:4190/knowledge/weekday-worlds/conditional/');
    await expect(staticPage.locator('.reader-scene:not([hidden])')).toHaveAttribute('id','conditional');
    await expect(staticPage.locator('.reader-menu a[href="/knowledge/weekday-worlds/notation/"]')).toHaveCount(1);
  }finally{await context.close();}
});
