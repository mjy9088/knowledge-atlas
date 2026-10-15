// Reproducible local review artifacts; does not render media or authorize release.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createExplosionEpisode} from '../apps/web/explosion-episode.mjs';
import {frameAt, timelineVtt} from '../apps/web/inference-video.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => readFile(path.join(root, relative));
const contract = JSON.parse(await read('content/formal-logic/explosion/inference.json'));
const timeline=createExplosionEpisode(),proof=timeline.snapshot.proof;
const files = [
  'content/formal-logic/explosion/episode.mjs', 'content/formal-logic/explosion/related.json',
  'apps/web/explosion-episode.mjs','apps/web/lesson.html','apps/web/lesson.css','apps/web/lesson-page.mjs',
  'packages/models/propositional.mjs', 'apps/web/inference-video.mjs',
  'apps/web/inference-visual.mjs', 'apps/web/formula-display.mjs', 'apps/web/slide-deck.mjs',
  'apps/web/app.mjs', 'apps/web/index.html', 'apps/web/styles.css', 'apps/web/stage-layout.css',
  'apps/web/inference-presets.mjs', 'apps/web/shorts.html', 'apps/web/shorts.css',
  'apps/web/shorts.mjs', 'apps/web/shorts-frame.mjs',
  'apps/web/preview.html', 'apps/web/preview.css', 'apps/web/preview.mjs',
  'apps/web/expanded-timeline.mjs', 'content/formal-logic/explosion/lesson.mjs',
  'apps/web/render.html', 'apps/web/render.css', 'apps/web/render.mjs',
  'apps/web/video-renderer.mjs', 'apps/web/webm-muxer.mjs', 'scripts/encode-mp4.mjs',
  'content/formal-logic/explosion/inference.json',
  'content/formal-logic/explosion/inference-claims.json',
  'content/formal-logic/explosion/claims.json', 'sources/registry.json',
];
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
  renderer: 'HTML Canvas; no encoded media file', size: [timeline.width, timeline.height],
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
console.log(`HTML preview artifacts: ${proof.lines.length} proof lines, ${timeline.cues.length} cues, ${timeline.durationMs}ms; review and publication pending.`);
