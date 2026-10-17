import type {CalendarWorld} from '../../../packages/models/weekday-worlds.js';

// Authored concept examples, separate from solutions of the riddle's date constraints.
export const MODAL_INTRO_EXAMPLES:readonly {id:string;title:string;worlds:CalendarWorld[]}[]=[
  {id:'possible',title:'가능하지만, 필연적이지는 않다',worlds:[{id:0,today:6},{id:1,today:4},{id:2,today:0}]},
  {id:'necessary',title:'필연적이다',worlds:[{id:0,today:4},{id:1,today:4},{id:2,today:4}]},
];
