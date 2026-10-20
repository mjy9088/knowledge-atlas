import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from './support/main-work.js';

const work=activeWork('newton-to-quantum');
const scenes=['photoelectric','below-threshold','above-threshold'] as const;

test('photoelectric observations and both energy ledgers remain complete',async({page})=>{
  // Given the active photoelectric mainline scene and photon-ledger detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When the observation, below-threshold, and above-threshold contracts are rendered.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'above-threshold');
  const detour=detours(work).find(chapter=>chapter.id==='photon-ledger');
  if(!detour)throw new TypeError('Missing photon-ledger detour');
  await expectDetourReturn(page,work,detour);
  // Then canonical source reasoning, direct entry, state atomicity, and parent return all survive.
  expect(errors).toEqual([]);
});
