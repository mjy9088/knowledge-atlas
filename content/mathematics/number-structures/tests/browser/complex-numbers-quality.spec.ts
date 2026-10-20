import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('number-structures');
const scenes=['complex-pairs','rotation','ordered-field-contradiction','choice-of-properties'] as const;

test('complex pairs, rotation, and the order detour preserve their mathematical contracts',async({page})=>{
  // Given the active complex-number chapter and its ordered-field detour.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When each mapped scene and the complete detour are rendered from current metadata.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'choice-of-properties');
  const detour=detours(work).find(chapter=>chapter.id==='complex-order');
  if(!detour)throw new TypeError('Missing complex-order detour');
  await expectDetourReturn(page,work,detour);
  // Then pair operations, geometric rotation, both order branches, and return remain observable.
  expect(errors).toEqual([]);
});
