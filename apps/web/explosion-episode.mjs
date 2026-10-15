import {EXPLOSION_EPISODE} from '../../content/formal-logic/explosion/episode.mjs';
import {deriveProof} from '../../packages/models/propositional.mjs';
import {createVideoTimeline} from './inference-video.mjs';
import {normalizeExperimentInput} from './premise-experiment.mjs';
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
// Every cue carries a complete model snapshot: seeks never depend on prior playback.
export function createExplosionEpisode(){
  const scenes={};
  for(const goal of ['Q','R','S']){
    const input={premises:['P','¬P'],goal};
    scenes[goal]=freeze({...createVideoTimeline({...input,proof:deriveProof(input)}),controlState:normalizeExperimentInput(input)});
  }
  const missing={premises:['P'],goal:'S'};
  scenes.missing=freeze({...createVideoTimeline({...missing,proof:deriveProof(missing)}),controlState:normalizeExperimentInput({premises:[{formula:'P',enabled:true},{formula:'¬P',enabled:false}],goal:'S'})});
  let cursor=0;
  const cues=EXPLOSION_EPISODE.sections.map(section=>{
    const cue={id:`${EXPLOSION_EPISODE.id}:${section.id}`,startMs:cursor,endMs:cursor+section.durationMs,
      activeLine:section.line??-1,phase:section.phase??'step',title:section.title,text:section.text,
      claimRefs:section.claimRefs,presentation:scenes[section.scene]};
    cursor=cue.endMs;return Object.freeze(cue);
  });
  return Object.freeze({...scenes.Q,version:4,lessonId:EXPLOSION_EPISODE.id,
    projectionId:'projection:logic.explosion.short.ko',title:EXPLOSION_EPISODE.title,
    sourceRefs:EXPLOSION_EPISODE.sourceRefs,cues:Object.freeze(cues),durationMs:cursor});
}
