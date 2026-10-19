import {defineConfig} from '@playwright/test';
const studioPort=process.env['STUDIO_TEST_PORT']??'4192';
if(!/^\d+$/.test(studioPort)||Number(studioPort)<1024||Number(studioPort)>65535)throw new RangeError('STUDIO_TEST_PORT must be a port from 1024 to 65535');
const studioUrl=`http://127.0.0.1:${studioPort}`;
export default defineConfig({
  testDir:'./tests/studio-browser',workers:1,timeout:30_000,
  outputDir:'./test-results/studio',
  reporter:[['list'],['html',{outputFolder:'playwright-report/studio',open:'never'}]],
  use:{baseURL:studioUrl,browserName:'chromium',screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'node --import tsx tools/studio/server.ts',url:`${studioUrl}/`,reuseExistingServer:false,env:{STUDIO_PORT:studioPort,STUDIO_DATA_DIR:`artifacts/studio-browser-${process.pid}`}},
  projects:[{name:'studio-desktop',use:{viewport:{width:1440,height:1000}}},{name:'studio-mobile',use:{viewport:{width:390,height:844}}},{name:'studio-200',use:{viewport:{width:960,height:540},deviceScaleFactor:2}}]
});
