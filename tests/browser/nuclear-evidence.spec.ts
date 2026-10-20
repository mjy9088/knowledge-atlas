import {test} from '@playwright/test';
import {expectRetiredRoute} from './support/main-work.js';

test('nuclear constituents screen is deliberately retired without leaving process controls',async({page,request})=>{
  // Given the retired interactive proton-process route.
  // When it is requested directly and the not-found catalog link is used.
  await expectRetiredRoute(page,request,'/knowledge/nuclear-constituents/#proton','.nuclear-evidence,[data-stage],#reader-controls');
  // Then the route is a real 404 and no obsolete staged process remains executable.
});
