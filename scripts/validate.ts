import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {deriveExplosion} from '../packages/models/explosion.js';
import {EXPLOSION_EPISODE} from '../content/formal-logic/explosion/episode.js';
import {EXPERIMENT_RULE_CLAIMS} from '../apps/web/topics/formal-reasoning/dialogue.js';
import {LESSON} from '../content/formal-logic/explosion/lesson.js';
import {validateRelatedPages} from '../packages/site/related-site.js';
import {loadContentCatalog} from '../packages/content/load-catalog.js';
import {validateDocumentation} from './documentation.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=<T>(p:string):T=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const errors:string[]=[];
errors.push(...validateDocumentation(root));
function need(ok:unknown,message:string){if(!ok)errors.push(message);}
function uniq(arr:Array<string|{id:string}>,label:string){const ids=arr.map(x=>typeof x==='string'?x:x.id); need(new Set(ids).size===ids.length,`duplicate IDs: ${label}`);}
const sources=read<typeof import('../sources/registry.json')>('sources/registry.json'),concepts=read<typeof import('../knowledge/concepts.json')>('knowledge/concepts.json'),relations=read<typeof import('../knowledge/relations.json')>('knowledge/relations.json');
const {collection:related,claims}=await loadContentCatalog(async name=>read(name));
for(const error of validateRelatedPages(related,claims))need(false,error);
const inference=read<typeof import('../content/formal-logic/explosion/inference.json')>('content/formal-logic/explosion/inference.json');
const content=read<typeof import('../content/formal-logic/explosion/content.json')>('content/formal-logic/explosion/content.json');
const scene=read<typeof import('../content/formal-logic/explosion/scenes/proof.json')>('content/formal-logic/explosion/scenes/proof.json');
const narration=read<typeof import('../content/formal-logic/explosion/narration/ko.json')>('content/formal-logic/explosion/narration/ko.json');
const projection=read<typeof import('../content/formal-logic/explosion/projection.json')>('content/formal-logic/explosion/projection.json');
for(const [arr,label] of [[sources,'sources'],[concepts,'concepts'],[claims,'claims'],[content.blocks,'content blocks'],[narration.chunks,'narration chunks'],[projection.segments,'projection segments']] as const) uniq(arr,label);
const sourceIds=new Set(sources.map(x=>x.id)), conceptIds=new Set(concepts.map(x=>x.id)), claimIds=new Set(claims.map(x=>x.id));
for(const id of Object.values(EXPERIMENT_RULE_CLAIMS))need(claimIds.has(id),'Unknown experiment dialogue claim '+id);
const narrationIds=new Set(narration.chunks.map(x=>x.id));
need(LESSON.reviewStatus==='needs-content-review','Lesson must retain content review status');
need(inference.lessonRef===LESSON.id,'Inference lesson reference mismatch');
for(const id of LESSON.sourceRefs)need(sourceIds.has(id),`Unknown lesson source ${id}`);
uniq([...LESSON.intro,...LESSON.outro],'lesson sections');
for(const section of [...LESSON.intro,...Object.values(LESSON.rules),...LESSON.outro]){
  need(Boolean(section.text&&section.claimRefs?.length),'Lesson section needs text and claim refs');
  for(const id of section.claimRefs)need(claimIds.has(id),`Unknown lesson claim ${id}`);
}
uniq(related.articles,'related articles');
for(const id of related.articleRefs??[])need(related.articles.some(article=>article.id===id),'Unknown collection article '+id);
uniq(related.articles.flatMap(a=>a.blocks),'related blocks');
uniq(EXPLOSION_EPISODE.sections,'episode sections');
need(content.relatedCollectionRef===related.id&&content.episodeRef===EXPLOSION_EPISODE.id,'Canonical related/episode references missing');
for(const id of EXPLOSION_EPISODE.sourceRefs)need(sourceIds.has(id),'Unknown episode source '+id);
need(EXPLOSION_EPISODE.sections.reduce((sum,s)=>sum+s.durationMs,0)<=180000,'Short episode exceeds 180 seconds');
for(const section of EXPLOSION_EPISODE.sections)for(const id of section.claimRefs)need(claimIds.has(id),'Unknown episode claim '+id);
for(const article of related.articles){
 need(conceptIds.has(article.conceptId)&&article.relatedConcepts.every(id=>conceptIds.has(id)),'Unknown related concept '+article.id);
 need(article.reviewStatus==='needs-content-review','Related article review missing');
 for(const block of article.blocks){need(Boolean(block.text&&block.claimRefs.length),'Empty related block');for(const id of block.claimRefs)need(claimIds.has(id),'Unknown related claim '+id);}
}
for(const s of sources){
  need(Boolean(s.canonicalUrl?.startsWith('https://')),`${s.id}: needs canonical https URL`);
  need(Boolean(s.providerRevision && s.license && s.rightsReview),`${s.id}: revision/license/rights status missing`);
}
for(const c of claims){
  need(Boolean(c.statement&&c.kind&&c.scope&&c.reviewStatus),`${c.id}: missing semantic information`);
  need(Array.isArray(c.sourceRefs)&&c.sourceRefs.length>0,`${c.id}: needs specific sourceRefs`);
  for(const r of c.sourceRefs??[])need(sourceIds.has(r.sourceId)&&Boolean(r.locator),`${c.id}: invalid source/locator ${r.sourceId}`);
}
for(const id of content.sourceRefs)need(sourceIds.has(id),`Unknown content source ${id}`);
for(const id of content.conceptRefs)need(conceptIds.has(id),`Unknown content concept ${id}`);
for(const id of content.claimRefs)need(claimIds.has(id),`Unknown content claim ${id}`);
for(const b of content.blocks)for(const id of b.claimRefs??[])need(claimIds.has(id),`Unknown block claim ${id}`);
for(const id of inference.claimRefs)need(claimIds.has(id),`Unknown inference claim ${id}`);
for(const id of inference.sourceRefs)need(sourceIds.has(id),`Unknown inference source ${id}`);
need(inference.schemaVersion===1&&inference.reviewStatus==='needs-content-review','Inference draft contract/review status missing');
need(inference.sceneId==='scene:logic.inference.lab'&&inference.modelId==='model:logic.propositional.forward','Inference scene/model identity changed');
need(inference.sourceReading.immutableSnapshotVerified===false&&inference.sourceReading.providerRevisionVerified===false,'Source snapshot/revision verification must not be invented');
for(const r of relations){
  need(conceptIds.has(r.from)&&conceptIds.has(r.to),`Unknown relation node ${r.from}→${r.to}`);
  need(Boolean(r.type&&r.status&&r.context),`Unqualified relation ${r.from}→${r.to}`);
  for(const id of r.sourceRefs??[])need(sourceIds.has(id),`Unknown relation source ${id}`);
}
need(content.sceneRefs.includes(scene.id),'Experience does not include scene');
for(const id of scene.claimRefs)need(claimIds.has(id),`Unknown scene claim ${id}`);
need(content.projectionRefs.includes(projection.id),'Experience does not include projection');
need(projection.sourceExperienceId===content.id,'Projection refers to a different experience');
need(projection.status==='draft-not-rendered','Bootstrap must not claim a rendered video');
let end=0;
for(const seg of projection.segments){
 need(seg.startMs===end,`${seg.id}: gap/overlap or out-of-order segment`);
 need(seg.durationMs>0,`${seg.id}: duration must be positive`);
 need(narrationIds.has(seg.narrationRef),`${seg.id}: unknown narration`);
 need(seg.sceneRef===scene.id,`${seg.id}: unknown scene`);
 try{deriveExplosion(seg.state);}catch(e){need(false,`${seg.id}: bad state: ${(e instanceof Error?e.message:String(e))}`)}
 end=seg.startMs+seg.durationMs;
}
if(errors.length){console.error('Validation failed:\n'+errors.map(e=>' - '+e).join('\n'));process.exit(1)}
console.log(`VALID: ${sources.length} sources, ${concepts.length} concepts, ${relations.length} relations, ${claims.length} claims, ${projection.segments.length} storyboard segments (${end}ms).`);
