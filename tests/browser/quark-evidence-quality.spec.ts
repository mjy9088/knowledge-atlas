import {test} from '@playwright/test';
import {expectRetiredRoute} from './support/main-work.js';

test('quark evidence screen is deliberately retired without leaving old controls',async({page,request})=>{
  // Given a public route that is outside the five active works.
  // When the retired quark screen is requested and its catalog return is followed.
  await expectRetiredRoute(page,request,'/knowledge/quark-evidence/','.quark-evidence,#reader-controls');
  // Then HTTP status, absent controls, and the active catalog boundary are all verified by the helper.
});
