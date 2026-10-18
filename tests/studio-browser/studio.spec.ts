import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import path from 'node:path';

test('brief save buttons persist title, goal, audience and sources; format budgets apply across contents',async({page,request})=>{
 await page.goto('/#binary-relations/question');await page.locator('#plan-settings summary').first().click();const initial={title:await page.locator('#plan-title').inputValue(),goal:await page.locator('#plan-goal').inputValue(),audience:await page.locator('#plan-audience').inputValue()};
 await page.locator('#plan-title').fill(initial.title+' 편집');await page.locator('#plan-goal').fill('웹에서 수정한 전체 목표');await page.locator('#plan-audience').fill('웹에서 수정한 대상');await page.getByText('출처·주장 편집',{exact:true}).click();const sourceRows=JSON.parse(await page.locator('#plan-sources').inputValue());sourceRows[0].locator+=' · UI fixture locator';await page.locator('#plan-sources').fill(JSON.stringify(sourceRows));await page.getByRole('button',{name:'기획 저장',exact:true}).click();await expect(page.locator('[data-save-status]').first()).toHaveText('저장됨');await page.reload();await page.locator('#plan-settings summary').first().click();await expect(page.locator('#plan-title')).toHaveValue(initial.title+' 편집');await expect(page.locator('#plan-goal')).toHaveValue('웹에서 수정한 전체 목표');await expect(page.locator('#plan-audience')).toHaveValue('웹에서 수정한 대상');await expect(page.locator('#plan-sources')).toHaveValue(/UI fixture locator/);await expect(page.locator('#plan-budget')).not.toBeEditable();
 await page.locator('#video-settings summary').click();await page.locator('#video-short').fill('210');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('210');const {topics}=await(await request.get('/api/topics')).json();expect(topics.filter((t:{plan:{metadata:{format:string}}})=>t.plan.metadata.format==='short').every((t:{plan:{totalSeconds:number}})=>t.plan.totalSeconds===210)).toBe(true);
 await page.locator('#video-short').fill('180');await page.locator('#save-video-budgets').click();await expect(page.locator('#plan-budget')).toHaveValue('180');await page.locator('#reset').click();await expect(page.locator('#plan-title')).toHaveValue(initial.title);
});

test('slides can be added, referenced, reordered and removed in the web editor',async({page})=>{
 await page.goto('/#two-children/question');await page.locator('#reset').click();await expect(page.locator('#position')).toHaveText('1 / 6');await page.locator('#slide-add').click();await page.locator('#slide-title').fill('웹에서 추가한 장면');await page.locator('#slide-goal').fill('관측 절차 확인');await page.locator('#narration').fill('관측 절차를 먼저 확인합니다.');await page.locator('#visual').fill('관측 절차 비교');await page.locator('#observation').fill('관측 절차를 확인');await page.locator('#save').click();await expect(page.locator('#save-status')).toHaveText('저장됨');await expect(page.locator('#position')).toHaveText('2 / 7');await page.locator('#slide-down').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 7');await page.reload();await expect(page.locator('#slide-title')).toHaveValue('웹에서 추가한 장면');await page.locator('#slide-delete').click();await page.locator('#save').click();await expect(page.locator('#position')).toHaveText('3 / 6');await page.locator('#reset').click();
});

test('external handoff controls replace embedded chat and import a validated revision-bound review',async({page,request},testInfo)=>{
  await page.goto('/#monty-hall/question');await expect(page.locator('#topic-title')).toContainText('몬티 홀');
  await expect(page.getByRole('heading',{name:'외부 에이전트 전달'})).toBeVisible();await expect(page.locator('.chat-panel')).toHaveCount(0);await expect(page.getByText('Codex와 대화')).toHaveCount(0);
  expect((await request.get('/api/chats')).status()).toBe(404);expect((await request.post('/api/chat-send',{data:{}})).status()).toBe(404);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'독립 리뷰 패킷 내보내기'}).click();expect((await download).suggestedFilename()).toContain('review-packet');
  const packet=await(await request.get('/api/handoff/review/monty-hall')).json();const result={...packet.resultContract,reviewer:{name:'Browser fixture',kind:'external-agent',tool:'Playwright fixture'},evidence:{reviewedAt:'2026-10-18T00:00:00Z',notes:'Controlled protocol fixture, not editorial evidence',artifactRefs:['fixture://studio-browser']},reports:packet.targets.map((target:string)=>({target,report:{summary:'Browser fixture review; not editorial approval',findings:[],timing:{status:'unverified',note:'No audio or rendered-video inspection'}}}))};
  const file=testInfo.outputPath('review-result.json');writeFileSync(file,JSON.stringify(result));await page.locator('#review-result-file').setInputFiles(file);await page.getByRole('button',{name:'검증 후 사용자 제공 리뷰 결과 가져오기'}).click();await expect(page.locator('#handoff-status')).toContainText('가져왔습니다');expect(await page.locator('#jobs .job').count()).toBeGreaterThanOrEqual(packet.targets.length);
  await expect(page.locator('#jobs .job').first()).toContainText('사용자 제공 가져오기');await expect(page.locator('#jobs .job').first()).toContainText('Browser fixture');
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
   await page.locator('#add-visuals').click();await expect(page.locator('#work-state')).toHaveText('작업 공간 준비됨',{timeout:30000});await page.locator('#add-interactions').click();await expect(page.locator('#work-state')).toHaveText('작업 공간 준비됨',{timeout:30000});await page.locator('#build-work').click();await expect(page.locator('#built-result')).toBeVisible({timeout:45_000});
   const packet=await(await request.get('/api/handoff/work/'+id)).json();
   await page.locator('#work-result-file').setInputFiles({name:'agent-qa-implementation-result.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...packet.resultContract,summary:'Agent QA external acknowledgement fixture',checks:[]}))});
   await page.locator('#import-work-result').click();await expect(page.locator('#handoff-status')).toContainText('소스');
   await page.locator('.production > details > summary').click();
   await expect(page.locator('#work-tasks > details > summary').first()).toHaveText(/^구현 기록 · /);
   await page.locator('.production > details > summary').click();
  const firstLab=id==='binary-relations'?'question':id==='monty-hall'?'strategy':'model';await page.locator(`#slides button[data-slide="${firstLab}"]`).click();
  const frame=page.frameLocator('#build-frame');await expect(frame.locator('body')).toContainText(id==='binary-relations'?'순서쌍':id==='monty-hall'?'공개 규칙':'관측');await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('.possibility-lab')).toBeVisible();await frame.locator('[data-action="branch"]').click();await expect(frame.locator('.lab-stage')).toHaveText('분기 1 / 3');
  if(id!=='binary-relations'){await page.locator(`#slides button[data-slide="${id==='monty-hall'?'compare':'child'}"]`).click();await expect(frame.locator('.lab-mode')).toHaveValue(id==='monty-hall'?'blind':'child');await page.locator(`#slides button[data-slide="${firstLab}"]`).click();await expect(frame.locator('.lab-mode')).toHaveValue(id==='monty-hall'?'informed':'filter');}
  await frame.locator('[data-action="animate"]').click();await expect(frame.locator('.lab-stage')).toHaveText('분기 3 / 3');
  if(id==='binary-relations'){await frame.locator('[data-edge="1"]').click();await expect(frame.locator('.lab-note')).toContainText('함수입니다');}
  else{await frame.locator('[data-count="100"]').click();await expect(frame.locator('.lab-status')).toContainText('시도 100회');await frame.locator('[data-action="play"]').click();await expect(frame.locator('[data-action="play"]')).toHaveText('일시정지');await expect(frame.locator('.lab-status')).not.toContainText('시도 100회');await frame.locator('[data-action="play"]').click();await frame.locator('.lab-mode').selectOption(id==='monty-hall'?'blind':'child');await expect(frame.locator('.lab-status')).toContainText('시도 0회');}
  expect(await frame.locator('.possibility-lab').evaluate(e=>{
   const r=e.getBoundingClientRect(),n=document.querySelector('#reader-scenes')!.getBoundingClientRect();return{fits:e.scrollWidth<=e.clientWidth+1,clear:r.bottom<=n.top,accessible:[...e.querySelectorAll('button,input,select')].filter(c=>c.getClientRects().length).every(c=>{const b=c.getBoundingClientRect();return b.bottom<=n.top&&b.right<=innerWidth&&b.left>=0;})};
  })).toEqual({fits:true,clear:true,accessible:true});
  expect(await frame.locator('.possibility-lab').evaluate(()=>{
   const api=window.__atlasRelated!,saved=api.getState();api.seek(5000);const a=api.getState();api.seek(100);api.seek(5000);const reproducible=JSON.stringify(a)===JSON.stringify(api.getState());
   let rejected=false;try{const invalid=structuredClone(a);if(invalid.interaction&&'count'in invalid.interaction)invalid.interaction.count=-1;api.setState(invalid);}catch{rejected=true;}
   const atomic=JSON.stringify(a)===JSON.stringify(api.getState());api.setState(saved);const restored=JSON.stringify(saved)===JSON.stringify(api.getState());api.reset();api.setState({sceneId:saved.sceneId});return{reproducible,rejected,atomic,restored};
  })).toEqual({reproducible:true,rejected:true,atomic:true,restored:true});
  if(id==='binary-relations')await frame.locator('[data-edge="0"]').click();else{await frame.locator('.lab-seed').fill('73');await frame.locator('.lab-seed').press('Tab');await frame.locator('[data-count="10"]').click();}
  const retained=await frame.locator('.possibility-lab').evaluate(()=>window.__atlasRelated!.getState().interaction);
  const next=id==='binary-relations'?'pairs':id==='monty-hall'?'compare':'child';await page.locator(`#slides button[data-slide="${next}"]`).click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#'+next)).toBeVisible();await expect(frame.locator('.possibility-lab')).toBeVisible();await expect(frame.locator('#question')).toBeHidden();
  expect(await frame.locator('.possibility-lab').evaluate(()=>window.__atlasRelated!.getState().interaction)).toEqual(retained);
  await page.locator('#slides button').first().click();await expect(frame.locator('#reader-controls')).toBeVisible();await expect(frame.locator('#question')).toBeVisible();
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.locator('#inspect-work').click();await page.locator('.production > details > summary').click();await expect(page.locator('#work-changes')).toBeVisible();
  const prepared=(await(await request.get('/api/work')).json() as {id:string;directory:string}[]).find(w=>w.id===id)!;
  expect(execFileSync('git',['show',`HEAD:content/${id==='binary-relations'?'mathematics':'statistics'}/${id}/article.ko.json`],{cwd:prepared.directory,encoding:'utf8'})).toContain(`article:${id==='binary-relations'?'mathematics':'statistics'}.${id}.ko`);
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
