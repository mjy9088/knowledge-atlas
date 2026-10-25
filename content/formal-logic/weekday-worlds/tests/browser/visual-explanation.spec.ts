import {expect,test} from '@playwright/test';
import {expectFrame,weekdayFrame} from './support.js';

test('calendar equality joins the correct date roles for every target and both interpretations',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#sunday');await page.waitForFunction(()=>window.__atlasRelated);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  for(const target of [0,1,2,3,4,5,6])for(const reverse of [false,true]){
    await page.evaluate(({saved,target,reverse})=>{
      const state=saved.interaction;
      if(!state||!('contexts' in state))throw new Error('Expected weekday state');
      window.__atlasRelated.setState({...saved,sceneId:reverse?'wednesday':'sunday',interaction:{...state,target,contexts:{yesterday:reverse?1:0,tomorrow:reverse?0:1,consequent:1,question:0},customized:true}});
    },{saved,target,reverse});
    const calendar=page.locator('.weekday-calendar');
    await expect(calendar).toHaveAttribute('data-direction',reverse?'reverse':'forward');
    await expect(calendar.locator('[data-calendar-world="0"] [data-role="오늘"]')).toHaveAttribute('data-day',String((target+(reverse?5:2))%7));
    await expect(calendar.locator('[data-calendar-world="1"] [data-role="오늘"]')).toHaveAttribute('data-day',String(target));
    const linked=calendar.locator('[data-linked=true]');
    await expect(linked).toHaveCount(2);
    expect(await linked.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-day')))).toEqual([String((target+(reverse?6:1))%7),String((target+(reverse?6:1))%7)]);
    await expectFrame(page,weekdayFrame);
  }
  await page.evaluate(saved=>window.__atlasRelated.setState(saved),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
});

test('inconsistent references clear the calendar and restoration does not retain stale days',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#sunday');await page.waitForFunction(()=>window.__atlasRelated);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(saved=>{
    const state=saved.interaction;if(!state||!('contexts'in state))throw new Error('Expected weekday state');
    window.__atlasRelated.setState({...saved,interaction:{...state,contexts:{yesterday:0,tomorrow:0,consequent:0,question:0},customized:true}});
  },saved);
  await expect(page.locator('.weekday-calendar')).toHaveCount(0);
  await expect(page.locator('.weekday-intro-reasoning')).toContainText('조건에 맞는 날짜가 없어요');
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(saved=>window.__atlasRelated.setState(saved),saved);
  await expect(page.locator('.weekday-calendar')).toHaveAttribute('data-shared-day','5');
});

test('quantifier evidence shows a witness and a counterexample without changing the saved editor',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  for(const [id,trueCount,falseCount]of [['possible',1,2],['necessary',3,0]] as const){
    const card=page.locator(`.weekday-modal-intro-case[data-example="${id}"]`);
    await expect(card.locator('.weekday-modal-intro-rail')).toBeVisible();
    for(const symbol of ['◇P','□P']){
      await expect(card.locator(`[data-operator="${symbol}"] .weekday-quantifier-dots [data-truth=true]`)).toHaveCount(trueCount);
      await expect(card.locator(`[data-operator="${symbol}"] .weekday-quantifier-dots [data-truth=false]`)).toHaveCount(falseCount);
    }
  }
  await expectFrame(page,weekdayFrame);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
});


test('world names and weekdays remain readable on separate lines',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#alethic');await page.waitForFunction(()=>window.__atlasRelated);await page.evaluate(()=>document.fonts.ready);
  const labels=await page.locator('.weekday-modal-diagram svg').evaluate(svg=>{
    const names=[...svg.querySelectorAll<SVGTextElement>('.weekday-modal-label')],days=[...svg.querySelectorAll<SVGTextElement>('.weekday-modal-day')];
    return names.map((name,index)=>{const day=days[index],a=name.getBoundingClientRect(),b=day.getBoundingClientRect();return {nameSize:parseFloat(getComputedStyle(name).fontSize)*name.getScreenCTM()!.a,daySize:parseFloat(getComputedStyle(day).fontSize)*day.getScreenCTM()!.a,separation:b.top-a.bottom};});
  });
  expect(labels).toHaveLength(2);for(const label of labels){expect(label.nameSize).toBeGreaterThanOrEqual(12);expect(label.daySize).toBeGreaterThanOrEqual(12);expect(label.separation).toBeGreaterThanOrEqual(0);}
});
