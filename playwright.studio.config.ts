import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/studio-browser',workers:1,timeout:30_000,
  outputDir:'./test-results/studio',
  reporter:[['list'],['html',{outputFolder:'playwright-report/studio',open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4192',browserName:'chromium',screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'node --import tsx tools/studio/server.ts',url:'http://127.0.0.1:4192/',reuseExistingServer:false,env:{STUDIO_PORT:'4192',STUDIO_DATA_DIR:`artifacts/studio-browser-${process.pid}`}},
  projects:[{name:'studio-desktop',use:{viewport:{width:1440,height:1000}}},{name:'studio-mobile',use:{viewport:{width:390,height:844}}},{name:'studio-200',use:{viewport:{width:960,height:540},deviceScaleFactor:2}}]
});
