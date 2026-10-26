import {test,expect} from '@playwright/test';

for(const route of ['/knowledge/weekday-worlds/#modal-expansion','/knowledge/weekday-worlds/modal-expansion/','/knowledge/monty-hall/#sampling']){
  test(`cold entry displays only the initialized requested scene: ${route}`,async({page},testInfo)=>{
    let release!:()=>void;
    const gate=new Promise<void>(resolve=>{release=resolve;});
    await page.route('**/pages/article/controller.js',async request=>{await gate;await request.continue();});
    await page.addInitScript(()=>{
      const frames:{ready:boolean;scene:string|undefined;cover:string|undefined}[]=[];
      Object.assign(window,{readerFrames:frames});
      const sample=()=>{const root=document.querySelector<HTMLElement>('[data-page]');if(root&&root.getBoundingClientRect().height)frames.push({ready:Boolean(window.__atlasRelated),scene:document.querySelector<HTMLElement>('.reader-scene:not([hidden])')?.id,cover:root.dataset.cover});requestAnimationFrame(sample);};requestAnimationFrame(sample);
    });
    await page.goto(route,{waitUntil:'commit'});
    await expect(page.locator('#reader-document')).toHaveCount(1);
    // Delayed modules must never expose a temporary source layout or first scene.
    await expect(page.locator('[data-page]')).toHaveCount(0);
    release();await page.waitForFunction(()=>window.__atlasRelated);
    const scene=route.includes('monty-hall')?'sampling':'modal-expansion';
    await expect(page).toHaveURL(new RegExp(`/knowledge/${route.includes('monty-hall')?'monty-hall':'weekday-worlds'}/${scene}/$`));
    await expect(page.locator(`#${scene}`)).toBeVisible();
    await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
    const frames=await page.evaluate(()=>Reflect.get(window,'readerFrames') as {ready:boolean;scene:string;cover:string|undefined}[]);
    expect(frames.length).toBeGreaterThan(0);expect(frames.every(frame=>frame.ready&&frame.scene===scene&&frame.cover!=='true')).toBe(true);
    await testInfo.attach('initialized-entry',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  });
}

test('path scene survives a panel fragment and browser traversal preserves reader input',async({page})=>{
  await page.goto('/knowledge/monty-hall/sampling/#evidence');await page.waitForFunction(()=>window.__atlasRelated);
  expect(await page.evaluate(()=>window.__atlasRelated.getState().sceneId)).toBe('sampling');
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.getByRole('button',{name:'닫기 ×',exact:true}).click();
  await page.getByRole('button',{name:'+100회',exact:true}).click();
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('#reader-next').click();
  await page.goBack();
  await expect.poll(()=>page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
});

test('failed controller loading recovers the source document and directory navigation',async({page})=>{
  await page.route('**/pages/article/controller.js',request=>request.abort());
  await page.goto('/knowledge/monty-hall/sampling/');
  await expect(page.getByRole('alert')).toContainText('실험을 불러오지 못했습니다');
  await expect(page.locator('#sampling')).toBeVisible();
  await expect(page.locator('#sampling .reader-static-navigation')).toBeVisible();
  await expect(page.locator('#sampling .reader-static-navigation a').first()).toHaveAttribute('href',/^\/knowledge\/monty-hall\/[a-z-]+\/$/);
});

test('repeated back and forward restores scene and cover without adding history entries',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  const length=await page.evaluate(()=>history.length);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/question\/$/);
  await page.goBack();await expect(page.locator('.reader-cover')).toBeVisible();
  await page.goForward();await expect(page.locator('.weekday-intro-question')).toBeVisible();
  await page.goBack();await expect(page.locator('.reader-cover')).toBeVisible();
  await page.goForward();await expect(page.locator('.weekday-intro-question')).toBeVisible();
  expect(await page.evaluate(()=>history.length)).toBe(length+1);
  await page.locator('.reader-menu summary').click();
  await page.getByRole('link',{name:'제목',exact:true}).click();
  await expect(page.locator('.reader-cover')).toBeVisible();
  await expect(page).toHaveURL(/\/weekday-worlds\/$/);
});

test('without JavaScript the requested scene, global navigation and adjacent links remain accessible',async({browser,page})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:page.viewportSize()});
  const reader=await context.newPage();
  await reader.goto('http://127.0.0.1:4190/knowledge/monty-hall/sampling/');
  await expect(reader.getByRole('link',{name:'지식 목록',exact:true}).first()).toBeVisible();
  await expect(reader.locator('#sampling')).toBeVisible();
  await expect(reader.locator('[data-page]')).toHaveCount(1);
  await expect(reader.locator('#sampling .reader-static-navigation')).toBeVisible();
  const next=reader.locator('#sampling .reader-static-navigation a[href="/knowledge/monty-hall/experiment/"]');
  await next.click();await expect(reader.locator('#experiment')).toBeVisible();
  await context.close();
});
