import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';

const revisions=[
  {slug:'counting-zero',scenes:['question','empty-set','identity','transfer']},
  {slug:'negative-numbers',scenes:['question','inverse','subtraction']},
  {slug:'rational-numbers',scenes:['question','zero-denominator','density','transfer']},
  {slug:'irrational-numbers',scenes:['first-parity','second-parity','transfer']},
  {slug:'inertial-motion',scenes:['comparison','inference','frame','transfer']},
  {slug:'nuclear-constituents',scenes:['neutral','collision-model','recoil']},
] as const;

for(const revision of revisions)test(`${revision.slug}: teaching figures remain visible with complete prose and restored scene identity`,async({page},testInfo)=>{
  const build=createHash('sha256').update(readFileSync('dist/build-manifest.json')).digest('hex');
  const directory=path.resolve('test-results/content-quality/latest',build,testInfo.project.name,revision.slug);
  mkdirSync(directory,{recursive:true});
  const observations=[];
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  for(const scene of revision.scenes){
    await page.goto(`/knowledge/${revision.slug}/#${scene}`);
    await page.waitForFunction(()=>window.__atlasRelated);
    const figure=page.locator('.reader-scene:visible .scene-figure');
    await expect(figure).toBeVisible();
    await expect(figure.locator('img')).toHaveAttribute('alt',/.+/);
    await expect(figure.locator('figcaption')).toBeVisible();
    expect(await figure.locator('img').evaluate(image=>image instanceof HTMLImageElement&&image.complete&&image.naturalWidth>0)).toBe(true);
    const state=await page.evaluate(()=>window.__atlasRelated.getState());
    await page.evaluate(()=>window.__atlasRelated.reset());
    await page.evaluate(saved=>window.__atlasRelated.setState(saved),state);
    expect(await page.evaluate(()=>window.__atlasRelated.getState())).toEqual(state);
    const observation=await page.evaluate(()=>{
      const issues:string[]=[];
      const root=document.documentElement;
      if(root.scrollWidth>innerWidth||root.scrollHeight>innerHeight)issues.push('document overflow');
      for(const element of document.querySelectorAll<HTMLElement>('.reader-scene:not([hidden]) .reader-copy,.reader-scene:not([hidden]) .scene-figure,#reader-controls')){
        const r=element.getBoundingClientRect();
        if(element.scrollWidth>element.clientWidth+1||element.scrollHeight>element.clientHeight+1)issues.push(`internal overflow: ${element.className}`);
        if(r.left<0||r.right>innerWidth||r.top<0||r.bottom>innerHeight)issues.push(`outside viewport: ${element.className}`);
      }
      return{issues,viewport:{width:innerWidth,height:innerHeight},scene:window.__atlasRelated.getState().sceneId};
    });
    expect(observation.issues,scene).toEqual([]);
    observations.push(observation);
    await page.screenshot({path:path.join(directory,`${scene}.png`)});
    await figure.locator('img').screenshot({path:path.join(directory,`${scene}-figure.png`)});
  }
  expect(errors).toEqual([]);
  writeFileSync(path.join(directory,'observations.json'),JSON.stringify({buildManifestSha256:build,observations,pageErrors:errors},null,2));
});

test('narrow authored skip keeps keyboard help readable instead of stacking single characters',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/knowledge/rational-numbers/#density');
  await page.waitForFunction(()=>window.__atlasRelated);
  await expect(page.locator('#reader-skip')).toBeVisible();
  const hint=await page.locator('#reader-skip-scope').boundingBox();
  expect(hint?.width).toBeGreaterThanOrEqual(200);
  expect(hint?.height).toBeLessThanOrEqual(28);
  const controls=await page.locator('#reader-controls').boundingBox();
  expect(controls?.height).toBeLessThanOrEqual(90);
  await page.locator('#reader-skip').click();
  expect(await page.evaluate(()=>window.__atlasRelated.getState().sceneId)).toBe('transfer');
});

test('narrow final reader keeps one-row end links separate from accessible navigation controls',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/knowledge/inertial-motion/#transfer');
  await page.waitForFunction(()=>window.__atlasRelated);
  const layout=await page.evaluate(()=>{
    const controls=document.querySelector<HTMLElement>('#reader-controls');
    const previous=document.querySelector<HTMLButtonElement>('#reader-prev');
    const hint=document.querySelector<HTMLElement>('#reader-skip-scope');
    const endLinks=document.querySelector<HTMLElement>('#reader-end-links');
    const next=document.querySelector<HTMLButtonElement>('#reader-next');
    const links=Array.from(document.querySelectorAll<HTMLAnchorElement>('#reader-end-links a'));
    if(!controls||!previous||!hint||!endLinks||!next||links.length===0)throw new Error('final reader controls are incomplete');
    const controlRect=controls.getBoundingClientRect();
    const buttonRects=[previous,next].map(button=>button.getBoundingClientRect());
    const linkRects=links.map(link=>link.getBoundingClientRect());
    const itemRects=[previous,hint,endLinks,next].map(element=>element.getBoundingClientRect()).filter(rect=>rect.width>0&&rect.height>0);
    const rectValue=(rect:DOMRect)=>({left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height});
    return{
      display:getComputedStyle(controls).display,
      footer:rectValue(controlRect),
      buttons:buttonRects.map(rectValue),
      items:itemRects.map(rectValue),
      links:linkRects.map(rectValue),
      inside:buttonRects.concat(linkRects).every(rect=>rect.left>=controlRect.left&&rect.right<=controlRect.right&&rect.top>=controlRect.top&&rect.bottom<=controlRect.bottom),
      separate:itemRects.every((rect,index)=>itemRects.slice(index+1).every(other=>rect.right<=other.left||other.right<=rect.left||rect.bottom<=other.top||other.bottom<=rect.top)),
      accessible:[previous,next,...links].every(element=>{const rect=element.getBoundingClientRect();const hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);return hit===element||element.contains(hit)}),
    };
  });
  const build=createHash('sha256').update(readFileSync('dist/build-manifest.json')).digest('hex');
  const directory=path.resolve('test-results/content-quality/latest',build,testInfo.project.name,'inertial-motion');
  mkdirSync(directory,{recursive:true});
  writeFileSync(path.join(directory,'final-footer-layout.json'),JSON.stringify(layout,null,2));
  expect(layout.display).toBe('grid');
  expect(layout.footer.height).toBeLessThanOrEqual(48);
  expect(layout.inside).toBe(true);
  expect(layout.separate).toBe(true);
  expect(layout.accessible).toBe(true);
  for(const target of [...layout.buttons,...layout.links]){expect(target.width).toBeGreaterThanOrEqual(44);expect(target.height).toBeGreaterThanOrEqual(44)}
});

const correctedScenes=[
  {slug:'rational-numbers',scene:'density',unbroken:[['.scene-figure figcaption','m−x\u00a0=\u00a0y−m\u00a0=\u00a0(y−x)/2>0'],['.scene-prose','m\u2060=\u2060(x+y)/2로\u00a0둡니다.'],['.scene-prose','같은\u00a0방법'],['.scene-prose','찾을\u00a0수\u00a0있습니다']]},
  {slug:'inertial-motion',scene:'comparison',unbroken:[['.scene-figure figcaption','공기\u00a0지지면'],['.scene-figure figcaption','무마찰\u00a0관찰\u00a0아님'],['.scene-prose','매끈한\u00a0면에서']]},
  {slug:'inertial-motion',scene:'inference',unbroken:[['.scene-figure figcaption','두\u00a0경우\u00a0모두\u00a0외력이\u00a0상쇄됨'],['.scene-prose','알짜\u00a0외력이\u00a00이면'],['.scene-prose','같은\u00a0조건의\u00a0두\u00a0경우입니다']]},
  {slug:'inertial-motion',scene:'frame',unbroken:[['.scene-figure figcaption','t=0,1,2\u00a0s'],['.scene-figure figcaption','앞쪽\u00a0힘이\u00a0생긴\u00a0것이\u00a0아님'],['.scene-prose','x′=x−X'],['.scene-prose','수평\u00a0알짜\u00a0외력은\u00a00입니다']]},
  {slug:'inertial-motion',scene:'transfer',unbroken:[['.scene-figure figcaption','속도\u00a0화살표'],['.scene-figure figcaption','힘의\u00a0균형은\u00a0먼저\u00a0둔\u00a0조건'],['.scene-prose','속력과\u00a0방향이\u00a0일정합니다']]},
] as const;

for(const target of correctedScenes)test(`${target.slug}/${target.scene}: figure stays proportional with readable labels and Korean wrapping`,async({page})=>{
  // Given a corrected teaching scene in the actual static build.
  await page.goto(`/knowledge/${target.slug}/#${target.scene}`);
  await page.waitForFunction(()=>window.__atlasRelated);
  // When rendered geometry, computed wrapping, and the served SVG labels are measured.
  const metrics=await page.evaluate(async()=>{
    const image=document.querySelector<HTMLImageElement>('.reader-scene:not([hidden]) .scene-figure img');
    const caption=document.querySelector<HTMLElement>('.reader-scene:not([hidden]) .scene-figure figcaption');
    const prose=document.querySelector<HTMLElement>('.reader-scene:not([hidden]) .scene-prose');
    if(!image||!caption||!prose)throw new Error('visible teaching figure is incomplete');
    const imageRect=image.getBoundingClientRect();
    const figureRect=image.parentElement?.getBoundingClientRect();
    const captionRect=caption.getBoundingClientRect();
    const source=await fetch(image.currentSrc||image.src).then(response=>response.text());
    const svg=new DOMParser().parseFromString(source,'image/svg+xml').documentElement;
    const viewBox=svg.getAttribute('viewBox')?.split(/\s+/).map(Number)??[];
    const viewBoxWidth=viewBox[2]??0;
    const essentialSizes=Array.from(svg.querySelectorAll<SVGTextElement>('[data-essential-label]')).map(label=>Number(label.getAttribute('font-size')));
    const captionStyle=getComputedStyle(caption);
    const proseStyle=getComputedStyle(prose);
    return{
      aspectRatio:imageRect.width/imageRect.height,
      intrinsicRatio:image.naturalWidth/image.naturalHeight,
      captionGap:captionRect.top-imageRect.bottom,
      captionWidthRatio:captionRect.width/(figureRect?.width??captionRect.width),
      essentialLabelCount:essentialSizes.length,
      minimumRenderedLabel:Math.min(...essentialSizes)*imageRect.width/viewBoxWidth,
      captionWrap:[captionStyle.wordBreak,captionStyle.overflowWrap,captionStyle.textWrap],
      proseWrap:[proseStyle.wordBreak,proseStyle.overflowWrap,proseStyle.textWrap],
    };
  });
  // Then the image box follows the artwork, the caption follows immediately, and essential text remains readable.
  expect(Math.abs(metrics.aspectRatio-metrics.intrinsicRatio)).toBeLessThan(0.02);
  expect(metrics.captionGap).toBeGreaterThanOrEqual(0);
  expect(metrics.captionGap).toBeLessThanOrEqual(8);
  expect(metrics.captionWidthRatio).toBeGreaterThanOrEqual(0.94);
  expect(metrics.essentialLabelCount).toBeGreaterThan(0);
  expect(metrics.minimumRenderedLabel).toBeGreaterThanOrEqual(13);
  expect(metrics.captionWrap).toEqual(['keep-all','anywhere','pretty']);
  expect(metrics.proseWrap).toEqual(['keep-all','anywhere','pretty']);
  for(const [selector,text] of target.unbroken){
    const lines=await page.locator(`.reader-scene:not([hidden]) ${selector}`).evaluate((element,unit)=>{
      const fullText=element.textContent??'';
      const start=fullText.indexOf(unit);
      if(start<0)return 0;
      const end=start+unit.length;
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      const range=document.createRange();
      let consumed=0,startNode:Text|null=null,endNode:Text|null=null,startOffset=0,endOffset=0;
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(!(node instanceof Text))continue;
        const next=consumed+node.data.length;
        if(startNode===null&&start>=consumed&&start<next){startNode=node;startOffset=start-consumed}
        if(endNode===null&&end>consumed&&end<=next){endNode=node;endOffset=end-consumed}
        consumed=next;
      }
      if(startNode===null||endNode===null)return 0;
      range.setStart(startNode,startOffset);
      range.setEnd(endNode,endOffset);
      return Array.from(range.getClientRects()).filter(rect=>rect.width>0).length;
    },text);
    expect(lines,`${text} should remain on one rendered line`).toBe(1);
  }
});
