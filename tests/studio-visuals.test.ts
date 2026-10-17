import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {planVisualInstallation} from '../tools/studio/install-visuals.js';
import {topicVisuals} from '../tools/studio/visuals.js';
import {EXAMPLES} from '../tools/studio/examples.js';
import {planInteractionInstallation} from '../tools/studio/install-interactions.js';
test('every authored scene gets a bounded, accessible, topic-specific figure without advancing its narrative',()=>{
 for(const plan of EXAMPLES){const figures=topicVisuals(plan.id);for(const slide of plan.slides){const f=figures[slide.id];assert.ok(f,`${plan.id}/${slide.id}`);assert.match(f.svg,/viewBox="0 0 600 300"/);assert.ok(f.alt.length>20&&f.caption.length>5);assert.ok(!f.svg.includes('<script'));}if(plan.id==='monty-hall')assert.ok(!figures.question.alt.includes('2/3'));if(plan.id==='two-children')assert.ok(!figures.question.alt.includes('1/3'));}
});
test('interaction opt-in preserves authored prose, images and other styles, and refuses conflicting adapters',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-interactions-')),plan=EXAMPLES[1],base=path.join(dir,'content',plan.domain,plan.id);mkdirSync(base,{recursive:true});const file=path.join(base,'page.ts');
 const page={slug:plan.id,styles:['/existing.css'],scenes:[{id:'question',title:'Accepted heading',figure:{src:'/owned.svg'}}]};
 writeFileSync(file,'export default '+JSON.stringify(page)+' satisfies ContentPage;\n');
 try{planInteractionInstallation(dir,plan).apply();const installed=readFileSync(file,'utf8');assert.ok(installed.includes('Accepted heading'));assert.ok(installed.includes('/owned.svg'));assert.ok(installed.includes('/existing.css'));assert.ok(installed.includes('"interactive": "monty-hall"'));planInteractionInstallation(dir,plan).apply();assert.equal(readFileSync(file,'utf8'),installed);
  writeFileSync(file,'export default '+JSON.stringify({...page,interactive:'weekday-worlds'})+' satisfies ContentPage;\n');assert.throws(()=>planInteractionInstallation(dir,plan),/기존 상호작용/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('visual installation preserves prose, scene order, captions and human-edited SVG assets',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'atlas-visuals-')),plan=EXAMPLES[0],base=path.join(dir,'content',plan.domain,plan.id);mkdirSync(base,{recursive:true});const file=path.join(base,'page.ts'),page={slug:plan.id,scenes:plan.slides.map(s=>({id:s.id,title:s.title,block:0,from:0,cards:[],known:s.observation}))};
 writeFileSync(file,"import type {ContentPage} from '../../../packages/content/types.js';\nexport default "+JSON.stringify(page)+' satisfies ContentPage;\n');
 try{const install=planVisualInstallation(dir,plan);assert.equal(install.count,6);install.apply();const original=readFileSync(file,'utf8');assert.match(original,/scene|figure/);assert.ok(original.includes(page.scenes[0].title));planVisualInstallation(dir,plan).apply();assert.equal(readFileSync(file,'utf8'),original);
  const image=path.join(base,'figure-question.svg');writeFileSync(image,'Accepted human drawing');assert.throws(()=>planVisualInstallation(dir,plan),/사람이 수정/);assert.equal(readFileSync(image,'utf8'),'Accepted human drawing');assert.equal(readFileSync(file,'utf8'),original);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
