import type {Article,ContentPage} from '../content/types.js';
import {validateQuality} from '../content/quality.js';
import {sceneText} from '../../content/catalog.js';

export interface StaticArticleCue {
  readonly startMs:number;
  readonly endMs:number;
  readonly readerState:Readonly<{sceneId:string}>;
  readonly title:string;
  readonly text:string;
  readonly claimRefs:readonly string[];
}
export interface StaticArticleTimeline {
  readonly version:1;
  readonly articleId:string;
  readonly slug:string;
  readonly timingStatus:'planned';
  readonly durationMs:number;
  readonly cues:readonly StaticArticleCue[];
}
interface StaticArticleInput {
  readonly article:Article;
  readonly page:ContentPage;
  readonly quality:unknown;
}
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);

export function createStaticArticleTimeline({article,page,quality}:StaticArticleInput):StaticArticleTimeline {
  const series=page.slug==='counting-zero'?'number-systems':page.slug==='inertial-motion'?'physics-discovery':null;
  if(!series||page.model||page.interactive||page.experiment)throw new TypeError('Only selected static article readers are supported');
  if(article.id!==page.articleId||article.id!==`article:${series}.${page.slug}.ko`)throw new TypeError('Static article identity mismatch');
  const errors=validateQuality(quality,{articleId:article.id,seriesId:`series:${series}`,sceneIds:page.scenes.map(scene=>scene.id)});
  if(errors.length)throw new TypeError(errors.join('\n'));
  if(!record(quality)||!record(quality['narration'])||!Array.isArray(quality['narration']['segments']))throw new TypeError('Missing timing segments');
  const segments=quality['narration']['segments'];
  let endMs=0;
  const cues=page.scenes.map((scene,index):StaticArticleCue=>{
    const segment:unknown=segments[index];
    if(!record(segment)||typeof segment['seconds']!=='number'||!Number.isSafeInteger(segment['seconds']*1000))throw new TypeError('Scene duration must resolve to whole milliseconds');
    const block=article.blocks[scene.block];
    if(!block||!Number.isInteger(scene.block)||!Number.isInteger(scene.from)||scene.from<0||
      (scene.to!==undefined&&(!Number.isInteger(scene.to)||scene.to<=scene.from)))throw new TypeError('Invalid static article scene range');
    const text=sceneText(article,scene);
    if(!text)throw new TypeError('Empty static article scene');
    const startMs=endMs;
    endMs+=segment['seconds']*1000;
    return Object.freeze({startMs,endMs,readerState:Object.freeze({sceneId:scene.id}),title:scene.title,text,claimRefs:Object.freeze([...block.claimRefs])});
  });
  if(!cues.length)throw new TypeError('Static article needs at least one scene');
  return Object.freeze({version:1,articleId:article.id,slug:page.slug,timingStatus:'planned',durationMs:endMs,cues:Object.freeze(cues)});
}

export function staticArticleFrameAt(timeline:StaticArticleTimeline,timeMs:number) {
  if(typeof timeMs!=='number'||!Number.isFinite(timeMs)||timeMs<0)throw new RangeError('Time must be finite and non-negative');
  const time=Math.min(timeMs,timeline.durationMs);
  const cue=timeline.cues.find(item=>time>=item.startMs&&time<item.endMs)??timeline.cues.at(-1);
  if(!cue)throw new TypeError('Static article timeline has no scenes');
  return {...structuredClone(cue),timeMs:time};
}

export function createStaticArticleCursor(timeline:StaticArticleTimeline) {
  let timeMs=0;
  const seek=(next:number)=>{
    const frame=staticArticleFrameAt(timeline,next);
    timeMs=frame.timeMs;
    return frame;
  };
  return {
    getState:()=>({version:1,articleId:timeline.articleId,timeMs}),
    setState:(value:unknown)=>{
      if(!record(value)||Object.keys(value).length!==3||value['version']!==1||value['articleId']!==timeline.articleId||
        typeof value['timeMs']!=='number'||!Number.isFinite(value['timeMs'])||value['timeMs']<0||value['timeMs']>timeline.durationMs)throw new TypeError('Invalid static article projection state');
      return seek(value['timeMs']);
    },
    seek,
    reset:()=>seek(0),
  };
}
