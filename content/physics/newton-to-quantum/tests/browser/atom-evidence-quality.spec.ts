import {expect,test} from '@playwright/test';
import {activeWork,detours,expectDetourReturn,expectLongformScene,expectReaderStateBoundary,openMainWorkScene} from '../../../../../tests/browser/support/main-work.js';

const work=activeWork('newton-to-quantum');
const scenes=['atomic-evidence','brownian-proxy','brownian-bridge'] as const;

test('atom evidence remains complete in the active mainline and Brownian detour',async({page})=>{
  // Given the active work that absorbed the retired atom reader.
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  // When every mapped evidence scene is opened from its real static route.
  for(const sceneId of scenes){await openMainWorkScene(page,work,sceneId);await expectLongformScene(page,work,sceneId);}
  await expectReaderStateBoundary(page,scenes.at(-1)??'brownian-bridge');
  const detour=detours(work).find(chapter=>chapter.id==='unseen-matter');
  if(!detour)throw new TypeError('Missing unseen-matter detour');
  await expectDetourReturn(page,work,detour);
  // Then full source copy, evidence cards, controls, restoration, and return remain operational.
  expect(errors).toEqual([]);
});
