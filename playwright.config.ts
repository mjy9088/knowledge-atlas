import {defineConfig} from '@playwright/test';

const excludedTestPaths=['**/node_modules/**','**/.git/**','**/.local/**','**/artifacts/**','**/dist/**','**/test-results/**','**/playwright-report/**','**/tools/studio/tests/browser/**'];
const standardTestIgnores=[...excludedTestPaths,'**/weekday-capture.spec.ts'];

export default defineConfig({
  testDir: '.',
  outputDir: './test-results/public',
  testMatch: '**/tests/browser/**/*.spec.ts',
  testIgnore: excludedTestPaths,
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
    {name: 'desktop', testIgnore:standardTestIgnores, use: {viewport: {width: 1920, height: 940}}},
    {name: 'compact-desktop', testIgnore:standardTestIgnores, use: {viewport: {width: 960, height: 540}}},
    {name: 'mobile', testIgnore:standardTestIgnores, use: {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
    // 1920×1080 physical capture at 200% scale: layout at 960×540 CSS pixels.
    {name:'youtube-200',testMatch:'**/tests/browser/weekday-capture.spec.ts',testIgnore:excludedTestPaths,use:{viewport:{width:960,height:540},deviceScaleFactor:2}},
  ],
});
