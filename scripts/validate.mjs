import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {deriveExplosion} from '../packages/models/explosion.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const errors=[];
function need(ok,message){if(!ok)errors.push(message);}
function uniq(arr,label){const ids=arr.map(x=>typeof x==='string'?x:x.id); need(new Set(ids).size===ids.length,`duplicate IDs: ${label}`);}
const sources=read('sources/registry.json'),concepts=read('knowledge/concepts.json'),relations=read('knowledge/relations.json');
const claims=[...read('content/formal-logic/explosion/claims.json'),...read('content/formal-logic/explosion/inference-claims.json')];
const inference=read('content/formal-logic/explosion/inference.json');
const content=read('content/formal-logic/explosion/content.json');
const scene=read('content/formal-logic/explosion/scenes/proof.json');
const narration=read('content/formal-logic/explosion/narration/ko.json');
const projection=read('content/formal-logic/explosion/projection.json');
const feedback=[...read('feedback/example-feedback.json'),read('feedback/2026-10-16-inference-video.json'),read('feedback/2026-10-16-slide-scenes.json'),read('feedback/2026-10-16-floating-controls.json')];
for(const [arr,label] of [[sources,'sources'],[concepts,'concepts'],[claims,'claims'],[content.blocks,'content blocks'],[narration.chunks,'narration chunks'],[projection.segments,'projection segments'],[feedback,'feedback']]) uniq(arr,label);
const sourceIds=new Set(sources.map(x=>x.id)), conceptIds=new Set(concepts.map(x=>x.id)), claimIds=new Set(claims.map(x=>x.id));
const blockIds=new Set(content.blocks.map(x=>x.id)), narrationIds=new Set(narration.chunks.map(x=>x.id));
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
 try{deriveExplosion(seg.state);}catch(e){need(false,`${seg.id}: bad state: ${e.message}`)}
 end=seg.startMs+seg.durationMs;
}
for(const f of feedback)need(Boolean(f.origin&&f.invariants&&f.targetId&&f.status),`${f.id}: invalid feedback`);
for(const f of feedback){
 const validTargets=new Set([scene.id,inference.id,inference.sceneId,...claimIds,...blockIds,...projection.segments.map(x=>x.id)]);
 need(validTargets.has(f.targetId),`${f.id}: nonexistent target`);
}
if(errors.length){console.error('Validation failed:\n'+errors.map(e=>' - '+e).join('\n'));process.exit(1)}
console.log(`VALID: ${sources.length} sources, ${concepts.length} concepts, ${relations.length} relations, ${claims.length} claims, ${projection.segments.length} storyboard segments (${end}ms).`);
