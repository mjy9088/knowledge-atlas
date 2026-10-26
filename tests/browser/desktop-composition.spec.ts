import {expect,test,type Page} from '@playwright/test';

const BASE_VIEWPORT={width:960,height:540} as const;
const LARGE_VIEWPORT={width:1920,height:940} as const;
const TARGETS=['.weekday-input-panel','.weekday-reasoning-panel','.reader-action-rail','#reader-next'] as const;

type Rectangle=Readonly<{x:number;y:number;width:number;height:number}>;

async function rectangles(page:Page):Promise<readonly Rectangle[]>{
  return page.locator(TARGETS.join(',')).evaluateAll(nodes=>nodes.map(node=>{
    const bounds=node.getBoundingClientRect();
    return{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height};
  }));
}

async function rectangle(page:Page,selector:string):Promise<Rectangle>{
  const bounds=await page.locator(selector).boundingBox();
  if(!bounds)throw new TypeError(`Missing rectangle for ${selector}`);
  return bounds;
}

test('fitted catalog keeps logical media columns while resizing between large viewports',async({page},testInfo)=>{
  test.skip(testInfo.project.name==='mobile','Desktop resize contract');
  // Given a fitted viewport whose physical width does not match the wide catalog query.
  await page.setViewportSize({width:1000,height:800});
  await page.goto('/knowledge/');
  const columns=page.locator('.knowledge-grid');
  await expect(columns).toBeVisible();
  expect((await columns.evaluate(node=>getComputedStyle(node).gridTemplateColumns)).split(' ')).toHaveLength(2);

  // When the same fitted session grows beyond the physical media-query threshold.
  await page.setViewportSize(LARGE_VIEWPORT);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

  // Then the logical 960px composition retains its two-column catalog.
  expect((await columns.evaluate(node=>getComputedStyle(node).gridTemplateColumns)).split(' ')).toHaveLength(2);

  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  expect(await page.evaluate(()=>document.documentElement.dataset.desktopScale)).toBeUndefined();
  expect((await columns.evaluate(node=>getComputedStyle(node).gridTemplateColumns)).split(' ')).toHaveLength(1);

  await page.setViewportSize(LARGE_VIEWPORT);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  expect((await columns.evaluate(node=>getComputedStyle(node).gridTemplateColumns)).split(' ')).toHaveLength(2);
});

test('base composition applies when one desktop dimension exceeds the baseline',async({page})=>{
  for(const viewport of [{width:1920,height:540},{width:960,height:1080}]){
    await page.setViewportSize(viewport);
    await page.goto('/knowledge/');
    const geometry=await page.evaluate(()=>{const bounds=document.body.getBoundingClientRect();return{scale:document.documentElement.dataset.desktopScale,x:bounds.x,width:bounds.width};});
    expect(geometry.scale).toBe('1');
    expect(geometry.width).toBe(960);
    expect(geometry.x).toBe((viewport.width-960)/2);
  }
});

test('top layers stay inside the logical frame at scale-one letterbox boundaries',async({page},testInfo)=>{
  test.skip(testInfo.project.name==='mobile','Desktop top-layer contract');
  await page.setViewportSize(BASE_VIEWPORT);
  await page.goto('/knowledge/weekday-worlds/modal-expansion/');
  await page.waitForFunction(()=>window.__atlasRelated);
  await page.evaluate(()=>{const popover=document.createElement('div');popover.id='boundary-popover';popover.popover='manual';popover.style.cssText='width:120px;height:60px;padding:0;border:0';document.body.append(popover);popover.showPopover();});
  const baselinePopover=await rectangle(page,'#boundary-popover');
  await page.screenshot({path:'test-results/public/desktop-fit-top-layer-960x540.png'});
  for(const viewport of [{width:960,height:1080},{width:1920,height:540}]){
    await page.setViewportSize(viewport);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const bounds=await rectangle(page,'#boundary-popover');
    expect(bounds).toEqual({...baselinePopover,x:baselinePopover.x+(viewport.width-960)/2});
    await page.screenshot({path:`test-results/public/desktop-fit-top-layer-${viewport.width}x${viewport.height}.png`});
  }
  await page.locator('#boundary-popover').evaluate(node=>node.remove());

  await page.setViewportSize(BASE_VIEWPORT);
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();
  const baselineDialog=await rectangle(page,'.weekday-world-dialog');
  for(const viewport of [{width:960,height:1080},{width:1920,height:540}]){
    await page.setViewportSize(viewport);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const bounds=await rectangle(page,'.weekday-world-dialog');
    expect(bounds).toEqual({...baselineDialog,x:baselineDialog.x+(viewport.width-960)/2});
  }
});

test('open anchored popover closes and restores native focus across viewport modes',async({page},testInfo)=>{
  test.skip(testInfo.project.name==='mobile','Desktop-to-mobile resize contract');
  await page.setViewportSize(BASE_VIEWPORT);
  await page.goto('/knowledge/weekday-worlds/modal-expansion/');
  await page.waitForFunction(()=>window.__atlasRelated);
  const trigger=page.locator('.weekday-target-trigger'),select=page.locator('.weekday-target-select'),popover=page.getByRole('listbox',{name:'문장 속 목표 요일',exact:true});
  for(const viewport of [LARGE_VIEWPORT,{width:1000,height:800},{width:390,height:844}]){
    await trigger.click();
    await expect(popover).toBeVisible();
    if(viewport===LARGE_VIEWPORT)await page.screenshot({path:'test-results/public/desktop-fit-inline-popover-before-resize-960x540.png'});
    await page.setViewportSize(viewport);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await expect(popover).toBeHidden();
    await expect(select).toBeFocused();
    if(viewport===LARGE_VIEWPORT)await page.screenshot({path:'test-results/public/desktop-fit-inline-popover-after-resize-1920x940.png'});
  }
  await trigger.click();
  await page.screenshot({path:'test-results/public/desktop-fit-inline-popover-mobile-390x844.png'});
  const option=popover.getByRole('option',{name:'월요일',exact:true}),value=await option.getAttribute('data-value');
  if(value===null)throw new TypeError('Missing inline option value');
  await option.click();
  await expect(select).toHaveValue(value);
  await expect(popover).toBeHidden();
});

test('larger desktop uniformly fits the 960 by 540 composition and keeps controls clickable',async({page})=>{
  // Given the bounded reader rendered at its authored desktop composition.
  await page.setViewportSize(BASE_VIEWPORT);
  await page.goto('/knowledge/weekday-worlds/modal-expansion/');
  await page.waitForFunction(()=>window.__atlasRelated);
  const baseline=await rectangles(page);
  const baselineFont=await page.locator('.weekday-context-select').first().evaluate(node=>getComputedStyle(node).fontSize);
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();
  const dialog=page.locator('.weekday-world-dialog');
  await expect(dialog).toBeVisible();
  const baselineDialog=await rectangle(page,'.weekday-world-dialog');
  await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await page.locator('.weekday-target-trigger').click();
  const inlinePopover=page.getByRole('listbox',{name:'문장 속 목표 요일',exact:true});
  await expect(inlinePopover).toBeVisible();
  const baselineInlinePopover=await rectangle(page,'.inline-select-popup:popover-open');
  await page.keyboard.press('Escape');
  await page.evaluate(()=>{const popover=document.createElement('div');popover.id='fit-popover';popover.popover='manual';popover.style.cssText='width:120px;height:60px;padding:0;border:0';document.body.append(popover);popover.showPopover();});
  const baselinePopover=await rectangle(page,'#fit-popover');

  // When the browser grows to the large desktop baseline.
  await page.setViewportSize(LARGE_VIEWPORT);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

  // Then every measured edge uses one fit scale, centered with horizontal letterboxing.
  const scale=Math.min(LARGE_VIEWPORT.width/BASE_VIEWPORT.width,LARGE_VIEWPORT.height/BASE_VIEWPORT.height);
  const inset=(LARGE_VIEWPORT.width-BASE_VIEWPORT.width*scale)/2;
  const enlarged=await rectangles(page);
  expect(enlarged).toHaveLength(baseline.length);
  for(const [index,bounds] of enlarged.entries()){
    const source=baseline[index];
    if(!source)throw new TypeError('Missing baseline rectangle');
    expect(bounds.x).toBeCloseTo(inset+source.x*scale,0);
    expect(bounds.y).toBeCloseTo(source.y*scale,0);
    expect(bounds.width).toBeCloseTo(source.width*scale,0);
    expect(bounds.height).toBeCloseTo(source.height*scale,0);
  }
  expect(await page.locator('.weekday-context-select').first().evaluate(node=>getComputedStyle(node).fontSize)).toBe(baselineFont);

  const enlargedPopover=await rectangle(page,'#fit-popover');
  for(const key of ['x','y','width','height'] as const){
    const expected=key==='x'?inset+baselinePopover[key]*scale:baselinePopover[key]*scale;
    expect(enlargedPopover[key]).toBeCloseTo(expected,0);
  }
  await page.locator('#fit-popover').evaluate(node=>node.remove());

  await page.locator('.weekday-target-trigger').click();
  await expect(inlinePopover).toBeVisible();
  const enlargedInlinePopover=await rectangle(page,'.inline-select-popup:popover-open');
  for(const key of ['x','y'] as const){
    const expected=key==='x'?inset+baselineInlinePopover[key]*scale:baselineInlinePopover[key]*scale;
    expect(enlargedInlinePopover[key],key).toBeCloseTo(expected,0);
  }
  expect(enlargedInlinePopover.width/baselineInlinePopover.width).toBeCloseTo(scale,1);
  expect(enlargedInlinePopover.height/baselineInlinePopover.height).toBeCloseTo(scale,1);
  await page.keyboard.press('Escape');

  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();
  await expect(dialog).toBeVisible();
  const dialogBounds=await rectangle(page,'.weekday-world-dialog');
  expect(dialogBounds.width/baselineDialog.width).toBeCloseTo(scale,3);
  expect(dialogBounds.height/baselineDialog.height).toBeCloseTo(scale,1);
  expect(dialogBounds.x+dialogBounds.width/2).toBeCloseTo(inset+(baselineDialog.x+baselineDialog.width/2)*scale,0);
  expect(dialogBounds.y+dialogBounds.height/2).toBeCloseTo((baselineDialog.y+baselineDialog.height/2)*scale,0);
  await page.getByRole('button',{name:'설정 닫기',exact:true}).click();

  await page.getByRole('button',{name:'세계 추가',exact:true}).click();
  expect(await page.evaluate(()=>{const state=window.__atlasRelated.getState().interaction;return state&&'worlds'in state?state.worlds.map(world=>world.id):[];})).toEqual([0,1,2]);
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();
  await expect(dialog).toBeVisible();
  await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await expect(dialog).toBeHidden();
});
