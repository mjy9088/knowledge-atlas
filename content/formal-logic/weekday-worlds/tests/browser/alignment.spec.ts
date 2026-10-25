import { expect, test } from "@playwright/test";
import { expectFrame, weekdayFrame, weekdayInputs, weekdayReasoning, weekdayView } from "./support.js";

test('weekday alignment highlights complete paths bidirectionally and refreshes with inputs',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  const nextBounds=await page.locator('#reader-next').boundingBox(),selectionBounds=await page.locator('.weekday-settings').boundingBox();
  const ids=async(side:string)=>page.locator(`[data-alignment-side="${side}"][data-alignment-on-path]`).evaluateAll(nodes=>[...new Set(nodes.map(n=>(n as HTMLElement).dataset.alignmentNode))].sort());
  const yesterday=['constraints','antecedent','yesterday','yesterday-base'].sort();
  await page.locator('.weekday-source [data-alignment-node="yesterday-base"]').hover();
  expect(await ids('source')).toEqual(yesterday);expect(await ids('symbol')).toEqual(yesterday);
  await expect(page.locator('.alignment-status')).toContainText('① 기준의 오늘');
  expect(await page.locator('#reader-next').boundingBox()).toEqual(nextBounds);expect(await page.locator('.weekday-settings').boundingBox()).toEqual(selectionBounds);
  await testInfo.attach('alignment-full-path',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('.weekday-symbol-constraints [data-alignment-node="tomorrow-offset"]').hover();
  const tomorrow=['constraints','antecedent','tomorrow','tomorrow-offset'].sort();expect(await ids('source')).toEqual(tomorrow);expect(await ids('symbol')).toEqual(tomorrow);
  await page.locator('.weekday-source [data-alignment-node="antecedent"]').focus();
  expect(await ids('source')).toEqual(['antecedent','constraints']);
  await page.keyboard.press('Enter');await page.keyboard.press('Space');expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await page.keyboard.press('Escape');expect(await ids('source')).toEqual([]);
  await page.getByRole('combobox',{name:'① 어제의 기준',exact:true}).selectOption('new:2');
  await expect(page.locator('.weekday-source [data-alignment-node="yesterday-base"] select')).toHaveValue('2');expect(await ids('source')).toEqual([]);
  await page.locator('.weekday-source [data-alignment-node="yesterday-base"]').focus();expect(await ids('symbol')).toEqual(yesterday);
  await weekdayView(page,'양상');
  await expect(page.locator('.weekday-symbol-definition').filter({hasText:'P: 이 세계'})).toContainText('P:');
  await page.locator('.weekday-source [data-alignment-node="yesterday-base"]').focus();expect(await ids('symbol')).toEqual(yesterday);
  await expect(page.locator('.weekday-symbolic-summary [data-alignment-node="yesterday-base"]')).toHaveAttribute('data-alignment-current','');
  await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);
});

test('weekday conditional connectives map both ways in the world model, comparison and modal stages without a mode toggle',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  for(const sceneId of ['contexts','modal-expansion','alethic']){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),sceneId);await weekdayInputs(page);
    const mode=sceneId==='alethic'?'양상':'달력';
    const clauseLines=page.locator('.weekday-symbol-clause');await expect(clauseLines).toHaveCount(2);await expect(clauseLines.nth(0)).toContainText('A:');await expect(clauseLines.nth(1)).toContainText('B:');
    const firstClause=await clauseLines.nth(0).boundingBox(),secondClause=await clauseLines.nth(1).boundingBox();expect(secondClause!.y).toBeGreaterThanOrEqual(firstClause!.y+firstClause!.height-.5);
    await expect(page.locator('.weekday-symbol-query')).toContainText('질문:');await expect(page.locator('.weekday-symbol-query')).not.toContainText('Γ');
    if(mode==='양상')await expect(page.locator('.weekday-symbolic-summary')).toContainText('◇P');
    await expect(page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true})).toHaveCount(0);
    const source=page.locator('.weekday-source [data-alignment-node="conditional-connective"]'),arrow=page.locator('.weekday-symbol-conditional [data-alignment-node="conditional-connective"]');
    await expect(source).toHaveText(['만약','이라면, ','이다']);await expect(arrow).toHaveText('→');
    for(const part of await source.all())for(const interaction of ['hover','focus'] as const){
      await part[interaction]();await expect(arrow).toHaveAttribute('data-alignment-current','');
      for(const fragment of await source.all())await expect(fragment).toHaveAttribute('data-alignment-current','');
      await expect(page.locator('.weekday-symbol-conditional>[data-alignment-node="constraints"]')).toHaveAttribute('data-alignment-on-path','');
      await expect(page.locator('.weekday-source [data-alignment-node="constraints"]')).toHaveAttribute('data-alignment-on-path','');
    }
    for(const interaction of ['hover','focus'] as const){await arrow[interaction]();for(const part of await source.all())await expect(part).toHaveAttribute('data-alignment-current','');}
    await expect(page.locator('.weekday-source [data-alignment-node="antecedent"]')).not.toHaveAttribute('data-alignment-on-path','');
    if(mode==='달력')await expect(page.locator('.weekday-symbol-limit').first()).toContainText('A → B만으로 A나 B가 참인 것은 아님');
    else await expect(page.locator('.weekday-symbol-limit')).toContainText('조건문 전체의 양상 번역은 아님');
    await expectFrame(page,weekdayFrame);await testInfo.attach(`conditional-${sceneId}`,{body:await page.screenshot(),contentType:'image/png'});
  }
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await weekdayInputs(page);
  await expect(page.locator('.weekday-experiment')).toHaveAttribute('data-logic-mode','alethic');await expect(page.locator('.weekday-symbol-conditional')).toContainText('A → B');
});

test('weekday equivalence tokens and their explanation highlight together in both translations',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  for(const mode of ['달력','양상']){
    await weekdayView(page,mode);
    const glossary=page.locator('.weekday-equivalence-definition'),tokens=page.locator('.weekday-symbol-constraints [data-alignment-node="weekday-equivalence"]');
    await tokens.first().hover();await expect(glossary).toHaveAttribute('data-alignment-current','');await expect(glossary).toHaveText('≡₇: 같은 요일');
    await glossary.hover();for(const token of await tokens.all())await expect(token).toHaveAttribute('data-alignment-current','');
    const result=page.locator('.weekday-logic-conclusion [data-alignment-node="weekday-equivalence"]').first();await result.hover();await expect(glossary).toHaveAttribute('data-alignment-current','');
    await expectFrame(page,weekdayFrame);
  }
});
