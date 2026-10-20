import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from './support/main-work.js';

const work=activeWork('newton-to-quantum');
const scenes=['nuclear-atom','scattering-inference'] as const;

test('nuclear scattering keeps observation and inference distinct in the active work',async({page})=>{
  // Given the mainline observation and its focused inference detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When both current scenes and the declared return path are exercised.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'scattering-inference');
  const detour=detours(work).find(chapter=>chapter.id==='probing-the-atom');
  if(!detour)throw new TypeError('Missing probing-the-atom detour');
  await expectDetourReturn(page,work,detour);
  // Then source prose, scientific scope cards, restoration, invalid atomicity, and return all hold.
  expect(errors).toEqual([]);
});
