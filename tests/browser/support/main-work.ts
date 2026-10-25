import {expect,type APIRequestContext,type Page} from '@playwright/test';
import newtonArticle from '../../../content/physics/newton-to-quantum/article.ko.json' with {type:'json'};
import numberArticle from '../../../content/mathematics/number-structures/article.ko.json' with {type:'json'};
import {CONTENT_PAGES,sceneText} from '../../../content/catalog.js';
import type {Article,ContentChapter,ContentPage,Scene} from '../../../packages/content/types.js';

export type MainWorkSlug='newton-to-quantum'|'number-structures';
export type ActiveWork=Readonly<{page:ContentPage;article:Article}>;

function requirePage(slug:MainWorkSlug):ContentPage{
  const page=CONTENT_PAGES.find(candidate=>candidate.slug===slug);
  if(!page)throw new TypeError(`Missing active work: ${slug}`);
  return page;
}

const WORKS={
  'newton-to-quantum':{page:requirePage('newton-to-quantum'),article:newtonArticle},
  'number-structures':{page:requirePage('number-structures'),article:numberArticle},
} satisfies Readonly<Record<MainWorkSlug,ActiveWork>>;

export function activeWork(slug:MainWorkSlug):ActiveWork{return WORKS[slug]}

export function requireScene(work:ActiveWork,sceneId:string):Scene{
  const scene=work.page.scenes.find(candidate=>candidate.id===sceneId);
  if(!scene)throw new TypeError(`Missing ${work.page.slug} scene: ${sceneId}`);
  return scene;
}

export function readingSceneIds(work:ActiveWork):readonly string[]{
  return work.page.scenes.map(scene=>scene.id);
}
export function skippableSections(work:ActiveWork):readonly ContentChapter[]{
  return work.page.navigation?.chapters.filter(chapter=>work.page.scenes.find(scene=>scene.id===chapter.sceneIds[0])?.skip)??[];
}
export function sectionBounds(work:ActiveWork,chapter:ContentChapter){
  const start=work.page.scenes.findIndex(scene=>scene.id===chapter.sceneIds[0]);
  const end=work.page.scenes.findIndex(scene=>scene.id===chapter.sceneIds.at(-1));
  const before=work.page.scenes[start-1],after=work.page.scenes[end+1];
  if(!before||!after)throw new RangeError('Section needs surrounding scenes');
  return {before:before.id,after:after.id};
}

export async function openMainWorkScene(page:Page,work:ActiveWork,sceneId:string):Promise<void>{
  requireScene(work,sceneId);
  const response=await page.goto(`/knowledge/${work.page.slug}/#${sceneId}`);
  if(response)expect(response.status(),`${work.page.slug}/${sceneId} response`).toBe(200);
  else expect(new URL(page.url()).pathname).toBe(`/knowledge/${work.page.slug}/`);
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.related-reader')).toHaveAttribute('data-presentation','longform');
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',sceneId);
}

export async function expectLongformScene(page:Page,work:ActiveWork,sceneId:string):Promise<void>{
  const scene=requireScene(work,sceneId),visible=page.locator('.reader-scene:visible');
  await expect(visible).toHaveAttribute('id',sceneId);
  await expect(visible.locator('h2')).toHaveText(scene.title);
  await expect(visible.locator('.scene-prose')).toHaveText(sceneText(work.article,scene));
  if(!scene.figure&&scene.cards.length>0){
    const rows=visible.locator('.concept-facts>li');
    await expect(rows).toHaveCount(scene.cards.length);
    await expect(visible.locator('.concept-connector')).toHaveCount(0);
    for(const [index,card] of scene.cards.entries()){
      await expect(rows.nth(index).locator('.concept-fact-value')).toHaveText(card);
    }
  }
  const geometry=await visible.evaluate(element=>{
    const copy=element.querySelector<HTMLElement>('.reader-copy'),prose=element.querySelector<HTMLElement>('.scene-prose');
    if(!copy||!prose)throw new TypeError('Missing canonical reader copy');
    const root=document.documentElement,bounds=element.getBoundingClientRect(),copyStyle=getComputedStyle(copy);
    return{
      documentWidth:root.scrollWidth,viewportWidth:innerWidth,
      sceneLeft:bounds.left,sceneRight:bounds.right,
      copyOverflowY:copyStyle.overflowY,copyMaxHeight:copyStyle.maxHeight,
      copyClipped:copy.scrollWidth>copy.clientWidth+1||copy.scrollHeight>copy.clientHeight+1,
      proseClipped:prose.scrollWidth>prose.clientWidth+1||prose.scrollHeight>prose.clientHeight+1,
      visual:element.getAttribute('data-visual'),
    };
  });
  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(geometry.sceneLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.sceneRight).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(geometry.copyOverflowY).toBe('visible');
  expect(geometry.copyMaxHeight).toBe('none');
  expect(geometry.copyClipped).toBe(false);
  expect(geometry.proseClipped).toBe(false);
  expect(geometry.visual).toBe(scene.figure?'figure':scene.cards.length>0?'cards':'none');
  if(scene.figure){
    const image=visible.locator('.scene-figure img');
    await expect(image).toHaveAttribute('src',scene.figure.src);
    await expect(image).toHaveAttribute('alt',scene.figure.alt);
    await expect(visible.locator('.scene-figure figcaption')).toHaveText(scene.figure.caption);
    expect(await image.evaluate(node=>node instanceof HTMLImageElement&&node.complete&&node.naturalWidth>0)).toBe(true);
    expect((await page.request.get(scene.figure.src)).status()).toBe(200);
  }
  for(const selector of ['#reader-prev','#reader-next','#reader-reset','.reader-menu summary']){
    const control=page.locator(selector);
    if(!await control.isVisible())continue;
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeInViewport();
    const access=await control.evaluate(element=>{
      const bounds=element.getBoundingClientRect(),hit=document.elementFromPoint(bounds.left+bounds.width/2,bounds.top+bounds.height/2);
      return{width:bounds.width,height:bounds.height,reachable:hit===element||Boolean(hit&&element.contains(hit))};
    });
    expect(access.width,selector).toBeGreaterThanOrEqual(44);
    expect(access.height,selector).toBeGreaterThanOrEqual(44);
    expect(access.reachable,selector).toBe(true);
  }
}

export async function expectReaderStateBoundary(page:Page,sceneId:string):Promise<void>{
  await page.evaluate(id=>window.__atlasRelated.setState({sceneId:id}),sceneId);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());
  await page.evaluate(()=>window.__atlasRelated.reset());
  await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
  expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(saved);
  expect(await page.evaluate(()=>{
    const before=window.__atlasRelated.getState();
    try{window.__atlasRelated.setState({sceneId:'scene:invalid'});}
    catch(error){if(!(error instanceof Error))throw error;return JSON.stringify(window.__atlasRelated.getState())===JSON.stringify(before);}
    return false;
  })).toBe(true);
}

export async function expectSectionContinuation(page:Page,work:ActiveWork,section:ContentChapter):Promise<void>{
  const bounds=sectionBounds(work,section);
  await openMainWorkScene(page,work,bounds.before);
  await page.locator('#reader-next').click();
  for(const sceneId of section.sceneIds){
    await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',sceneId);
    await expectLongformScene(page,work,sceneId);
    await page.locator('#reader-next').click();
  }
  await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',bounds.after);
}

export async function expectRetiredRoute(page:Page,request:APIRequestContext,route:string,oldControls:string):Promise<void>{
  expect((await request.get(route)).status(),route).toBe(404);
  const response=await page.goto(route);
  expect(response?.status(),route).toBe(404);
  await expect(page.locator('h1')).toHaveText('페이지를 찾지 못했습니다');
  await expect(page.locator(oldControls)).toHaveCount(0);
  await page.getByRole('link',{name:'지식 목록으로'}).click();
  await expect(page).toHaveURL(/\/knowledge\/$/);
  await expect(page.locator('.knowledge-card')).toHaveCount(5);
}
