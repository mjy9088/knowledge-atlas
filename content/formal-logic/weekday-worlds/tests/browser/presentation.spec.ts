import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../../../catalog.js";
import { activeWork, readingSceneIds } from "../../../../../tests/browser/support/main-work.js";
import { expectFrame, weekdayFrame, weekdayInputs, weekdayReasoning, weekdayView } from "./support.js";

test('weekday Next keeps the same bounds on title, every scene, both modes and final links',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  const baseline=await page.locator('#reader-next').boundingBox();expect(baseline).not.toBeNull();
  expect(await page.locator('#reader-next').evaluate(button=>{const range=document.createRange();range.selectNodeContents(button);return range.getClientRects().length;})).toBe(1);
  const menuBox=await page.locator('.reader-menu summary').boundingBox();expect(baseline!.y-menuBox!.y-menuBox!.height).toBeLessThanOrEqual(40);
  async function stable(){const box=await page.locator('#reader-next').boundingBox();expect(box).not.toBeNull();for(const key of ['x','y','width','height'] as const)expect(Math.abs(box![key]-baseline![key]),key).toBeLessThan(.1);}
  await page.locator('#reader-next').click();
  for(const scene of CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    for(const mode of ['달력','양상']){await weekdayView(page,mode);await stable();await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await stable();await expectFrame(page,weekdayFrame);}
  }
  await expect(page.locator('#reader-end-links,#reader-skip-scope')).toHaveCount(0);await expectFrame(page,{content:['.reader-action-rail'],controls:['#reader-prev','#reader-next']});
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await stable();await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await stable();await testInfo.attach('weekday-fixed-next-final',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday actions stay compact with menu links and tooltip-only keyboard help; other readers keep their navigation',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/question/');await page.waitForFunction(()=>window.__atlasRelated);
  const hint=page.locator('#reader-skip-scope'),links=page.locator('#reader-end-links'),next=page.locator('#reader-next'),prev=page.locator('#reader-prev'),menu=page.locator('.reader-menu summary');
  await expect(hint).toHaveCount(0);await expect(links).toHaveCount(0);
  await expect(next).toHaveAttribute('title','→ 방향키 · Space / Enter: 다음');await expect(prev).toHaveAttribute('title','← 방향키: 이전 장면');
  const a=await menu.boundingBox(),b=await prev.boundingBox(),c=await next.boundingBox(),scale=await page.evaluate(()=>Number(document.documentElement.dataset.desktopScale??1));if(!a||!b||!c)throw new TypeError('Expected visible weekday actions');expect(b.y).toBeGreaterThanOrEqual(a.y+a.height);expect((b.y-a.y-a.height)/scale).toBeLessThanOrEqual(5);expect(c.y).toBe(b.y);expect(c.x).toBeGreaterThanOrEqual(b.x+b.width);expect((c.x-b.x-b.width)/scale).toBeLessThanOrEqual(5);
  for(const action of [a,b,c]){expect(action.width).toBeGreaterThanOrEqual(44);expect(action.height).toBeGreaterThanOrEqual(44);}
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion'}));await expect(page.locator('.weekday-source')).toContainText('만약');
  const hiddenAlignment=await page.locator('.alignment-status').evaluate(e=>{const scale=Number(document.documentElement.dataset.desktopScale??1),bounds=e.getBoundingClientRect();return{width:bounds.width/scale,height:bounds.height/scale,clip:getComputedStyle(e).clipPath};});expect(hiddenAlignment.width).toBeCloseTo(1,3);expect(hiddenAlignment.height).toBeCloseTo(1,3);expect(hiddenAlignment.clip).toBe('inset(50%)');await expect(page.locator('.weekday-sentence [data-alignment-node][title],.weekday-context-select[title],.weekday-logic-diagram [data-alignment-node][title]')).toHaveCount(0);
  const term=page.locator('.weekday-symbol-clause [data-alignment-node="yesterday-base"]');await term.hover();await expect(page.locator('.weekday-source [data-alignment-node="yesterday-base"]')).toHaveAttribute('data-alignment-current','');
  const snapshot=await page.evaluate(()=>window.__atlasRelated.getState());await page.keyboard.press('ArrowRight');await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','modal-rules');
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'conclusion'}));await expect(hint).toHaveCount(0);await expect(links).toHaveCount(0);
  await menu.click();await expect(page.locator('.reader-menu a[href="/knowledge/"]')).toBeVisible();await expect(page.locator('.reader-menu a[href="#evidence"]')).toHaveCount(1);
  await page.locator('.reader-menu a[href="#evidence"]').click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');await page.keyboard.press('Escape');
  await page.evaluate(state=>window.__atlasRelated.setState(state),snapshot);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-compact-actions',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('.reader-menu').evaluate(e=>(e as HTMLDetailsElement).open=true);await page.locator('.reader-menu a[href="/knowledge/"]').click();await expect(page).toHaveURL(/\/knowledge\/$/);
  await page.goto('/knowledge/number-structures/question/');await page.waitForFunction(()=>window.__atlasRelated);
  const finalMainline=readingSceneIds(activeWork('number-structures')).at(-1);if(!finalMainline)throw new TypeError('Missing number-structures mainline');
  await expect(hint).toBeVisible();await expect(links).toBeHidden();
  await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),finalMainline);await expect(links).toBeVisible();await expect(links.locator('a')).toHaveText(['지식 목록 ↗','근거와 범위']);
});

test('weekday title slide, simultaneous original/symbol panels, named worlds and scrollable choices restore independently',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.reader-cover h1')).toBeVisible();await expect(page.locator('#reader-workbench')).toBeHidden();expect(await page.evaluate(()=>window.__atlasRelated.getState().cover)).toBe(true);
  const titleState=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(page.locator('.reader-cover h1')).toBeHidden();await weekdayInputs(page);
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeHidden();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion'}));
  await expect(page.locator('.weekday-source')).toBeVisible();await expect(page.locator('.weekday-symbolic-summary')).toBeVisible();await expect(page.locator('.weekday-source')).toContainText('가정 1');await expect(page.locator('.weekday-source')).not.toContainText('w₁');await expect(page.locator('.weekday-symbolic-summary')).toContainText('w₁');
  const settings=page.locator('.weekday-settings');await expect(settings).toHaveCSS('overflow-y','auto');await expect(settings).toHaveCSS('background-color','rgb(255, 255, 255)');await expect(settings.getByRole('heading',{name:'선택'})).toBeVisible();
  for(const control of await settings.locator('button,select').all()){
    if(await control.isDisabled())continue;await control.scrollIntoViewIfNeeded();
    const reachable=await control.evaluate(e=>{const r=e.getBoundingClientRect(),s=e.closest('.weekday-settings')!.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.top>=s.top&&r.bottom<=s.bottom&&Boolean(hit&&(e.contains(hit)||hit.contains(e)));});expect(reachable).toBe(true);
  }
  await settings.evaluate(e=>e.scrollTop=0);await weekdayView(page,'양상');await expect(page.locator('.weekday-symbolic-summary')).toContainText('P: 이 세계의 오늘은 금요일');await weekdayReasoning(page);await expect(page.locator('.weekday-modal-diagram')).toBeVisible();await expect(page.locator('.weekday-modal-diagram svg')).toHaveAttribute('aria-label',/현실 → 가정 1/);
  await weekdayInputs(page);await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-world-dialog select')).toHaveCount(0);await expect(page.getByRole('checkbox',{name:'현실 → 가정 1',exact:true})).toBeVisible();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  const readingState=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await expect(page.locator('.reader-cover h1')).toBeVisible();await page.evaluate(saved=>window.__atlasRelated.setState(saved),readingState);await expect(page.locator('.reader-cover h1')).toBeHidden();await weekdayInputs(page);await expect(page.locator('.weekday-experiment')).toHaveAttribute('data-logic-mode','alethic');
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,cover:'invalid'} as never);}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}return false;});expect(rejected).toBe(true);
  await page.evaluate(saved=>window.__atlasRelated.setState(saved),titleState);await expect(page.locator('.reader-cover h1')).toBeVisible();await page.goto('/knowledge/weekday-worlds/sunday/');await expect(page.locator('.reader-cover h1')).toBeHidden();await expect(page.locator('.reader-scene:visible h2')).toContainText('일요일');await weekdayInputs(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-stacked-reading',{body:await page.screenshot(),contentType:'image/png'});
});

test('skip controls appear only for a distinct jump and disclose scope and destination',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/question/');await page.waitForFunction(()=>window.__atlasRelated);
  for(const scene of CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    if(scene.skip)await expect(page.locator('#reader-skip')).toBeVisible();else await expect(page.locator('#reader-skip')).toBeHidden();await expect(page.locator('.reader-scene:visible .skip-context')).toBeHidden();
  }
});

test('weekday direct links preserve both nonmodal and alethic views in narrow windows',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});const topic=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!;
  for(const scene of topic.scenes){await page.goto(`/knowledge/${topic.slug}/${scene.id}/`);await page.waitForFunction(()=>window.__atlasRelated);if(scene.id==='question')await expect(page.locator('#reader-scenes')).toBeHidden();else await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);await expectFrame(page,weekdayFrame);
    for(const mode of ['달력','양상']){await weekdayInputs(page);await weekdayView(page,mode);await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);}
    if(scene.id==='wednesday')await testInfo.attach('weekday-narrow-alethic',{body:await page.screenshot(),contentType:'image/png'});
  }
});
