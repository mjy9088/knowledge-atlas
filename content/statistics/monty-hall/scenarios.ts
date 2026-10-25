import {draw} from '../../../packages/models/possibility-lab.js';

export const DOORS = [1, 2, 3] as const;
export type Door = typeof DOORS[number];
function door(value: number): Door {
  if (!DOORS.some(candidate => candidate === value)) throw new RangeError('Invalid door');
  return value as Door;
}
function seedValue(seed: number): number {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('Invalid seed');
  return seed;
}
export function otherDoors(choice: number): Door[] { return DOORS.filter(value => value !== door(choice)); }

/** A labelled hypothetical prize case, not another observed trial. */
export function informedCase(choiceValue: number, prizeValue: number, seed = 42) {
  const choice = door(choiceValue), prize = door(prizeValue);
  const available = otherDoors(choice).filter(value => value !== prize);
  const opened = available[Math.floor(draw(seedValue(seed), 0, 1) * available.length)];
  const remaining = DOORS.find(value => value !== choice && value !== opened);
  if (opened === undefined || remaining === undefined) throw new RangeError('Incomplete door case');
  return {choice, prize, opened, remaining, switchWins: remaining === prize};
}

/** Prize depends only on the seed, so changing the reader's choice cannot move it. */
export function openingRound(choice: number, seed: number) {
  const prize = 1 + Math.floor(draw(seedValue(seed), 0, 0) * 3);
  return informedCase(choice, prize, seed);
}

/** Six equally likely prize/opened pairs for an uninformed uniform host. */
export function blindCases(choiceValue: number) {
  const choice = door(choiceValue);
  return DOORS.flatMap(prize => otherDoors(choice).map(opened => {
    const remaining = DOORS.find(value => value !== choice && value !== opened)!;
    return {choice, prize, opened, remaining, accepted: opened !== prize, switchWins: remaining === prize};
  }));
}
