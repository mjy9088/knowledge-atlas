import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results/public',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  reporter: [['list'], ['html', {open: 'never',outputFolder:'playwright-report/public'}]],
  use: {
    baseURL: 'http://127.0.0.1:4190',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [{
    command: 'node --import tsx scripts/build-site.ts && node --import tsx scripts/serve-static.ts',
    url: 'http://127.0.0.1:4190/knowledge/',
    env: {PORT: '4190'},
    reuseExistingServer: false,
  },{
    command: 'node --import tsx scripts/dev-server.ts',
    url: 'http://127.0.0.1:4191/tools/media/',
    env: {PORT:'4191'},
    reuseExistingServer: false,
  }],
  projects: [
    {name: 'fhd', testIgnore:'**/weekday-capture.spec.ts', use: {viewport: {width: 1920, height: 1080}}},
    {name: 'desktop', testIgnore:'**/weekday-capture.spec.ts', use: {viewport: {width: 1920, height: 940}}},
    {name: 'compact-desktop', testIgnore:'**/weekday-capture.spec.ts', use: {viewport: {width: 1920, height: 900}}},
    {name: 'mobile', testIgnore:'**/weekday-capture.spec.ts', use: {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
    // 1920×1080 physical capture at 200% scale: layout at 960×540 CSS pixels.
    {name:'youtube-200',testMatch:'**/weekday-capture.spec.ts',use:{viewport:{width:960,height:540},deviceScaleFactor:2}},
  ],
});
