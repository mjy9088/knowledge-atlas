import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {deriveExplosion} from '../packages/models/explosion.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const projection=read('content/formal-logic/explosion/projection.json');
const narr=read('content/formal-logic/explosion/narration/ko.json');
const byId=new Map(narr.chunks.map(c=>[c.id,c.text]));
const storyboard={projectionId:projection.id,status:'storyboard-only-not-a-video',format:projection.format,
  frames:projection.segments.map(s=>({
    segmentId:s.id,startMs:s.startMs,endMs:s.startMs+s.durationMs,
    narration:byId.get(s.narrationRef), state:s.state,modelResult:deriveExplosion(s.state)
  }))};
const output=path.join(root,'artifacts','storyboard.json');
mkdirSync(path.dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(storyboard,null,2)+'\n');
console.log(`Wrote ${output} (structured storyboard only; NO video rendering performed).`);
