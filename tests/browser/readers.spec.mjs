import {test, expect} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.mjs';
import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';

// Measure content, not just CSS overflow:hidden: clipped scroll containers fail too.
async function expectFrame(page, {content, controls}) {
  const problems = await page.evaluate(({content, controls}) => {
    const issues = [];
    const root = document.documentElement;
    if (root.scrollHeight > innerHeight || root.scrollWidth > innerWidth)
      issues.push(`document ${root.scrollWidth}×${root.scrollHeight} exceeds ${innerWidth}×${innerHeight}`);
    for (const selector of [...content, ...controls])
      if (!document.querySelector(selector)) issues.push(`missing layout target: ${selector}`);
    for (const selector of content) for (const node of document.querySelectorAll(selector)) {
      if (!node.checkVisibility()) continue;
      if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
        issues.push(`${selector}: content ${node.scrollWidth}×${node.scrollHeight}, space ${node.clientWidth}×${node.clientHeight}`);
      const r = node.getBoundingClientRect();
      if (r.top < 0 || r.left < 0 || r.bottom > innerHeight || r.right > innerWidth)
        issues.push(`${selector}: content outside viewport`);
    }
    for (const selector of controls) for (const node of document.querySelectorAll(selector)) {
      if (!node.checkVisibility()) continue;
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

const lambdaFrame={content:['.lambda-editor','.lambda-output','.lambda-rule-term','.lambda-step-term','.reader-scene:not([hidden]) .reader-copy'],controls:['#reader-controls button','.lambda-experiment button','.lambda-experiment input','.lambda-experiment textarea','.lambda-experiment select','.reader-menu summary']};
for(const topic of CONTENT_PAGES.filter(p=>p.interactive==='typed-lambda'))test(`${topic.slug}: all typed examples and explanation scenes fit`,async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
  for(let i=0;i<topic.scenes.length;i++){
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',topic.scenes[i].id);
    await expect(page.getByRole('combobox',{name:'비교할 예제'})).toHaveValue(topic.scenes[i].suggestion.example);
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
  const rejected=await page.evaluate(()=>{const before=window.__atlasRelated.getState();try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,step:99}});return false;}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}});expect(rejected).toBe(true);
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
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/knowledge/atomic-orbitals/');await page.waitForFunction(()=>window.__atlasRelated);
  const metadata=CONTENT_PAGES.find(p=>p.slug==='atomic-orbitals');
  for(const scene of metadata.scenes){
    await expect(page.locator('.reader-scene:visible h2')).toHaveText(scene.title);
    const snapshot=await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot());
    expect(snapshot.interaction.orbital).toEqual({n:scene.suggestion.n,basis:scene.suggestion.basis,Z:scene.suggestion.Z});
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
    const image=await page.locator('canvas').evaluate(canvas=>canvas.toDataURL());expect(image.length).toBeGreaterThan(1000);
  }
  const surface=await page.evaluate(()=>window.__atlasRelated.getInspectionSnapshot().interaction.viewer.triangleCount);expect(surface).toBeGreaterThan(0);
  await testInfo.attach('orbital-surface',{body:await page.screenshot(),contentType:'image/png'});
  await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption('cloud');
  const before=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('canvas').focus();await page.keyboard.press('ArrowRight');
  const rotated=await page.evaluate(()=>window.__atlasRelated.getState());expect(rotated.sceneId).toBe(before.sceneId);expect(rotated.interaction.view.yaw).toBeGreaterThan(before.interaction.view.yaw);
  await page.locator('#reader-next').click();await expect(page.getByRole('combobox',{name:'핵전하 Z',exact:true})).toHaveValue('2');
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  const rejection=await page.evaluate(()=>{const before=window.__atlasRelated.getState();let rejected=false;try{window.__atlasRelated.setState({...before,interaction:{...before.interaction,orbital:{n:0,basis:'s',Z:1}}});}catch{rejected=true;}return {before,after:window.__atlasRelated.getState(),rejected};});
  expect(rejection.rejected).toBe(true);expect(rejection.after).toEqual(rejection.before);
  const pixels=await page.locator('canvas').evaluate(canvas=>canvas.toDataURL());
  await page.evaluate(()=>window.__atlasRelated.seek(700));expect(await page.locator('canvas').evaluate(canvas=>canvas.toDataURL())).toBe(pixels);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();await expect(page.getByRole('combobox',{name:'핵전하 Z',exact:true})).toHaveValue('1');
});

test('spatial viewer can render a non-orbital field and reject an invalid camera state',async({page})=>{
  await page.goto('/knowledge/');
  const result=await page.evaluate(async()=>{
    const {mountFieldViewer}=await import('/components/spatial/field-viewer.mjs');
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
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4191/tools/media/');
  await expect(page.locator('#render-plan')).toContainText('134.0초 · 1080×1440 · 4020프레임');
  await expect(page.locator('#render-caption')).toContainText('0.0초');
  await page.locator('#render-format').selectOption('landscape');
  await expect(page.locator('#render-canvas')).toHaveAttribute('width','1920');
  await expect(page.locator('#render-canvas')).toHaveAttribute('height','1080');
  await page.locator('#render-seek').evaluate(input=>{input.value='64000';input.dispatchEvent(new Event('input',{bubbles:true}));});
  await expect(page.locator('#render-caption')).toContainText('64.0초');
  expect(errors).toEqual([]);
});

test('an article can read and restore scenes without installing an experiment adapter',async({page})=>{
  const data={...CONTENT_PAGES.find(p=>p.slug==='zfc'),model:null};
  await page.route('**/content/catalog.mjs',route=>route.fulfill({contentType:'text/javascript',body:`export const CONTENT_PAGES=${JSON.stringify([data])};`}));
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
  await expect(heading).toHaveText(title);
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
  await expect(page.locator('#dialogue-title')).toHaveText(title);
  await expect(page.locator('#lesson-evaluation')).toBeVisible();
  await expect(page.locator('#dialogue-text')).toHaveAttribute('aria-disabled','true');
  await expectFrame(page,lessonFrame);
  await page.getByRole('button',{name:'장면 예시로',exact:true}).click();
  await expect(page.locator('#lesson-evaluation')).toBeHidden();
  await expect(page.locator('#dialogue-text')).toBeVisible();
});

test('availability feedback supports non-logic content and deterministic restoration',async({page})=>{
  await page.goto('/knowledge/');
  const results=await page.evaluate(async()=>{
    const {mountEvaluationFeedback}=await import('/components/reader/evaluation-feedback.mjs');
    const content=document.createElement('section'),message=document.createElement('p');
    content.textContent='Measurement details';document.body.append(content,message);
    const component=mountEvaluationFeedback({content,message});
    const unavailable={available:false,summary:'Calibration unavailable',detail:'Choose a calibrated sample.'};
    component.setState(unavailable);
    const blocked={hidden:content.hidden,disabled:content.getAttribute('aria-disabled'),text:message.textContent};
    const snapshot=component.getState();snapshot.available=true;
    let rejected=false;try{component.setState({available:true,summary:42,detail:''});}catch{rejected=true;}
    const unchanged=component.getState();component.reset();
    const reset={hidden:content.hidden,messageHidden:message.hidden};component.setState(unavailable);
    return {blocked,rejected,unchanged,reset,restored:component.getState()};
  });
  expect(results.blocked).toEqual({hidden:true,disabled:'true',text:'Calibration unavailableChoose a calibrated sample.'});
  expect(results.rejected).toBe(true);expect(results.unchanged).toEqual(results.restored);
  expect(results.reset).toEqual({hidden:false,messageHidden:true});
});

