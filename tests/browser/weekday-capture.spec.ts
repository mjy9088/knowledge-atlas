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
  const crossings=await page.evaluate(()=>{
    const state=window.__atlasRelated.getState().interaction;if(!state||!('worlds'in state))throw new Error('Expected worlds');
    const circles=[...document.querySelectorAll<SVGCircleElement>('.weekday-modal-diagram circle[data-world]')],edges=[...document.querySelectorAll<SVGPathElement>('.weekday-modal-diagram svg>path')];
    return edges.flatMap((edge,index)=>{const [from,to]=state.access[index],length=edge.getTotalLength();return circles.flatMap(circle=>{const id=Number(circle.dataset.world);if(id===from||id===to)return [];for(let step=0;step<=100;step++){const p=edge.getPointAtLength(length*step/100);if(Math.hypot(p.x-circle.cx.baseVal.value,p.y-circle.cy.baseVal.value)<circle.r.baseVal.value)return [`${from}→${to} crosses ${id}`];}return [];});});
  });expect(crossings).toEqual([]);
  await testInfo.attach('youtube-1920x1080-at-200-percent',{body:await page.screenshot(),contentType:'image/png'});expect(errors).toEqual([]);
});

test('focus chrome reveals on top hover and keyboard focus; side menu and scrolling choices stay accessible',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#sunday');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('#reader-end-links,#reader-skip-scope')).toHaveCount(0);
  const actions=await Promise.all(['.reader-menu summary','#reader-prev','#reader-next'].map(selector=>page.locator(selector).boundingBox()));
  for(let i=1;i<actions.length;i++){const gap=actions[i]!.y-actions[i-1]!.y-actions[i-1]!.height;expect(gap).toBeGreaterThanOrEqual(0);expect(gap).toBeLessThanOrEqual(5);}
  await expect(page.locator('#reader-next')).toHaveAttribute('title','→ 방향키 · Space / Enter: 다음');
  const chrome=page.locator('.reader-reveal-chrome'),link=chrome.getByRole('link',{name:'지식 지도',exact:true});
  await page.mouse.move(480,270);await expect(chrome.locator('nav')).toHaveCSS('opacity','0');
  await page.mouse.move(480,2);await expect(chrome.locator('nav')).toHaveCSS('opacity','1');await expect(chrome).toHaveCSS('height','40px');
  await page.mouse.move(480,270);await expect(chrome.locator('nav')).toHaveCSS('opacity','0');await link.focus();await expect(chrome.locator('nav')).toHaveCSS('opacity','1');await link.blur();
  await page.locator('.reader-menu summary').click();await expect(page.locator('.reader-menu nav')).toBeVisible();
  const menuBounds=await page.locator('.reader-menu nav').boundingBox();expect(menuBounds!.y).toBeGreaterThanOrEqual(0);expect(menuBounds!.y+menuBounds!.height).toBeLessThanOrEqual(540);expect(menuBounds!.x).toBeGreaterThanOrEqual(0);expect(menuBounds!.x+menuBounds!.width).toBeLessThanOrEqual(960);
  const closeMenu=page.getByRole('button',{name:'목차 닫기 ×',exact:true});await expect(closeMenu).toBeVisible();await page.locator('.reader-menu nav').evaluate(e=>e.scrollTop=e.scrollHeight);await closeMenu.click();await expect(page.locator('.reader-menu')).not.toHaveAttribute('open','');
  await page.locator('.reader-menu summary').click();await page.keyboard.press('Escape');await expect(page.locator('.reader-menu')).not.toHaveAttribute('open','');await expect(page.locator('.reader-menu summary')).toBeFocused();
  await page.locator('.reader-menu summary').click();await page.mouse.click(450,520);await expect(page.locator('.reader-menu')).not.toHaveAttribute('open','');
  await page.locator('.reader-menu summary').click();
  await page.locator('.reader-menu a[href="#evidence"]').click();await expect(page.locator('dialog[open]')).toContainText('주장별 조건과 근거 위치');await page.keyboard.press('Escape');
  await page.mouse.move(480,270);
  for(const control of await page.locator('.weekday-settings button,.weekday-settings select').all()){
    if(await control.isDisabled())continue;await control.scrollIntoViewIfNeeded();
    expect(await control.evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return Boolean(hit&&(e.contains(hit)||hit.contains(e)));})).toBe(true);
  }
  await page.getByRole('button',{name:'세계 · 접근 관계',exact:true}).click();await expect(page.locator('.weekday-world-dialog')).toBeVisible();await page.keyboard.press('Escape');await fit(page);
  await testInfo.attach('youtube-focus-controls',{body:await page.screenshot(),contentType:'image/png'});
});

test('compact expressions open captured choices and the video frame keeps input and reasoning together',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#sunday');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.getByRole('button',{name:'입력 보기',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'추론 보기',exact:true})).toHaveCount(0);
  await expect(page.locator('.weekday-input-panel')).toBeVisible();await expect(page.locator('.weekday-reasoning-panel')).toBeVisible();
  const term=page.locator('.weekday-sentence-line .weekday-reference-trigger').first(),bounds=await term.boundingBox();expect(bounds!.width).toBeLessThan(150);expect(bounds!.height).toBeGreaterThanOrEqual(26);
  await term.click({position:{x:12,y:bounds!.height/2}});
  const menu=page.getByRole('listbox',{name:'① 어제의 기준',exact:true});await expect(menu).toBeVisible();await expect(menu.getByRole('option')).toHaveCount(4);
  await testInfo.attach('captured-expression-dropdown',{body:await page.screenshot(),contentType:'image/png'});
  await menu.getByRole('option',{name:'가정 2 (선택하여 추가)',exact:true}).click();await expect(page.getByRole('combobox',{name:'① 어제의 기준',exact:true})).toHaveValue('2');await expect(menu).toBeHidden();
  const select=page.getByRole('combobox',{name:'② 내일의 기준',exact:true});await select.focus();await page.keyboard.press('Space');await expect(page.getByRole('listbox',{name:'② 내일의 기준',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(select).toBeFocused();
  const metrics=await page.evaluate(()=>({caption:document.querySelector('#reader-scenes')!.getBoundingClientRect().height,height:innerHeight,sourceFont:parseFloat(getComputedStyle(document.querySelector('.weekday-sentence-line')!).fontSize),proseFont:parseFloat(getComputedStyle(document.querySelector('.reader-scene:not([hidden]) .scene-prose')!).fontSize)}));
  expect(metrics.caption/metrics.height).toBeLessThan(.24);expect(metrics.sourceFont*2).toBeGreaterThanOrEqual(24);expect(metrics.proseFont*2).toBeGreaterThanOrEqual(24);
  await fit(page);
  await page.getByRole('button',{name:'A · 현실 어제 고정',exact:true}).click();const goal=page.locator('.weekday-target-trigger');await goal.click();const goalMenu=page.getByRole('listbox',{name:'문장 속 목표 요일',exact:true});await expect(goalMenu).toBeVisible();await goalMenu.getByRole('option',{name:'월요일',exact:true}).click();await expect(page.locator('.weekday-result')).toContainText('수요일');await expect(page.locator('.weekday-settings .weekday-target-select')).toHaveCount(0);await fit(page);
});


test('the modal introduction bridge and its authored transition fit the 200% video frame',async({page},testInfo)=>{
  await page.goto('/knowledge/weekday-worlds/#notation');await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('.weekday-reading-comparison')).toBeVisible();await fit(page);
  await testInfo.attach('modal-introduction-comparison-200',{body:await page.screenshot(),contentType:'image/png'});
  await page.locator('#reader-next').click();await expect(page.getByRole('checkbox',{name:'양상 논리로 번역',exact:true})).toBeChecked();await expect(page.locator('.weekday-modal-diagram')).toBeVisible();await fit(page);
  await testInfo.attach('modal-introduction-counterfactual-200',{body:await page.screenshot(),contentType:'image/png'});
});
