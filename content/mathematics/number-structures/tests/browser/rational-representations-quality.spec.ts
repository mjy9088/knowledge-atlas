import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('number-structures');
const scenes=['representative-independence','fraction-domain','fraction-transitivity'] as const;

test('rational representatives retain independence, domain, and transitivity reasoning',async({page})=>{
  // Given the active representative scene and fraction-construction detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When the mapped construction is entered directly and through its declared branch.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'fraction-transitivity');
  const detour=detours(work).find(chapter=>chapter.id==='fraction-construction');
  if(!detour)throw new TypeError('Missing fraction-construction detour');
  await expectDetourReturn(page,work,detour);
  // Then exact source prose, cross-product cards, state atomicity, and parent return remain intact.
  expect(errors).toEqual([]);
});
