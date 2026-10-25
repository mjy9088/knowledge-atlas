import {expect,test} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';

for(const slug of ['newton-to-quantum','number-structures','monty-hall']) {
  const work=CONTENT_PAGES.find(page=>page.slug===slug)!;
  test(`${slug}: default Next includes every slide and Previous follows the same complete order`,async({page})=>{
    await page.goto(`/knowledge/${slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
    if(slug==='monty-hall')await page.getByRole('button',{name:'3번 문 선택',exact:true}).click();
    const contents=await page.locator('.reader-menu nav a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
    expect(contents.filter(href=>work.scenes.some(scene=>href===`/knowledge/${slug}/${scene.id}/`))).toEqual(work.scenes.map(scene=>`/knowledge/${slug}/${scene.id}/`));
    for(const [index,scene] of work.scenes.entries()){
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',scene.id);
      await expect(page.locator('.reader-scene:visible .eyebrow').first()).toHaveText(`본문 ${index+1} / ${work.scenes.length}`);
      if(index<work.scenes.length-1)await page.locator('#reader-next').click();
    }
    for(const scene of work.scenes.slice(0,-1).reverse()){
      await page.locator('#reader-prev').click();
      await expect(page.locator('.reader-scene:visible')).toHaveAttribute('id',scene.id);
    }
    if(slug==='monty-hall')await expect(page.getByRole('button',{name:'3번 문 선택',exact:true})).toHaveAttribute('aria-pressed','true');
  });
}

test('without JavaScript the included numbered comparison continues directly to sampling',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('/knowledge/monty-hall/specific/');
  await page.locator('.reader-scene:visible .reader-static-navigation').getByRole('link',{name:'다음 →',exact:true}).click();
  await expect(page).toHaveURL(/\/specific-cases\/$/);
  await page.locator('.reader-scene:visible .reader-static-navigation').getByRole('link',{name:'다음 →',exact:true}).click();
  await page.locator('.reader-scene:visible .reader-static-navigation').getByRole('link',{name:'다음 →',exact:true}).click();
  await expect(page).toHaveURL(/\/sampling\/$/);
  await context.close();
});
