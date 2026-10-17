import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

test('format, depth and content scope are independently editable and survive reload',async({page})=>{
 await page.goto('/#monty-hall/question');await expect(page.locator('#topic-title')).toContainText('몬티 홀');
 await page.locator('#metadata-settings summary').click();await page.locator('#preset-deep').click();await page.locator('#meta-purpose').selectOption('interest');await page.locator('#meta-outOfScope').fill('일반적인 게임 이론');
 await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');await page.reload();await page.locator('#metadata-settings summary').click();
 await expect(page.locator('#meta-format')).toHaveValue('long');await expect(page.locator('#meta-depth')).toHaveValue('deep');await expect(page.locator('#meta-purpose')).toHaveValue('interest');await expect(page.locator('#meta-outOfScope')).toHaveValue('일반적인 게임 이론');
 await page.locator('#reset').click();await expect(page.locator('#save-status')).toHaveText('저장됨');
});

test('plan becomes canonical worktree sources and a real static reader build with versioned feedback',async({page,request},testInfo)=>{
 test.setTimeout(90_000);
 const id={'studio-desktop':'binary-relations','studio-mobile':'monty-hall','studio-200':'two-children'}[testInfo.project.name]!;
 try{
  await page.goto('/#'+id+'/question');await expect(page.locator('#work-state')).toContainText('아직');await page.locator('#prepare-work').click();await expect(page.locator('#work-state')).toHaveText('작업 공간 준비됨',{timeout:30_000});
  await page.locator('#build-work').click();await expect(page.locator('#built-result')).toBeVisible({timeout:45_000});
  const frame=page.frameLocator('#build-frame');await expect(frame.locator('body')).toContainText(id==='binary-relations'?'순서쌍':id==='monty-hall'?'공개 규칙':'관측');await expect(frame.locator('#reader-controls')).toBeVisible();
  const next=await page.locator('#slides button').nth(1).getAttribute('data-slide');await page.locator('#slides button').nth(1).click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#'+next)).toBeVisible();await expect(frame.locator('#question')).toBeHidden();
  await page.locator('#slides button').first().click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#question')).toBeVisible();
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.locator('#inspect-work').click();await page.locator('.production > details > summary').click();await expect(page.locator('#work-changes')).toContainText('content/catalog.ts');
  await page.locator('#feedback-build').click();await expect(page.locator('#feedback-text')).toHaveValue(/build=.*source=.*slide=question/);await page.locator('#feedback-text').press('End');await page.locator('#feedback-text').pressSequentially(' 화면 피드백');await page.locator('#add-feedback').click();await expect(page.locator('#feedback')).toContainText('화면 피드백');
  await page.locator('#built-result').scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  const bounds=await page.locator('#build-frame').boundingBox();expect(bounds!.width).toBeGreaterThan(250);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  const scroll=await frame.locator('html').evaluate(e=>({width:e.scrollWidth,client:e.clientWidth}));expect(scroll.width).toBeLessThanOrEqual(scroll.client+1);expect(errors).toEqual([]);
  await page.screenshot({path:`test-results/studio-build-${testInfo.project.name}.png`,fullPage:true});
 }finally{
  const works=await(await request.get('/api/work')).json() as {id:string;directory:string;branch:string}[];const w=works.find(w=>w.id===id);
  if(w){const expected=path.resolve('artifacts/studio-workspaces');if(path.dirname(path.resolve(w.directory))!==expected||!w.branch.startsWith('codex/studio/'))throw Error('Unsafe test workspace cleanup');execFileSync('git',['worktree','remove','--force',w.directory]);execFileSync('git',['branch','-D',w.branch]);}
 }
});
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
