import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('newton-to-quantum');
const scenes=['spectral-lines','bohr','wavelength-energy','hydrogen-prediction'] as const;

test('spectral observations, Bohr reconstruction, and wavelength conversions remain complete',async({page})=>{
  // Given the active spectral mainline and line-energy detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When all mapped scientific scenes are entered and their current source contracts measured.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'hydrogen-prediction');
  const detour=detours(work).find(chapter=>chapter.id==='line-energy');
  if(!detour)throw new TypeError('Missing line-energy detour');
  await expectDetourReturn(page,work,detour);
  // Then line position, energy conversion, model limits, restoration, and detour return stay asserted.
  expect(errors).toEqual([]);
});
