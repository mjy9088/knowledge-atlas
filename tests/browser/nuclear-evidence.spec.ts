import {test,expect} from '@playwright/test';
import type {Page} from '@playwright/test';

type SurfaceBounds = Readonly<{
  top: number;
  right: number;
  bottom: number;
  left: number;
  clientHeight: number;
  scrollHeight: number;
}>;

const compactSurfaceBounds = async (page: Page) => page.evaluate(() => {
  const bounds = (selector: string): SurfaceBounds => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) throw new TypeError(`Missing compact surface: ${selector}`);
    const rectangle = element.getBoundingClientRect();
    return {
      top: rectangle.top,
      right: rectangle.right,
      bottom: rectangle.bottom,
      left: rectangle.left,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    };
  };
  return {
    viewport: {width: innerWidth, height: innerHeight},
    document: {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    },
    menu: bounds('.reader-menu summary'),
    process: bounds('.nuclear-evidence'),
    dialogue: bounds('.reader-scene:not([hidden]) .reader-dialogue'),
    history: bounds('.nuclear-evidence-history'),
    readerControls: bounds('#reader-controls'),
  };
});

test('proton process separates observation and inference with independent restoration',async({page})=>{
  await page.goto('/knowledge/nuclear-constituents/#proton');
  await page.waitForFunction(()=>window.__atlasRelated);
  const panel=page.locator('.nuclear-evidence');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-stage','setup');
  for(const stage of ['contact','emission','inference']){
    await page.getByRole('button',{name:'다음 단계 →',exact:true}).click();
    await expect(panel).toHaveAttribute('data-stage',stage);
  }
  const state=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.locator('#reader-next').click();
  await expect(page.locator('#reader-workbench')).toBeHidden();
  await expect(page.locator('.reader-scene:visible .concept-diagram')).toBeVisible();
  await page.locator('#reader-prev').click();
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(saved=>window.__atlasRelated.setState(saved),state);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
  expect(await page.evaluate(()=>{
    const before=window.__atlasRelated.getState();
    try{window.__atlasRelated.setState({...before,interaction:{version:1,timeMs:-1}});}catch{return JSON.stringify(before)===JSON.stringify(window.__atlasRelated.getState());}
    return false;
  })).toBe(true);
});

test('reduced-motion reader retains all manual process stages without automatic playback',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/knowledge/nuclear-constituents/#proton');
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.getByRole('button',{name:'자동 재생 꺼짐',exact:true})).toBeDisabled();
  for(const stage of ['contact','emission','inference']){
    await page.getByRole('button',{name:'다음 단계 →',exact:true}).click();
    await expect(page.locator('.nuclear-evidence')).toHaveAttribute('data-stage',stage);
  }
  await page.getByRole('button',{name:'처음부터',exact:true}).click();
  await expect(page.locator('.nuclear-evidence')).toHaveAttribute('data-stage','setup');
});

test('proton process keeps its complete reading surface reachable in compact landscape',async({page})=>{
  // Given the future 1920×1080 video layout at 200% capture scale.
  await page.setViewportSize({width:960,height:540});
  await page.goto('/knowledge/nuclear-constituents/#proton');
  await page.waitForFunction(()=>window.__atlasRelated);

  // When every authored process stage is selected independently.
  for(const timeMs of [0,1_600,3_200,4_800]){
    await page.evaluate(time=>window.__atlasRelated.seek(time),timeMs);

    // Then the process, canonical dialogue, scope/history, menu, and navigation fit without normal scrolling.
    const surface=await compactSurfaceBounds(page);
    expect(surface.viewport).toEqual({width:960,height:540});
    expect(surface.document.scrollWidth).toBe(surface.document.clientWidth);
    expect(surface.document.scrollHeight).toBe(surface.document.clientHeight);
    for(const bounds of [surface.menu,surface.process,surface.dialogue,surface.history,surface.readerControls]){
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(surface.viewport.width);
      expect(bounds.bottom).toBeLessThanOrEqual(surface.viewport.height);
      expect(bounds.scrollHeight-bounds.clientHeight).toBeLessThanOrEqual(1);
    }
  }
});
