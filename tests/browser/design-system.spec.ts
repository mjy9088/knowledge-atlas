import {expect,test} from '@playwright/test';
import {CONTENT_PAGES} from '../../content/catalog.js';

function luminance(css:string):number{
  const rgb=css.match(/[\d.]+/g)?.slice(0,3).map(Number);
  if(!rgb||rgb.length!==3)throw new Error(`Expected computed RGB color: ${css}`);
  return rgb.map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
}
function contrast(a:string,b:string):number{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}

test('catalog text and primary reader actions remain legible and keyboard reachable across topics',async({page})=>{
  await page.goto('/knowledge/');
  const typography=await page.locator('.knowledge-card').evaluateAll(cards=>cards.flatMap(card=>{
    const background=getComputedStyle(card).backgroundColor;
    return [...card.querySelectorAll('h3,p,small')].map(node=>({text:getComputedStyle(node).color,background}));
  }));
  for(const colors of typography)expect(contrast(colors.text,colors.background)).toBeGreaterThanOrEqual(4.5);
  for(const topic of CONTENT_PAGES){
    await page.goto(`/knowledge/${topic.slug}/`);await page.waitForFunction(()=>window.__atlasRelated);
    const next=page.locator('#reader-next');await next.focus();
    await expect(next).toBeFocused();
    const appearance=await next.evaluate(node=>{
      const style=getComputedStyle(node),rect=node.getBoundingClientRect();
      const hit=document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
      return{text:style.color,background:style.backgroundColor,outline:style.outlineStyle,outlineWidth:parseFloat(style.outlineWidth),reachable:Boolean(hit&&(node.contains(hit)||hit.contains(node)))};
    });
    expect(appearance.reachable,topic.slug).toBe(true);
    expect(contrast(appearance.text,appearance.background),topic.slug).toBeGreaterThanOrEqual(4.5);
    expect(appearance.outline).not.toBe('none');expect(appearance.outlineWidth).toBeGreaterThanOrEqual(2);
  }
});
