import {test,expect} from '@playwright/test';
test('private studio preserves edits and feedback across navigation, reload and explicit reset',async({page},testInfo)=>{
  await page.goto('/#two-children/question');await expect(page.locator('#topic-title')).toContainText('적어도 한 명');
  const initial=await page.locator('#narration').inputValue();await page.locator('#narration').fill(initial+' 화면 테스트 수정.');
  await page.locator('[data-topic="binary-relations"]').click();await expect(page.getByRole('alert')).toContainText('저장하지 않은');
  await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');
  await page.locator('#feedback-text').fill('조건을 알게 된 절차를 더 명확히 설명해 주세요.');await page.locator('#add-feedback').click();await expect(page.locator('#feedback')).toContainText('미해결');
  await page.reload();await expect(page.locator('#narration')).toHaveValue(initial+' 화면 테스트 수정.');await expect(page.locator('#feedback')).toContainText('조건을 알게 된 절차');
  await page.locator('#feedback button').last().click();await expect(page.locator('#feedback .note').last()).toContainText('해결됨');
  await page.locator('[data-topic="monty-hall"]').click();await expect(page.locator('#topic-title')).toContainText('몬티 홀');await page.locator('[data-topic="two-children"]').click();
  await page.locator('#reset').click();await expect(page.locator('#narration')).toHaveValue(initial);
  const download=page.waitForEvent('download');await page.locator('#export').click();expect((await download).suggestedFilename()).toBe('two-children-studio.json');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  await page.locator('#add-feedback').scrollIntoViewIfNeeded();await expect(page.locator('#add-feedback')).toBeInViewport();
  await page.screenshot({path:`test-results/studio-${testInfo.project.name}.png`,fullPage:true});
});
test('unavailable real runner produces an honest failure and cannot satisfy the review gate',async({page})=>{
  await page.goto('/#binary-relations/question');await expect(page.locator('#topic-title')).toContainText('이항 관계');await page.locator('#review-one').click();
  await expect(page.locator('#jobs .job').first()).toContainText('실패');await expect(page.locator('#gate')).toContainText('검토 대기');await expect(page.locator('#jobs .job').first().locator('details')).toHaveCount(0);
});
