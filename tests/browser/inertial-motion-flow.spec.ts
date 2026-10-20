import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from './support/main-work.js';

const work=activeWork('newton-to-quantum');
const scenes=['newton','force-balance','frame-comparison'] as const;

test('inertial reasoning retains prediction, force balance, and frame comparison',async({page})=>{
  // Given the current mainline and forces-and-frames detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When each mapped scene and the complete detour flow are rendered.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'frame-comparison');
  const detour=detours(work).find(chapter=>chapter.id==='forces-and-frames');
  if(!detour)throw new TypeError('Missing forces-and-frames detour');
  await expectDetourReturn(page,work,detour);
  // Then the active article preserves the old scientific distinctions without a retired route.
  expect(errors).toEqual([]);
});
