import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../../../catalog.js";
import { expectFrame, weekdayFrame, weekdayInputs, weekdayReasoning, weekdayView } from "./support.js";

test('weekday review skip keeps edits and lands on a nonmodal worked proof before possible worlds',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-expansion');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true}).selectOption('0');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'notation'}));
  const skip=page.locator('#reader-skip');await expect(skip).toContainText('고전 논리 복습 건너뛰기');await expect(skip).toHaveAttribute('title',/조건문.*후건 부정.*이동: 양상 논리 없이/);
  await expectFrame(page,{...weekdayFrame,controls:[...weekdayFrame.controls,'#reader-skip']});
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','inference');await expect(skip).toBeHidden();
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'notation'}));await skip.click();await expect(page).toHaveURL(/\/nonmodal-proof\/$/);
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
  await expectFrame(page,weekdayFrame);await page.locator('#reader-next').click();await expect(page).toHaveURL(/\/alethic\/$/);await expect(page.locator('.weekday-modal-diagram')).toBeVisible();
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
  await page.locator('#reader-next').click();await expect(page).toHaveURL(/\/frame-system\/$/);
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
