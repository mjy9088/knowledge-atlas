import {expect,test} from '@playwright/test';
import {activeWork,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('newton-to-quantum');

test('electron charge-to-mass evidence remains complete in the active probe detour',async({page})=>{
  // Given the active scene that reuses the electron force-balance derivation.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When it is entered directly and exercised through the reader state boundary.
  await openMainWorkScene(page,work,'charge-mass-ratio');
  await expectLongformScene(page,work,'charge-mass-ratio');
  await expectReaderStateBoundary(page,'charge-mass-ratio');
  // Then the canonical derivation, current visual cards, and deterministic state all remain present.
  expect(errors).toEqual([]);
});
