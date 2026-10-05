import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
/** Set BASE_URL to test a deployed site (preview, production) instead of a local build */
const remoteUrl = process.env.BASE_URL;
const baseURL = remoteUrl ?? `http://localhost:${PORT}`;

/**
 * Real-browser checks that jsdom can't do (layout, contrast, navigation, no-JS, Lighthouse).
 * Uses the installed Chrome (`channel: 'chrome'`): no Playwright browser download.
 * Run `npm run build` first: the local server is `next start`, as in production.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      testIgnore: /(touch|lighthouse)\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    {
      name: 'mobile',
      testMatch: /touch\.spec\.ts$/,
      use: { ...devices['Pixel 7'], channel: 'chrome' }
    },
    {
      // Launches its own Chrome for Lighthouse: no browser fixture needed
      name: 'lighthouse',
      testMatch: /lighthouse\.spec\.ts$/
    }
  ],
  webServer: remoteUrl
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true
      }
});
