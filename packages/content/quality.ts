type QualityIdentity={readonly articleId:string;readonly seriesId:string;readonly sceneIds:readonly string[]};
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const text=(value:unknown):value is string=>typeof value==='string'&&value.trim().length>0;
const texts=(value:unknown):value is string[]=>Array.isArray(value)&&value.every(text);
const only=(value:Record<string,unknown>,keys:readonly string[])=>Object.keys(value).every(key=>keys.includes(key));

export function validateContentLimit(articleIds:readonly string[]):string[]{
  const errors:string[]=[];
  if(articleIds.length>100)errors.push('Content limit: at most 100 content units, including existing articles and standalone episodes.');
  if(new Set(articleIds).size!==articleIds.length)errors.push('Content limit: duplicate article identity.');
  return errors;
}

export function validateQuality(value:unknown,identity:QualityIdentity):string[]{
  if(!record(value))return ['Quality record must be an object.'];
  const errors:string[]=[];
  if(!only(value,['schemaVersion','articleId','seriesId','openingQuestion','readerOutcome','assumedKnowledge','misconception','transfer','narration','review']))errors.push('Unknown quality fields; evidence and approval records belong in their own reviewed contracts.');
  if(value['schemaVersion']!==1)errors.push('Unsupported quality schemaVersion.');
  if(value['articleId']!==identity.articleId||value['seriesId']!==identity.seriesId)errors.push('Quality identity mismatch.');
  for(const field of ['openingQuestion','readerOutcome','misconception']){
    if(!text(value[field]))errors.push(`Missing ${field}.`);
  }
  if(!texts(value['assumedKnowledge']))errors.push('assumedKnowledge must be an array of nonempty strings.');
  const transfer=value['transfer'];
  if(!record(transfer)||!only(transfer,['question','answer','rationale'])||!['question','answer','rationale'].every(key=>text(transfer[key])))errors.push('Transfer needs question, answer and rationale only.');
  const narration=value['narration'];
  if(!record(narration))errors.push('Missing planned narration.');
  else{
    if(!only(narration,['status','seconds','segments']))errors.push('Unknown narration evidence or approval fields.');
    if(narration['status']!=='planned')errors.push('Narration must remain planned; measurement needs separate evidence.');
    const seconds=narration['seconds'];
    if(typeof seconds!=='number'||!Number.isFinite(seconds)||seconds<=0||seconds>180)errors.push('Planned duration must be within 180 seconds.');
    const segments=narration['segments'];
    if(!Array.isArray(segments))errors.push('Missing narration segments.');
    else{
      const sceneIds:string[]=[];let total=0;
      for(const segment of segments){
        if(!record(segment)||!only(segment,['sceneId','seconds'])||!text(segment['sceneId'])||typeof segment['seconds']!=='number'||!Number.isFinite(segment['seconds'])||segment['seconds']<=0){
          errors.push('Invalid narration segment.');continue;
        }
        sceneIds.push(segment['sceneId']);total+=segment['seconds'];
      }
      if(sceneIds.length!==identity.sceneIds.length||sceneIds.some((id,index)=>id!==identity.sceneIds[index])||new Set(sceneIds).size!==sceneIds.length)errors.push('Narration scene coverage must match reader scene order exactly once.');
      if(total!==seconds)errors.push('Narration duration sum does not match total.');
    }
  }
  const review=value['review'];
  if(!record(review)||!only(review,['status','blockers'])||review['status']!=='review-required'||!texts(review['blockers'])||review['blockers'].length===0)errors.push('Review must retain review-required status and explicit unresolved review only.');
  return errors;
}
