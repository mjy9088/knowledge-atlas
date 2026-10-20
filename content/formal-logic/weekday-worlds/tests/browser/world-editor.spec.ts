import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../../../catalog.js";
import { expectFrame, weekdayFrame, weekdayInputs, weekdayReasoning, weekdayView } from "./support.js";

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
