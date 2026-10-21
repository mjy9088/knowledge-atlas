import type {SiteContent} from '../packages/content/types.js';
import {browserJavaScript} from './typescript.js';
import {isTestPath} from './public-assets.js';
import {readFile,readdir,mkdir,writeFile,rm,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CONTENT_ENTRIES,CONTENT_PAGES,pageURL} from '../content/catalog.js';
import {renderRelatedIndex,renderRelatedPage,validateRelatedPages} from '../packages/site/related-site.js';
import {loadContentCatalog} from '../packages/content/load-catalog.js';
import {scenePath} from '../packages/content/scene-routing.js';
import {svgViewBoxDimensions,type FigureDimensions} from '../packages/site/svg-dimensions.js';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Reader-facing assets only. Local production tools must be explicitly excluded from publication.
export const PUBLIC_ASSET_ROOTS=['components','styles'];
const readJSON=async (name:string):Promise<unknown>=>JSON.parse(await readFile(path.join(projectRoot,name),'utf8'));
export async function loadSiteContent(){
  const {collection,claims,sources}=await loadContentCatalog(readJSON),errors=validateRelatedPages(collection,claims);
  if(sources.some(source=>!source.canonicalUrl?.startsWith('https://')))errors.push('Source links must use HTTPS');
  if(errors.length)throw new Error(errors.join('\n'));
  const figureDimensions:Record<string,FigureDimensions>={};
  for(const asset of new Set(CONTENT_PAGES.flatMap(page=>page.scenes.flatMap(scene=>scene.figure?[scene.figure.src]:[])))){
    figureDimensions[asset]=svgViewBoxDimensions(await readFile(path.join(projectRoot,asset.slice(1)),'utf8'));
  }
  return {collection,claims,sources,figureDimensions};
}
export function siteDocuments({collection,claims,sources,figureDimensions={}}:SiteContent):Map<string,string>{
  const documents=new Map([['/',renderRelatedIndex(collection)],['/knowledge/',renderRelatedIndex(collection)]]);
  for(const page of CONTENT_PAGES){
    documents.set(pageURL(page),renderRelatedPage(page,collection,claims,sources,undefined,figureDimensions));
    for(const scene of page.scenes)documents.set(scenePath(page.slug,scene.id),renderRelatedPage(page,collection,claims,sources,scene.id,figureDimensions));
  }
  return documents;
}
// Fixed, workspace-contained destination. Never accept an arbitrary recursive-delete target.
export async function buildSite(){
  const root=path.resolve(projectRoot),output=path.resolve(root,'dist');
  if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Invalid output directory');
  const existing=await lstat(output).catch(error=>{if(error.code==='ENOENT')return null;throw error;});
  if(existing?.isSymbolicLink())throw new Error('Refusing a linked dist directory');
  const content=await loadSiteContent();
  await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
  const files:{path:string;sha256:string}[]=[];
  const emit=async(relative:string,data:string|Uint8Array)=>{await mkdir(path.dirname(path.join(output,relative)),{recursive:true});await writeFile(path.join(output,relative),data);files.push({path:relative,sha256:createHash('sha256').update(data).digest('hex')});};
  async function copyTree(source:string,dest:string,extensions:string[]):Promise<void>{
    for(const entry of (await readdir(path.join(root,source),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
      if(isTestPath(source+'/'+entry.name))continue;
      if(entry.isSymbolicLink())throw new Error('Refusing source symlink '+entry.name);
      if(entry.isDirectory())await copyTree(source+'/'+entry.name,dest?dest+'/'+entry.name:entry.name,extensions);
      else if(extensions.includes(path.extname(entry.name))){
        const sourcePath=path.join(root,source,entry.name),relative=(dest?dest+'/'+entry.name:entry.name).replace(/\.ts$/,'.js');
        const data=await readFile(sourcePath);
        await emit(relative,entry.name.endsWith('.ts')?browserJavaScript(data.toString('utf8'),sourcePath):data);
      }
    }
  }
  for(const dir of PUBLIC_ASSET_ROOTS)await copyTree(`apps/web/${dir}`,dir,['.ts','.css']);
  for(const dir of ['article','catalog'])await copyTree(`apps/web/pages/${dir}`,`pages/${dir}`,['.ts','.css']);
  await copyTree('apps/web/topics/quantum','topics/quantum',['.ts','.css']);
  await copyTree('apps/web/topics/presentation','topics/presentation',['.ts','.css']);
  for(const file of ['weekday-alignment.ts','weekday-bridge.ts','weekday-challenge.ts','weekday-congruence.css','weekday-intro.ts','weekday-logic.ts','weekday-modal-introduction.ts','weekday-modal.ts','weekday-reference-contrast.ts','weekday-sentence.ts','weekday-systems.ts','weekday-world-style.ts','weekday-worlds.css','weekday-worlds.ts']){
    const sourcePath=path.join(root,'apps/web/topics/formal-reasoning',file);
    const data=await readFile(sourcePath);
    await emit(`topics/formal-reasoning/${file.replace(/\.ts$/,'.js')}`,file.endsWith('.ts')?browserJavaScript(data.toString('utf8'),sourcePath):data);
  }
  for(const relative of ['statistics/possibility-lab.ts','statistics/possibility-ledger.ts','statistics/possibility-lab.css','physics/physics-history.ts','physics/physics-history-suggestion.ts']){
    const sourcePath=path.join(root,'apps/web/topics',relative);
    const data=await readFile(sourcePath);
    await emit(`topics/${relative.replace(/\.ts$/,'.js')}`,relative.endsWith('.ts')?browserJavaScript(data.toString('utf8'),sourcePath):data);
  }
  await emit('topics/registry.js',browserJavaScript(await readFile(path.join(root,'apps/web/topics/registry.ts'),'utf8'),path.join(root,'apps/web/topics/registry.ts')));
  await emit('packages/projection/proof-view.js',browserJavaScript(await readFile(path.join(root,'packages/projection/proof-view.ts'),'utf8'),path.join(root,'packages/projection/proof-view.ts')));
  await emit('content/catalog.js',browserJavaScript(await readFile(path.join(root,'content/catalog.ts'),'utf8'),path.join(root,'content/catalog.ts')));
  for(const page of CONTENT_PAGES){
    const entry=CONTENT_ENTRIES.find(item=>item.articleId===page.articleId);
    if(!entry)throw new TypeError(`Missing active content entry ${page.articleId}`);
    await copyTree(`content/${entry.directory}`,`content/${entry.directory}`,['.ts']);
  }
  const contentAssets=new Set(CONTENT_PAGES.flatMap(page=>[page.coverArtwork?.src,...page.scenes.map(scene=>scene.figure?.src)].filter((src):src is string=>src!==undefined)));
  for(const asset of contentAssets)await emit(asset.slice(1),await readFile(path.join(root,asset.slice(1))));
  for(const dir of ['knowledge','sources','packages/models','packages/experiments','packages/content','packages/spatial'])await copyTree(dir,dir,['.json','.ts']);
  for(const [url,html]of siteDocuments(content))await emit(url.slice(1)+'index.html',html);
  const pages=[...siteDocuments(content).keys()];
  await emit('404.html','<!doctype html><html lang="ko"><meta charset="utf-8"><title>페이지를 찾지 못했습니다</title><h1>페이지를 찾지 못했습니다</h1><a href="/knowledge/">지식 목록으로</a></html>');
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const buildInputs=[];
   for(const file of ['package.json','scripts/build-site.ts','scripts/typescript.ts','scripts/public-assets.ts','tsconfig.json','packages/site/related-site.ts'])buildInputs.push({path:file,sha256:createHash('sha256').update(await readFile(path.join(root,file))).digest('hex')});
  const manifest={schemaVersion:1,kind:'static-review-build',published:false,sourceSnapshotVerified:content.collection.sourceSnapshotVerified,reviewStatus:content.collection.reviewStatus,pages,articles:CONTENT_PAGES.map(p=>({articleId:p.articleId,url:pageURL(p)})),sources:content.sources.map(s=>({id:s.id,contentHash:s.contentHash,rightsReview:s.rightsReview})),buildInputs,files};
  await writeFile(path.join(output,'build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return {output,manifest};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const {output,manifest}=await buildSite();console.log(`Static review build: ${output} (${manifest.files.length} files, ${manifest.articles.length} related pages; publication pending)`);
}
