import { type Browser, chromium, expect, test } from '@playwright/test';
import lighthouse, { desktopConfig, type Config } from 'lighthouse';

import { LANGS } from './helpers';

/**
 * Accessibility, best practices, SEO and agentic browsing must score 100 in every mode.
 * Performance gets a margin: measured from one machine it moves with the network (the
 * same production deploy scores 95–100 in back-to-back runs), so an exact 100 would fail
 * on noise. Real regressions drop well below the threshold.
 * - LH_STRICT=1 (npm run test:lighthouse, against production): median of 3 runs, ≥ 95
 * - Default (local `next start`, 1 run): ≥ 90, capped by the missing CDN
 * LH_MIN_PERFORMANCE overrides the threshold (0–1).
 */
const STRICT = process.env.LH_STRICT === '1';
const RUNS = STRICT ? 3 : 1;
const MIN_PERFORMANCE = Number(process.env.LH_MIN_PERFORMANCE ?? (STRICT ? 0.95 : 0.9));
const DEBUGGING_PORT = 9333;

const FORM_FACTORS = [
  { name: 'mobile', config: undefined },
  { name: 'desktop', config: desktopConfig }
] as const;

// One Chrome on a fixed debugging port: run in order, in a single worker. Unlike
// `serial`, a failed audit doesn't skip the rest
test.describe.configure({ mode: 'default' });

let browser: Browser;

test.beforeAll(async () => {
  browser = await chromium.launch({
    channel: 'chrome',
    args: [`--remote-debugging-port=${DEBUGGING_PORT}`]
  });
});

test.afterAll(async () => {
  await browser.close();
});

const audit = async (url: string, config?: Config) => {
  const result = await lighthouse(
    url,
    { port: DEBUGGING_PORT, output: 'json', logLevel: 'error' },
    config
  );

  return Object.fromEntries(
    Object.values(result?.lhr.categories ?? {}).map(({ id, score }) => [id, score ?? 0])
  );
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};

for (const { lang, path } of LANGS) {
  for (const { name, config } of FORM_FACTORS) {
    test(`Lighthouse ${name} in "${lang}"`, async ({ baseURL }) => {
      test.setTimeout(RUNS * 60_000);
      const url = new URL(path, baseURL).href;

      const runs: Record<string, number>[] = [];
      for (let run = 0; run < RUNS; run += 1) runs.push(await audit(url, config));

      const scores = Object.fromEntries(
        Object.keys(runs[0] ?? {}).map((id) => [id, median(runs.map((run) => run[id] ?? 0))])
      );
      const { performance = 0, ...rest } = scores;
      // The real scores, visible even when the test passes
      // eslint-disable-next-line no-console
      console.log(`${name} ${path}: ${JSON.stringify(scores)} (median of ${RUNS})`);

      expect(performance, `performance in ${JSON.stringify(runs)}`).toBeGreaterThanOrEqual(
        MIN_PERFORMANCE
      );
      Object.entries(rest).forEach(([category, score]) => expect(score, category).toBe(1));
    });
  }
}
