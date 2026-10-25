import {expect, test} from '@playwright/test';
import type {Locator} from '@playwright/test';

async function expectCase(row: Locator, kept: number, wins: boolean) {
  await expect(row.locator('.lab-prior')).toHaveText('2칸');
  await expect(row.locator('.lab-unit[data-kept=true]')).toHaveCount(kept);
  await expect(row.locator('.lab-unit[data-kept=false]')).toHaveCount(2 - kept);
  await expect(row.locator('.lab-outcome')).toHaveText(wins ? '상품을 얻음' : '꽝으로 감');
}

test('Monty opening offers three hidden doors and carries the selected identity through the worked cases', async ({page}) => {
  await page.goto('/knowledge/monty-hall/');
  await page.waitForFunction(() => window.__atlasRelated);
  const doors = page.locator('button.monty-door');
  await expect(doors).toHaveCount(3);
  await expect(page.locator('.monty-story')).toContainText('닫힌 문');
  await expect(page.locator('.lab-ledger')).toBeHidden();
  await expect(page.locator('.monty-story')).not.toContainText('2/3');
  await page.getByRole('button', {name: '3번 문 선택', exact: true}).click();
  await expect(page.getByRole('button', {name: '3번 문 선택', exact: true})).toHaveAttribute('aria-pressed', 'true');
  const opening = await page.evaluate(() => window.__atlasRelated.getState());
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/reveal\/$/);
  await expect(page.locator('.monty-door[data-chosen=true] strong')).toHaveText('3번');
  await expect(page.locator('.monty-door[data-open=true]')).toHaveCount(1);
  await expect(page.locator('.monty-door[data-prize=true]')).toHaveCount(0);
  await expect(page.locator('.monty-door[data-open=true]')).not.toHaveAttribute('data-chosen', 'true');
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'case-hit'}));
  await expect(page.locator('.monty-door[data-prize=true] strong')).toHaveText('3번');
  await expect(page.locator('.monty-story-note')).toContainText('꽝입니다');
  for (const sceneId of ['case-miss-a', 'case-miss-b']) {
    await page.evaluate(sceneId => window.__atlasRelated.setState({sceneId}), sceneId);
    await expect(page.locator('.monty-door[data-chosen=true] strong')).toHaveText('3번');
    await expect(page.locator('.monty-story-note')).toContainText('상품을 얻습니다');
  }
  await page.evaluate(state => window.__atlasRelated.setState(state), opening);
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(opening);
  await expect(page.getByRole('button', {name: '3번 문 선택', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => window.__atlasRelated.reset());
  await expect(page.locator('button.monty-door[aria-pressed=true]')).toHaveCount(0);
  await page.locator('#reader-next').click();
  await expect(page.locator('.monty-story-note')).toContainText('1번을 고른 예시');
});

test('optional lab retains exact counts, changed inputs, samples, reset and restoration', async ({page}) => {
  await page.goto('/knowledge/monty-hall/experiment/');
  await page.waitForFunction(() => window.__atlasRelated);
  await page.locator('.lab-mode').selectOption('blind');
  await expectCase(page.locator('[data-case="door-1"]'), 2, false);
  await expectCase(page.locator('[data-case="door-2"]'), 1, true);
  await expectCase(page.locator('[data-case="door-3"]'), 1, true);
  await expect(page.locator('.lab-equation')).toContainText('2 ÷ 4 = 1/2');
  await page.locator('.lab-choice').selectOption('2');
  await expectCase(page.locator('[data-case="door-2"]'), 2, false);
  const changed = await page.evaluate(() => window.__atlasRelated.getState());
  await page.locator('#reader-prev').click();
  await expect(page).toHaveURL(/\/sampling\/$/);
  await page.locator('#reader-next').click();
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(changed);
  await page.locator('.lab-sampling summary').click();
  await page.getByRole('button', {name: '10회', exact: true}).click();
  await expect(page.locator('.lab-count')).toHaveValue('10');
  await page.getByRole('button', {name: '실험 초기화', exact: true}).click();
  await expect(page.locator('.lab-mode')).toHaveValue('informed');
  await expect(page.locator('.lab-choice')).toHaveValue('1');
  await expect(page.locator('.lab-equation')).toContainText('4 ÷ 6 = 2/3');
  const saved = await page.evaluate(() => window.__atlasRelated.getState());
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'question'}));
  await page.evaluate(state => window.__atlasRelated.setState(state), saved);
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);
});

test('the numbered-door section proceeds to paired sampling and the full experiment', async ({page}) => {
  await page.goto('/knowledge/monty-hall/specific/');
  await page.waitForFunction(() => window.__atlasRelated);
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('별도 예시');
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/specific-cases\/$/);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/specific-result\/$/);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/sampling\/$/);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/experiment\/$/);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/close\/$/);
});
