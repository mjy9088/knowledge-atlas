import {test, expect, type Page} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';
import {activeWork,expectLongformScene,mainlineSceneIds} from './support/main-work.js';

// Measure content, not just CSS overflow:hidden: clipped scroll containers fail too.
async function expectFrame(page: Page, {content, controls}: {content:string[];controls:string[]}) {
  const problems = await page.evaluate(({content, controls}) => {
    const issues: string[] = [];
    const root = document.documentElement;
    if (root.scrollHeight > innerHeight || root.scrollWidth > innerWidth)
      issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
    for (const selector of [...content, ...controls])
      if (!document.querySelector(selector)) issues.push(`missing layout target: ${selector}`);
    for (const selector of content) for (const node of document.querySelectorAll<HTMLElement>(selector)) {
      if (!node.checkVisibility()) continue;
      if(node.closest('.weekday-settings')&&!node.matches('.weekday-settings'))continue;
      if (node.scrollWidth > node.clientWidth || !node.matches('.weekday-settings')&&node.scrollHeight > node.clientHeight)
        issues.push(`${selector}: content ${node.scrollWidth}×${node.scrollHeight}, space ${node.clientWidth}×${node.clientHeight}`);
      const r = node.getBoundingClientRect();
      if (r.top < 0 || r.left < 0 || r.bottom > innerHeight || r.right > innerWidth)
        issues.push(`${selector}: content outside viewport`);
    }
    for (const selector of controls) for (const node of document.querySelectorAll(selector)) {
      if (!node.checkVisibility()) continue;
      if(node.closest('.weekday-settings'))continue;
      const r = node.getBoundingClientRect();
      if (r.top < 0 || r.left < 0 || r.bottom > innerHeight || r.right > innerWidth)
        issues.push(`${selector}: outside viewport (${r.x}, ${r.y}, ${r.width}, ${r.height})`);
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      if (!hit || (!node.contains(hit) && !hit.contains(node))) issues.push(`${selector}: obscured`);
    }
    return issues;
  }, {content, controls});
  expect(problems).toEqual([]);
}
const relatedFrame = {
  content: ['.reader-copy:not([hidden])', '.explorer-diagram', '.explorer-lines', '.experiment-premises'],
  controls: ['#reader-controls button', '.experiment-goal', '.experiment-heading button', '.reader-menu summary'],
};
const questionTopics=CONTENT_PAGES.filter(p=>p.slug==='weekday-worlds');
const questionFrame={
  content:['#reader-workbench>div:last-child','#reader-workbench p','.reader-scene:not([hidden]) .reader-copy'],
  controls:['#reader-controls button','#reader-workbench button','#reader-workbench input','#reader-workbench select','.reader-menu summary'],
};
const weekdayFrame={content:[...questionFrame.content,'.weekday-bridge,.weekday-rule-table,.weekday-classical-proof,.weekday-frame-systems','.weekday-modal-introduction,.weekday-modal-intro-case,.weekday-modal-intro-worlds,.weekday-modal-intro-world','.weekday-intro-source','.weekday-intro-reasoning','.weekday-interpretation-comparison','.world-comparison','.weekday-sentence','.weekday-sentence-line','.weekday-sentence-question','.weekday-logic-diagram','.weekday-logic-premises','.weekday-logic-node','.weekday-logic-conclusion','.weekday-symbolic-summary','.weekday-settings','.weekday-input-panel','.weekday-reasoning-panel','.weekday-modal-diagram','.world-card','.world-cells','.world-cell','.world-note'],controls:[...questionFrame.controls.filter(selector=>selector!=='#reader-workbench input'),'.weekday-symbol-header']};
for(const topic of questionTopics)test(`${topic.slug}: question-led scenes fit and restore their authored state`,async({page},testInfo)=>{
  if(topic.slug==='weekday-worlds'){await page.clock.install({time:new Date('2026-10-18T00:00:00Z')});await page.clock.pauseAt(new Date('2026-10-18T00:00:00Z'));}
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
  if(topic.cover)await page.locator('#reader-next').click();
  for(const scene of topic.scenes){
    if(topic.slug==='weekday-worlds'&&scene.id==='question')await expect(page.locator('#reader-scenes')).toBeHidden();else await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const state=await page.evaluate(()=>window.__atlasRelated.getState());
    await page.evaluate(()=>window.__atlasRelated.reset());
    await page.evaluate(saved=>window.__atlasRelated.setState(saved),state);
    expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
    await test.step(scene.id,()=>expectFrame(page,topic.slug==='weekday-worlds'?weekdayFrame:questionFrame));
    if(scene===topic.scenes[0]||scene===topic.scenes.at(-1))await testInfo.attach(`${topic.slug}-${scene.id}`,{body:await page.screenshot(),contentType:'image/png'});
    if(scene!==topic.scenes.at(-1)){await page.locator('#reader-next').click();if(topic.slug==='weekday-worlds'&&scene.id==='question')await page.locator('#reader-next').click();}
  }
  if(topic.slug==='weekday-worlds')await expect(page.locator('#reader-end-links')).toHaveCount(0);else await expect(page.locator('#reader-end-links')).toBeVisible();
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

async function weekdayInputs(page:Page){if(await page.locator('.weekday-experiment').getAttribute('data-lesson-stage')==='modal-comparison'){await expect(page.locator('.weekday-modal-introduction')).toBeVisible();await expect(page.locator('.weekday-input-panel')).toBeHidden();await expect(page.locator('.weekday-reasoning-panel')).toBeHidden();return;}await expect(page.locator('.weekday-input-panel')).toBeVisible();if(['question','reason','conditional','notation','inference','nonmodal-proof','modal-rules','modal-systems'].includes((await page.locator('.weekday-experiment').getAttribute('data-lesson-stage'))!))await expect(page.locator('.weekday-reasoning-panel')).toBeHidden();else await expect(page.locator('.weekday-reasoning-panel')).toBeVisible();}
async function weekdayReasoning(page:Page){await weekdayInputs(page);}

test('weekday choice and reflection are one page without a fixed caption or writing field',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const timer=page.getByRole('timer',{name:'남은 시간'}),answer=page.getByRole('button',{name:'수요일',exact:true});
  await expect(page.locator('#reader-scenes')).toBeHidden();expect(await page.locator('#reader-workbench').evaluate(e=>e.getBoundingClientRect().height/innerHeight)).toBeGreaterThan(.9);await expect(timer).toHaveText('20초');await expect(answer).toBeEnabled();
  await page.clock.fastForward(7_000);await expect(timer).toHaveText('13초');
  await answer.click();await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();await expect(page).toHaveURL(/#question$/);
  expect((await page.evaluate(()=>window.__atlasRelated.getState())).sceneId).toBe('question');
  for(const selector of ['.weekday-intro-quote','.weekday-intro-question','.weekday-challenge-quiz'])await expect(page.locator(selector)).toBeHidden();await expect(page.getByRole('textbox')).toHaveCount(0);
  await expect(page.locator('#reader-scenes')).toBeHidden();
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(30_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','conditional');await expect(page.locator('.reader-scene:visible .eyebrow')).toHaveText('2 / 17');
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();
  await page.evaluate(state=>window.__atlasRelated.setState({...state,sceneId:'reason'}),saved);await expect(page).toHaveURL(/#question$/);await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeVisible();
  await expect(page.locator('.reader-menu a[href="#question"]')).toHaveCount(1);await expect(page.locator('.reader-menu a[href="#reason"]')).toHaveCount(0);await expectFrame(page,weekdayFrame);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,challenge:{phase:'expired',elapsedMs:10}}} as never);}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}return false;});expect(rejected).toBe(true);
});

test('weekday expiry, explicit skip and keyboard skip reveal the same in-page question',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const question=page.getByRole('heading',{name:'어떤 기준으로 풀면 좋을까요?',exact:true});
  await page.clock.fastForward(20_000);await expect(question).toBeVisible();await expect(question).toBeFocused();await expect(page).toHaveURL(/#question$/);
  await expect(page.getByRole('heading',{name:'왜 그렇게 생각하셨나요?',exact:true})).toBeHidden();await expect(page.getByRole('button',{name:'설명 보기 →',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'다시 풀어보기',exact:true}).click();await expect(page.getByRole('timer')).toHaveText('20초');await page.clock.fastForward(20_000);await page.getByRole('button',{name:'설명 보기 →',exact:true}).click();await expect(page).toHaveURL(/#conditional$/);
  await page.evaluate(()=>{window.__atlasRelated.setState({sceneId:'question'});window.__atlasRelated.seek(5_000);});await expect(page.getByRole('timer')).toHaveText('15초');
  const frame=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(60_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(frame);
  await page.evaluate(()=>window.__atlasRelated.reset());await page.clock.fastForward(60_000);expect((await page.evaluate(()=>window.__atlasRelated.getState())).interaction).toMatchObject({challenge:{phase:'ready',elapsedMs:0}});await page.locator('#reader-next').click();await expect(page.getByRole('timer')).toHaveText('20초');await expect(page.locator('#reader-next')).toHaveText('건너뛰기 →');await page.locator('#reader-next').click();await expect(question).toBeVisible();
  await page.evaluate(()=>window.__atlasRelated.reset());await page.locator('#reader-next').click();await page.keyboard.press('ArrowRight');await expect(question).toBeVisible();await expect(page).toHaveURL(/#question$/);
  await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/#conditional$/);await expectFrame(page,weekdayFrame);
});

async function weekdayView(page:Page,mode:string){await weekdayInputs(page);const stage=await page.locator('.weekday-experiment').getAttribute('data-disclosure');if(stage!=='formal')return;await page.evaluate(modal=>{const state=window.__atlasRelated.getState();window.__atlasRelated.setState({...state,sceneId:modal?'alethic':'modal-expansion'});},mode.includes('양상'));}

test('weekday review skip keeps edits and lands on a nonmodal worked proof before possible worlds',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true}).selectOption('0');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'notation'}));
  const skip=page.locator('#reader-skip');await expect(skip).toContainText('고전 논리 복습 건너뛰기');await expect(skip).toHaveAttribute('title',/조건문.*후건 부정.*이동: 양상 논리 없이/);
  await expectFrame(page,{...weekdayFrame,controls:[...weekdayFrame.controls,'#reader-skip']});
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','inference');await expect(skip).toBeHidden();
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'notation'}));await skip.click();await expect(page).toHaveURL(/#nonmodal-proof$/);
  await expect(page.locator('.weekday-classical-proof')).toContainText('문제가 묻는 A인 경우를 가정');await expect(page.locator('.weekday-classical-proof')).toContainText('전건 긍정');await expect(page.locator('.weekday-classical-proof')).toContainText('t ≡₇ 0 + 2');await expect(page.locator('.weekday-classical-answer')).toHaveText('따라서 현실의 오늘은 수요일.');
  await expect(page.locator('.weekday-classical-inputs')).toContainText('차이가 7의 정수배');await expect(page.locator('.weekday-congruence-rules')).toContainText('x + c ≡₇ y + c');await expect(page.locator('.weekday-classical-proof ol li')).toHaveCount(7);await expect(page.locator('.weekday-classical-proof')).toContainText('2·4: 추이');
  await expect(page.locator('.weekday-classical-inputs')).toContainText('만약 어제가 내일이라면, 오늘이 월요일이다.');await expect(page.locator('.weekday-classical-inputs')).toContainText('A → B');
  expect(await page.locator('.weekday-bridge').innerText()).not.toMatch(/◇|□|가능세계/);await expectFrame(page,weekdayFrame);
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','contexts');await expect(page.locator('.weekday-source')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeVisible();
  const current=(await page.evaluate(()=>window.__atlasRelated.getState())).interaction;expect(current).toEqual(saved.interaction);
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState({...state,sceneId:'nonmodal-proof'}),saved);await expect(page.locator('.weekday-classical-answer')).toContainText('수요일');
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();if(!state.interaction||!('contexts'in state.interaction))throw new Error('Expected weekday state');window.__atlasRelated.setState({...state,interaction:{...state.interaction,contexts:{yesterday:1,tomorrow:0,consequent:1,question:0},customized:true}});});
  await expect(page.locator('.weekday-classical-proof ol li')).toHaveCount(8);await expect(page.locator('.weekday-classical-proof')).toContainText('2: 대칭');await expect(page.locator('.weekday-classical-proof')).toContainText('5·4: 추이');await expect(page.locator('.weekday-classical-answer')).toContainText('토요일');await expectFrame(page,weekdayFrame);
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();if(!state.interaction||!('contexts'in state.interaction))throw new Error('Expected weekday state');window.__atlasRelated.setState({...state,interaction:{...state.interaction,contexts:{yesterday:0,tomorrow:0,consequent:0,question:0},customized:true}});});
  await expect(page.locator('.weekday-classical-proof')).toContainText('맞는 달력이 없습니다');await expect(page.locator('.weekday-classical-answer')).toHaveCount(0);await expectFrame(page,weekdayFrame);
});

test('weekday modality introduction shows only separate possibility and necessity examples and preserves edits',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);
  for(const selector of ['.weekday-source','.weekday-settings','.weekday-logic-diagram','.weekday-interpretation-comparison','.weekday-modal-diagram'])await expect(page.locator(selector)).toBeHidden();
  const intro=page.locator('.weekday-modal-introduction');await expect(intro).toBeVisible();await expect(intro.locator('.weekday-modal-intro-world')).toHaveCount(6);
  for(const [id,actual,necessary]of [['possible','거짓','false'],['necessary','참','true']]){const card=intro.locator(`[data-example="${id}"]`);await expect(card.locator('.weekday-modal-intro-actual')).toHaveText('현실에서 P: '+actual);await expect(card.locator('[data-operator="◇P"]')).toHaveAttribute('data-truth','true');await expect(card.locator('[data-operator="□P"]')).toHaveAttribute('data-truth',necessary);}
  await expectFrame(page,weekdayFrame);await page.locator('#reader-next').click();await expect(page).toHaveURL(/#alethic$/);await expect(page.locator('.weekday-modal-diagram')).toBeVisible();
  await page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true}).selectOption('0');const saved=(await page.evaluate(()=>window.__atlasRelated.getState())).interaction;
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-comparison'}));expect({...((await page.evaluate(()=>window.__atlasRelated.getState())).interaction),logicMode:undefined}).toEqual({...saved,logicMode:undefined});await expect(intro.locator('.weekday-modal-intro-proposition')).toContainText('금요일');
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion'}));await expect(page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true})).toHaveValue('0');await expect(page.locator('.weekday-interpretation-comparison')).toBeVisible();await expect(intro).toBeHidden();
});

test('weekday nonmodal model allows presets and keeps antecedent and consequent on separate unbroken lines',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#contexts');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.getByRole('button',{name:'세계 · 접근 관계',exact:true})).toBeHidden();await expect(page.getByRole('button',{name:'세계 추가',exact:true})).toBeHidden();
  for(const preset of ['B · 현실 내일 고정','C · 가능세계 없이','A · 현실 어제 고정']){
    const button=page.getByRole('button',{name:preset,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');
    const first=page.locator('.weekday-sentence-antecedent-line'),second=page.locator('.weekday-sentence-consequent-line'),a=await first.boundingBox(),b=await second.boundingBox();expect(a!.y+a!.height).toBeLessThanOrEqual(b!.y);await expect(first).toContainText('① 어제');await expect(first).toContainText('② 내일');await expect(second).toContainText('③ 오늘');await expect(second).toContainText('이다.”');
    await expectFrame(page,{...weekdayFrame,content:[...weekdayFrame.content,'.weekday-sentence-antecedent-line','.weekday-sentence-consequent-line']});
  }
  await page.locator('#reader-next').click();await expect(page.locator('.weekday-modal-introduction')).toBeVisible();await page.locator('#reader-next').click();await expect(page.getByRole('button',{name:'세계 · 접근 관계',exact:true})).toBeVisible();
});

test('weekday modal systems distinguish the K editor from current S4 or S5 frame conditions',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-systems');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.weekday-system-table tbody tr')).toHaveCount(6);await expect(page.locator('.weekday-system-table')).toContainText('K');await expect(page.locator('.weekday-system-table')).toContainText('T + B');
  await page.locator('#reader-next').click();await expect(page).toHaveURL(/#frame-system$/);
  const status=page.locator('.weekday-frame-systems');await expect(status).toContainText('편집기의 기본 보장: K');await expect(status.locator('[data-system="S4"]')).toHaveAttribute('data-satisfied','true');await expect(status.locator('[data-system="S5"]')).toHaveAttribute('data-satisfied','false');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await page.getByRole('checkbox',{name:'가정 1 → 현실',exact:true}).check();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await expect(status.locator('[data-system="S5"]')).toHaveAttribute('data-satisfied','true');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(status.locator('[data-system="S5"]')).toHaveAttribute('data-satisfied','true');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();for(const name of ['현실 → 현실','현실 → 가정 1','가정 1 → 현실','가정 1 → 가정 1'])await page.getByRole('checkbox',{name,exact:true}).uncheck();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await expect(status.locator('[data-system="K"]')).toHaveAttribute('data-satisfied','true');await expect(status.locator('[data-system="D"]')).toHaveAttribute('data-satisfied','false');await expect(status.locator('[data-system="T"]')).toHaveAttribute('data-satisfied','false');await expectFrame(page,weekdayFrame);
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(status.locator('[data-system="S5"]')).toHaveAttribute('data-satisfied','true');
});

test('weekday modal notation expands over exactly the current accessible worlds',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  const some=page.locator('[data-modal-expansion="◇P"]'),all=page.locator('[data-modal-expansion="□P"]');
  await expect(some).toHaveText('하나 이상: P(w₀) ∨ P(w₁) ↔ ◇P');await expect(all).toHaveText('모두: P(w₀) ∧ P(w₁) ↔ □P');
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await page.getByRole('button',{name:'세계 추가',exact:true}).click();
  await expect(some).toHaveText('하나 이상: P(w₀) ∨ P(w₁) ∨ P(w₂) ∨ P(w₃) ↔ ◇P');await expect(all).toContainText('P(w₂) ∧ P(w₃)');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();if(!state.interaction||!('access'in state.interaction))throw new Error('Expected weekday state');window.__atlasRelated.setState({...state,interaction:{...state.interaction,access:[],customized:true}});});
  await expect(some).toHaveText('하나 이상: ⊥ ↔ ◇P');await expect(all).toHaveText('모두: ⊤ ↔ □P');await expectFrame(page,weekdayFrame);
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(some).toContainText('P(w₃)');await expectFrame(page,weekdayFrame);
});

test('weekday target stays transparent and optional reference comparison separates date contexts from accessibility',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  for(const selector of ['.weekday-target-trigger','.weekday-target-select'])expect(await page.locator(selector).evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true}).selectOption('0');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState()),opener=page.getByRole('button',{name:'기준 변경과 양상 비교 ↗',exact:true});await opener.click();
  const dialog=page.getByRole('dialog',{name:'기준 변경과 양상 논리 비교',exact:true});await expect(dialog).toBeVisible();
  const dates=dialog.getByRole('table',{name:'기준에 따른 날짜 식과 답',exact:true});await expect(dates).toContainText('t − 1 ≡₇ h + 1');await expect(dates).toContainText('h − 1 ≡₇ t + 1');await expect(dates).toContainText('수요일');await expect(dates).toContainText('토요일');
  const modal=dialog.getByRole('table',{name:'접근 범위에 따른 비양상 전개와 양상 판정',exact:true});await expect(modal.locator('tbody tr').nth(0)).toContainText('◇P: 참');await expect(modal.locator('tbody tr').nth(0)).toContainText('□P: 거짓');await expect(modal.locator('tbody tr').nth(1)).toContainText('□P: 참');
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const body=dialog.locator('.weekday-reference-contrast-body');await body.evaluate(e=>e.scrollTop=e.scrollHeight);await expect(dialog.getByRole('button',{name:'비교 자료 닫기',exact:true})).toBeInViewport();
  const bounds=await dialog.boundingBox(),viewport=page.viewportSize()!;expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.y).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(viewport.width);expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(viewport.height);expect(await body.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(opener).toBeFocused();await opener.click();await dialog.getByRole('button',{name:'비교 자료 닫기',exact:true}).click();await expect(dialog).toBeHidden();
  await opener.click();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'contexts'}));await expect(dialog).toBeHidden();await expectFrame(page,weekdayFrame);
});

test('weekday bridge symbols and their A/B meaning lines highlight along the same paths',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#notation');await page.waitForFunction(()=>window.__atlasRelated);
  for(const [role,text]of [['antecedent','A: t − 1 ≡₇ h + 1'],['consequent','B: h ≡₇ 4']]){
    const letter=page.locator(`.weekday-bridge-formula [data-alignment-node="${role}"]`),meaning=page.locator(`.weekday-bridge-definition[data-alignment-node="${role}"]`);
    await letter.hover();await expect(meaning).toHaveText(text);await expect(meaning).toHaveAttribute('data-alignment-current','');await expect(page.locator('.weekday-bridge [data-alignment-side="source"][data-alignment-node="constraints"]')).toHaveAttribute('data-alignment-on-path','');
    await meaning.focus();await expect(letter).toHaveAttribute('data-alignment-current','');await expectFrame(page,weekdayFrame);
  }
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();if(!state.interaction||!('worlds'in state.interaction))throw new Error('Expected weekday state');window.__atlasRelated.setState({...state,interaction:{...state.interaction,target:0,worlds:[...state.interaction.worlds,{id:2,today:0}],contexts:{yesterday:2,tomorrow:0,consequent:1,question:0},customized:true}});});
  await expect(page.locator('.weekday-bridge-definition')).toHaveText(['A: t₂ − 1 ≡₇ t + 1','B: h ≡₇ 0']);await expectFrame(page,weekdayFrame);
});

test('weekday Next keeps the same bounds on title, every scene, both modes and final links',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  const baseline=await page.locator('#reader-next').boundingBox();expect(baseline).not.toBeNull();
  const menuBox=await page.locator('.reader-menu summary').boundingBox();expect(baseline!.y-menuBox!.y-menuBox!.height).toBeLessThanOrEqual(40);
  async function stable(){const box=await page.locator('#reader-next').boundingBox();expect(box).not.toBeNull();for(const key of ['x','y','width','height'] as const)expect(Math.abs(box![key]-baseline![key]),key).toBeLessThan(.1);}
  await page.locator('#reader-next').click();
  for(const scene of CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    for(const mode of ['달력','양상']){await weekdayView(page,mode);await stable();await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await stable();await expectFrame(page,weekdayFrame);}
  }
  await expect(page.locator('#reader-end-links,#reader-skip-scope')).toHaveCount(0);await expectFrame(page,{content:['.reader-action-rail'],controls:['#reader-prev','#reader-next']});
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await stable();await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await stable();await testInfo.attach('weekday-fixed-next-final',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday actions stay compact with menu links and tooltip-only keyboard help; other readers keep their navigation',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const hint=page.locator('#reader-skip-scope'),links=page.locator('#reader-end-links'),next=page.locator('#reader-next'),prev=page.locator('#reader-prev'),menu=page.locator('.reader-menu summary');
  await expect(hint).toHaveCount(0);await expect(links).toHaveCount(0);
  await expect(next).toHaveAttribute('title','→ 방향키 · Space / Enter: 다음');await expect(prev).toHaveAttribute('title','← 방향키: 이전 장면');
  const a=await menu.boundingBox(),b=await prev.boundingBox(),c=await next.boundingBox();if(!a||!b||!c)throw new TypeError('Expected visible weekday actions');expect(b.y).toBeGreaterThanOrEqual(a.y+a.height);expect(b.y-a.y-a.height).toBeLessThanOrEqual(5);expect(c.y).toBe(b.y);expect(c.x).toBeGreaterThanOrEqual(b.x+b.width);expect(c.x-b.x-b.width).toBeLessThanOrEqual(5);
  for(const action of [a,b,c]){expect(action.width).toBeGreaterThanOrEqual(44);expect(action.height).toBeGreaterThanOrEqual(44);}
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion'}));await expect(page.locator('.weekday-source')).toContainText('만약');
  expect(await page.locator('.alignment-status').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,clip:getComputedStyle(e).clipPath}))).toEqual({width:1,height:1,clip:'inset(50%)'});await expect(page.locator('.weekday-sentence [data-alignment-node][title],.weekday-context-select[title],.weekday-logic-diagram [data-alignment-node][title]')).toHaveCount(0);
  const term=page.locator('.weekday-symbol-clause [data-alignment-node="yesterday-base"]');await term.hover();await expect(page.locator('.weekday-source [data-alignment-node="yesterday-base"]')).toHaveAttribute('data-alignment-current','');
  const snapshot=await page.evaluate(()=>window.__atlasRelated.getState());await page.keyboard.press('ArrowRight');await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','modal-rules');
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'conclusion'}));await expect(hint).toHaveCount(0);await expect(links).toHaveCount(0);
  await menu.click();await expect(page.locator('.reader-menu a[href="/knowledge/"]')).toBeVisible();await expect(page.locator('.reader-menu a[href="#evidence"]')).toHaveCount(1);
  await page.locator('.reader-menu a[href="#evidence"]').click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');await page.keyboard.press('Escape');
  await page.evaluate(state=>window.__atlasRelated.setState(state),snapshot);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-compact-actions',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('.reader-menu').evaluate(e=>(e as HTMLDetailsElement).open=true);await page.locator('.reader-menu a[href="/knowledge/"]').click();await expect(page).toHaveURL(/\/knowledge\/$/);
  await page.goto('/knowledge/number-structures/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const finalMainline=mainlineSceneIds(activeWork('number-structures')).at(-1);if(!finalMainline)throw new TypeError('Missing number-structures mainline');
  await expect(hint).toBeVisible();await expect(links).toBeHidden();
  await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),finalMainline);await expect(links).toBeVisible();await expect(links.locator('a')).toHaveText(['지식 목록 ↗','근거와 범위']);
});

test('weekday title slide, simultaneous original/symbol panels, named worlds and scrollable choices restore independently',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.reader-cover h1')).toBeVisible();await expect(page.locator('#reader-workbench')).toBeHidden();expect(await page.evaluate(()=>window.__atlasRelated.getState().cover)).toBe(true);
  const titleState=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(page.locator('.reader-cover h1')).toBeHidden();await weekdayInputs(page);
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeHidden();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion'}));
  await expect(page.locator('.weekday-source')).toBeVisible();await expect(page.locator('.weekday-symbolic-summary')).toBeVisible();await expect(page.locator('.weekday-source')).toContainText('가정 1');await expect(page.locator('.weekday-source')).not.toContainText('w₁');await expect(page.locator('.weekday-symbolic-summary')).toContainText('w₁');
  const settings=page.locator('.weekday-settings');await expect(settings).toHaveCSS('overflow-y','auto');await expect(settings).toHaveCSS('background-color','rgb(255, 255, 255)');await expect(settings.getByRole('heading',{name:'선택'})).toBeVisible();
  for(const control of await settings.locator('button,select').all()){
    if(await control.isDisabled())continue;await control.scrollIntoViewIfNeeded();
    const reachable=await control.evaluate(e=>{const r=e.getBoundingClientRect(),s=e.closest('.weekday-settings')!.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.top>=s.top&&r.bottom<=s.bottom&&Boolean(hit&&(e.contains(hit)||hit.contains(e)));});expect(reachable).toBe(true);
  }
  await settings.evaluate(e=>e.scrollTop=0);await weekdayView(page,'양상');await expect(page.locator('.weekday-symbolic-summary')).toContainText('P: 이 세계의 오늘은 금요일');await weekdayReasoning(page);await expect(page.locator('.weekday-modal-diagram')).toBeVisible();await expect(page.locator('.weekday-modal-diagram svg')).toHaveAttribute('aria-label',/현실 → 가정 1/);
  await weekdayInputs(page);await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-world-dialog select')).toHaveCount(0);await expect(page.getByRole('checkbox',{name:'현실 → 가정 1',exact:true})).toBeVisible();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  const readingState=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await expect(page.locator('.reader-cover h1')).toBeVisible();await page.evaluate(saved=>window.__atlasRelated.setState(saved),readingState);await expect(page.locator('.reader-cover h1')).toBeHidden();await weekdayInputs(page);await expect(page.locator('.weekday-experiment')).toHaveAttribute('data-logic-mode','alethic');
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,cover:'invalid'} as never);}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}return false;});expect(rejected).toBe(true);
  await page.evaluate(saved=>window.__atlasRelated.setState(saved),titleState);await expect(page.locator('.reader-cover h1')).toBeVisible();await page.goto('/knowledge/weekday-worlds/#sunday');await expect(page.locator('.reader-cover h1')).toBeHidden();await expect(page.locator('.reader-scene:visible h2')).toContainText('일요일');await weekdayInputs(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-stacked-reading',{body:await page.screenshot(),contentType:'image/png'});
});

test('skip controls appear only for a distinct jump and disclose scope and destination',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  for(const scene of CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    if(scene.skip)await expect(page.locator('#reader-skip')).toBeVisible();else await expect(page.locator('#reader-skip')).toBeHidden();await expect(page.locator('.reader-scene:visible .skip-context')).toBeHidden();
  }
});

test('deleting reference and evaluation worlds removes every UI reference and survives navigation and restore',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await page.getByRole('button',{name:'세계 추가',exact:true}).click();
  await page.getByRole('combobox',{name:'세계 선택 목록',exact:true}).selectOption('accessible');
  for(const id of [1,2,3]){
    for(const name of ['① 어제의 기준','② 내일의 기준','③ 그럼 오늘의 기준','④ 묻는 오늘의 기준','평가·접근 기준'])await page.getByRole('combobox',{name,exact:true}).selectOption(String(id));
    await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await page.getByRole('button',{name:`가정 ${id} 삭제`,exact:true}).click();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
    for(const name of ['① 어제의 기준','② 내일의 기준','③ 그럼 오늘의 기준','④ 묻는 오늘의 기준','평가·접근 기준'])await expect(page.getByRole('combobox',{name,exact:true})).toHaveValue('0');
    for(const mode of ['달력','양상']){
      await weekdayView(page,mode);await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);
      for(let removed=1;removed<=id;removed++)await expect(page.locator(`.weekday-experiment [data-world="${removed}"]:not([data-create-world]),.weekday-world-dialog [data-world="${removed}"]`)).toHaveCount(0);
      await weekdayInputs(page);
    }
    await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-rules'}));await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'transfer'}));
    const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);await weekdayInputs(page);
    for(let removed=1;removed<=id;removed++)await expect(page.locator(`.weekday-experiment [data-world="${removed}"]:not([data-create-world]),.weekday-world-dialog [data-world="${removed}"]`)).toHaveCount(0);
  }
  await expect(page.locator('.weekday-symbol-definition').first()).toContainText('W = {w₀}');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-dialog-world')).toHaveCount(1);await expect(page.locator('.weekday-access-matrix input')).toHaveCount(1);await testInfo.attach('weekday-only-remaining-world',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday layout keeps every project viewport usable with four worlds',async({page},testInfo)=>{
  const topic=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!;
  for(const scene of topic.scenes){
    await page.goto(`/knowledge/weekday-worlds/#${scene.id}`);await page.waitForFunction(()=>window.__atlasRelated);
    if(await page.locator('.weekday-experiment').getAttribute('data-disclosure')!=='formal'){await expectFrame(page,weekdayFrame);continue;}
    while(await page.getByRole('button',{name:'세계 추가',exact:true}).isEnabled())await page.getByRole('button',{name:'세계 추가',exact:true}).click();
    for(const mode of ['달력','양상']){
      await weekdayView(page,mode);await test.step(`${scene.id} / ${mode}`,()=>expectFrame(page,weekdayFrame));
    }
  }
  const measures=await page.evaluate(()=>({width:document.querySelector('.weekday-experiment')!.getBoundingClientRect().width/innerWidth,controls:[...document.querySelectorAll<HTMLSelectElement>('.weekday-context-select')].map(node=>({font:parseFloat(getComputedStyle(node).fontSize),height:node.getBoundingClientRect().height}))}));
  if((page.viewportSize()?.width??0)>=1200)expect(measures.width).toBeGreaterThan(.9);
  else expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const desktop=(page.viewportSize()?.width??0)>=1200,minimumFont=desktop?13:10,minimumHeight=desktop?34:24;
  for(const control of measures.controls){expect(control.font).toBeGreaterThanOrEqual(minimumFont);expect(control.height).toBeGreaterThanOrEqual(minimumHeight);}
  await testInfo.attach('weekday-four-worlds',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday reference choices create absent worlds and identify other expressions using each world',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  const first=page.getByRole('combobox',{name:'① 어제의 기준',exact:true}),second=page.getByRole('combobox',{name:'② 내일의 기준',exact:true}),third=page.getByRole('combobox',{name:'③ 그럼 오늘의 기준',exact:true}),fourth=page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true}),evaluation=page.getByRole('combobox',{name:'평가·접근 기준',exact:true});
  await expect(second.locator('option[value="1"]')).toHaveText('가정 1 (③의 기준)');await expect(third.locator('option[value="1"]')).toHaveText('가정 1 (②의 기준)');await expect(first.locator('option[value="1"]')).toHaveText('가정 1 (②·③의 기준)');
  await expect(second.locator('optgroup[label="새 세계 추가"] option')).toHaveText(['가정 2 (선택하여 추가)','가정 3 (선택하여 추가)']);
  await second.selectOption('new:2');await expect(second).toHaveValue('2');await expect(third.locator('option[value="2"]')).toHaveText('가정 2 (②의 기준)');await expect(third.locator('option[value="1"]')).toHaveText('가정 1');
  await third.selectOption('2');await expect(second.locator('option[value="2"]')).toHaveText('가정 2 (③의 기준)');await expect(fourth.locator('option[value="2"]')).toHaveText('가정 2 (②·③의 기준)');
  await evaluation.selectOption('new:3');await expect(evaluation).toHaveValue('3');await expect(first.locator('[data-create-world]')).toHaveCount(0);await expect(page.getByRole('button',{name:'세계 추가',exact:true})).toBeDisabled();
  await page.getByRole('combobox',{name:'세계 선택 목록',exact:true}).selectOption('accessible');await expect(second.locator('option[value="2"]')).toHaveJSProperty('disabled',true);await expect(second.locator('option[value="2"]')).toContainText('③의 기준');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await page.getByRole('button',{name:'가정 2 삭제',exact:true}).click();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await expect(second).toHaveValue('0');await expect(second.locator('option[value="2"]')).toHaveCount(0);await expect(second.locator('option[value="new:2"]')).toHaveText('가정 2 (선택하여 추가)');
  await first.selectOption('new:2');await expect(first).toHaveValue('2');await expect(second.locator('option[value="2"]')).toHaveText('가정 2 (①의 기준)');await expect(second.locator('option[value="2"]')).toHaveJSProperty('disabled',false);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  const configuration=await page.evaluate(()=>{const s=window.__atlasRelated.getState().interaction;if(!s||!('worlds'in s))throw new Error('Expected worlds');return {ids:s.worlds.map(w=>w.id),hasNewEdge:s.access.some(e=>e[0]===3&&e[1]===2),hasSelf:s.access.some(e=>e[0]===2&&e[1]===2)};});expect(configuration).toEqual({ids:[0,1,2,3],hasNewEdge:true,hasSelf:true});
  await page.locator('#reader-next').click();await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await weekdayInputs(page);await expect(first).toHaveValue('2');await expect(second.locator('option[value="2"]')).toHaveText('가정 2 (①의 기준)');
  await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-reference-creation',{body:await page.screenshot(),contentType:'image/png'});await weekdayReasoning(page);await expectFrame(page,weekdayFrame);
  await weekdayInputs(page);await page.getByRole('button',{name:'C · 가능세계 없이',exact:true}).click();await expectFrame(page,weekdayFrame);
  const clippedLabels=await page.locator('.weekday-basis select[data-world]').evaluateAll(nodes=>{const canvas=document.createElement('canvas'),context=canvas.getContext('2d')!;return nodes.flatMap(node=>{const select=node as HTMLSelectElement,style=getComputedStyle(select);context.font=style.font;const text=select.selectedOptions[0].textContent??'',needed=context.measureText(text).width+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+20;return needed>select.clientWidth?[text]:[];});});expect(clippedLabels).toEqual([]);
});

test('weekday world identity colors agree across selectors, sentence, formulas, graph and configuration',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await page.getByRole('button',{name:'세계 추가',exact:true}).click();
  const control=page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true});
  for(let id=0;id<4;id++){
    await control.selectOption(String(id));await weekdayView(page,'달력');
    const sentenceColor=await page.locator('.weekday-sentence-question .weekday-word').evaluate(e=>getComputedStyle(e).backgroundColor);
    expect(await control.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(sentenceColor);
    await weekdayReasoning(page);expect(await page.locator(`.world-card[data-world="${id}"]`).evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(sentenceColor);await weekdayInputs(page);
    await weekdayView(page,'달력');expect(await page.locator(`.weekday-symbol-query [data-world="${id}"]`).evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(sentenceColor);
  }
  const colors=await control.locator('option').evaluateAll(options=>options.map(e=>getComputedStyle(e).backgroundColor));expect(new Set(colors).size).toBe(4);
  expect(await page.locator('.world-cell[data-linked=true]').evaluateAll(nodes=>nodes.every(e=>getComputedStyle(e).backgroundColor===getComputedStyle(e.closest('.world-card')!).backgroundColor))).toBe(true);
  await weekdayView(page,'양상');await weekdayReasoning(page);
  expect(await page.locator('.weekday-modal-diagram circle[data-world]').evaluateAll(nodes=>nodes.map(e=>getComputedStyle(e).fill))).toEqual(colors);
  await weekdayInputs(page);await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();
  expect(await page.locator('.weekday-dialog-world').evaluateAll(nodes=>nodes.map(e=>getComputedStyle(e).backgroundColor))).toEqual(colors);
  await page.getByRole('button',{name:'가정 2 삭제',exact:true}).click();
  expect(await page.locator('.weekday-dialog-world[data-world="3"]').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(colors[3]);
  await page.getByRole('button',{name:'설정 닫기',exact:true}).click();await control.selectOption('3');expect(await control.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(colors[3]);
  await weekdayReasoning(page);await expectFrame(page,weekdayFrame);
});

test('weekday worlds preserve independent expressions, preset semantics and validated state',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  const controls=['① 어제의 기준','② 내일의 기준','③ 그럼 오늘의 기준','④ 묻는 오늘의 기준'].map(name=>page.getByRole('combobox',{name,exact:true}));
  const target=page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true});
  await expect(page.locator('.weekday-presets button')).toHaveCount(3);await expect(page.locator('.weekday-symbolic-summary')).toBeVisible();
  const layout=await page.evaluate(()=>{const a=document.querySelector('.weekday-input-panel')!.getBoundingClientRect(),b=document.querySelector('.weekday-reasoning-panel')!.getBoundingClientRect();return {desktop:innerWidth>720,left:a.right<=b.left,sameTop:Math.abs(a.top-b.top)<1};});if(layout.desktop){expect(layout.left).toBe(true);expect(layout.sameTop).toBe(true);}
  await expect(page.locator('.weekday-logic-conclusion')).toContainText('④ 오늘은 일요일');
  await page.getByRole('button',{name:'B · 현실 내일 고정',exact:true}).click();await expect(controls[0]).toHaveValue('1');await expect(controls[1]).toHaveValue('0');await expect(controls[2]).toHaveValue('1');await expect(page.locator('.weekday-result')).toContainText('현실 답: 수요일');
  await controls[3].selectOption('1');await expect(page.locator('.weekday-result')).toContainText('조건의 재확인: 금요일');
  await controls[2].selectOption('0');await expect(page.locator('.weekday-result')).toContainText('다른 세계의 답: 일요일');
  await controls[0].selectOption('0');await expect(page.locator('.weekday-result')).toContainText('조건을 만족하는 달력 없음');
  await page.getByRole('button',{name:'B · 현실 내일 고정',exact:true}).click();await page.locator('#reader-prev').click();await expect(controls[0]).toHaveValue('1');
  await expect(page.getByRole('combobox',{name:'현실의 오늘',exact:true})).toHaveCount(0);await expect(page.locator('.weekday-result')).toContainText('두 조건을 만족하는 모든 경우에 성립');
  await target.selectOption('0');await page.getByRole('button',{name:'A · 현실 어제 고정',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('현실 답: 수요일');await expect(target).toHaveValue('0');
  await page.getByRole('button',{name:'B · 현실 내일 고정',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('현실 답: 토요일');
  await page.getByRole('button',{name:'C · 가능세계 없이',exact:true}).click();await expect(page.locator('.world-card')).toHaveCount(1);for(const control of controls)await expect(control).toHaveValue('0');await expect(page.locator('.weekday-result')).toContainText('조건을 만족하는 달력 없음');
  await page.getByRole('button',{name:'A · 현실 어제 고정',exact:true}).click();
  const custom=await page.evaluate(()=>window.__atlasRelated.getState());
  for(let mask=0;mask<16;mask++){
    const kind=await page.evaluate(({custom,mask})=>{if(!custom.interaction||!('contexts'in custom.interaction))throw new Error('Expected weekday state');const bit=(index:number):0|1=>(mask>>index)&1?1:0;window.__atlasRelated.setState({...custom,interaction:{...custom.interaction,customized:true,contexts:{yesterday:bit(0),tomorrow:bit(1),consequent:bit(2),question:bit(3)}}});const info=window.__atlasRelated.getInspectionSnapshot().interaction;if(!info||!('contexts'in info))throw new Error('Expected weekday inspection');return info.result.kind;},{custom,mask});
    const expected=(mask&1)===((mask>>1)&1)?'impossible':((mask>>2)&1)===((mask>>3)&1)?'direct':mask&8?'reversed':'inferred';expect(kind).toBe(expected);await expectFrame(page,weekdayFrame);
  }
  await page.evaluate(state=>window.__atlasRelated.setState(state),custom);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>{const s=window.__atlasRelated.getState();if(s.interaction&&'worlds'in s.interaction){s.interaction.worlds[0].today=0;s.interaction.access[0][0]=1;s.interaction.contexts.question=1;}});expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();let rejected=0;for(const patch of [{actual:7},{target:NaN},{contexts:{yesterday:0,tomorrow:1,consequent:1,question:3}},{contexts:null},{worlds:[]},{access:[[0,3]]},{evaluationWorld:3},{logicMode:'unknown'},{representation:'unknown'},{version:99}])try{window.__atlasRelated.setState({...before,sceneId:'conclusion',interaction:{...before.interaction,...patch}} as never);}catch{rejected++;}return rejected===10&&JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());});expect(rejected).toBe(true);
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-expansion',interaction:{actual:6,target:4,rule:'actual-yesterday',example:'question',customized:true}} as never));await weekdayInputs(page);await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');await expect(target).toHaveValue('4');await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-final-layout',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday original expressions own the choices and every displayed day follows the constraints',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  await expect(page.locator('.weekday-original-section .weekday-context-select')).toHaveCount(4);
  await expect(page.locator('.weekday-settings .weekday-context-select')).toHaveCount(0);
  await expect(page.getByRole('combobox',{name:'현실의 오늘',exact:true})).toHaveCount(0);
  const input=page.getByRole('combobox',{name:'① 어제의 기준',exact:true});
  const native=await input.evaluate(e=>e.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true})));expect(native).toBe(false);await expect(page.getByRole('listbox',{name:'① 어제의 기준',exact:true})).toBeVisible();await page.keyboard.press('Escape');
  await page.evaluate(()=>{const saved=window.__atlasRelated.getState();if(!saved.interaction||!('worlds'in saved.interaction))throw new Error('Expected worlds');saved.interaction.actual=0;for(const w of saved.interaction.worlds)w.today=0;window.__atlasRelated.setState(saved);});
  await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');await expect(page.locator('.world-card[data-world="0"] .world-cell').nth(1)).toContainText('일요일');
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await expect(page.locator('.world-card[data-world="2"]')).toContainText('오늘 미정');
  await page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true}).selectOption('2');await expect(page.locator('.weekday-result')).toContainText('가능한 요일 7개');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-world-dialog select')).toHaveCount(0);
  await page.getByRole('checkbox',{name:'현실 → 가정 2',exact:true}).uncheck();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('가능한 요일 7개');
  await expectFrame(page,weekdayFrame);
});

test('weekday editable worlds and accessibility preserve reference choices during modal translation',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  await weekdayView(page,'양상');
  await expect(page.locator('.weekday-modal-proposition')).toHaveText('P: 이 세계의 오늘은 금요일');await expect(page.locator('.weekday-modal-limit')).toContainText('◇ 하나 이상');
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await page.getByRole('button',{name:'세계 추가',exact:true}).click();await expect(page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true}).locator('option')).toHaveCount(4);await expect(page.getByRole('button',{name:'세계 추가',exact:true})).toBeDisabled();
  await page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true}).selectOption('2');await expect(page.locator('.weekday-result')).toContainText('가능한 요일 7개');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('dialog[open]')).toBeVisible();
  await page.getByRole('checkbox',{name:'현실 → 현실',exact:true}).uncheck();await page.getByRole('checkbox',{name:'현실 → 가정 2',exact:true}).uncheck();await page.getByRole('checkbox',{name:'현실 → 가정 3',exact:true}).uncheck();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();
  await page.getByRole('combobox',{name:'세계 선택 목록',exact:true}).selectOption('accessible');
  const question=page.getByRole('combobox',{name:'④ 묻는 오늘의 기준',exact:true});await expect(question.locator('option:enabled')).toHaveText(['가정 1 (②·③의 기준)']);await expect(question).toHaveValue('2');await expect(question.locator('option:disabled')).toContainText('범위 밖');
  await expect(page.locator('.weekday-modal-proposition')).toHaveText('P: 이 세계의 오늘은 금요일');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await page.getByRole('checkbox',{name:'현실 → 가정 1',exact:true}).uncheck();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();await expect(page.locator('.weekday-modal-limit')).toContainText('접근 세계 없음');
  await page.getByRole('combobox',{name:'평가·접근 기준',exact:true}).selectOption('1');await expect(question.locator('option:enabled')).toHaveText(['가정 1 (②·③의 기준)']);
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await page.getByRole('button',{name:'가정 2 삭제',exact:true}).click();await page.getByRole('button',{name:'설정 닫기',exact:true}).click();await expect(question).toHaveValue('0');
  await page.getByRole('combobox',{name:'세계 선택 목록',exact:true}).selectOption('all');await expect(question.locator('option:not([data-create-world])')).toHaveText(['현실 (①의 기준)','가정 1 (②·③의 기준)','가정 3']);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-rules'}));await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'transfer'}));await expect(question.locator('option:not([data-create-world])')).toHaveCount(3);await page.evaluate(s=>window.__atlasRelated.setState(s),saved);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-modal-multiworld',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday direct links preserve both nonmodal and alethic views in narrow windows',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});const topic=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!;
  for(const scene of topic.scenes){await page.goto(`/knowledge/${topic.slug}/#${scene.id}`);await page.waitForFunction(()=>window.__atlasRelated);if(scene.id==='question')await expect(page.locator('#reader-scenes')).toBeHidden();else await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);await expectFrame(page,weekdayFrame);
    for(const mode of ['달력','양상']){await weekdayInputs(page);await weekdayView(page,mode);await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);}
    if(scene.id==='wednesday')await testInfo.attach('weekday-narrow-alethic',{body:await page.screenshot(),contentType:'image/png'});
  }
});

test('number-structures: every authored scene has complete long-form source and reachable controls', async ({page}) => {
  const work=activeWork('number-structures');await page.goto('/knowledge/number-structures/');await page.waitForFunction(()=>window.__atlasRelated);
  for(const scene of work.page.scenes){await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);await test.step(scene.id,()=>expectLongformScene(page,work,scene.id));}
  const finalMainline=mainlineSceneIds(work).at(-1);if(!finalMainline)throw new TypeError('Missing number-structures mainline');
  await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),finalMainline);
  await expect(page.locator('#reader-end-links')).toBeVisible();
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('weekday contradiction briefly explains classical explosion and keeps its evidence reachable',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  const note=page.locator('.weekday-explosion-note');await expect(note).toHaveCount(0);
  // A sample mismatch is not an inconsistent constraint set.
  await page.evaluate(()=>{const saved=window.__atlasRelated.getState();if(!saved.interaction||!('worlds'in saved.interaction))throw new Error('Expected worlds');saved.interaction.actual=0;saved.interaction.worlds[0].today=0;window.__atlasRelated.setState(saved);});await expect(note).toHaveCount(0);await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');
  await page.getByRole('button',{name:'C · 가능세계 없이',exact:true}).click();
  for(const mode of ['달력','양상']){
    await weekdayView(page,mode);await weekdayReasoning(page);
    await expect(note).toBeVisible();await expect(note).toContainText('모든 요일 명제가 도출됨');await expect(note).toContainText('현실의 사실은 아님');
    await expect(page.locator('.weekday-logic-conclusion>.weekday-logic-formula')).toHaveText('조건을 만족하는 달력 없음');await expect(page.locator('.weekday-result')).toContainText('요일 답 추출 중지');
    await expectFrame(page,{...weekdayFrame,content:[...weekdayFrame.content,'.weekday-explosion-note'],controls:[...weekdayFrame.controls,'.weekday-explosion-note a']});
  }
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-rules'}));await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'transfer'}));await expect(note).toBeVisible();
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await weekdayReasoning(page);await expect(note).toBeVisible();
  await testInfo.attach('weekday-explosion-connection',{body:await page.screenshot(),contentType:'image/png'});
  await note.getByRole('link',{name:'근거와 범위 ↗',exact:true}).click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');
  await page.keyboard.press('Escape');await page.goto('/knowledge/weekday-worlds/#literal');await page.waitForFunction(()=>window.__atlasRelated);await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','literal');await weekdayReasoning(page);await expect(note).toBeVisible();
  await weekdayInputs(page);await page.getByRole('button',{name:'A · 현실 어제 고정',exact:true}).click();await expect(note).toHaveCount(0);
});

test('short titles keep the catalog text-only and the meme illustration on the restorable cover',async({page},testInfo)=>{
  const short='이걸로 IQ를 재겠다고?',full=short+' (어제가 내일이었으면...)';
  await page.goto(`/knowledge/?catalog=${Math.floor(CONTENT_PAGES.findIndex(entry=>entry.slug==='weekday-worlds')/12)+1}`);const card=page.locator('a.knowledge-card[href="/knowledge/weekday-worlds/"]');
  await expect(card.locator('h3')).toHaveText(short);await expect(card).toHaveAttribute('title',full);
  await expect(card.locator('img')).toHaveCount(0);
  await card.click();await page.waitForFunction(()=>window.__atlasRelated);await expect(page).toHaveTitle(full+' · Knowledge Atlas');await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',full);
  await expect(page.locator('.reader-cover h1')).toHaveText(short);await expect(page.locator('.reader-cover h1')).toHaveAttribute('title',full);
  const artwork=page.locator('.reader-cover-artwork');await expect(artwork).toBeVisible();await expect(artwork).toHaveAttribute('src',/cover\.svg$/);await expect(artwork).toHaveJSProperty('naturalWidth',1200);await expect(artwork).toHaveAttribute('alt',/IQ 좀 높다면 도전! 20초/);
  const svg=await (await page.request.get((await artwork.getAttribute('src'))!)).text();expect(svg).toContain('IQ 좀 높다면 도전!');expect(svg).toContain('>20초</text>');expect(svg).toContain('Q. 그렇다면 오늘은 무슨 요일일까?');
  await expectFrame(page,{content:['.reader-cover','.reader-cover h1','.reader-cover-artwork'],controls:['#reader-next','.reader-menu summary']});
  await testInfo.attach('iq-title-slide',{body:await page.screenshot(),contentType:'image/png'});
  const title=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(artwork).toBeHidden();await weekdayInputs(page);await expect(page.locator('.weekday-intro-question')).toHaveText('그렇다면 오늘은 무슨 요일일까?');await page.evaluate(state=>window.__atlasRelated.setState(state),title);await expect(artwork).toBeVisible();
  await page.goto('/knowledge/newton-to-quantum/');const physics=CONTENT_PAGES.find(page=>page.slug==='newton-to-quantum');if(!physics)throw new TypeError('Missing physics work');const heading=page.locator('.reader-intro h1'),fullTitle=await heading.getAttribute('title');if(!fullTitle)throw new TypeError('Missing full article title');await expect(heading).toHaveText(physics.label);expect(await page.title()).toBe(`${fullTitle} · Knowledge Atlas`);
});

test('knowledge index fits or scrolls naturally with accessible topic cards', async ({page}, testInfo) => {
  await page.goto('/knowledge/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  if(testInfo.project.name==='mobile'){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const card of await page.locator('a.knowledge-card').all()){await card.scrollIntoViewIfNeeded();await expect(card).toBeInViewport();}
  }else await expectFrame(page, {content: ['.knowledge-card'], controls: ['a.knowledge-card']});
});

const orbitalFrame={
  content:['.reader-copy:not([hidden])','.orbital-controls','.orbital-footer','.orbital-view'],
  controls:['#reader-controls button','.orbital-controls select','.orbital-controls button','.field-canvas','.reader-menu summary'],
};
async function expectOrbitalLongform(page:Page){
  await expect(page.locator('.related-reader')).toHaveAttribute('data-presentation','longform');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const selector of [...orbitalFrame.content,...orbitalFrame.controls]){
    const matches=page.locator(selector);expect(await matches.count(),selector).toBeGreaterThan(0);
    for(let index=0;index<await matches.count();index++){
      const match=matches.nth(index);if(!await match.isVisible())continue;
      await match.scrollIntoViewIfNeeded();await expect(match,selector).toBeInViewport();
    }
  }
}
test('orbitals: each authored scene fits with its corresponding field state',async({page},testInfo)=>{
  const errors: string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');await page.waitForFunction(()=>window.__atlasRelated);
  const metadata=CONTENT_PAGES.find(p=>p.slug==='newton-to-quantum')!,orbitalScenes=metadata.scenes.filter(scene=>scene.id==='orbital-density'||scene.id==='orbital-phase');
  for(const scene of orbitalScenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const snapshot=await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot());
    if(!snapshot.interaction||!('orbital' in snapshot.interaction))throw new Error('Expected orbital inspection');
    expect(snapshot.interaction.orbital).toEqual({n:2,basis:'px',Z:1});
    expect(snapshot.interaction.viewer.pointCount).toBe(6500);
    await test.step(scene.id,()=>expectOrbitalLongform(page));
  }
  await testInfo.attach('orbital-scene',{body:await page.screenshot(),contentType:'image/png'});
  expect(errors).toEqual([]);
});
test('orbital controls, camera, modes, state persistence and restoration use current input',async({page},testInfo)=>{
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'주양자수 n',exact:true}).selectOption('3');
  await page.getByRole('combobox',{name:'오비탈 종류·방향',exact:true}).selectOption('dxy');
  await page.getByRole('combobox',{name:'핵전하 Z',exact:true}).selectOption('2');
  await expect(page.locator('.reader-scene:visible h2')).toHaveText('점 밀도는 전자 궤적이 아닙니다');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('l=2, Z=2');
  for(const mode of ['cloud','slice','surface']){
    await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption(mode);await expectOrbitalLongform(page);
    const image=await page.locator('.field-canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL());expect(image.length).toBeGreaterThan(1000);
  }
  const surface=await page.evaluate(()=>{const interaction=window.__atlasRelated.getInspectionSnapshot().interaction;if(!interaction||!('viewer' in interaction))throw new Error('Expected spatial inspection');return interaction.viewer.triangleCount;});expect(surface).toBeGreaterThan(0);
  await testInfo.attach('orbital-surface',{body:await page.screenshot(),contentType:'image/png'});
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('cloud');
  const before=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('.field-canvas').focus();await page.keyboard.press('ArrowRight');
  const rotated=await page.evaluate(()=>window.__atlasRelated.getState());expect(rotated.sceneId).toBe(before.sceneId);if(!rotated.interaction||!('view' in rotated.interaction)||!before.interaction||!('view' in before.interaction))throw new Error('Expected orbital camera state');expect(rotated.interaction.view.yaw).toBeGreaterThan(before.interaction.view.yaw);
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'orbital-phase',interaction:window.__atlasRelated.getState().interaction}));await expect(page.getByRole('combobox',{name:'핵전하 Z',exact:true})).toHaveValue('2');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const rejection=await page.evaluate(()=>{const before=window.__atlasRelated.getState();let rejected=false;try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,orbital:{n:0,basis:'s',Z:1}}} as never);}catch{rejected=true;}return {before,after:window.__atlasRelated.getState(),rejected};});
  expect(rejection.rejected).toBe(true);expect(rejection.after).toEqual(rejection.before);
  const pixels=await page.locator('.field-canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL());
  await page.evaluate(()=>window.__atlasRelated.seek(700));expect(await page.locator('.field-canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL())).toBe(pixels);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();await expect(page.getByRole('combobox',{name:'핵전하 Z',exact:true})).toHaveValue('1');
});

test('spatial viewer can render a non-orbital field and reject an invalid camera state',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.js');
    const container=document.createElement('div');container.style.width='400px';container.style.height='300px';document.body.append(container);
    const viewer=mountFieldViewer(container,{label:'Generic signed field'});
    viewer.setField({evaluate:([x,y,z])=>1-x*x-y*y-z*z,weight:v=>Math.max(0,v),bounds:[[-1,1],[-1,1],[-1,1]],resolution:12});
    viewer.setState({mode:'surface',iso:.5});const before=viewer.getState(),snapshot=viewer.inspect();
    let rejected=false;try{viewer.setState({...before,zoom:0});}catch{rejected=true;}
    const unchanged=JSON.stringify(before)===JSON.stringify(viewer.getState());viewer.reset();viewer.setState(before);viewer.seek(100);
    const restored=JSON.stringify(before)===JSON.stringify(viewer.getState());viewer.dispose();return {snapshot,rejected,unchanged,restored,children:container.children.length};
  });
  expect(result.snapshot.triangleCount).toBeGreaterThan(0);expect(result.rejected&&result.unchanged&&result.restored).toBe(true);expect(result.children).toBe(0);
});

test('home opens the knowledge catalog and links to an interactive article',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  await page.locator('a.knowledge-card[href="/knowledge/newton-to-quantum/"]').click();
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('#reader-controls')).toBeVisible();
  await expectLongformScene(page,activeWork('newton-to-quantum'),'question');
});

test('local media tool loads its moved dependencies and draws the selected projection',async({page})=>{
  const errors: string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4191/tools/media/');
  await expect(page.locator('#render-plan')).toContainText('134.0초 · 1080×1440 · 4020프레임');
  await expect(page.locator('#render-caption')).toContainText('0.0초');
  await page.locator('#render-format').selectOption('landscape');
  await expect(page.locator('#render-canvas')).toHaveAttribute('width','1920');
  await expect(page.locator('#render-canvas')).toHaveAttribute('height','1080');
  await page.locator('#render-seek').evaluate(input=>{(input as HTMLInputElement).value='64000';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await expect(page.locator('#render-caption')).toContainText('64.0초');
  expect(errors).toEqual([]);
});

test('an article can read and restore scenes without installing an experiment adapter',async({page})=>{
  const work=activeWork('number-structures'),mainline=mainlineSceneIds(work),nextScene=mainline[1];if(!nextScene)throw new TypeError('Missing second number-structures mainline scene');
  await page.goto('/knowledge/number-structures/');await page.waitForFunction(()=>window.__atlasRelated);await expectLongformScene(page,work,mainline[0]??'question');
  await page.locator('#reader-next').click();
  const state=await page.evaluate(()=>window.__atlasRelated.getState());
  expect(state).toEqual({sceneId:nextScene});
  await page.evaluate(()=>window.__atlasRelated.reset());
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',mainline[0]??'question');
  await page.evaluate(state=>window.__atlasRelated.setState(state),state);
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',nextScene);
});

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
  await expect(page.locator('.weekday-modal-proposition')).toContainText('P:');
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

test('structural alignment instances isolate paths and validate deterministic state',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {markAlignment,mountSemanticAlignment}=await import('/components/alignment/semantic-alignment.js');
    const forest=[{id:'root',label:'Expression'},{id:'branch',parent:'root',label:'Argument'},{id:'leaf',parent:'branch',label:'Value'},{id:'sibling',parent:'root',label:'Value'}];
    function fixture(){
      const root=document.createElement('section'),status=document.createElement('p');
      for(const side of ['source','symbol'] as const){const top=markAlignment(document.createElement('span'),'root',side),branch=markAlignment(document.createElement('span'),'branch',side),leaf=markAlignment(document.createElement('span'),'leaf',side),sibling=markAlignment(document.createElement('span'),'sibling',side);leaf.textContent=sibling.textContent='x';branch.append(leaf);top.append(branch,sibling);root.append(top);}
      root.append(status);document.body.append(root);const api=mountSemanticAlignment(root,forest,status);api.refresh();return {root,api,status};
    }
    const a=fixture(),b=fixture();a.api.setState({activeId:'leaf'});
    const selected=[...a.root.querySelectorAll('[data-alignment-on-path]')].map(n=>(n as HTMLElement).dataset.alignmentNode);
    const detached=a.api.getState();detached.activeId='sibling';
    let rejected=false;try{a.api.setState({activeId:'unknown'});}catch{rejected=true;}
    const preserved=a.api.getState(),isolated=b.api.getState();a.api.reset();const reset=a.api.getState();a.api.setState(preserved);a.api.refresh();const refreshed=a.api.getState();
    a.api.destroy();a.root.querySelector('[data-alignment-node="leaf"]')!.dispatchEvent(new PointerEvent('pointermove',{bubbles:true}));const destroyed=a.api.getState();b.api.destroy();a.root.remove();b.root.remove();
    return {selected,rejected,preserved,isolated,reset,refreshed,destroyed};
  });
  expect(result.selected).toEqual(['root','branch','leaf','root','branch','leaf']);expect(result.rejected).toBe(true);expect(result.preserved).toEqual({activeId:'leaf'});
  for(const state of [result.isolated,result.reset,result.refreshed,result.destroyed])expect(state).toEqual({activeId:null});
});

test('availability feedback supports non-logic content and deterministic restoration',async({page})=>{
  await page.goto('/knowledge/');
  const results=await page.evaluate(async()=>{
    const {mountEvaluationFeedback}=await import('/components/reader/evaluation-feedback.js');
    const content=document.createElement('section'),message=document.createElement('p');
    content.textContent='Measurement details';document.body.append(content,message);
    const component=mountEvaluationFeedback({content,message});
    const unavailable={available:false,summary:'Calibration unavailable',detail:'Choose a calibrated sample.'};
    component.setState(unavailable);
    const blocked={hidden:content.hidden,disabled:content.getAttribute('aria-disabled'),text:message.textContent};
    const snapshot=component.getState();snapshot.available=true;
    let rejected=false;try{component.setState({available:true,summary:42 as never,detail:''});}catch{rejected=true;}
    const unchanged=component.getState();component.reset();
    const reset={hidden:content.hidden,messageHidden:message.hidden};component.setState(unavailable);
    return {blocked,rejected,unchanged,reset,restored:component.getState()};
  });
  expect(results.blocked).toEqual({hidden:true,disabled:'true',text:'Calibration unavailableChoose a calibrated sample.'});
  expect(results.rejected).toBe(true);expect(results.unchanged).toEqual(results.restored);
  expect(results.reset).toEqual({hidden:false,messageHidden:true});
});



test('weekday introduces worlds with Wednesday, then symbols and classical inference before modalities',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const scenes=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes;
  const beforeWorlds=['question','reason','conditional','sunday','wednesday','notation','inference','nonmodal-proof','contexts'];
  for(const [index,scene]of scenes.entries()){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    if(scene.id==='question')await expect(page.locator('#reader-scenes')).toBeHidden();else {await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',scene.id);await expect(page.locator('.reader-scene:visible .eyebrow')).toHaveText(`${index+1} / ${scenes.length}`);}
    await expect(page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true})).toHaveCount(0);
    expect(await page.locator('.weekday-experiment').innerText()).not.toMatch(/Wish|□→/);
    if(beforeWorlds.includes(scene.id)){
      if(scene.id!=='contexts')await expect(page.locator('.weekday-settings')).toBeHidden();await expect(page.locator('.weekday-modal-diagram')).toBeHidden();
      expect(await page.locator('.weekday-experiment').innerText()).not.toMatch(/접근|◇|□/);
    }
    if(['question','conditional','sunday'].includes(scene.id))expect(await page.locator('.weekday-experiment').innerText()).not.toMatch(/가능세계/);
    if(scene.id==='wednesday'){await expect(page.locator('.weekday-intro-worlds')).toBeVisible();await expect(page.locator('.weekday-intro-worlds')).toContainText('가능세계');await expect(page.locator('.weekday-symbol-section')).toBeHidden();}
    if(scene.id==='conditional')await expect(page.locator('.weekday-bridge')).toContainText('만약 어제가 내일이라면, 오늘이 금요일이다.');
    if(scene.id==='notation'){
      await expect(page.locator('.weekday-bridge')).toContainText('A → B');
      await expect(page.locator('.weekday-bridge-definition')).toHaveText(['A: t − 1 ≡₇ h + 1','B: h ≡₇ 4']);
      await page.locator('.weekday-bridge-formula [data-alignment-side="symbol"][data-alignment-node="antecedent"]').hover();
      await expect(page.locator('.weekday-bridge [data-alignment-side="source"][data-alignment-node="antecedent"]')).toHaveAttribute('data-alignment-current','');
    }
    if(scene.id==='inference')for(const rule of ['전건 긍정','후건 부정','논리곱 도입','논리곱 제거','선언 삼단논법'])await expect(page.locator('.weekday-rule-table')).toContainText(rule);
    if(scene.id==='nonmodal-proof')await expect(page.locator('.weekday-classical-proof')).toContainText('따라서 현실의 오늘은 일요일.');
    if(scene.id==='contexts'){await expect(page.locator('.world-comparison')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeVisible();}
    if(scene.id==='modal-expansion'){await expect(page.locator('.weekday-interpretation-comparison')).toBeVisible();await expect(page.locator('.weekday-symbolic-summary')).toContainText('◇P');}
    if(scene.id==='alethic')await expect(page.locator('.weekday-modal-verdict')).toContainText('P: 거짓 · ◇P: 참 · □P: 거짓');
    if(scene.id==='modal-rules'){await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await expect(page.locator('.weekday-bridge')).toContainText('가정 없이 증명한 정리');}
    await expectFrame(page,weekdayFrame);
  }
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  const target=page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true});await target.selectOption('2');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  for(const sceneId of ['question','notation','inference','contexts','alethic']){await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),sceneId);const current=(await page.evaluate(()=>window.__atlasRelated.getState())).interaction;expect({...current,logicMode:'calendar',challenge:undefined}).toEqual({...saved.interaction,logicMode:'calendar',challenge:undefined});}
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(target).toHaveValue('2');
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();window.__atlasRelated.setState({...state,sceneId:'notation',interaction:{...state.interaction,logicMode:'alethic',modeSource:'manual'}} as never);});
  await expect(page.locator('.weekday-modal-diagram')).toBeHidden();await expect(page.locator('.weekday-bridge')).not.toContainText('◇');
});
