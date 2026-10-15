// Reproducible local review artifacts; does not render media or authorize release.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {deriveProof} from '../packages/models/propositional.mjs';
import {createVideoTimeline, frameAt, timelineVtt} from '../apps/web/inference-video.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => readFile(path.join(root, relative));
const contract = JSON.parse(await read('content/formal-logic/explosion/inference.json'));
const {premises, goal} = contract.initialState;
const proof = deriveProof({premises, goal});
const timeline = createVideoTimeline({premises, goal, proof});
const files = [
  'packages/models/propositional.mjs', 'apps/web/inference-video.mjs',
  'apps/web/app.mjs', 'apps/web/index.html', 'apps/web/styles.css',
  'content/formal-logic/explosion/inference.json',
  'content/formal-logic/explosion/inference-claims.json',
  'content/formal-logic/explosion/claims.json', 'sources/registry.json',
];
const dependencies = await Promise.all(files.map(async file => ({file, sha256: sha256(await read(file))})));
const timelineJson = JSON.stringify(timeline, null, 2) + '\n';
const captions = timelineVtt(timeline);
const diagnostics = timeline.cues.map(cue => {
  const frame = frameAt(timeline, Math.min(cue.startMs + 500, cue.endMs));
  return {timeMs: frame.timeMs, caption: frame.caption, activeLine: frame.activeLine,
    visibleLineIds: frame.visibleLines.map(line => line.id)};
});
const manifest = {
  id: 'preview:logic.inference.local', schemaVersion: 1, status: 'local-review-candidate',
  sceneId: contract.sceneId, modelId: contract.modelId,
  renderer: 'HTML Canvas; no encoded media file', size: [timeline.width, timeline.height],
  durationMs: timeline.durationMs, audio: 'none',
  claimRefs: contract.claimRefs, sourceRefs: contract.sourceRefs,
  sourceRevisionVerified: false, sourceSnapshotVerified: false, rightsApproved: false,
  published: false, scientificHumanApproval: false,
  dependencies, outputs: {timelineSha256: sha256(timelineJson), captionsSha256: sha256(captions)},
  limitations: proof.limitations,
};
const output = path.join(root, 'artifacts/inference-preview');
await mkdir(output, {recursive: true});
await Promise.all([
  writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n'),
  writeFile(path.join(output, 'timeline.json'), timelineJson),
  writeFile(path.join(output, 'captions.vtt'), captions),
  writeFile(path.join(output, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2) + '\n'),
]);
console.log(`HTML preview artifacts: ${proof.lines.length} proof lines, ${timeline.cues.length} cues, ${timeline.durationMs}ms; review and publication pending.`);
