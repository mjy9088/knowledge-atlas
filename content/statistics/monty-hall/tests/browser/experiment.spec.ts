import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

async function expectCase(row: Locator, kept: number, wins: boolean) {
  await expect(row.locator('.lab-prior')).toHaveText('2칸');
  await expect(row.locator('.lab-unit[data-kept=true]')).toHaveCount(kept);
  await expect(row.locator('.lab-unit[data-kept=false]')).toHaveCount(2 - kept);
  await expect(row.locator('.lab-mass strong')).toHaveText(`2칸 중 ${kept}칸`);
  await expect(row.locator('.lab-outcome')).toHaveText(wins ? '상품을 얻음' : '꽝으로 감');
}

test('monty-hall: count retained equal cases before sampling and after input changes, reset and restoration', async ({ page }) => {
  await page.goto('/knowledge/monty-hall/#compare');
  await page.waitForFunction(() => window.__atlasRelated);
  const cases = page.locator('.lab-ledger tbody tr');
  await expect(cases).toHaveCount(3);
  await expectCase(page.locator('[data-case="door-1"]'), 2, false);
  await expectCase(page.locator('[data-case="door-2"]'), 1, true);
  await expectCase(page.locator('[data-case="door-3"]'), 1, true);
  await expect(page.locator('.lab-event')).toContainText('몇 번 문을 열었는지는 가리지 않습니다');
  await expect(page.locator('.lab-equation')).toContainText('2 ÷ 4 = 1/2');
  await page.locator('.lab-choice').selectOption('2');
  await expectCase(page.locator('[data-case="door-2"]'), 2, false);
  await expectCase(page.locator('[data-case="door-1"]'), 1, true);
  await page.locator('.lab-mode').selectOption('informed');
  for (const door of [1, 2, 3]) await expectCase(page.locator(`[data-case="door-${door}"]`), 2, door !== 2);
  await expect(page.locator('.lab-equation')).toContainText('4 ÷ 6 = 2/3');
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('본문의 정답을 모르고 미선택 문을 균등하게 여는 절차와 달리');
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('4 ÷ 6 = 2/3');

  const changed = await page.evaluate(() => window.__atlasRelated.getState());
  await page.locator('#reader-prev').click();
  await page.locator('#reader-next').click();
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(changed);
  await page.locator('.lab-sampling summary').click();
  await page.getByRole('button', { name: '10회', exact: true }).click();
  await page.getByRole('button', { name: '실험 초기화', exact: true }).click();
  await expectCase(page.locator('[data-case="door-1"]'), 2, false);
  await expectCase(page.locator('[data-case="door-2"]'), 1, true);
  await expect(page.locator('.lab-equation')).toContainText('2 ÷ 4 = 1/2');
  expect(await page.locator('.lab-count').inputValue()).toBe('0');
  await page.getByRole('button', { name: '10회', exact: true }).click();
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('본문과 같은 정답을 모르고 미선택 문을 균등하게 여는 절차');
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('표본 실험');
  const state = await page.evaluate(() => window.__atlasRelated.getState());
  await page.locator('#reader-prev').click();
  await page.evaluate(saved => window.__atlasRelated.setState(saved), state);
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(state);
});

test('monty-hall: mainline earns the answer while numbered-door comparison remains optional and directly restorable', async ({ page }) => {
  await page.goto('/knowledge/monty-hall/compare/');
  await page.waitForFunction(() => window.__atlasRelated);
  await page.locator('#reader-next').click();
  await expect(page).toHaveURL(/\/close\/$/);
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('처음 틀린 게임의 절반');
  await page.goto('/knowledge/monty-hall/specific/');
  await page.waitForFunction(() => window.__atlasRelated);
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('2번을 열 수 있으면 반드시 2번');
  const saved = await page.evaluate(() => window.__atlasRelated.getState());
  await page.locator('#reader-prev').click();
  await page.evaluate(state => window.__atlasRelated.setState(state), saved);
  expect(await page.evaluate(() => window.__atlasRelated.getState())).toEqual(saved);
  await expect(page.locator('.reader-scene:not([hidden]) .scene-prose')).toContainText('전체 게임에서는');
});
