export const CHALLENGE_DURATION_MS=20_000;
export interface WeekdayChallenge {phase:'ready'|'running'|'answered'|'expired'|'skipped';elapsedMs:number;answer:number|null;promptTarget:number|null;playback:'live'|'paused'}
export const freshWeekdayChallenge=():WeekdayChallenge=>({phase:'ready',elapsedMs:0,answer:null,promptTarget:null,playback:'paused'});
export function validateWeekdayChallenge(value:unknown):WeekdayChallenge{
  if(typeof value!=='object'||value===null||Array.isArray(value)||Object.keys(value).some(key=>!['phase','elapsedMs','answer','promptTarget','playback'].includes(key)))throw new TypeError('Invalid challenge');
  const c=value as Record<string,unknown>;
  if(typeof c.phase!=='string'||!['ready','running','answered','expired','skipped'].includes(c.phase)||typeof c.elapsedMs!=='number'||!Number.isFinite(c.elapsedMs)||c.elapsedMs<0||c.elapsedMs>CHALLENGE_DURATION_MS||c.playback!=='live'&&c.playback!=='paused')throw new TypeError('Invalid challenge state');
  if(c.promptTarget!==null&&(typeof c.promptTarget!=='number'||!Number.isInteger(c.promptTarget)||c.promptTarget<0||c.promptTarget>6)||c.phase==='ready'&&c.promptTarget!==null||c.phase!=='ready'&&c.promptTarget===null)throw new TypeError('Invalid challenge prompt');
  if(c.answer!==null&&(typeof c.answer!=='number'||!Number.isInteger(c.answer)||c.answer<0||c.answer>6))throw new TypeError('Invalid challenge answer');
  if((c.phase==='answered')!==(c.answer!==null)||c.phase==='ready'&&c.elapsedMs!==0||c.phase==='expired'&&c.elapsedMs!==CHALLENGE_DURATION_MS||(c.phase==='running'||c.phase==='answered')&&c.elapsedMs>=CHALLENGE_DURATION_MS||c.phase!=='running'&&c.playback!=='paused')throw new TypeError('Inconsistent challenge state');
  return {phase:c.phase as WeekdayChallenge['phase'],elapsedMs:c.elapsedMs,answer:c.answer as number|null,promptTarget:c.promptTarget as number|null,playback:c.playback};
}
export function advanceWeekdayChallenge(input:WeekdayChallenge,deltaMs:number):WeekdayChallenge{
  const c=validateWeekdayChallenge(input);if(!Number.isFinite(deltaMs)||deltaMs<0)throw new RangeError('Invalid challenge time');
  if(c.phase!=='running')return c;
  const elapsedMs=Math.min(CHALLENGE_DURATION_MS,c.elapsedMs+deltaMs);
  return {...c,elapsedMs,...(elapsedMs===CHALLENGE_DURATION_MS?{phase:'expired' as const,playback:'paused' as const}:{})};
}
export function answerWeekdayChallenge(input:WeekdayChallenge,day:number):WeekdayChallenge{
  const c=validateWeekdayChallenge(input);if(!Number.isInteger(day)||day<0||day>6)throw new RangeError('Invalid weekday choice');
  return c.phase==='running'?{...c,phase:'answered',answer:day,playback:'paused'}:c;
}
// A seek is an independent, frozen projection frame, never a live deadline.
export function weekdayChallengeAt(ms:number,promptTarget=4):WeekdayChallenge{
  if(!Number.isFinite(ms)||ms<0)throw new RangeError('Invalid challenge frame');
  return validateWeekdayChallenge({...freshWeekdayChallenge(),phase:ms>=CHALLENGE_DURATION_MS?'expired':'running',elapsedMs:Math.min(ms,CHALLENGE_DURATION_MS),promptTarget});
}
