import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const blockers=[];
const sources=read('sources/registry.json'), claims=read('content/formal-logic/explosion/claims.json');
const content=read('content/formal-logic/explosion/content.json');
const projection=read('content/formal-logic/explosion/projection.json');
if(content.status!=='approved')blockers.push('Content not approved');
if(projection.status!=='rendered-and-reviewed')blockers.push('Video not rendered/reviewed');
for(const s of sources.filter(x=>content.sourceRefs.includes(x.id))){
 if(s.rightsReview!=='approved')blockers.push(`Rights pending: ${s.id}`);
 if(!s.contentHash)blockers.push(`Source content snapshot not frozen: ${s.id}`);
}
for(const c of claims)if(!['approved','expert-reviewed'].includes(c.reviewStatus))blockers.push(`Claim not approved: ${c.id}`);
if(blockers.length){console.error('BLOCKED (expected for initial scaffold):\n'+blockers.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('Metadata precheck passed; still requires operational publication approval.');
