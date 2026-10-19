import {expect,test} from '@playwright/test';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';

const scenes=['question','comparison','inference','frame','limit','transfer'] as const;
const cardScenes=new Set<string>(['question','limit']);

test('inertial-motion: all six scenes fit with topic-scoped Korean wrapping and card flow',async({page},testInfo)=>{
  // Given the complete six-scene article in one supported viewport.
  const build=createHash('sha256').update(readFileSync('dist/build-manifest.json')).digest('hex');
  const directory=path.resolve('test-results/content-quality/latest',build,testInfo.project.name,'inertial-motion-flow');
  mkdirSync(directory,{recursive:true});
  const observations=[];
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const scene of scenes){
    await page.goto(`/knowledge/inertial-motion/#${scene}`);
    await page.waitForFunction(()=>window.__atlasRelated);
    // When prose, controls, and any card layout are measured from the rendered static build.
    const observation=await page.evaluate(cardScene=>{
      const visible=document.querySelector<HTMLElement>('.reader-scene:not([hidden])');
      const prose=visible?.querySelector<HTMLElement>('.scene-prose');
      const heading=visible?.querySelector<HTMLElement>('.reader-copy h2');
      const controls=document.querySelector<HTMLElement>('#reader-controls');
      if(!visible||!prose||!heading||!controls)throw new Error('inertial scene is incomplete');
      const issues:string[]=[];
      const measured=[visible,prose,heading,controls];
      const diagram=visible.querySelector<HTMLElement>('.concept-diagram:not([hidden])');
      if(diagram)measured.push(diagram);
      for(const element of measured){
        const rect=element.getBoundingClientRect();
        if(element.scrollWidth>element.clientWidth+1||element.scrollHeight>element.clientHeight+1)issues.push(`internal overflow: ${element.className}`);
        if(rect.left<0||rect.right>innerWidth||rect.top<0||rect.bottom>innerHeight)issues.push(`outside viewport: ${element.className}`);
      }
      if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight)issues.push('document overflow');
      const proseStyle=getComputedStyle(prose);
      const buttons=Array.from(controls.querySelectorAll<HTMLButtonElement>('button:not([hidden])'));
      const narrowCards=cardScene&&innerWidth<=720;
      const cardLayout=narrowCards&&diagram?getComputedStyle(diagram).flexDirection:null;
      const connectors=cardScene&&diagram?Array.from(diagram.querySelectorAll<HTMLElement>('.concept-connector')).map(connector=>({display:getComputedStyle(connector).display,width:connector.getBoundingClientRect().width,height:connector.getBoundingClientRect().height})):[];
      const cards=narrowCards&&diagram?Array.from(diagram.querySelectorAll<HTMLElement>(':scope>span:not(.concept-connector)')).map(card=>{const rect=card.getBoundingClientRect();return{top:rect.top,bottom:rect.bottom,width:rect.width}}):[];
      return{
        scene:visible.id,
        issues,
        wrap:[proseStyle.wordBreak,proseStyle.overflowWrap,proseStyle.textWrap],
        headingSize:Number.parseFloat(getComputedStyle(heading).fontSize),
        controlsAccessible:buttons.every(button=>{const rect=button.getBoundingClientRect();return rect.width>=44&&rect.height>=44}),
        narrowCards,
        cardLayout,
        connectors,
        cards,
        viewport:{width:innerWidth,height:innerHeight},
      };
    },cardScenes.has(scene));
    // Then every scene remains readable, card scenes omit semantic-looking dots, and narrow cards form a vertical comparison.
    expect(observation.scene).toBe(scene);
    expect(observation.issues,scene).toEqual([]);
    expect(observation.wrap).toEqual(['keep-all','anywhere','pretty']);
    expect(observation.headingSize).toBeGreaterThanOrEqual(17);
    expect(observation.controlsAccessible).toBe(true);
    if(cardScenes.has(scene))expect(observation.connectors.every(connector=>connector.display==='none'&&connector.width===0&&connector.height===0)).toBe(true);
    if(observation.narrowCards){
      expect(observation.cardLayout).toBe('column');
      expect(observation.cards.every((card,index)=>index===0||(observation.cards[index-1]?.bottom??card.top)<=card.top)).toBe(true);
    }
    observations.push(observation);
    await page.screenshot({path:path.join(directory,`${scene}.png`)});
  }
  expect(errors).toEqual([]);
  writeFileSync(path.join(directory,'observations.json'),JSON.stringify({buildManifestSha256:build,observations,pageErrors:errors},null,2));
});
