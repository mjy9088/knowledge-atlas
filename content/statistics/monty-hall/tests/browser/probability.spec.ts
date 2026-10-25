import {expect, test, type Page} from '@playwright/test';
import {validateLabState} from '../../../../../packages/models/possibility-lab.js';

async function snapshot(page: Page) {
  const state = await page.evaluate(() => window.__atlasRelated.getState());
  const interaction = state.interaction;
  validateLabState(interaction, 'monty-hall');
  return {...state, interaction};
}

test('connected probability trees distinguish unequal paths and the excluded sample', async ({page}) => {
  await page.goto('/knowledge/monty-hall/informed-tree/');
  await page.waitForFunction(() => window.__atlasRelated);
  await expect(page.locator('.monty-tree-path')).toHaveCount(4);
  await expect(page.locator('.monty-path-mass')).toHaveText(['1/3×1/2=1/6', '1/3×1/2=1/6', '1/3×1=1/3', '1/3×1=1/3']);
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'blind-paths'}));
  await expect(page.locator('.monty-tree-path')).toHaveCount(6);
  await expect(page.locator('.monty-tree-path[data-accepted=false]')).toHaveCount(2);
  await expect(page.locator('.monty-tree-path[data-excluded=true]')).toHaveCount(0);
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'compare'}));
  await expect(page.locator('.monty-tree-path[data-excluded=true]')).toHaveCount(2);
  await expect(page.locator('.monty-tree-path[data-accepted=true]')).toHaveCount(4);
  await expect(page.locator('.monty-tree-path[data-accepted=true][data-win=true]')).toHaveCount(2);
  await expect(page.locator('.monty-story-note')).toContainText('2/4 = 1/2');
});

test('direct paired sampling preserves denominators, choice and reproducible prefixes', async ({page}) => {
  await page.goto('/knowledge/monty-hall/');
  await page.waitForFunction(() => window.__atlasRelated);
  await page.getByRole('button', {name: '3번 문 선택', exact: true}).click();
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'sampling'}));
  const sampler = page.locator('.monty-sampler');
  await expect(sampler.locator('.monty-sample-rate')).toHaveText(['남은 표본 없음', '남은 표본 없음']);
  await page.getByRole('button', {name: '+1회', exact: true}).click();
  await page.getByRole('button', {name: '+100회', exact: true}).click();
  await page.getByRole('button', {name: '+1,000회', exact: true}).click();
  await expect(sampler.locator('[data-stat=attempted]')).toHaveText('1,101');
  const numbers = await sampler.locator('[data-stat]').evaluateAll(elements => Object.fromEntries(elements.map(element => [`${element.closest('[data-host]')?.getAttribute('data-host') ?? 'all'}-${element.getAttribute('data-stat')}`, Number(element.textContent?.replaceAll(',', ''))])));
  expect(numbers['informed-excluded']).toBe(0);
  expect(numbers['informed-accepted']).toBe(1101);
  expect(numbers['blind-accepted'] + numbers['blind-excluded']).toBe(1101);
  expect(numbers['blind-successes'] + numbers['blind-excluded']).toBe(numbers['informed-successes']);
  await expect(sampler.locator('[data-host=blind] .monty-sample-rate')).toContainText(`${numbers['blind-successes']} / ${numbers['blind-accepted']}`);
  const saved = await snapshot(page);
  expect(saved.interaction.choice).toBe(3);
  const prefix = await sampler.locator('.monty-sample-cards').innerText();
  await page.getByRole('button', {name: '횟수 지우기', exact: true}).click();
  expect((await snapshot(page)).interaction.seed).toBe(saved.interaction.seed);
  await page.evaluate(state => window.__atlasRelated.setState(state), saved);
  expect(await sampler.locator('.monty-sample-cards').innerText()).toBe(prefix);
  await page.evaluate(() => window.__atlasRelated.setState({sceneId: 'compare'}));
  await page.locator('#reader-next').click();
  expect(await sampler.locator('.monty-sample-cards').innerText()).toBe(prefix);
  await page.getByRole('button', {name: '새 표본', exact: true}).click();
  const fresh = await snapshot(page);
  expect(fresh.interaction.seed).not.toBe(saved.interaction.seed);
  expect(fresh.interaction.choice).toBe(3);
  expect(fresh.interaction.count).toBe(0);
  await page.evaluate(() => window.__atlasRelated.reset());
  expect((await snapshot(page)).interaction.count).toBe(0);
});

test('sampling playback pauses on navigation and caps a bounded restored sample', async ({page}) => {
  await page.goto('/knowledge/monty-hall/sampling/');
  await page.waitForFunction(() => window.__atlasRelated);
  await page.getByRole('button', {name: '반복 뽑기', exact: true}).click();
  await expect.poll(async () => (await snapshot(page)).interaction.count).toBeGreaterThan(0);
  await page.getByRole('button', {name: '일시정지', exact: true}).click();
  const paused = await snapshot(page);
  await page.waitForTimeout(150);
  expect(await snapshot(page)).toEqual(paused);
  await page.getByRole('button', {name: '반복 뽑기', exact: true}).click();
  await page.locator('#reader-next').click();
  const away = await snapshot(page);
  await page.waitForTimeout(150);
  expect(await snapshot(page)).toEqual(away);
  await page.evaluate(state => window.__atlasRelated.setState({...state, sceneId: 'sampling', interaction: {...state.interaction, count: 9999}}), paused);
  await page.getByRole('button', {name: '+100회', exact: true}).click();
  await expect(page.locator('.monty-sampler [data-stat=attempted]')).toHaveText('10,000');
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual((page.viewportSize()?.height ?? 0) + 1);
  for (const card of await page.locator('.monty-sample-card').all()) {
    const bounds = await card.evaluate(element => ({width: element.clientWidth, scrollWidth: element.scrollWidth}));
    expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
  }
  await expect(page.getByRole('button', {name: '반복 뽑기', exact: true})).toBeDisabled();
  await expect(page.locator('[data-sample-step]:enabled')).toHaveCount(0);
  await page.getByRole('button', {name: '횟수 지우기', exact: true}).click();
  await expect(page.getByRole('button', {name: '반복 뽑기', exact: true})).toBeEnabled();
});
