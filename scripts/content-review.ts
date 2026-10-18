import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {CONTENT_ENTRIES} from '../content/catalog.js';
import {loadContentCatalog} from '../packages/content/load-catalog.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const slug=process.argv.slice(2).filter(argument=>argument!=='--')[0];
const entry=CONTENT_ENTRIES.find(item=>item.page.slug===slug);
if(!entry){
  console.error('Usage: pnpm content:review -- <registered-slug>');
  process.exitCode=1;
}else{
  const read=async(name:string):Promise<unknown>=>JSON.parse(readFileSync(path.join(root,name),'utf8'));
  const content=await loadContentCatalog(read);
  const article=content.collection.articles.find(item=>item.id===entry.page.articleId);
  const domain=entry.directory.split('/')[0];
  const quality=domain==='physics-discovery'||domain==='number-systems'?await read(`content/${entry.directory}/quality.json`):null;
  const claimIds=new Set([...(entry.page.claimRefs??[]),...(article?.blocks.flatMap(block=>block.claimRefs)??[])]);
  const claims=content.claims.filter(claim=>claimIds.has(claim.id));
  const sourceIds=new Set(claims.flatMap(claim=>claim.sourceRefs.map(ref=>ref.sourceId)));
  const packet={protocol:'content-review-v1',article,page:entry.page,quality,claims,sources:content.sources.filter(source=>sourceIds.has(source.id)),rubric:readFileSync(path.join(root,'docs/CONTENT-QUALITY.md'),'utf8'),authority:'Local review candidate only; no scientific, rights or publication approval.'};
  const revision=createHash('sha256').update(JSON.stringify(packet)).digest('hex');
  console.log(JSON.stringify({revision,...packet,resultContract:{protocol:packet.protocol,revision,provenance:{origin:'external-review-assertion',reviewer:'',reviewedAt:'',verificationScope:[]},findings:[]}},null,2));
}
