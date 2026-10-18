import {test,expect} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';
import {CATALOG_PAGE_SIZE} from '../../packages/content/catalog-pagination.js';
import {loadSiteContent} from '../../scripts/build-site.js';
import {articleDisplayTitle} from '../../packages/content/presentation.js';

const pageCount=Math.ceil(CONTENT_PAGES.length/CATALOG_PAGE_SIZE);

test('catalog pages expose every registered article exactly once with restorable navigation',async({page},testInfo)=>{
  // Given
  await page.goto('/knowledge/');
  const visited:string[]=[];
  const {collection}=await loadSiteContent();

  // When
  for(let catalogPage=1;catalogPage<=pageCount;catalogPage++){
    await expect(page.locator('.catalog-pagination')).toHaveAttribute('data-page',String(catalogPage));
    await expect(page.locator('#connections')).toBeVisible();
    const visible=page.locator('.knowledge-card:visible');
    const titles=CONTENT_PAGES.slice((catalogPage-1)*CATALOG_PAGE_SIZE,catalogPage*CATALOG_PAGE_SIZE).map(entry=>{
      const article=collection.articles.find(article=>article.id===entry.articleId);
      if(!article)throw new Error('Missing canonical article');
      return articleDisplayTitle(article);
    });
    expect(await visible.locator('h2').allTextContents()).toEqual(titles);
    visited.push(...await visible.evaluateAll(cards=>cards.map(card=>(card as HTMLAnchorElement).pathname)));
    await testInfo.attach(`catalog-${testInfo.project.name}-page-${catalogPage}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
    if(catalogPage<pageCount)await page.getByRole('link',{name:'다음 목록'}).click();
  }

  // Then
  expect(visited).toEqual(CONTENT_PAGES.map(entry=>`/knowledge/${entry.slug}/`));
  expect(new Set(visited).size).toBe(CONTENT_PAGES.length);
  await page.reload();
  await expect(page.locator('.catalog-pagination')).toHaveAttribute('data-page',String(pageCount));
  await page.getByRole('link',{name:'이전 목록'}).click();
  await page.goBack();
  await expect(page.locator('.catalog-pagination')).toHaveAttribute('data-page',String(pageCount));
});

test('catalog pages fit their viewport without clipping cards or controls',async({page},testInfo)=>{
  await page.goto('/knowledge/');
  for(let catalogPage=1;catalogPage<=pageCount;catalogPage++){
    // Given / When
    const problems=await page.evaluate(()=>{
      const issues:string[]=[];
      const root=document.documentElement;
      if(root.scrollWidth>innerWidth)issues.push(`document width ${root.scrollWidth} exceeds ${innerWidth}`);
      if(innerWidth>=1000&&root.scrollHeight>innerHeight)issues.push(`desktop height ${root.scrollHeight} exceeds ${innerHeight}`);
      for(const node of document.querySelectorAll<HTMLElement>('.knowledge-card,.catalog-pagination a')){
        if(!node.checkVisibility())continue;
        const bounds=node.getBoundingClientRect();
        if(bounds.left<0||bounds.right>innerWidth||bounds.top<0||(innerWidth>=1000&&bounds.bottom>innerHeight))issues.push(`${node.className||node.textContent}: outside viewport`);
        if(node.scrollWidth>node.clientWidth||node.scrollHeight>node.clientHeight)issues.push(`${node.className||node.textContent}: clipped content`);
      }
      return issues;
    });

    // Then
    expect(problems).toEqual([]);
    if(catalogPage<pageCount)await page.getByRole('link',{name:'다음 목록'}).click();
  }
});

test('catalog cards fit every page at 1280 by 900',async({page},testInfo)=>{
  // Given
  await page.setViewportSize({width:1280,height:900});

  for(let catalogPage=1;catalogPage<=pageCount;catalogPage++){
    // When
    await page.goto(`/knowledge/?catalog=${catalogPage}`);
    const measurements=await page.locator('.knowledge-card:visible').evaluateAll(cards=>cards.map(card=>({
      title:card.querySelector('h2')?.textContent??'',
      clientHeight:card.clientHeight,
      scrollHeight:card.scrollHeight,
    })));

    // Then
    expect(measurements.filter(card=>card.scrollHeight>card.clientHeight)).toEqual([]);
    await testInfo.attach(`catalog-1280-page-${catalogPage}-measurements`,{body:Buffer.from(JSON.stringify(measurements,null,2)),contentType:'application/json'});
  }
});

test('catalog remains a readable scrolling document without JavaScript',async({browser})=>{
  // Given
  const context=await browser.newContext({baseURL:'http://127.0.0.1:4190',javaScriptEnabled:false,viewport:{width:1920,height:900}});
  const page=await context.newPage();

  // When
  await page.goto('/knowledge/');

  // Then
  await expect(page.locator('.knowledge-card')).toHaveCount(CONTENT_PAGES.length);
  expect(await page.locator('.knowledge-card').evaluateAll(cards=>cards.every(card=>getComputedStyle(card).display!=='none'))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});
