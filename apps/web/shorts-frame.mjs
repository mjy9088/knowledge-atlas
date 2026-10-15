import {frameAt} from './inference-video.mjs';
// RAF's first timestamp can precede the clock sampled by the play handler.
export function advanceShortsTime(timeMs, deltaMs, durationMs) {
  return Math.min(durationMs,timeMs+Math.max(0,deltaMs));
}
// Same timeline/proof as the web playback; only the composition differs.
export function shortsFrame(timeline, timeMs) {
  const frame = frameAt(timeline, timeMs);
  return {...frame, phase:frame.activeLine >= 0 ? 'step' : frame.timeMs < 2500 ? 'intro' : 'outro'};
}
