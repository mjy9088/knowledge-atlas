import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {ASSESSMENT_DIMENSIONS} from '../../tools/studio/contracts.js';
import type {Plan} from '../../tools/studio/contracts.js';

test('brief save buttons persist title, goal, audience and sources; format budgets apply across contents',async({page,request})=>{
 await page.goto('/#binary-relations/question');await page.locator('#plan-settings summary').first().click();const initial={title:await page.locator('#plan-title').inputValue(),goal:await page.locator('#plan-goal').inputValue(),audience:await page.locator('#plan-audience').inputValue()};
 await page.locator('#plan-title').fill(initial.title+' 편집');await page.locator('#plan-goal').fill('웹에서 수정한 전체 목표');await page.locator('#plan-audience').fill('웹에서 수정한 대상');await page.getByText('출처·주장 편집',{exact:true}).click();const sourceRows=JSON.parse(await page.locator('#plan-sources').inputValue());sourceRows[0].locator+=' · UI fixture locator';await page.locator('#plan-sources').fill(JSON.stringify(sourceRows));await page.getByRole('button',{name:'기획 저장',exact:true}).click();await expect(page.locator('[data-save-status]').first()).toHaveText('저장됨');await page.reload();await page.locator('#plan-settings summary').first().click();await expect(page.locator('#plan-title')).toHaveValue(initial.title+' 편집');await expect(page.locator('#plan-goal')).toHaveValue('웹에서 수정한 전체 목표');await expect(page.locator('#plan-audience')).toHaveValue('웹에서 수정한 대상');await expect(page.locator('#plan-sources')).toHaveValue(/UI fixture locator/);await expect(page.locator('#plan-budget')).not.toBeEditable();
 await page.locator('#video-settings summary').click();await page.locator('#video-short').fill('210');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('210');const {topics}=await(await request.get('/api/topics')).json();expect(topics.filter((t:{plan:{metadata:{format:string}}})=>t.plan.metadata.format==='short').every((t:{plan:{totalSeconds:number}})=>t.plan.totalSeconds===210)).toBe(true);
 await page.locator('#video-short').fill('180');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('180');await page.locator('#reset').click();await expect(page.locator('#plan-title')).toHaveValue(initial.title);
});

test('slides can be added, referenced, reordered and removed in the web editor',async({page})=>{
 await page.goto('/#two-children/question');await page.locator('#reset').click();await expect(page.locator('#position')).toHaveText('1 / 6');await page.locator('#slide-add').click();await page.locator('#slide-title').fill('웹에서 추가한 장면');await page.locator('#slide-goal').fill('관측 절차 확인');await page.locator('#narration').fill('관측 절차를 먼저 확인합니다.');await page.locator('#visual').fill('관측 절차 비교');await page.locator('#observation').fill('관측 절차를 확인');await page.locator('#intent-settings summary').click();await page.locator('#intent-status').selectOption('authored');await page.locator('#intent-contentRefs').fill('family-filter');await page.locator('#intent-prerequisites').fill('표본공간');await page.locator('#intent-successCheck').fill('독자가 두 관측 절차의 차이를 설명한다.');await page.locator('#intent-representationRationale').fill('나란한 절차 그림이 서로 다른 조건화를 보이게 한다.');await page.locator('#intent-interaction-kind').selectOption('static');await page.locator('#intent-interaction-detail').fill('이 장면은 절차 비교만 요구하므로 조작 없이 나란한 정적 비교가 충분하다.');await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');await expect(page.locator('#position')).toHaveText('2 / 7');await page.locator('#slide-down').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 7');await page.reload();await expect(page.locator('#slide-title')).toHaveValue('웹에서 추가한 장면');await page.locator('#intent-settings summary').click();await expect(page.locator('#intent-status')).toHaveValue('authored');await expect(page.locator('#intent-successCheck')).toHaveValue('독자가 두 관측 절차의 차이를 설명한다.');await page.locator('#slide-delete').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 6');await page.locator('#reset').click();
});

test('external handoff controls replace embedded chat and import a validated revision-bound review',async({page,request},testInfo)=>{
  await page.goto('/#monty-hall/question');await expect(page.locator('#topic-title')).toContainText('몬티 홀');
  await expect(page.getByRole('heading',{name:'외부 에이전트 전달'})).toBeVisible();await expect(page.locator('.chat-panel')).toHaveCount(0);await expect(page.getByText('Codex와 대화')).toHaveCount(0);
  expect((await request.get('/api/chats')).status()).toBe(404);expect((await request.post('/api/chat-send',{data:{}})).status()).toBe(404);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'독립 리뷰 패킷 내보내기'}).click();expect((await download).suggestedFilename()).toContain('review-packet');
   const packet=await(await request.get('/api/handoff/review/monty-hall')).json();const result={...packet.resultContract,verification:'user-assertion',reviewer:{name:'Browser fixture',kind:'external-agent',tool:'Playwright fixture'},evidence:{reviewedAt:'2026-10-18T00:00:00Z',notes:'Controlled protocol fixture, not editorial evidence',artifactRefs:['fixture://studio-browser']},reports:packet.targets.map((target:string)=>({target,report:{summary:'Browser fixture review; not editorial approval',findings:[],timing:{status:'unverified',note:'No audio or rendered-video inspection'},assessments:ASSESSMENT_DIMENSIONS.map(dimension=>({dimension,verdict:'adequate',expected:`Protocol expectation for ${target}`,actual:`Protocol observation for ${target}`,evidenceRefs:dimension==='surface'?[{kind:'build',ref:'browser-fixture-build'},{kind:'viewport',ref:'configured-playwright-viewport'},{kind:'artifact',ref:'fixture://studio-browser/surface'}]:dimension==='source'?[{kind:'source',ref:packet.plan.sources[0].id}]:dimension==='interaction'?[{kind:'execution',ref:'fixture://studio-browser/interaction'}]:dimension==='reasoning'||dimension==='coherence'?[{kind:'manuscript',ref:'fixture://studio-browser/manuscript'},{kind:'worked-reasoning',ref:'fixture://studio-browser/worked-reasoning'}]:dimension==='objective'||dimension==='value'?[{kind:'manuscript',ref:'fixture://studio-browser/manuscript'}]:[{kind:'artifact',ref:`fixture://studio-browser/${dimension}`}],requestedCorrection:'No correction requested by this protocol fixture.',invariant:'Preserve stable IDs and unresolved approval state.'}))}}))};
  const file=testInfo.outputPath('review-result.json');writeFileSync(file,JSON.stringify(result));await page.locator('#review-result-file').setInputFiles(file);await page.getByRole('button',{name:'검증 후 사용자 제공 리뷰 결과 가져오기'}).click();await expect(page.locator('#handoff-status')).toContainText('가져왔습니다');expect(await page.locator('#jobs .job').count()).toBeGreaterThanOrEqual(packet.targets.length);
  await expect(page.locator('#jobs .job').first()).toContainText('사용자 제공 가져오기');await expect(page.locator('#jobs .job').first()).toContainText('Browser fixture');
  const imported=page.locator('#jobs .job').first();await imported.locator('summary').click();await expect(imported.locator('[data-assessment]')).toHaveCount(ASSESSMENT_DIMENSIONS.length);for(const dimension of ASSESSMENT_DIMENSIONS)await expect(imported.locator(`[data-assessment="${dimension}"]`)).toBeVisible();
});

test('format, depth and content scope are independently editable and survive reload',async({page})=>{
 await page.goto('/#monty-hall/question');await expect(page.locator('#topic-title')).toContainText('몬티 홀');
 await page.locator('#metadata-settings summary').click();await page.locator('#preset-deep').click();await page.locator('#meta-purpose').selectOption('interest');await page.locator('#meta-outOfScope').fill('일반적인 게임 이론');
 await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');await page.reload();await page.locator('#metadata-settings summary').click();
 await expect(page.locator('#meta-format')).toHaveValue('long');await expect(page.locator('#meta-depth')).toHaveValue('deep');await expect(page.locator('#meta-purpose')).toHaveValue('interest');await expect(page.locator('#meta-outOfScope')).toHaveValue('일반적인 게임 이론');
 await page.locator('#reset').click();await expect(page.locator('#save-status')).toHaveText('저장됨');
});

test('a fresh authored draft becomes an isolated prose reader with versioned feedback',async({page,request},testInfo)=>{
 test.setTimeout(90_000);
 const ids:Record<string,string>={'studio-desktop':'studio-draft-desktop','studio-mobile':'studio-draft-mobile','studio-200':'studio-draft-capture'},id=ids[testInfo.project.name];
 if(!id)throw new TypeError(`Unknown Studio project ${testInfo.project.name}`);
 try{
   await page.goto('/#binary-relations/question');await page.locator('#new-content').click();await page.locator('#new-id').fill(id);await page.locator('#new-title').fill(`Studio prose fixture ${testInfo.project.name}`);await page.locator('#create-content').click();await expect(page.locator(`[data-topic="${id}"]`)).toBeVisible();
   const response=await request.get('/api/topics'),body=await response.json() as {topics:{plan:Plan;revision:string}[]},cloned=body.topics.find(topic=>topic.plan.id===id);
   if(!cloned)throw new TypeError(`Missing cloned Studio plan ${id}`);
   const plan={...cloned.plan,slides:cloned.plan.slides.map(slide=>({...slide,intent:{status:'authored' as const,contentRefs:slide.claimRefs,prerequisites:[],successCheck:'Confirm the projected prose and stable scene can be inspected.',representationRationale:'This controlled fixture needs canonical prose and direct navigation; no diagram or manipulation is claimed.',interaction:{kind:'static' as const,rationale:'The fixture verifies prose production rather than a topic-specific experiment.'}}}))};
   expect((await request.post('/api/save',{data:{plan,revision:cloned.revision}})).ok()).toBe(true);await page.reload();await expect(page.locator('#topic-title')).toContainText('Studio prose fixture');await expect(page.locator('#work-state')).toContainText('아직');await page.locator('#prepare-work').click();await expect(page.locator('#work-state')).toHaveText('작업 공간 준비됨',{timeout:30_000});
    await page.locator('#build-work').click();await expect(page.locator('#built-result')).toBeVisible({timeout:45_000});
    const packet=await(await request.get('/api/handoff/work/'+id)).json();
    await page.locator('#work-result-file').setInputFiles({name:'agent-qa-implementation-result.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...packet.resultContract,summary:'Agent QA external acknowledgement fixture',checks:[]}))});
   await page.locator('#import-work-result').click();await expect(page.locator('#handoff-status')).toContainText('소스');
   await page.locator('.production > details > summary').click();
   await expect(page.locator('#work-tasks > details > summary').first()).toHaveText(/^구현 기록 · /);
   await page.locator('.production > details > summary').click();
   const frame=page.frameLocator('#build-frame');await expect(frame.locator('body')).toContainText('순서쌍');await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('.possibility-lab')).toHaveCount(0);if(testInfo.project.name==='studio-mobile')expect(await frame.locator('html').evaluate(()=>innerHeight)).toBeGreaterThanOrEqual(844);
   await page.locator('#slides button[data-slide="pairs"]').click();await expect(frame.locator('#pairs')).toBeVisible();await expect(frame.locator('#question')).toBeHidden();
   expect(await frame.locator('body').evaluate(()=>{const api=window.__atlasRelated;if(!api)throw new TypeError('Missing reader state API');const saved=api.getState();api.setState({sceneId:'question'});const changed=api.getState().sceneId==='question';let rejected=false;try{api.setState({sceneId:'missing'});}catch{rejected=true;}const atomic=api.getState().sceneId==='question';api.reset();api.setState(saved);return{changed,rejected,atomic,restored:api.getState().sceneId===saved.sceneId};})).toEqual({changed:true,rejected:true,atomic:true,restored:true});
   await page.locator('#slides button').first().click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#question')).toBeVisible();
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.locator('#inspect-work').click();await page.locator('.production > details > summary').click();await expect(page.locator('#work-changes')).toBeVisible();
   const prepared=(await(await request.get('/api/work')).json() as {id:string;directory:string}[]).find(work=>work.id===id);
   if(!prepared)throw new TypeError(`Missing prepared Studio work ${id}`);
   expect(readFileSync(path.join(prepared.directory,`content/mathematics/${id}/article.ko.json`),'utf8')).toContain(`article:mathematics.${id}.ko`);
  await page.locator('#feedback-build').click();await expect(page.locator('#feedback-text')).toHaveValue(/build=.*source=.*slide=question/);await page.locator('#feedback-text').press('End');await page.locator('#feedback-text').pressSequentially(' 화면 피드백');await page.locator('#add-feedback').click();await expect(page.locator('#feedback')).toContainText('화면 피드백');
  await page.locator('#built-result').scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  const bounds=await page.locator('#build-frame').boundingBox();expect(bounds!.width).toBeGreaterThan(250);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  const scroll=await frame.locator('html').evaluate(e=>({width:e.scrollWidth,client:e.clientWidth}));expect(scroll.width).toBeLessThanOrEqual(scroll.client+1);expect(errors).toEqual([]);
  await page.screenshot({path:`test-results/studio-build-${testInfo.project.name}.png`,fullPage:true});
 }finally{
  const works=await(await request.get('/api/work')).json() as {id:string;directory:string;branch:string}[];const w=works.find(w=>w.id===id);
  if(w){const expected=path.resolve('artifacts/studio-workspaces');if(path.dirname(path.resolve(w.directory))!==expected||!w.branch.startsWith('studio/'))throw Error('Unsafe test workspace cleanup');execFileSync('git',['worktree','remove','--force',w.directory]);execFileSync('git',['branch','-D',w.branch]);}
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
