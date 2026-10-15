import {readFile,readdir,mkdir,writeFile,rm,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {RELATED_PAGES,pageURL} from '../content/formal-logic/explosion/related-pages.mjs';
import {renderRelatedIndex,renderRelatedPage,validateRelatedPages} from '../packages/site/related-site.mjs';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const readJSON=async name=>JSON.parse(await readFile(path.join(projectRoot,name),'utf8'));
export async function loadSiteContent(){
  const [collection,original,inference,sources]=await Promise.all(['content/formal-logic/explosion/related.json','content/formal-logic/explosion/claims.json','content/formal-logic/explosion/inference-claims.json','sources/registry.json'].map(readJSON));
  const claims=[...original,...inference,...collection.claims],errors=validateRelatedPages(collection,claims);
  if(sources.some(source=>!source.canonicalUrl?.startsWith('https://')))errors.push('Source links must use HTTPS');
  if(errors.length)throw new Error(errors.join('\n'));
  return {collection,claims,sources};
}
export function siteDocuments({collection,claims,sources}){
  return new Map([['/knowledge/',renderRelatedIndex(collection)],...RELATED_PAGES.map(page=>[pageURL(page),renderRelatedPage(page,collection,claims,sources)])]);
}
// Fixed, workspace-contained destination. Never accept an arbitrary recursive-delete target.
export async function buildSite(){
  const root=path.resolve(projectRoot),output=path.resolve(root,'dist');
  if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Invalid output directory');
  const existing=await lstat(output).catch(error=>{if(error.code==='ENOENT')return null;throw error;});
  if(existing?.isSymbolicLink())throw new Error('Refusing a linked dist directory');
  const content=await loadSiteContent();
  await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
  const files=[];
  const emit=async(relative,data)=>{await mkdir(path.dirname(path.join(output,relative)),{recursive:true});await writeFile(path.join(output,relative),data);files.push({path:relative,sha256:createHash('sha256').update(data).digest('hex')});};
  async function copyTree(source,dest,extensions){
    for(const entry of (await readdir(path.join(root,source),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
      if(entry.isSymbolicLink())throw new Error('Refusing source symlink '+entry.name);
      if(entry.isDirectory())await copyTree(source+'/'+entry.name,dest?dest+'/'+entry.name:entry.name,extensions);
      else if(extensions.includes(path.extname(entry.name))){
        const relative=dest?dest+'/'+entry.name:entry.name;let data=await readFile(path.join(root,source,entry.name));
        if(relative==='render.html')data=Buffer.from(data.toString().replace('<head>','<head><meta name="atlas-hosting" content="static">'));
        await emit(relative,data);
      }
    }
  }
  await copyTree('apps/web','',['.html','.mjs','.css','.svg']);
  for(const dir of ['content','knowledge','sources','packages/models'])await copyTree(dir,dir,['.json','.mjs']);
  for(const [url,html]of siteDocuments(content))await emit(url.slice(1)+'index.html',html);
  const pages=['/','/lesson.html',...siteDocuments(content).keys()];
  await emit('404.html','<!doctype html><html lang="ko"><meta charset="utf-8"><title>페이지를 찾지 못했습니다</title><h1>페이지를 찾지 못했습니다</h1><a href="/knowledge/">지식 목록으로</a></html>');
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const buildInputs=[];
  for(const file of ['package.json','scripts/build-site.mjs','packages/site/related-site.mjs'])buildInputs.push({path:file,sha256:createHash('sha256').update(await readFile(path.join(root,file))).digest('hex')});
  const manifest={schemaVersion:1,kind:'static-review-build',published:false,sourceSnapshotVerified:content.collection.sourceSnapshotVerified,reviewStatus:content.collection.reviewStatus,pages,articles:RELATED_PAGES.map(p=>({articleId:p.articleId,url:pageURL(p)})),sources:content.sources.map(s=>({id:s.id,contentHash:s.contentHash,rightsReview:s.rightsReview})),buildInputs,files};
  await writeFile(path.join(output,'build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return {output,manifest};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const {output,manifest}=await buildSite();console.log(`Static review build: ${output} (${manifest.files.length} files, ${manifest.articles.length} related pages; publication pending)`);
}
