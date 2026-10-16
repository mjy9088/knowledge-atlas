import type {SiteContent} from '../packages/content/types.js';
import {browserJavaScript} from './typescript.js';
import {readFile,readdir,mkdir,writeFile,rm,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CONTENT_PAGES,pageURL} from '../content/catalog.js';
import {renderRelatedIndex,renderRelatedPage,validateRelatedPages} from '../packages/site/related-site.js';
import {loadContentCatalog} from '../packages/content/load-catalog.js';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Reader-facing assets only. Local production tools must be explicitly excluded from publication.
export const PUBLIC_ASSET_ROOTS=['components','pages','styles','topics'];
const readJSON=async (name:string):Promise<unknown>=>JSON.parse(await readFile(path.join(projectRoot,name),'utf8'));
export async function loadSiteContent(){
  const {collection,claims,sources}=await loadContentCatalog(readJSON),errors=validateRelatedPages(collection,claims);
  if(sources.some(source=>!source.canonicalUrl?.startsWith('https://')))errors.push('Source links must use HTTPS');
  if(errors.length)throw new Error(errors.join('\n'));
  return {collection,claims,sources};
}
export function siteDocuments({collection,claims,sources}:SiteContent):Map<string,string>{
  return new Map([['/',renderRelatedIndex(collection)],['/knowledge/',renderRelatedIndex(collection)],...CONTENT_PAGES.map((page):[string,string]=>[pageURL(page),renderRelatedPage(page,collection,claims,sources)])]);
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
      if(entry.isSymbolicLink())throw new Error('Refusing source symlink '+entry.name);
      if(entry.isDirectory())await copyTree(source+'/'+entry.name,dest?dest+'/'+entry.name:entry.name,extensions);
      else if(extensions.includes(path.extname(entry.name))){
        const sourcePath=path.join(root,source,entry.name),relative=(dest?dest+'/'+entry.name:entry.name).replace(/\.ts$/,'.js');
        const data=await readFile(sourcePath);
        await emit(relative,entry.name.endsWith('.ts')?browserJavaScript(data.toString('utf8'),sourcePath):data);
      }
    }
  }
  for(const dir of PUBLIC_ASSET_ROOTS)await copyTree('apps/web/'+dir,dir,['.ts','.css']);
  await emit('lesson.html',await readFile(path.join(root,'apps/web/pages/lesson/index.html')));
  for(const dir of ['content','knowledge','sources','packages/models','packages/experiments','packages/projection','packages/content','packages/spatial'])await copyTree(dir,dir,['.json','.ts']);
  for(const [url,html]of siteDocuments(content))await emit(url.slice(1)+'index.html',html);
  const pages=[...new Set(['/','/lesson.html',...siteDocuments(content).keys()])];
  await emit('404.html','<!doctype html><html lang="ko"><meta charset="utf-8"><title>페이지를 찾지 못했습니다</title><h1>페이지를 찾지 못했습니다</h1><a href="/knowledge/">지식 목록으로</a></html>');
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const buildInputs=[];
  for(const file of ['package.json','scripts/build-site.ts','scripts/typescript.ts','tsconfig.json','packages/site/related-site.ts'])buildInputs.push({path:file,sha256:createHash('sha256').update(await readFile(path.join(root,file))).digest('hex')});
  const manifest={schemaVersion:1,kind:'static-review-build',published:false,sourceSnapshotVerified:content.collection.sourceSnapshotVerified,reviewStatus:content.collection.reviewStatus,pages,articles:CONTENT_PAGES.map(p=>({articleId:p.articleId,url:pageURL(p)})),sources:content.sources.map(s=>({id:s.id,contentHash:s.contentHash,rightsReview:s.rightsReview})),buildInputs,files};
  await writeFile(path.join(output,'build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return {output,manifest};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const {output,manifest}=await buildSite();console.log(`Static review build: ${output} (${manifest.files.length} files, ${manifest.articles.length} related pages; publication pending)`);
}
