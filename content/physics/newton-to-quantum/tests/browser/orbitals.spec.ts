import { expect, test, type Page } from "@playwright/test";
import { CONTENT_PAGES, sceneText } from "../../../../catalog.js";
import { activeWork, detours, expectLongformScene, openMainWorkScene } from "../../../../../tests/browser/support/main-work.js";

const orbitalFrame={content:['.reader-copy:not([hidden])','.orbital-controls','.orbital-footer','.orbital-view'],controls:['#reader-controls button','.orbital-controls select','.orbital-controls button','.field-canvas','.reader-menu summary']} as const;
async function expectOrbitalLongform(page:Page){
  await expect(page.locator('.related-reader')).toHaveAttribute('data-presentation','longform');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const selector of [...orbitalFrame.content,...orbitalFrame.controls]){
    const matches=page.locator(selector);expect(await matches.count(),selector).toBeGreaterThan(0);
    for(let index=0;index<await matches.count();index++){const match=matches.nth(index);if(!await match.isVisible())continue;await match.scrollIntoViewIfNeeded();await expect(match,selector).toBeInViewport();}
  }
}

test('orbital detour displays a substantial canvas in every rendering mode',async({page})=>{
  // Given the actual optional orbital reader, not a standalone viewer harness.
  await page.goto('/knowledge/newton-to-quantum/#orbital-density');
  await page.waitForFunction(()=>window.__atlasRelated);
  // When each supported representation is selected.
  for(const mode of ['cloud','slice','surface']){
    await page.getByRole('combobox',{name:'표시 방식',exact:true}).selectOption(mode);
    const canvas=page.locator('.field-canvas');
    await canvas.scrollIntoViewIfNeeded();
    // Then both the displayed box and its drawn field remain visible at reading size.
    const geometry=await canvas.evaluate(element=>{
      if(!(element instanceof HTMLCanvasElement))throw new TypeError('Expected visible canvas');
      const bounds=element.getBoundingClientRect(),context=element.getContext('2d');
      if(!context)throw new TypeError('Missing visible canvas context');
      const {data}=context.getImageData(0,0,element.width,element.height);
      let fieldPixels=0;
      for(let i=0;i<data.length;i+=4)if(data[i]>55||data[i+1]>65||data[i+2]>75)fieldPixels++;
      return{width:bounds.width,height:bounds.height,fieldPixels};
    });
    expect(geometry.width).toBeGreaterThan(250);
    expect(geometry.height).toBeGreaterThanOrEqual(240);
    expect(geometry.fieldPixels).toBeGreaterThan(100);
  }
});

test('customized optional orbital input preserves canonical prose when returning to the mainline',async({page})=>{
  // Given the main argument and its optional orbital chapter.
  const work=activeWork('newton-to-quantum');
  const branch=detours(work).find(chapter=>chapter.id==='orbital-laboratory');
  if(!branch)throw new TypeError('Missing orbital detour');
  await openMainWorkScene(page,work,branch.parentSceneId);
  await page.locator('.reader-scene:visible .reader-branch-links a').click();
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',branch.sceneIds[0]);
  // When the reader edits the optional scientific input and explicitly returns.
  await page.getByRole('combobox',{name:'핵전하 Z',exact:true}).selectOption('2');
  const sourceScene=work.page.scenes.find(scene=>scene.id===branch.sceneIds[0]);
  if(!sourceScene)throw new TypeError('Missing orbital source scene');
  await expect(page.locator('.reader-scene:visible .scene-prose')).toContainText(sceneText(work.article,sourceScene));
  const edited=await page.evaluate(()=>window.__atlasRelated.getState().interaction);
  await page.locator('.reader-scene:visible .reader-branch-links a').click();
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',branch.returnSceneId);
  // Then the inactive adapter cannot replace the mainline's complete manuscript.
  await expectLongformScene(page,work,branch.returnSceneId);
  await expect(page.locator('#reader-workbench')).toBeHidden();
  expect(await page.evaluate(()=>window.__atlasRelated.getState().interaction)).toEqual(edited);
});

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
