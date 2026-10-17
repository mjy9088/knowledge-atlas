import {test,expect,type Page} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';

async function fit(page:Page){
  const issues=await page.evaluate(()=>{
    const result:string[]=[];
    if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight)result.push('document overflow');
    for(const node of document.querySelectorAll<HTMLElement>('.weekday-input-panel,.weekday-reasoning-panel,.weekday-original-section,.weekday-symbol-section,.reader-copy,.world-card,.reader-action-rail,.reader-cover')){
      if(!node.checkVisibility())continue;
      if(node.scrollHeight>node.clientHeight+1||node.scrollWidth>node.clientWidth+1)result.push(node.className+' content overflow '+node.scrollWidth+'x'+node.scrollHeight+' / '+node.clientWidth+'x'+node.clientHeight);
      const r=node.getBoundingClientRect();if(r.top<0||r.left<0||r.bottom>innerHeight+.1||r.right>innerWidth+.1)result.push(node.className+' outside viewport');
    }
    for(const node of document.querySelectorAll<HTMLElement>('.reader-action-rail button,.reader-action-rail summary,.reader-action-rail a,.weekday-context-select,.weekday-modal-toggle input')){
      if(!node.checkVisibility()||node.closest('details:not([open]) nav'))continue;
      const r=node.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
      if(!hit||!node.contains(hit)&&!hit.contains(node))result.push(node.className+' inaccessible');
    }
    return result;
  });expect(issues).toEqual([]);
}

test('200% capture fits title, every scene, both translations, four worlds and restored state',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/knowledge/weekday-worlds/');await page.waitForFunction(()=>window.__atlasRelated);await fit(page);
  expect(await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio}))).toEqual({width:960,height:540,dpr:2});
  const baseline=await page.locator('#reader-next').boundingBox();
  for(const scene of CONTENT_PAGES.find(p=>p.slug==='weekday-worlds')!.scenes){
    await page.evaluate(sceneId=>window.__atlasRelated.setState({sceneId}),scene.id);
    for(const mode of [false,true]){
      await page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true}).setChecked(mode);await fit(page);
      const bounds=await page.locator('#reader-next').boundingBox();expect(bounds).toEqual(baseline);
    }
  }
  await page.getByRole('button',{name:'세계 추가',exact:true}).click();await page.getByRole('button',{name:'세계 추가',exact:true}).click();await fit(page);
  const saved=await page.evaluate(()=>window.__atlasRelated.getState());await page.evaluate(()=>window.__atlasRelated.reset());await page.evaluate(state=>window.__atlasRelated.setState(state),saved);await fit(page);
  await testInfo.attach('youtube-1920x1080-at-200-percent',{body:await page.screenshot(),contentType:'image/png'});expect(errors).toEqual([]);
});

test('focus chrome reveals on top hover and keyboard focus; side menu and scrolling choices stay accessible',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#sunday');await page.waitForFunction(()=>window.__atlasRelated);
  const chrome=page.locator('.reader-reveal-chrome'),link=chrome.getByRole('link',{name:'지식 지도',exact:true});
  await page.mouse.move(480,270);await expect(chrome.locator('nav')).toHaveCSS('opacity','0');
  await page.mouse.move(480,2);await expect(chrome.locator('nav')).toHaveCSS('opacity','1');await expect(chrome).toHaveCSS('height','40px');
  await page.mouse.move(480,270);await expect(chrome.locator('nav')).toHaveCSS('opacity','0');await link.focus();await expect(chrome.locator('nav')).toHaveCSS('opacity','1');await link.blur();
  await page.locator('.reader-menu summary').click();await expect(page.locator('.reader-menu nav')).toBeVisible();
  await page.locator('.reader-menu a[href="#evidence"]').click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');await page.keyboard.press('Escape');
  await page.mouse.move(480,270);
  for(const control of await page.locator('.weekday-settings button,.weekday-settings select').all()){
    if(await control.isDisabled())continue;await control.scrollIntoViewIfNeeded();
    expect(await control.evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return Boolean(hit&&(e.contains(hit)||hit.contains(e)));})).toBe(true);
  }
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-world-dialog')).toBeVisible();await page.keyboard.press('Escape');await fit(page);
  await testInfo.attach('youtube-focus-controls',{body:await page.screenshot(),contentType:'image/png'});
});
