// Reproducible local review artifacts; does not render media or authorize release.
import {readFile, readdir, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createExplosionEpisode} from '../packages/projection/explosion.js';
import {frameAt, timelineVtt} from '../packages/projection/timeline.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = (bytes: string|Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const read = (relative:string) => readFile(path.join(root, relative));
const contract = JSON.parse((await read('content/formal-logic/explosion/inference.json')).toString('utf8'));
const timeline=createExplosionEpisode(),proof=timeline.snapshot.proof;
if(!proof?.lines)throw new Error('Projection proof is missing');
async function dependencyFiles(directory:string):Promise<string[]>{
  const entries=await readdir(path.join(root,directory),{withFileTypes:true});
  const result=[];
  for(const entry of entries){
    if(entry.isSymbolicLink())throw new Error('Linked dependency');
    const file=directory+'/'+entry.name;
    if(entry.isDirectory())result.push(...await dependencyFiles(file));
    else if(/\.(ts|json|html|css)$/.test(file))result.push(file);
  }
  return result.sort();
}
const files=['scripts/encode-mp4.ts',...await dependencyFiles('packages/models'),...await dependencyFiles('packages/experiments'),...await dependencyFiles('packages/projection'),...await dependencyFiles('content/formal-logic/explosion'),...await dependencyFiles('tools/media'),'sources/registry.json'];
const dependencies = await Promise.all(files.map(async file => ({file, sha256: sha256(await read(file))})));
const timelineJson = JSON.stringify(timeline, null, 2) + '\n';
const captions = timelineVtt(timeline);
const diagnostics = timeline.cues.map(cue => {
  const frame = frameAt(timeline, Math.min(cue.startMs + 500, cue.endMs));
  return {timeMs: frame.timeMs, caption: frame.caption, activeLine: frame.activeLine, goal:frame.presentation.goal,premises:frame.presentation.premises,
    visibleLineIds: frame.visibleLines.map(line => line.id)};
});
const manifest = {
  id: 'preview:logic.explosion.short.local', schemaVersion: 1, status: 'local-review-candidate',
  sceneId: contract.sceneId, modelId: contract.modelId,
  renderer: 'Shared scene timeline; no encoded media file', size: [timeline.width, timeline.height],
  durationMs: timeline.durationMs, audio: 'none',
  claimRefs: [...new Set(timeline.cues.flatMap(c=>c.claimRefs))], sourceRefs: timeline.sourceRefs,
  sourceRevisionVerified: false, sourceSnapshotVerified: false, rightsApproved: false,
  published: false, scientificHumanApproval: false,
  dependencies, outputs: {timelineSha256: sha256(timelineJson), captionsSha256: sha256(captions)},
  limitations: proof.limitations,
};
const output = path.join(root, 'artifacts/explosion-preview');
await mkdir(output, {recursive: true});
await Promise.all([
  writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n'),
  writeFile(path.join(output, 'timeline.json'), timelineJson),
  writeFile(path.join(output, 'captions.vtt'), captions),
  writeFile(path.join(output, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2) + '\n'),
]);
console.log(`Projection review artifacts: ${proof.lines.length} proof lines, ${timeline.cues.length} cues, ${timeline.durationMs}ms; review and publication pending.`);
