import {interpretWeekdayWorlds,type WeekdayInterpretation,type WorldIndex} from './weekday-worlds.js';
export interface ModalFrame {evaluationWorld:WorldIndex;access:[WorldIndex,WorldIndex][]}
export function weekdayModal(input:WeekdayInterpretation,frame:ModalFrame){
  const calendar=interpretWeekdayWorlds(input),ids=calendar.worldDays.map(w=>w.id);
  if(!frame||!ids.includes(frame.evaluationWorld)||!Array.isArray(frame.access)||!frame.access.every(e=>Array.isArray(e)&&e.length===2&&ids.includes(e[0])&&ids.includes(e[1]))||new Set(frame.access.map(e=>e.join(','))).size!==frame.access.length)throw new RangeError('Invalid modal frame');
  const valuation=calendar.worldDays.filter(w=>w.days[1]===input.target).map(w=>w.id);
  const accessible=frame.access.filter(e=>e[0]===frame.evaluationWorld).map(e=>e[1]);
  return {valuation,accessible,actual:valuation.includes(frame.evaluationWorld),
    diamond:accessible.some(id=>valuation.includes(id)),box:accessible.every(id=>valuation.includes(id)),
    reflexive:ids.every(id=>frame.access.some(e=>e[0]===id&&e[1]===id)),
    calendarKind:calendar.kind,calendarMatches:calendar.matches,
  };
}
