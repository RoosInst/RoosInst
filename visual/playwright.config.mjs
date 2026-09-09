import { defineConfig } from '@playwright/test';

/**
 * Baseline is captured from the live site; comparisons run against a local
 * build. Same spec, different origin -- run.mjs sets VISUAL_BASE_URL.
 */
const baseURL = (process.env.VISUAL_BASE_URL ?? 'https://roos.com').replace(/\/$/, '');

/** One project per breakpoint. Bootstrap 3 switches at 768 and 992. */
const viewports = {
  w375: { width: 375, height: 812 },   // xs -- phone
  w768: { width: 768, height: 1024 },  // sm -- tablet, nav collapses
  w1440: { width: 1440, height: 900 }, // lg -- desktop
};

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.mjs',
  fullyParallel: true,
  // Deliberately low. Capturing 162 shots against the production site with
  // more workers changes how fast its assets arrive, and the baseline then
  // disagrees with a quieter comparison run over text antialiasing.
  workers: Number(process.env.VISUAL_WORKERS ?? 2),
  timeout: 120_000,
  retries: 1, // one retry absorbs a flaky third-party load, not a real diff

  snapshotPathTemplate: 'baseline/{projectName}/{arg}{ext}',

  expect: {
    // The stabilisation loop needs room: this site keeps mutating its DOM for
    // well over a second after load.
    timeout: 20_000,
    toHaveScreenshot: {
      // ~0.2% of pixels. Tight enough to catch a shifted section, loose
      // enough to survive font antialiasing between runs.
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  reporter: [['list'], ['html', { outputFolder: 'report', open: 'never' }]],

  use: {
    baseURL,
    reducedMotion: 'reduce',
    colorScheme: 'light',
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
    ignoreHTTPSErrors: true,
    screenshot: 'off',
    trace: 'retain-on-failure',
  },

  projects: Object.entries(viewports).map(([name, viewport]) => ({
    name,
    use: { browserName: 'chromium', viewport, deviceScaleFactor: 1, isMobile: false },
  })),
});
