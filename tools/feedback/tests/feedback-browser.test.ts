import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {chromium,expect} from '@playwright/test';
import {QuestionStore} from '../store.js';
import {createFeedbackServer} from '../server.js';

test('answering and editing one question preserves a sibling draft across request states',async()=>{
  const directory=mkdtempSync(path.join(os.tmpdir(),'atlas-feedback-browser-'));
  const store=new QuestionStore(directory);
  store.add({text:'에이전트 QA 전용: 같은 조건을 바꾸면 결과가 어떻게 달라질까요?',optional:true});
  store.add({text:'에이전트 QA 전용: 다음 설명에서 확인할 근거는 무엇인가요?',optional:true});
  const tokens={admin:'admin-only-isolated-browser-fixture',answer:'answer-only-isolated-browser-fixture'};
  const server=createFeedbackServer(store,tokens);
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address();assert.ok(address&&typeof address==='object');
  const browser=await chromium.launch({args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:375,height:844}});
  const evidence=path.resolve('test-results/feedback/current');mkdirSync(evidence,{recursive:true});
  try{
    await page.goto(`http://127.0.0.1:${address.port}/a/${tokens.answer}`);
    await expect(page.locator('textarea')).toHaveCount(2);
    await page.screenshot({path:path.join(evidence,'pending-375.png'),fullPage:true});
    await page.locator('textarea').nth(0).fill('에이전트 QA 답변: 조건과 측정 결과를 구별합니다.');
    await page.locator('textarea').nth(1).fill('에이전트 QA 미저장 초안: 다른 답변을 저장해도 유지되어야 합니다.');
    let release=()=>{};
    const paused=new Promise<void>(resolve=>{release=resolve;});
    await page.route('**/api/public/answer',async route=>{await paused;await route.continue();});
    await page.getByRole('button',{name:'Save answer'}).nth(0).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.form-status').nth(0)).toHaveText('Saving...');
    await expect(page.locator('textarea').nth(0)).toBeDisabled();
    await page.screenshot({path:path.join(evidence,'submitting-375.png'),fullPage:true});
    release();
    await expect(page.locator('.saved-answer:visible')).toHaveCount(1);
    await expect(page.locator('textarea:visible')).toHaveValue('에이전트 QA 미저장 초안: 다른 답변을 저장해도 유지되어야 합니다.');
    for(const width of [375,768,1280]){
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:path.join(evidence,`answered-${width}.png`),fullPage:true});
    }
    await page.getByRole('button',{name:'Edit answer'}).focus();await page.keyboard.press('Space');
    await expect(page.locator('textarea').nth(0)).toBeFocused();
    await page.screenshot({path:path.join(evidence,'edit-1280.png'),fullPage:true});
    await page.unroute('**/api/public/answer');
    await page.route('**/api/public/answer',route=>route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:'Agent QA rejected write'})}));
    await page.locator('textarea').nth(0).fill('에이전트 QA 실패 뒤 보존할 답변');
    await page.getByRole('button',{name:'Save answer'}).nth(0).click();
    await expect(page.locator('.form-status').nth(0)).toHaveText('Agent QA rejected write');
    await expect(page.locator('textarea').nth(0)).toBeEnabled();
    await expect(page.locator('textarea').nth(0)).toHaveValue('에이전트 QA 실패 뒤 보존할 답변');
    await page.screenshot({path:path.join(evidence,'failure-1280.png'),fullPage:true});
    await page.reload();
    await expect(page.getByText('에이전트 QA 답변: 조건과 측정 결과를 구별합니다.',{exact:true})).toBeVisible();
  }finally{
    await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));rmSync(directory,{recursive:true,force:true});
  }
});
