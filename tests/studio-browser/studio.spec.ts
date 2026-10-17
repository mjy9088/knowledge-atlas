import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import type {Conversation} from '../../tools/studio/chat.js';

test('brief save buttons persist title, goal, audience and sources; format budgets apply across contents',async({page,request})=>{
 await page.goto('/#binary-relations/question');await page.locator('#plan-settings summary').first().click();const initial={title:await page.locator('#plan-title').inputValue(),goal:await page.locator('#plan-goal').inputValue(),audience:await page.locator('#plan-audience').inputValue()};
 await page.locator('#plan-title').fill(initial.title+' 편집');await page.locator('#plan-goal').fill('웹에서 수정한 전체 목표');await page.locator('#plan-audience').fill('웹에서 수정한 대상');await page.getByText('출처·주장 편집',{exact:true}).click();const sourceRows=JSON.parse(await page.locator('#plan-sources').inputValue());sourceRows[0].locator+=' · UI fixture locator';await page.locator('#plan-sources').fill(JSON.stringify(sourceRows));await page.getByRole('button',{name:'기획 저장',exact:true}).click();await expect(page.locator('[data-save-status]').first()).toHaveText('저장됨');await page.reload();await page.locator('#plan-settings summary').first().click();await expect(page.locator('#plan-title')).toHaveValue(initial.title+' 편집');await expect(page.locator('#plan-goal')).toHaveValue('웹에서 수정한 전체 목표');await expect(page.locator('#plan-audience')).toHaveValue('웹에서 수정한 대상');await expect(page.locator('#plan-sources')).toHaveValue(/UI fixture locator/);await expect(page.locator('#plan-budget')).not.toBeEditable();
 await page.locator('#video-settings summary').click();await page.locator('#video-short').fill('210');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('210');const {topics}=await(await request.get('/api/topics')).json();expect(topics.filter((t:{plan:{metadata:{format:string}}})=>t.plan.metadata.format==='short').every((t:{plan:{totalSeconds:number}})=>t.plan.totalSeconds===210)).toBe(true);
 await page.locator('#video-short').fill('180');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('180');await page.locator('#reset').click();await expect(page.locator('#plan-title')).toHaveValue(initial.title);
});

test('slides can be added, referenced, reordered and removed in the web editor',async({page})=>{
 await page.goto('/#two-children/question');await page.locator('#reset').click();await expect(page.locator('#position')).toHaveText('1 / 6');await page.locator('#slide-add').click();await page.locator('#slide-title').fill('웹에서 추가한 장면');await page.locator('#slide-goal').fill('관측 절차 확인');await page.locator('#narration').fill('관측 절차를 먼저 확인합니다.');await page.locator('#visual').fill('관측 절차 비교');await page.locator('#observation').fill('관측 절차를 확인');await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');await expect(page.locator('#position')).toHaveText('2 / 7');await page.locator('#slide-down').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 7');await page.reload();await expect(page.locator('#slide-title')).toHaveValue('웹에서 추가한 장면');await page.locator('#slide-delete').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 6');await page.locator('#reset').click();
});

test('chat failures preserve the user message and topic-specific drafts survive navigation',async({page})=>{
 await page.goto('/#monty-hall/question');await expect(page.locator('#topic-title')).toContainText('몬티 홀');await page.locator('#work-instruction').fill('채팅 실패 테스트 · 실제 모델 응답 아님');await page.locator('[data-topic="two-children"]').click();await expect(page.locator('#work-instruction')).toHaveValue('');await page.locator('[data-topic="monty-hall"]').click();await expect(page.locator('#work-instruction')).toHaveValue('채팅 실패 테스트 · 실제 모델 응답 아님');
 await page.locator('#chat-ask').click();await expect(page.locator('#chat-status')).toHaveText('실행 실패');await expect(page.locator('#chat-messages')).toContainText('채팅 실패 테스트');await expect(page.locator('#chat-messages .assistant')).toHaveCount(0);await page.reload();await expect(page.locator('#chat-messages')).toContainText('채팅 실패 테스트');
});

test('question and approval UI preserves partial answers during polling and sends only explicit scoped responses',async({page},testInfo)=>{
 // UI protocol fixture only. No inference, command, actual approval or editorial evidence is fabricated.
 const c:Conversation={id:'ui-fixture',topicId:'monty-hall',threadId:'fixture-thread',turnId:'fixture-turn',mode:'work',revision:'fixture',status:'waiting',messages:[{id:'fixture-reply',role:'assistant',mode:'work',revision:'fixture',text:'UI test fixture: 설명 범위를 알려 주세요.'}],requests:[{id:'fixture-question',rpcId:10,kind:'question',turnId:'fixture-turn',description:'Test question',canAccept:false,questions:[{id:'scope',header:'설명 범위',question:'어느 범위를 다룰까요?',secret:false,options:[{label:'핵심만',description:'짧은 설명'}]}]}]};
 await page.route('**/api/chats',route=>route.fulfill({json:[c]}));
 await page.route('**/api/chat-answer',async route=>{const body=route.request().postDataJSON();expect(body.id).toBe('monty-hall');expect(body.conversationId).toBe(c.id);
  if(body.requestId==='fixture-question'){expect(body.response.answers.scope).toBe('핵심만 + 비교');c.requests=[{id:'fixture-approval',rpcId:11,kind:'command',turnId:'fixture-turn',description:'Test command, not actually executed',canAccept:true,questions:[]}];}
  else{expect(body.requestId).toBe('fixture-approval');expect(body.response).toEqual({decision:'decline'});c.requests=[];c.status='idle';}await route.fulfill({json:{ok:true}});
 });
 await page.goto('/#monty-hall/question');await expect(page.locator('#chat-requests')).toContainText('어느 범위를');await page.locator('#chat-requests').getByRole('button',{name:'핵심만',exact:true}).click();const answer=page.getByLabel('어느 범위를 다룰까요?',{exact:true});await answer.fill('핵심만 + 비교');await page.waitForTimeout(2800);await expect(answer).toHaveValue('핵심만 + 비교');
 await page.locator('[data-topic="two-children"]').click();await page.locator('[data-topic="monty-hall"]').click();await expect(answer).toHaveValue('핵심만 + 비교');await page.getByRole('button',{name:'답변 보내기',exact:true}).click();await expect(page.locator('#chat-requests')).toContainText('명령 실행 승인 요청');
 await page.locator('#chat-requests').getByRole('button',{name:'거절',exact:true}).click();await expect(page.locator('#chat-requests').locator('form')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
});

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
  await page.locator('#add-visuals').click();await expect(page.locator('#work-state')).toHaveText('작업 공간 준비됨',{timeout:30000});await page.locator('#build-work').click();await expect(page.locator('#built-result')).toBeVisible({timeout:45_000});
  const frame=page.frameLocator('#build-frame');await expect(frame.locator('body')).toContainText(id==='binary-relations'?'순서쌍':id==='monty-hall'?'공개 규칙':'관측');await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#question .scene-figure img')).toBeVisible();expect(await frame.locator('#question .scene-figure img').evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBeGreaterThan(0);
  const next=await page.locator('#slides button').nth(1).getAttribute('data-slide');await page.locator('#slides button').nth(1).click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#'+next)).toBeVisible();await expect(frame.locator('#'+next+' .scene-figure img')).toBeVisible();await expect(frame.locator('#question')).toBeHidden();
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
