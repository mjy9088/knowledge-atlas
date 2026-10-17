import {interpretWeekdayWorlds,type WeekdayInterpretation,type WorldIndex} from './weekday-worlds.js';
export interface ModalFrame {evaluationWorld:WorldIndex;access:[WorldIndex,WorldIndex][]}
// Ordinary Kripke truth at one world, independent of any calendar constraints.
export function alethicValuationAt(ids:readonly WorldIndex[],valuation:readonly WorldIndex[],frame:ModalFrame){
  if(!ids.length||ids.length>4||new Set(ids).size!==ids.length||!ids.every(id=>Number.isInteger(id)&&id>=0&&id<=3)||new Set(valuation).size!==valuation.length||!valuation.every(id=>ids.includes(id))||!frame||!ids.includes(frame.evaluationWorld)||!Array.isArray(frame.access)||!frame.access.every(e=>Array.isArray(e)&&e.length===2&&ids.includes(e[0])&&ids.includes(e[1]))||new Set(frame.access.map(e=>e.join(','))).size!==frame.access.length)throw new RangeError('Invalid modal valuation/frame');
  const accessible=frame.access.filter(e=>e[0]===frame.evaluationWorld).map(e=>e[1]);
  return {accessible,actual:valuation.includes(frame.evaluationWorld),diamond:accessible.some(id=>valuation.includes(id)),box:accessible.every(id=>valuation.includes(id))};
}
export function weekdayModal(input:WeekdayInterpretation,frame:ModalFrame){
  const calendar=interpretWeekdayWorlds(input),ids=calendar.worldDays.map(w=>w.id);
  if(!frame||!ids.includes(frame.evaluationWorld)||!Array.isArray(frame.access)||!frame.access.every(e=>Array.isArray(e)&&e.length===2&&ids.includes(e[0])&&ids.includes(e[1]))||new Set(frame.access.map(e=>e.join(','))).size!==frame.access.length)throw new RangeError('Invalid modal frame');
  const valuation=calendar.worldDays.filter(w=>w.days[1]===input.target).map(w=>w.id);
  return {valuation,...alethicValuationAt(ids,valuation,frame),
    reflexive:ids.every(id=>frame.access.some(e=>e[0]===id&&e[1]===id)),
    calendarKind:calendar.kind,calendarMatches:calendar.matches,
  };
}

// UI projection: evaluate each satisfying calendar, never the legacy sample days.
// null means disagreement between completions, or no consistent calendar.
export function deducedWeekdayModal(input:WeekdayInterpretation,frame:ModalFrame){
  const {accessible}=weekdayModal(input,frame),calendar=interpretWeekdayWorlds(input);
  const rows=calendar.models.map(model=>{
    const p=(id:WorldIndex)=>model.values[id]===input.target;
    return {actual:p(frame.evaluationWorld),diamond:accessible.some(p),box:accessible.every(p)};
  });
  const agreed=(key:'actual'|'diamond'|'box'):boolean|null=>rows.length&&rows.every(row=>row[key]===rows[0][key])?rows[0][key]:null;
  return {accessible,consistent:rows.length>0,actual:agreed('actual'),diamond:agreed('diamond'),box:agreed('box')};
}
