import type {ContentEntry,ContentPage,CollectionMetadata,Article,Claim,SourceRecord,SiteContent} from './types.js';
type RegistryEntry=Pick<ContentEntry,'directory'|'article'> & {page: Pick<ContentPage,'slug'|'articleId'>};
interface CatalogOptions {entries?: RegistryEntry[];claimFiles?: string[];collectionFile?: string}
import {CONTENT_ENTRIES,CLAIM_FILES,COLLECTION_FILE} from '../../content/catalog.js';
import {validateArticleTitles} from './presentation.js';

// Reader/build adapters supply I/O; this module has no filesystem or DOM dependency.
export async function loadContentCatalog(readJSON: (name: string)=>Promise<unknown>,{entries=CONTENT_ENTRIES,claimFiles=CLAIM_FILES,collectionFile=COLLECTION_FILE}: CatalogOptions={}): Promise<SiteContent>{
  const paths=[collectionFile,...claimFiles],slugs=new Set(),articlesSeen=new Set();
  for(const entry of entries){
    if(!/^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)+$/.test(entry.directory)||!/^[a-z][a-z0-9.-]*\.json$/.test(entry.article))throw new TypeError('Invalid content entry path');
    if(!/^[a-z][a-z-]+$/.test(entry.page.slug)||slugs.has(entry.page.slug)||articlesSeen.has(entry.page.articleId))throw new TypeError('Duplicate or invalid catalog route/article');
    slugs.add(entry.page.slug);articlesSeen.add(entry.page.articleId);
  }
  if(paths.some(name=>!/^content\/[a-z0-9./-]+\.json$/.test(name)||name.split('/').some(part=>!part||part==='.'||part==='..')))throw new TypeError('Invalid content data path');
  const [metadata,sources,claimGroups,articles]=await Promise.all([
    readJSON(collectionFile) as Promise<CollectionMetadata>,readJSON('sources/registry.json') as Promise<SourceRecord[]>,
    Promise.all(claimFiles.map(name=>readJSON(name) as Promise<Claim[]>)),
    Promise.all(entries.map(entry=>readJSON(`content/${entry.directory}/${entry.article}`) as Promise<Article>)),
  ]);
  const claims=claimGroups.flat();
  if(new Set(claims.map(claim=>claim.id)).size!==claims.length)throw new TypeError('Duplicate claim ownership');
  articles.forEach((article,index)=>{if(article.id!==entries[index].page.articleId)throw new TypeError('Catalog article identity mismatch');validateArticleTitles(article);});
  return {collection:{...metadata,articles},claims,sources};
}
