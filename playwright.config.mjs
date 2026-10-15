import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL: 'http://127.0.0.1:4190',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/build-site.mjs && node scripts/serve-static.mjs',
    url: 'http://127.0.0.1:4190/lesson.html',
    env: {PORT: '4190'},
    reuseExistingServer: false,
  },
  projects: [
    {name: 'fhd', use: {viewport: {width: 1920, height: 1080}}},
    {name: 'desktop', use: {viewport: {width: 1920, height: 940}}},
    {name: 'compact-desktop', use: {viewport: {width: 1920, height: 900}}},
    {name: 'mobile', use: {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
  ],
});
