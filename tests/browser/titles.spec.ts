import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../../content/catalog.js";
import { weekdayInputs } from "../../content/formal-logic/weekday-worlds/tests/browser/support.js";
import { expectFrame } from "./support/frame.js";

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
