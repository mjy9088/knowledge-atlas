import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../../../catalog.js";
import { expectFrame, questionFrame, weekdayFrame } from "./support.js";

const questionTopics=CONTENT_PAGES.filter(p=>p.slug==='weekday-worlds');

for(const topic of questionTopics)test(`${topic.slug}: question-led scenes fit and restore their authored state`,async({page},testInfo)=>{
  if(topic.slug==='weekday-worlds'){await page.clock.install({time:new Date('2026-10-18T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-18T00:00:00Z'));}
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
  if(topic.cover)await page.locator('#reader-next').click();
  for(const scene of topic.scenes){
    if(topic.slug==='weekday-worlds'&&scene.id==='question')await expect(page.locator('#reader-scenes')).toBeHidden();else await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const state=await page.evaluate(()=>window.__atlasRelated.getState());
    await page.evaluate(()=>window.__atlasRelated.reset());
    await page.evaluate(saved=>window.__atlasRelated.setState(saved),state);
    expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
    await test.step(scene.id,()=>expectFrame(page,topic.slug==='weekday-worlds'?weekdayFrame:questionFrame));
    if(scene===topic.scenes[0]||scene===topic.scenes.at(-1))await testInfo.attach(`${topic.slug}-${scene.id}`,{body:await page.screenshot(),contentType:'image/png'});
    if(scene!==topic.scenes.at(-1)){await page.locator('#reader-next').click();if(topic.slug==='weekday-worlds'&&scene.id==='question')await page.locator('#reader-next').click();}
  }
  if(topic.slug==='weekday-worlds')await expect(page.locator('#reader-end-links')).toHaveCount(0);else await expect(page.locator('#reader-end-links')).toBeVisible();
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('weekday choice and reflection are one page without a fixed caption or writing field',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const timer=page.getByRole('timer',{name:'남은 시간'}),answer=page.getByRole('button',{name:'수요일',exact:true});
  await expect(page.locator('#reader-scenes')).toBeHidden();expect(await page.locator('#reader-workbench').evaluate(e=>e.getBoundingClientRect().height/innerHeight)).toBeGreaterThan(.9);await expect(timer).toHaveText('20초');await expect(answer).toBeEnabled();
  await page.clock.fastForward(7_000);await expect(timer).toHaveText('13초');
  await answer.click();await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();await expect(page).toHaveURL(/\/question\/$/);
  expect((await page.evaluate(()=>window.__atlasRelated.getState())).sceneId).toBe('question');
  for(const selector of ['.weekday-intro-quote','.weekday-intro-question','.weekday-challenge-quiz'])await expect(page.locator(selector)).toBeHidden();await expect(page.getByRole('textbox')).toHaveCount(0);
  await expect(page.locator('#reader-scenes')).toBeHidden();
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(30_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','conditional');await expect(page.locator('.reader-scene:visible .eyebrow')).toHaveText('2 / 17');
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();
  await page.evaluate(state=>window.__atlasRelated.setState({...state,sceneId:'reason'}),saved);await expect(page).toHaveURL(/\/question\/$/);await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();
  await expect(page.locator('.reader-menu a[href="/knowledge/weekday-worlds/question/"]')).toHaveCount(1);await expect(page.locator('.reader-menu a[href="#reason"]')).toHaveCount(0);await expectFrame(page,weekdayFrame);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,challenge:{phase:'expired',elapsedMs:10}}} as never);}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}return false;});expect(rejected).toBe(true);
});

test('weekday expiry, explicit skip and keyboard skip reveal the same in-page question',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const question=page.getByRole('heading',{name:'어떤 기준으로 풀면 좋을까요?',exact:true});
  await page.clock.fastForward(20_000);await expect(question).toBeVisible();await expect(question).toBeFocused();await expect(page).toHaveURL(/\/question\/$/);
  await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeHidden();await expect(page.getByRole('button',{name:'설명 보기 →',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'다시 풀어보기',exact:true}).click();await expect(page.getByRole('timer')).toHaveText('20초');await page.clock.fastForward(20_000);await page.getByRole('button',{name:'설명 보기 →',exact:true}).click();await expect(page).toHaveURL(/\/conditional\/$/);
  await page.evaluate(()=>{window.__atlasRelated.setState({sceneId:'question'});window.__atlasRelated.seek(5_000);});await expect(page.getByRole('timer')).toHaveText('15초');
  const frame=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(60_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(frame);
  await page.evaluate(()=>window.__atlasRelated.reset());await page.clock.fastForward(60_000);expect((await page.evaluate(()=>window.__atlasRelated.getState())).interaction).toMatchObject({challenge:{phase:'ready',elapsedMs:0}});await page.locator('#reader-next').click();await expect(page.getByRole('timer')).toHaveText('20초');await expect(page.locator('#reader-next')).toHaveText('건너뛰기 →');await page.locator('#reader-next').click();await expect(question).toBeVisible();
  await page.evaluate(()=>window.__atlasRelated.reset());await page.locator('#reader-next').click();await page.keyboard.press('ArrowRight');await expect(question).toBeVisible();await expect(page).toHaveURL(/\/question\/$/);
  await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/\/conditional\/$/);await expectFrame(page,weekdayFrame);
});
