import {test, expect, type Page} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';
import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.js';

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
const lessonFrame = {
  content: ['#lesson-dialogue-copy', '#lesson-stage', '.experiment-premises'],
  controls: ['.dialogue-actions button', '.experiment-goal', '#lesson-menu-open'],
};

const questionTopics=CONTENT_PAGES.filter(p=>['binary-search','sphere-slices','base-rates','weekday-worlds'].includes(p.slug));
const questionFrame={
  content:['#reader-workbench>div:last-child','#reader-workbench p','.reader-scene:not([hidden]) .reader-copy'],
  controls:['#reader-controls button','#reader-workbench button','#reader-workbench input','#reader-workbench select','.reader-menu summary'],
};
const weekdayFrame={content:[...questionFrame.content,'.weekday-intro-source','.weekday-intro-reasoning','.weekday-interpretation-comparison','.world-comparison','.weekday-sentence','.weekday-sentence-line','.weekday-sentence-question','.weekday-logic-diagram','.weekday-logic-premises','.weekday-logic-node','.weekday-logic-conclusion','.weekday-symbolic-summary','.weekday-settings','.weekday-input-panel','.weekday-reasoning-panel','.weekday-modal-diagram','.world-card','.world-cells','.world-cell','.world-note'],controls:[...questionFrame.controls.filter(selector=>selector!=='#reader-workbench input'),'.weekday-symbol-header']};
for(const topic of questionTopics)test(`${topic.slug}: question-led scenes fit and restore their authored state`,async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
  if(topic.cover)await page.locator('#reader-next').click();
  for(const scene of topic.scenes){
    await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const state=await page.evaluate(()=>window.__atlasRelated.getState());
    await page.evaluate(()=>window.__atlasRelated.reset());
    await page.evaluate(saved=>window.__atlasRelated.setState(saved),state);
    expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
    await test.step(scene.id,()=>expectFrame(page,topic.slug==='weekday-worlds'?weekdayFrame:questionFrame));
    if(scene===topic.scenes[0]||scene===topic.scenes.at(-1))await testInfo.attach(`${topic.slug}-${scene.id}`,{body:await page.screenshot(),contentType:'image/png'});
    if(scene!==topic.scenes.at(-1))await page.locator('#reader-next').click();
  }
  if(topic.slug==='weekday-worlds')await expect(page.locator('#reader-end-links')).toHaveCount(0);else await expect(page.locator('#reader-end-links')).toBeVisible();
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

async function weekdayInputs(page:Page){await expect(page.locator('.weekday-input-panel')).toBeVisible();if(['question','reason','conditional','notation','inference','modal-rules'].includes((await page.locator('.weekday-experiment').getAttribute('data-lesson-stage'))!))await expect(page.locator('.weekday-reasoning-panel')).toBeHidden();else await expect(page.locator('.weekday-reasoning-panel')).toBeVisible();}
async function weekdayReasoning(page:Page){await weekdayInputs(page);}

test('weekday 20-second attempt freezes an answer, keeps reflection and advances without grading',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const timer=page.getByRole('timer',{name:'남은 시간'}),answer=page.getByRole('button',{name:'수요일',exact:true});
  await expect(timer).toHaveText('20초');await expect(answer).toBeDisabled();await page.clock.fastForward(25_000);await expect(timer).toHaveText('20초');
  await page.getByRole('button',{name:'20초 도전 시작',exact:true}).click();await page.clock.fastForward(7_000);await expect(timer).toHaveText('13초');
  await answer.click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','reason');await expect(page.locator('.weekday-challenge-summary')).toHaveText('고른 답: 수요일');
  const reason=page.getByRole('textbox',{name:'그렇게 생각한 이유',exact:true});await reason.fill('금요일의 어제를 기준으로 생각했다.');await expect(reason).toBeFocused();
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(30_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await page.locator('#reader-next').click();await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','conditional');
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(reason).toHaveValue('금요일의 어제를 기준으로 생각했다.');
  await expect(page.locator('.weekday-challenge')).not.toContainText('정답입니다');await expectFrame(page,weekdayFrame);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,challenge:{phase:'expired',elapsedMs:10}}} as never);}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}return false;});expect(rejected).toBe(true);
});

test('weekday expiry opens reflection at 20 seconds; seek frames stay independent and frozen',async({page})=>{
  await page.clock.install();await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('button',{name:'20초 도전 시작',exact:true}).click();await page.clock.fastForward(19_900);await expect(page.getByRole('timer')).toHaveText('1초');await page.clock.fastForward(100);
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','reason');await expect(page.locator('.weekday-challenge-summary')).toContainText('20초가 지났어요');
  await page.evaluate(()=>{window.__atlasRelated.setState({sceneId:'question'});window.__atlasRelated.seek(5_000);});await expect(page.getByRole('timer')).toHaveText('15초');
  const frame=await page.evaluate(()=>window.__atlasRelated.getState());await page.clock.fastForward(60_000);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(frame);
  await page.evaluate(()=>window.__atlasRelated.seek(1_000));await expect(page.getByRole('timer')).toHaveText('19초');await expectFrame(page,weekdayFrame);
});
async function weekdayView(page:Page,mode:string){await weekdayInputs(page);const stage=await page.locator('.weekday-experiment').getAttribute('data-disclosure');if(stage!=='formal')return;await page.evaluate(modal=>{const state=window.__atlasRelated.getState();window.__atlasRelated.setState({...state,sceneId:modal?'alethic':'modal-comparison'});},mode.includes('양상'));}


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
  const a=await menu.boundingBox(),b=await prev.boundingBox(),c=await next.boundingBox();expect(b!.y).toBeGreaterThanOrEqual(a!.y+a!.height);expect(c!.y).toBeGreaterThanOrEqual(b!.y+b!.height);expect(c!.y-b!.y-b!.height).toBeLessThanOrEqual(5);
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-comparison'}));await expect(page.locator('.weekday-source')).toContainText('만약');
  expect(await page.locator('.alignment-status').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,clip:getComputedStyle(e).clipPath}))).toEqual({width:1,height:1,clip:'inset(50%)'});await expect(page.locator('.weekday-sentence [data-alignment-node][title],.weekday-context-select[title],.weekday-logic-diagram [data-alignment-node][title]')).toHaveCount(0);
  const term=page.locator('.weekday-symbol-clause [data-alignment-node="yesterday-base"]');await term.hover();await expect(page.locator('.weekday-source [data-alignment-node="yesterday-base"]')).toHaveAttribute('data-alignment-current','');
  const snapshot=await page.evaluate(()=>window.__atlasRelated.getState());await page.keyboard.press('ArrowRight');await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','alethic');
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'conclusion'}));await expect(hint).toHaveCount(0);await expect(links).toHaveCount(0);
  await menu.click();await expect(page.locator('.reader-menu a[href="/knowledge/"]')).toBeVisible();await expect(page.locator('.reader-menu a[href="#evidence"]')).toHaveCount(1);
  await page.locator('.reader-menu a[href="#evidence"]').click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');await page.keyboard.press('Escape');
  await page.evaluate(state=>window.__atlasRelated.setState(state),snapshot);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-compact-actions',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('.reader-menu').evaluate(e=>(e as HTMLDetailsElement).open=true);await page.locator('.reader-menu a[href="/knowledge/"]').click();await expect(page).toHaveURL(/\/knowledge\/$/);
  await page.goto('/knowledge/binary-search/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const topic=CONTENT_PAGES.find(p=>p.slug==='binary-search')!;await expect(hint).toBeVisible();await expect(links).toBeHidden();
  await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),topic.scenes.at(-1)!.id);await expect(links).toBeVisible();await expect(links.locator('a')).toHaveText(['지식 목록 ↗','근거와 범위']);
});

test('weekday title slide, simultaneous original/symbol panels, named worlds and scrollable choices restore independently',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.reader-cover h1')).toBeVisible();await expect(page.locator('#reader-workbench')).toBeHidden();expect(await page.evaluate(()=>window.__atlasRelated.getState().cover)).toBe(true);
  const titleState=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(page.locator('.reader-cover h1')).toBeHidden();await weekdayInputs(page);
  await expect(page.locator('.weekday-intro-source')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeHidden();await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-comparison'}));
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
    await expect(page.locator('#reader-skip')).toBeHidden();await expect(page.locator('.reader-scene:visible .skip-context')).toBeHidden();
  }
  await page.goto('/lesson.html');await page.waitForFunction(()=>window.__atlasLesson);
  for(let index=0;index<EXPLOSION_EPISODE.sections.length;index++){
    const section=EXPLOSION_EPISODE.sections[index];await page.evaluate(sectionId=>window.__atlasLesson.setState({sectionId}),section.id);
    const view=await page.evaluate(()=>window.__atlasLesson.inspect()),targetIndex=EXPLOSION_EPISODE.sections.findIndex(s=>s.id===view.nextChapter?.id);
    const skip=page.locator('#lesson-skip'),scope=page.locator('#lesson-skip-context');
    if(targetIndex>index+1){
      await expect(skip).toHaveText(`${view.chapter.title} 건너뛰기 ↗`);await expect(scope).toContainText(view.chapter.known);await expect(scope).toContainText(`이동: ${view.nextChapter!.title}`);
      for(const item of EXPLOSION_EPISODE.sections.slice(index,targetIndex))await expect(skip).toHaveAttribute('title',new RegExp(item.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      await expectFrame(page,lessonFrame);await skip.click();expect(await page.evaluate(()=>window.__atlasLesson.getState().sectionId)).toBe(view.nextChapter!.id);
      if(section.id==='premise-p'){
        await page.evaluate(()=>{window.__atlasLesson.setState({sectionId:'premise-p'});window.__atlasLessonExperiment.setState({...window.__atlasLessonExperiment.getState(),customized:true});});
        await expect(skip).toContainText('근거에서 결론까지');await expect(scope).toContainText('현재 경로의 전제');
        await page.evaluate(()=>window.__atlasLessonExperiment.reset());await expect(skip).toHaveText('모순에서 Q까지 건너뛰기 ↗');
      }
      await page.evaluate(sectionId=>window.__atlasLesson.setState({sectionId}),section.id);await page.locator('#lesson-next').click();expect(await page.evaluate(()=>window.__atlasLesson.getState().sectionId)).toBe(EXPLOSION_EPISODE.sections[index+1].id);
    }else{await expect(skip).toBeHidden();await expect(scope).toBeHidden();}
  }
});

test('deleting reference and evaluation worlds removes every UI reference and survives navigation and restore',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
    await page.locator('#reader-next').click();await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.locator('#reader-next').click();
    const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);await weekdayInputs(page);
    for(let removed=1;removed<=id;removed++)await expect(page.locator(`.weekday-experiment [data-world="${removed}"]:not([data-create-world]),.weekday-world-dialog [data-world="${removed}"]`)).toHaveCount(0);
  }
  await expect(page.locator('.weekday-symbol-definition').first()).toContainText('W = {w₀}');
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-dialog-world')).toHaveCount(1);await expect(page.locator('.weekday-access-matrix input')).toHaveCount(1);await testInfo.attach('weekday-only-remaining-world',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday wide layout fills the desktop and keeps every view usable with four worlds',async({page},testInfo)=>{
  test.skip((page.viewportSize()?.width??0)<1200,'Wide desktop composition');
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
  expect(measures.width).toBeGreaterThan(.9);for(const control of measures.controls){expect(control.font).toBeGreaterThanOrEqual(13);expect(control.height).toBeGreaterThanOrEqual(34);}
  await testInfo.attach('weekday-wide-four-worlds',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday reference choices create absent worlds and identify other expressions using each world',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  const controls=['① 어제의 기준','② 내일의 기준','③ 그럼 오늘의 기준','④ 묻는 오늘의 기준'].map(name=>page.getByRole('combobox',{name,exact:true}));
  const target=page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true});
  await expect(page.locator('.weekday-presets button')).toHaveCount(3);await expect(page.locator('.weekday-symbolic-summary')).toBeVisible();
  const layout=await page.evaluate(()=>{const a=document.querySelector('.weekday-input-panel')!.getBoundingClientRect(),b=document.querySelector('.weekday-reasoning-panel')!.getBoundingClientRect();return {desktop:innerWidth>720,left:a.right<=b.left,sameTop:Math.abs(a.top-b.top)<1};});if(layout.desktop){expect(layout.left).toBe(true);expect(layout.sameTop).toBe(true);}
  await expect(page.locator('.weekday-logic-conclusion')).toContainText('④ 오늘은 일요일');
  await page.getByRole('button',{name:'B · 현실 내일 고정',exact:true}).click();await expect(controls[0]).toHaveValue('1');await expect(controls[1]).toHaveValue('0');await expect(controls[2]).toHaveValue('1');await expect(page.locator('.weekday-result')).toContainText('현실 답: 수요일');
  await controls[3].selectOption('1');await expect(page.locator('.weekday-result')).toContainText('조건의 재확인: 금요일');
  await controls[2].selectOption('0');await expect(page.locator('.weekday-result')).toContainText('다른 세계의 답: 일요일');
  await controls[0].selectOption('0');await expect(page.locator('.weekday-result')).toContainText('조건을 만족하는 달력 없음');
  await page.getByRole('button',{name:'B · 현실 내일 고정',exact:true}).click();await page.locator('#reader-next').click();await expect(controls[0]).toHaveValue('1');
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
  await page.evaluate(()=>window.__atlasRelated.setState({sceneId:'modal-comparison',interaction:{actual:6,target:4,rule:'actual-yesterday',example:'question',customized:true}} as never));await weekdayInputs(page);await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('현실 답: 일요일');await expect(target).toHaveValue('4');await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-final-layout',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday original expressions own the choices and every displayed day follows the constraints',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.locator('#reader-next').click();await expect(question.locator('option:not([data-create-world])')).toHaveCount(3);await page.evaluate(s=>window.__atlasRelated.setState(s),saved);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);await testInfo.attach('weekday-modal-multiworld',{body:await page.screenshot(),contentType:'image/png'});
});

test('weekday direct links preserve both nonmodal and alethic views in narrow windows',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});const topic=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!;
  for(const scene of topic.scenes){await page.goto(`/knowledge/${topic.slug}/#${scene.id}`);await page.waitForFunction(()=>window.__atlasRelated);await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);await expectFrame(page,weekdayFrame);
    for(const mode of ['달력','양상']){await weekdayInputs(page);await weekdayView(page,mode);await expectFrame(page,weekdayFrame);await weekdayReasoning(page);await expectFrame(page,weekdayFrame);}
    if(scene.id==='wednesday')await testInfo.attach('weekday-narrow-alethic',{body:await page.screenshot(),contentType:'image/png'});
  }
});

test('binary search follows comparisons, preserves edits, clears invalid drafts and seeks independently',async({page},testInfo)=>{
  await page.goto('/knowledge/binary-search/');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'예상 횟수',exact:true}).selectOption('10');
  for(let i=0;i<10;i++)await page.getByRole('button',{name:'한 번 비교',exact:true}).click();
  await expect(page.locator('.binary-summary')).toContainText('10회 비교 · 찾았습니다');
  await expect(page.locator('.binary-pivot')).toContainText('2000');
  await expectFrame(page,questionFrame);
  await testInfo.attach('search-completed',{body:await page.screenshot(),contentType:'image/png'});
  const target=page.getByRole('textbox',{name:'찾을 값',exact:true});await target.fill('1999');
  await page.locator('#reader-next').click();await expect(target).toHaveValue('1999');
  await page.locator('#reader-next').click();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('목록에 있다면');
  await target.fill('');await expect(page.locator('.binary-bar')).toBeHidden();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('정수를 입력');
  const draft=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),draft);
  await expect(target).toHaveValue('');await expect(page.locator('.binary-bar')).toBeHidden();
  await expectFrame(page,questionFrame);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await page.evaluate(()=>window.__atlasRelated.seek(3000));
  const sought=await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot());
  await page.evaluate(()=>window.__atlasRelated.seek(0));await page.evaluate(()=>window.__atlasRelated.seek(3000));
  expect(await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot())).toEqual(sought);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,step:999}} as never);return false;}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}});
  expect(rejected).toBe(true);
});

test('sphere slices synchronize geometric boundaries, preserve reveal and reject unsupported saved controls',async({page},testInfo)=>{
  await page.goto('/knowledge/sphere-slices/#explain');await page.waitForFunction(()=>window.__atlasRelated);
  const height=page.getByRole('slider',{name:'평면 높이 h',exact:true});
  const setHeight=async(value:string)=>height.evaluate((input,value)=>{(input as HTMLInputElement).value=value;input.dispatchEvent(new Event('input',{bubbles:true}));},value);
  await expect(page.locator('.sphere-result')).toContainText('r = 4 cm');
  await setHeight('-3');await expect(page.locator('.sphere-result')).toContainText('r = 4 cm');
  await setHeight('5');await expect(page.locator('.sphere-result')).toContainText('한 점');
  await setHeight('6');await expect(page.locator('.sphere-result')).toContainText('단면이 없습니다');
  await expect(page.getByRole('img')).toHaveAccessibleName(/구 바깥/);
  await page.locator('#reader-next').click();await expect(height).toHaveValue('6');
  await setHeight('3');await page.getByRole('button',{name:'같은 원판의 두 구 보기',exact:true}).click();
  await expect(page.locator('.sphere-transfer')).toContainText('모두 r=4 cm');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();return [0,2.35,Number.NaN].every(radius=>{try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,radius}} as never);return false;}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}});});
  expect(rejected).toBe(true);await expectFrame(page,questionFrame);
  await testInfo.attach('sphere-comparison',{body:await page.screenshot(),contentType:'image/png'});
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.locator('.sphere-transfer span')).toBeHidden();
});

test('base rates preserve predictions and drafts, change the denominator and handle no alerts',async({page},testInfo)=>{
  await page.goto('/knowledge/base-rates/');await page.waitForFunction(()=>window.__atlasRelated);
  const prediction=page.getByRole('combobox',{name:'경보 중 불량 비율 예상',exact:true});
  await prediction.selectOption('over-half');await page.locator('#reader-next').click();
  await expect(prediction).toHaveValue('over-half');await expect(page.locator('.base-rates-output')).toBeHidden();
  await page.locator('#reader-next').click();
  await expect(page.locator('.base-rates-answer')).toContainText('90 ÷ 585 ≈ 15.38%');
  const prevalence=page.getByRole('spinbutton',{name:'불량 비율 (%)',exact:true});await prevalence.fill('10');
  await expect(page.locator('.base-rates-answer')).toContainText('900 ÷ 1,350 ≈ 66.67%');
  await page.locator('#reader-next').click();await expect(prevalence).toHaveValue('10');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('1,350');
  await testInfo.attach('base-rate-comparison',{body:await page.screenshot(),contentType:'image/png'});
  await prevalence.fill('');await expect(page.locator('.base-rates-output')).toBeHidden();
  const draft=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),draft);
  await expect(prevalence).toHaveValue('');await expect(page.locator('.base-rates-output')).toBeHidden();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('계산할 수 없습니다');
  await prevalence.fill('10');
  await page.getByRole('spinbutton',{name:'불량 중 경보 (%)',exact:true}).fill('0');
  await page.getByRole('spinbutton',{name:'정상 중 경보 (%)',exact:true}).fill('0');
  await expect(page.locator('.base-rates-answer')).toContainText('정의되지 않습니다');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('정의되지 않습니다');
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,prevalence:2}} as never);return false;}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}});
  expect(rejected).toBe(true);await expectFrame(page,questionFrame);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.locator('.base-rates-answer')).toContainText('15.38%');
});

const lambdaFrame={content:['.lambda-editor','.lambda-output','.lambda-rule-term','.lambda-step-term','.reader-scene:not([hidden]) .reader-copy'],controls:['#reader-controls button','.lambda-experiment button','.lambda-experiment input','.lambda-experiment textarea','.lambda-experiment select','.reader-menu summary']};
for(const topic of CONTENT_PAGES.filter(p=>p.interactive==='typed-lambda'))test(`${topic.slug}: all typed examples and explanation scenes fit`,async({page},testInfo)=>{
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
  for(let i=0;i<topic.scenes.length;i++){
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',topic.scenes[i].id);
    await expect(page.getByRole('combobox',{name:'비교할 예제'})).toHaveValue((topic.scenes[i].suggestion as {example:string}).example);
    await test.step(topic.scenes[i].id,()=>expectFrame(page,lambdaFrame));
    if(i+1<topic.scenes.length)await page.locator('#reader-next').click();
  }
  for(const option of await page.getByRole('combobox',{name:'비교할 예제'}).locator('option').all()){
    await page.getByRole('combobox',{name:'비교할 예제'}).selectOption(await option.getAttribute('value'));
    await expectFrame(page,lambdaFrame);
  }
  expect(errors).toEqual([]);await testInfo.attach('typed-lambda',{body:await page.screenshot(),contentType:'image/png'});
});

test('typed terms update dialogue, compute substitution, reject errors and restore state',async({page})=>{
  await page.goto('/knowledge/lambda-calculus/#substitution');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.lambda-judgment')).toContainText('현재 타입: A');
  await page.getByRole('button',{name:'한 단계 계산',exact:true}).click();await expect(page.locator('.lambda-step-term')).toHaveText('a');
  const defaultState=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(s=>window.__atlasRelated.setState(s),defaultState);expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(defaultState);
  const input=page.getByRole('textbox',{name:'람다 식',exact:true});await input.fill('(λx:A. λy:B. x) a');
  await expect(page.locator('.lambda-judgment')).toContainText('A');await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('현재 식의 타입은 B → A');
  await page.locator('#reader-next').click();await expect(input).toHaveValue('(λx:A. λy:B. x) a');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(s=>window.__atlasRelated.setState(s),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  await input.fill('λx:A. x x');await expect(page.locator('.lambda-output')).toHaveAttribute('data-valid','false');await expect(page.locator('.lambda-results')).toBeHidden();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('기본 예시의 해설은 이 입력에 적용하지 않습니다');
  await expectFrame(page,lambdaFrame);
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,step:99}} as never);return false;}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}});expect(rejected).toBe(true);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();await expect(page.locator('.lambda-output')).toHaveAttribute('data-valid','true');
  await input.focus();const scene=await page.evaluate(()=>window.__atlasRelated.getState().sceneId);await page.keyboard.press('ArrowRight');expect(await page.evaluate(()=>window.__atlasRelated.getState().sceneId)).toBe(scene);
});

const readingFrame={content:['.reader-scene:not([hidden]) .reader-copy','.reader-scene:not([hidden]) .concept-diagram'],controls:['#reader-controls button','.reader-menu summary']};
for (const reader of CONTENT_PAGES.filter(page=>!page.interactive)) test(`${reader.slug}: every scene and rule example fits`, async ({page}, testInfo) => {
  await page.goto(`/knowledge/${reader.slug}/`);
  await page.waitForFunction(() => window.__atlasRelated);
  const frame=reader.model?relatedFrame:readingFrame;
  for (let index = 0; index < reader.scenes.length; index++) {
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id', reader.scenes[index].id);
    await test.step(reader.scenes[index].id, () => expectFrame(page, frame));
    if (index + 1 < reader.scenes.length) await page.locator('#reader-next').click();
  }
  await expect(page.locator('#reader-end-links')).toBeVisible();
  if (reader.model === 'ch') await testInfo.attach('final-scene', {body: await page.screenshot(), contentType: 'image/png'});
  for (const preset of await page.locator('#reader-presets button').all()) {
    await preset.click();
    await expectFrame(page, frame);
  }
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expectFrame(page, frame);
});

test('direct links restore the requested scene and typing arrows does not navigate', async ({page}) => {
  await page.goto('/lesson.html#explanation-remove-premise');
  await page.waitForFunction(() => window.__atlasLesson);
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('remove-premise');
  const goal = page.getByRole('textbox', {name: '목표 명제식', exact: true});
  await goal.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('remove-premise');
  await expectFrame(page, lessonFrame);
});

test('weekday contradiction briefly explains classical explosion and links to the existing lesson',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await page.locator('#reader-next').click();await expect(note).toBeVisible();
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await weekdayReasoning(page);await expect(note).toBeVisible();
  await testInfo.attach('weekday-explosion-connection',{body:await page.screenshot(),contentType:'image/png'});
  await note.getByRole('link',{name:'모순 폭발 ↗',exact:true}).click();await expect(page).toHaveURL(/\/lesson\.html#explanation-explosion$/);await expect(page.locator('#dialogue-title')).toHaveText('⊥에서 Q: 폭발 규칙');
  await page.goto('/knowledge/weekday-worlds/#conclusion');await page.waitForFunction(()=>window.__atlasRelated);await page.locator('#reader-next').click();await expect(page.locator('dialog[open] a[href="/lesson.html"]')).toHaveText('모순 폭발 ↗');
  await page.keyboard.press('Escape');await page.goto('/knowledge/weekday-worlds/#literal');await page.waitForFunction(()=>window.__atlasRelated);await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('월요일’부터 ‘일요일');await weekdayReasoning(page);await expect(note).toBeVisible();
  await weekdayInputs(page);await page.getByRole('button',{name:'A · 현실 어제 고정',exact:true}).click();await expect(note).toHaveCount(0);
});

test('short titles keep the catalog text-only and the meme illustration on the restorable cover',async({page},testInfo)=>{
  const short='이걸로 IQ를 재겠다고?',full=short+' (어제가 내일이었으면...)';
  await page.goto('/knowledge/');const card=page.locator('a.knowledge-card[href="/knowledge/weekday-worlds/"]');
  await expect(card.locator('h2')).toHaveText(short);await expect(card).toHaveAttribute('title',full);
  await expect(card.locator('img')).toHaveCount(0);
  await card.click();await page.waitForFunction(()=>window.__atlasRelated);await expect(page).toHaveTitle(full+' · Knowledge Atlas');await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',full);
  await expect(page.locator('.reader-cover h1')).toHaveText(short);await expect(page.locator('.reader-cover h1')).toHaveAttribute('title',full);
  const artwork=page.locator('.reader-cover-artwork');await expect(artwork).toBeVisible();await expect(artwork).toHaveAttribute('src',/cover\.svg$/);await expect(artwork).toHaveJSProperty('naturalWidth',1200);await expect(artwork).toHaveAttribute('alt',/IQ 좀 높다면 도전! 20초/);
  const svg=await (await page.request.get((await artwork.getAttribute('src'))!)).text();expect(svg).toContain('IQ 좀 높다면 도전!');expect(svg).toContain('>20초</text>');expect(svg).toContain('Q. 그렇다면 오늘은 무슨 요일일까?');
  await expectFrame(page,{content:['.reader-cover','.reader-cover h1','.reader-cover-artwork'],controls:['#reader-next','.reader-menu summary']});
  await testInfo.attach('iq-title-slide',{body:await page.screenshot(),contentType:'image/png'});
  const title=await page.evaluate(()=>window.__atlasRelated.getState());await page.locator('#reader-next').click();await expect(artwork).toBeHidden();await weekdayInputs(page);await expect(page.locator('.weekday-intro-question')).toHaveText('그렇다면 오늘은 무슨 요일일까?');await page.evaluate(state=>window.__atlasRelated.setState(state),title);await expect(artwork).toBeVisible();
  await page.goto('/knowledge/binary-search/');await expect(page.locator('.reader-intro h1')).toHaveText('1,000개 중 하나, 몇 번이면 찾을까요?');
});

test('desktop knowledge index fits with accessible topic cards', async ({page}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The narrow index is a normal scrolling document.');
  await page.goto('/knowledge/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  await expectFrame(page, {content: ['.knowledge-card'], controls: ['a.knowledge-card']});
});

const orbitalFrame={
  content:['.reader-copy:not([hidden])','.orbital-controls','.orbital-footer','.orbital-view'],
  controls:['#reader-controls button','.orbital-controls select','.orbital-controls button','.field-canvas','.reader-menu summary'],
};
test('orbitals: each authored scene fits with its corresponding field state',async({page},testInfo)=>{
  const errors: string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/knowledge/atomic-orbitals/');await page.waitForFunction(()=>window.__atlasRelated);
  const metadata=CONTENT_PAGES.find(p=>p.slug==='atomic-orbitals')!;
  for(const scene of metadata.scenes){
    await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const snapshot=await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot());
    if(!snapshot.interaction||!('orbital' in snapshot.interaction))throw new Error('Expected orbital inspection');
    expect(snapshot.interaction.orbital).toEqual({n:(scene.suggestion as {n:number}).n,basis:(scene.suggestion as {basis:string}).basis,Z:(scene.suggestion as {Z:number}).Z});
    expect(snapshot.interaction.viewer.pointCount).toBe(6500);
    await test.step(scene.id,()=>expectFrame(page,orbitalFrame));
    if(scene!==metadata.scenes.at(-1))await page.locator('#reader-next').click();
  }
  await testInfo.attach('orbital-scene',{body:await page.screenshot(),contentType:'image/png'});
  expect(errors).toEqual([]);
});
test('orbital controls, camera, modes, state persistence and restoration use current input',async({page},testInfo)=>{
  await page.goto('/knowledge/atomic-orbitals/#nodes');await page.waitForFunction(()=>window.__atlasRelated);
  await page.getByRole('combobox',{name:'주양자수 n',exact:true}).selectOption('3');
  await page.getByRole('combobox',{name:'오비탈 종류·방향',exact:true}).selectOption('dxy');
  await page.getByRole('combobox',{name:'핵전하 Z',exact:true}).selectOption('2');
  await expect(page.locator('.reader-scene:visible h2')).toHaveText('분포 안의 빈 곳: 마디');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText('l=2, Z=2');
  for(const mode of ['cloud','slice','surface']){
    await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption(mode);await expectFrame(page,orbitalFrame);
    const image=await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL());expect(image.length).toBeGreaterThan(1000);
  }
  const surface=await page.evaluate(()=>{const interaction=window.__atlasRelated.getInspectionSnapshot().interaction;if(!interaction||!('viewer' in interaction))throw new Error('Expected spatial inspection');return interaction.viewer.triangleCount;});expect(surface).toBeGreaterThan(0);
  await testInfo.attach('orbital-surface',{body:await page.screenshot(),contentType:'image/png'});
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('cloud');
  const before=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('canvas').focus();await page.keyboard.press('ArrowRight');
  const rotated=await page.evaluate(()=>window.__atlasRelated.getState());expect(rotated.sceneId).toBe(before.sceneId);if(!rotated.interaction||!('view' in rotated.interaction)||!before.interaction||!('view' in before.interaction))throw new Error('Expected orbital camera state');expect(rotated.interaction.view.yaw).toBeGreaterThan(before.interaction.view.yaw);
  await page.locator('#reader-next').click();await expect(page.getByRole('combobox',{name:'핵전하 Z',exact:true})).toHaveValue('2');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const rejection=await page.evaluate(()=>{const before=window.__atlasRelated.getState();let rejected=false;try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,orbital:{n:0,basis:'s',Z:1}}} as never);}catch{rejected=true;}return {before,after:window.__atlasRelated.getState(),rejected};});
  expect(rejection.rejected).toBe(true);expect(rejection.after).toEqual(rejection.before);
  const pixels=await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL());
  await page.evaluate(()=>window.__atlasRelated.seek(700));expect(await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).toDataURL())).toBe(pixels);
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

test('lesson: every explanation fits and keyboard navigation works', async ({page}) => {
  await page.goto('/lesson.html');
  await page.waitForFunction(() => window.__atlasLesson);
  await expect(page.locator('.lesson-claim').first()).toBeAttached();
  await expect(page.locator('#lesson-error')).toBeEmpty();
  for (let index = 0; index < EXPLOSION_EPISODE.sections.length; index++) {
    await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe(EXPLOSION_EPISODE.sections[index].id);
    await test.step(EXPLOSION_EPISODE.sections[index].id, () => expectFrame(page, lessonFrame));
    if (index + 1 < EXPLOSION_EPISODE.sections.length) await page.locator('#lesson-next').click();
  }
  await expect(page.locator('.lesson-end-links')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('consistency');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.__atlasLesson.getState().sectionId)).toBe('summary');
});

test('home opens the knowledge catalog and links to an interactive article',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  await page.locator('a.knowledge-card[href="/knowledge/zfc/"]').click();
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('#reader-controls')).toBeVisible();
  await expectFrame(page,relatedFrame);
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
  const data={...CONTENT_PAGES.find(p=>p.slug==='zfc'),model:null};
  await page.route('**/content/catalog.js',route=>route.fulfill({contentType:'text/javascript',body:`export const CONTENT_PAGES=${JSON.stringify([data])};`}));
  await page.goto('/knowledge/zfc/');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.reader-scene:visible .concept-diagram')).toBeVisible();
  await expectFrame(page,{content:['.reader-scene:not([hidden]) .concept-diagram','.reader-scene:not([hidden]) .reader-copy'],controls:['#reader-controls button','.reader-menu summary']});
  await page.locator('#reader-next').click();
  const state=await page.evaluate(()=>window.__atlasRelated.getState());
  expect(state).toEqual({sceneId:'axioms'});
  await page.evaluate(()=>window.__atlasRelated.reset());
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','sets');
  await page.evaluate(state=>window.__atlasRelated.setState(state),state);
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','axioms');
});

test('edited inputs invalidate dialogue and proof, survive navigation, and reset', async ({page}) => {
  await page.goto('/knowledge/zfc/');
  await page.waitForFunction(() => window.__atlasRelated);
  const goal = page.getByRole('textbox', {name: '목표 명제식', exact: true});
  await goal.fill('invalid(');
  await expect(page.locator('.reader-scene:visible .reader-copy')).toHaveAttribute('data-status', 'invalid');
  await expect(page.locator('.explorer-lines button')).toHaveCount(0);
  await page.locator('#reader-next').click();
  await expect(goal).toHaveValue('invalid(');
  await expectFrame(page, relatedFrame);
  await page.getByRole('button', {name: '장면 예시로', exact: true}).click();
  await expect(page.locator('.explorer-lines button').first()).toBeVisible();
  await expectFrame(page, relatedFrame);
});

test('eight premises remain editable without pushing navigation outside the frame', async ({page}) => {
  await page.goto('/knowledge/zfc/');
  await page.waitForFunction(() => window.__atlasRelated);
  const add = page.getByRole('button', {name: '+ 전제', exact: true});
  while (await add.isEnabled()) await add.click();
  const rows = page.locator('.experiment-premises input[type=text]');
  await expect(rows).toHaveCount(8);
  await rows.last().fill('x ∈ A');
  // Long, user-created collections may scroll inside their editor; default scenes may not.
  await expectFrame(page, {...relatedFrame, content: []});
  await page.locator('#reader-next').click();
  await expect(rows.last()).toHaveValue('x ∈ A');
  await page.getByRole('button', {name: '장면 예시로', exact: true}).click();
  await expectFrame(page, relatedFrame);
});

test('unavailable evaluation preserves the scene title, disables its copy, and recovers', async ({page},testInfo) => {
  await page.goto('/knowledge/paraconsistent-logic/#four-values');
  await page.waitForFunction(() => window.__atlasRelated);
  const scene=page.locator('.reader-scene:visible'),heading=scene.locator('h2');
  const title=await heading.textContent();
  await page.getByRole('button',{name:'모순과 별개인 목표',exact:true}).click();
  await expect(heading).toHaveText(title!);
  await expect(scene.locator('.scene-result')).toContainText('FDE에서 목표가 따라오지 않는 평가입니다');
  await expect(scene.locator('.scene-prose')).toBeHidden();
  await expect(scene.locator('.scene-prose')).toHaveAttribute('aria-disabled','true');
  await expect(page.getByRole('textbox',{name:'목표 명제식',exact:true})).toHaveValue('Q');
  await expectFrame(page,relatedFrame);
  await testInfo.attach('evaluation-message',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('#reader-next').click();
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id','counterexample');
  await page.getByRole('button',{name:'그리고 나누기',exact:true}).click();
  await expect(page.locator('.reader-scene:visible .scene-result')).toBeHidden();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toBeVisible();
  await expect(page.locator('.reader-scene:visible .scene-prose')).toHaveAttribute('aria-disabled','false');
  await expectFrame(page,relatedFrame);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.locator('.reader-scene:visible h2')).toHaveText('모순을 허용하는 반례 평가');
});

test('lesson keeps its topic while an inapplicable explanation is disabled',async({page})=>{
  await page.goto('/lesson.html#explanation-explosion');
  await page.waitForFunction(()=>window.__atlasLesson);
  const title=await page.locator('#dialogue-title').textContent();
  await page.getByRole('textbox',{name:'목표 명제식',exact:true}).fill('(');
  await expect(page.locator('#dialogue-title')).toHaveText(title!);
  await expect(page.locator('#lesson-evaluation')).toBeVisible();
  await expect(page.locator('#dialogue-text')).toHaveAttribute('aria-disabled','true');
  await expectFrame(page,lessonFrame);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.locator('#lesson-evaluation')).toBeHidden();
  await expect(page.locator('#dialogue-text')).toBeVisible();
});

test('weekday alignment highlights complete paths bidirectionally and refreshes with inputs',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
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

test('weekday conditional connectives map both ways in the comparison and modal stages without a mode toggle',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);await weekdayInputs(page);
  for(const mode of ['달력','양상']){
    await weekdayView(page,mode);
    const clauseLines=page.locator('.weekday-symbol-clause');await expect(clauseLines).toHaveCount(2);await expect(clauseLines.nth(0)).toContainText('A:');await expect(clauseLines.nth(1)).toContainText('B:');
    const firstClause=await clauseLines.nth(0).boundingBox(),secondClause=await clauseLines.nth(1).boundingBox();expect(secondClause!.y).toBeGreaterThanOrEqual(firstClause!.y+firstClause!.height-.5);
    await expect(page.locator('.weekday-symbol-query')).toContainText('질문:');await expect(page.locator('.weekday-symbol-query')).not.toContainText('Γ');
    if(mode==='양상')await expect(page.locator('.weekday-symbolic-summary')).toContainText('◇P');
    await expect(page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true})).toHaveCount(0);
    const source=page.locator('.weekday-source [data-alignment-node="conditional-connective"]'),arrow=page.locator('.weekday-symbol-conditional [data-alignment-node="conditional-connective"]');
    await expect(source).toHaveText(['이라면, ']);await expect(arrow).toHaveText('→');
    await source.first().hover();await expect(arrow).toHaveAttribute('data-alignment-current','');await expect(page.locator('.weekday-symbol-conditional>[data-alignment-node="constraints"]')).toHaveAttribute('data-alignment-on-path','');
    await arrow.hover();for(const part of await source.all())await expect(part).toHaveAttribute('data-alignment-current','');
    await expect(page.locator('.weekday-source [data-alignment-node="antecedent"]')).not.toHaveAttribute('data-alignment-on-path','');
    if(mode==='달력')await expect(page.locator('.weekday-symbol-limit').first()).toContainText('A → B만으로 A나 B가 참인 것은 아님');
    else await expect(page.locator('.weekday-symbol-limit')).toContainText('조건문 전체의 양상 번역은 아님');
    await expectFrame(page,weekdayFrame);await testInfo.attach(`conditional-${mode}`,{body:await page.screenshot(),contentType:'image/png'});
  }
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await weekdayInputs(page);
  await expect(page.locator('.weekday-experiment')).toHaveAttribute('data-logic-mode','alethic');await expect(page.locator('.weekday-symbol-conditional')).toContainText('A → B');
});

test('weekday equivalence tokens and their explanation highlight together in both translations',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);
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



test('weekday introduces symbols and classical inference before worlds, then compares modalities without a checkbox',async({page})=>{
  await page.goto('/knowledge/weekday-worlds/#question');await page.waitForFunction(()=>window.__atlasRelated);
  const scenes=CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes;
  const beforeWorlds=['question','reason','conditional','sunday','wednesday','notation','inference'];
  for(const [index,scene]of scenes.entries()){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',scene.id);
    await expect(page.locator('.reader-scene:visible .eyebrow')).toHaveText(`${index+1} / ${scenes.length}`);
    await expect(page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true})).toHaveCount(0);
    expect(await page.locator('.weekday-experiment').innerText()).not.toMatch(/Wish|□→/);
    if(beforeWorlds.includes(scene.id)){
      await expect(page.locator('.weekday-settings')).toBeHidden();await expect(page.locator('.weekday-modal-diagram')).toBeHidden();
      expect(await page.locator('.weekday-experiment').innerText()).not.toMatch(/가능세계|접근|w₀|◇|□/);
    }
    if(scene.id==='conditional')await expect(page.locator('.weekday-bridge')).toContainText('만약 어제가 내일이라면, 오늘이 금요일이다.');
    if(scene.id==='notation'){
      await expect(page.locator('.weekday-bridge')).toContainText('A → B');
      await page.locator('.weekday-bridge [data-alignment-side="symbol"][data-alignment-node="antecedent"]').hover();
      await expect(page.locator('.weekday-bridge [data-alignment-side="source"][data-alignment-node="antecedent"]')).toHaveAttribute('data-alignment-current','');
    }
    if(scene.id==='inference')await expect(page.locator('.weekday-bridge')).toContainText('modus ponens');
    if(scene.id==='contexts'){await expect(page.locator('.world-comparison')).toBeVisible();await expect(page.locator('.weekday-symbol-section')).toBeHidden();}
    if(scene.id==='modal-comparison'){await expect(page.locator('.weekday-interpretation-comparison')).toBeVisible();await expect(page.locator('.weekday-symbolic-summary')).toContainText('◇P');}
    if(scene.id==='alethic')await expect(page.locator('.weekday-modal-verdict')).toContainText('P: 거짓 · ◇P: 참 · □P: 거짓');
    if(scene.id==='modal-rules'){await expect(page.locator('.weekday-bridge')).toContainText('K 공리');await expect(page.locator('.weekday-bridge')).toContainText('가정 없이 증명한 정리');}
    await expectFrame(page,weekdayFrame);
  }
  await page.goto('/knowledge/weekday-worlds/#modal-comparison');await page.waitForFunction(()=>window.__atlasRelated);
  const target=page.getByRole('combobox',{name:'문장 속 목표 요일',exact:true});await target.selectOption('2');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  for(const sceneId of ['question','notation','inference','contexts','alethic']){await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),sceneId);const current=(await page.evaluate(()=>window.__atlasRelated.getState())).interaction;expect({...current,logicMode:'calendar'}).toEqual({...saved.interaction,logicMode:'calendar'});}
  await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await expect(target).toHaveValue('2');
  await page.evaluate(()=>{const state=window.__atlasRelated.getState();window.__atlasRelated.setState({...state,sceneId:'notation',interaction:{...state.interaction,logicMode:'alethic',modeSource:'manual'}} as never);});
  await expect(page.locator('.weekday-modal-diagram')).toBeHidden();await expect(page.locator('.weekday-bridge')).not.toContainText('◇');
});
