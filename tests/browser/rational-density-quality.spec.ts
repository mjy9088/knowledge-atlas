import {expect,test} from '@playwright/test';
import {activeWork,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from './support/main-work.js';

const work=activeWork('number-structures');
const scenes=['local-vs-global','archimedean-consequence'] as const;

test('density remains distinguished from completeness and derived by an Archimedean mesh',async({page})=>{
  // Given the active global-structure chapter and uniqueness detour consequence.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When both mapped density scenes are loaded from the current public article.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,'archimedean-consequence');
  // Then local/global scope, the rational-grid construction, and deterministic state remain asserted.
  expect(errors).toEqual([]);
});
