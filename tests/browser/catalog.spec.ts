import {test,expect} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';
import {expectRetiredRoute} from './support/main-work.js';

const routes=['/knowledge/newton-to-quantum/','/knowledge/number-structures/','/knowledge/weekday-worlds/','/knowledge/monty-hall/','/knowledge/two-children/'] as const;
const retiredRoutes=[
  '/lesson.html','/knowledge/binary-search/','/knowledge/atomic-orbitals/',
  '/knowledge/atom-evidence/','/knowledge/electron-evidence/','/knowledge/nuclear-scattering/','/knowledge/inertial-motion/',
  '/knowledge/photoelectric-evidence/','/knowledge/quantum-spectra/','/knowledge/quark-evidence/','/knowledge/nuclear-constituents/','/knowledge/light-clock-time/',
  '/knowledge/counting-zero/','/knowledge/negative-numbers/','/knowledge/rational-numbers/','/knowledge/rational-representations/',
  '/knowledge/irrational-numbers/','/knowledge/rational-density/','/knowledge/real-completeness/','/knowledge/complex-numbers/',
] as const;

test('catalog gives every active topic the same entry information and visual treatment',async({page},testInfo)=>{
  // Given the public catalog with multiple possible starting points.
  await page.goto('/knowledge/');
  // When the entries are read and their actual styles and widths are compared.
  const cards=page.locator('.knowledge-card');
  await expect(cards).toHaveCount(CONTENT_PAGES.length);
  const appearance=await cards.evaluateAll(entries=>entries.map(entry=>{
    const heading=entry.querySelector('h3');
    if(!heading)throw new TypeError('Missing topic title');
    const style=getComputedStyle(entry),title=getComputedStyle(heading);
    return{width:entry.getBoundingClientRect().width,padding:style.padding,background:style.backgroundColor,border:style.border,fontSize:title.fontSize,fontWeight:title.fontWeight};
  }));
  // Then no topic gains a larger card, privileged typography, or extra entry information.
  for(const item of appearance)expect(item).toEqual(appearance[0]);
  for(const [index,topic]of CONTENT_PAGES.entries()){
    const card=cards.nth(index),first=topic.scenes[0];
    const finalId=topic.navigation?.chapters.filter(chapter=>chapter.kind==='mainline').at(-1)?.sceneIds.at(-1);
    const last=topic.scenes.find(scene=>scene.id===finalId)??topic.scenes.at(-1);
    if(!first||!last)throw new TypeError('Missing topic opening or payoff');
    await expect(card.locator('p')).toHaveText(first.title);
    await expect(card.locator('small')).toContainText(last.title);
    await expect(card).toHaveAttribute('href',`/knowledge/${topic.slug}/`);
  }
  await testInfo.attach('catalog-starting-points',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('catalog remains readable without JavaScript',async({browser})=>{
  // Given a browser with enhancement disabled.
  const context=await browser.newContext({baseURL:'http://127.0.0.1:4190',javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
  // When the catalog is loaded.
  await page.goto('/knowledge/');
  // Then all five canonical entrances remain visible without horizontal overflow.
  await expect(page.locator('.knowledge-card')).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});

test('retired reader routes return not found while active routes render',async({page,request})=>{
  // Given the curated route boundary.
  // When active and retired URLs are requested directly.
  const active=await Promise.all(routes.map(route=>request.get(route))),retired=await Promise.all(retiredRoutes.map(route=>request.get(route)));
  // Then active works render and retired executable screens remain absent.
  expect(active.every(response=>response.status()===200)).toBe(true);
  expect(retired.every(response=>response.status()===404)).toBe(true);
  for(const base of ['http://127.0.0.1:4190','http://127.0.0.1:4191']){
    const testSource=await request.get(`${base}/packages/models/tests/hydrogenic.test.js`);
    expect(testSource.status()).toBe(404);
  }
  await test.step('nuclear constituents screen is deliberately retired without leaving process controls',async()=>{
    await expectRetiredRoute(page,request,'/knowledge/nuclear-constituents/#proton','.nuclear-evidence,[data-stage],#reader-controls');
  });
  await test.step('quark evidence screen is deliberately retired without leaving old controls',async()=>{
    await expectRetiredRoute(page,request,'/knowledge/quark-evidence/','.quark-evidence,#reader-controls');
  });
  await test.step('light-clock screen is deliberately retired without leaving old controls',async()=>{
    await expectRetiredRoute(page,request,'/knowledge/light-clock-time/','.light-clock,#reader-controls');
  });
});

test('every public article restores a direct scene and reset deterministically',async({page})=>{
  for(const topic of CONTENT_PAGES){
    // Given direct entry to the final authored scene.
    const scene=topic.scenes.at(-1);if(!scene)throw new TypeError('Expected article scene');
    await page.goto(`/knowledge/${topic.slug}/#${scene.id}`);await page.waitForFunction(()=>window.__atlasRelated);
    const direct=await page.evaluate(()=>window.__atlasRelated.getState());
    // When reset and explicit restoration are applied.
    await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),direct);
    // Then scene identity and interaction state return exactly.
    expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(direct);
  }
});
