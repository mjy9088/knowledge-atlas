import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {CONTENT_PAGES} from '../../content/catalog.js';
import {parseSlug} from './contracts.js';

const args=process.argv.slice(2);
if(args.length!==1)throw new TypeError('Usage: node --import tsx tools/content-workflow/browser-check.ts <slug>');
const slug=parseSlug(args[0]??'');
const pageDefinition=CONTENT_PAGES.find(page=>page.slug===slug);
if(!pageDefinition)throw new TypeError('Only registered readers may be inspected');
const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=path.join(root,'test-results','independent-reader',slug,randomUUID());
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors:string[]=[];
const records:unknown[]=[];
try{
  for(const width of [390,1280]){
    const page=await browser.newPage({viewport:{width,height:width===390?844:900}});
    page.on('pageerror',error=>errors.push(error.message));
    for(const scene of pageDefinition.scenes){
      await page.goto(`http://127.0.0.1:4174/knowledge/${slug}/${scene.id}/`);
      await page.waitForFunction(()=>window.__atlasRelated);
      const bounds=await page.evaluate(()=>{
        const node=document.querySelector<HTMLElement>('.reader-scene:not([hidden]) .reader-copy');
        if(!node)throw new TypeError('Missing active copy');
        return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,maxHeight:getComputedStyle(node).maxHeight,overflow:getComputedStyle(node).overflowY,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};
      });
      if(bounds.scrollWidth>width||pageDefinition.navigation&&(bounds.maxHeight!=='none'||bounds.scrollHeight>bounds.clientHeight+1))throw new TypeError(`Clipped scene ${scene.id}`);
      const saved=await page.evaluate(()=>window.__atlasRelated.getState());
      let changedInput='static';
      const select=page.locator('.lab-mode:visible, #reader-workbench select:visible').first();
      if(await select.count()){
        const value=await select.inputValue();
        const alternatives=await select.locator('option').evaluateAll(options=>options.flatMap(option=>option instanceof HTMLOptionElement&&!option.disabled?[option.value]:[]));
        const next=alternatives.find(option=>option!==value);
        if(next!==undefined){
          await select.selectOption(next);
          if(await select.inputValue()!==next)throw new TypeError('Changed input was not reflected');
          changedInput=`select ${value} -> ${next}`;
          await page.screenshot({path:path.join(directory,`${width}-${scene.id}-changed.png`),fullPage:true});
          await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
        }
      }
      const atomic=await page.evaluate(()=>{
        const api=window.__atlasRelated,before=JSON.stringify(api.getState());
        try{api.setState({...api.getState(),sceneId:'invalid-scene'});}catch{return before===JSON.stringify(api.getState());}
        return false;
      });
      if(!atomic)throw new TypeError('Invalid scene restoration was not atomic');
      let motion='static';
      if(scene.motion){
        await page.evaluate(()=>window.__atlasRelated.seek(2000));
        const first=await page.locator('.scene-motion svg').innerHTML();
        await page.evaluate(()=>{window.__atlasRelated.seek(4000);window.__atlasRelated.seek(2000);});
        if(await page.locator('.scene-motion svg').innerHTML()!==first)throw new TypeError('Presentation seek depends on previous frames');
        await page.locator('.scene-motion input').focus();
        await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
        if(Number(await page.locator('.scene-motion input').inputValue())<=0)throw new TypeError('Keyboard scrubbing failed');
        await page.locator('.scene-motion [data-play]').click();await page.locator('#reader-next').click();
        if(await page.evaluate(()=>window.__atlasRelated.getState().sceneId)===scene.id)throw new TypeError('Playback blocked navigation');
        await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
        motion='seek, keyboard scrub, replay and immediate Next executed';
      }
      await page.evaluate(()=>window.__atlasRelated.reset());
      await page.evaluate(state=>window.__atlasRelated.setState(state),saved);
      const restored=await page.evaluate(()=>window.__atlasRelated.getState());
      if(JSON.stringify(saved)!==JSON.stringify(restored))throw new TypeError('Saved state did not restore');
      const artifact=path.join(directory,`${width}-${scene.id}.png`);
      await page.screenshot({path:artifact,fullPage:true});
      records.push({scene:scene.id,width,bounds,atomic,restored:true,changedInput,motion,artifact});
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const scene of pageDefinition.scenes.filter(item=>item.motion)){
      await page.goto(`http://127.0.0.1:4174/knowledge/${slug}/${scene.id}/`);
      await page.waitForFunction(()=>window.__atlasRelated);
      const before=await page.evaluate(()=>JSON.stringify(window.__atlasRelated.getState()));
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(null)))));
      if(await page.evaluate(()=>JSON.stringify(window.__atlasRelated.getState()))!==before)throw new TypeError('Reduced-motion scene advanced automatically');
      records.push({scene:scene.id,width,reducedMotionPaused:true});
    }
    await page.close();
  }
}finally{await browser.close();}
if(errors.length)throw new TypeError(`Browser errors: ${errors.join('; ')}`);
const result={slug,directory,records,errors,authority:'Executed browser behavior only; not scientific, learner, expert, rights or publication approval'};
await writeFile(path.join(directory,'evidence.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({slug,directory,scenes:pageDefinition.scenes.length,viewports:2,states:records.length,errors,checks:'bounds, invalid state, reset, restoration; motion scenes also seek, keyboard scrub, immediate Next and paused reduced motion',evidence:path.join(directory,'evidence.json')},null,2));
