import { expect, type Page, test } from '@playwright/test';

import { LANGS, selectSkin, SKINS, THEMES } from './helpers';

/**
 * Pixel snapshots of every skin × theme × language, plus the privacy notice: the CSS
 * regressions that axe and the unit tests can't see. Baselines depend on the platform's
 * font rendering (hence the -darwin suffix). After an intended visual change:
 * `npm run test:visual -- --update-snapshots`, then review the new PNGs before committing.
 */

// Same year in every run: the footer would change the snapshots every January
const FIXED_NOW = new Date('2026-06-01T12:00:00Z');

const prepare = async (page: Page, theme: (typeof THEMES)[number]) => {
  await page.clock.setFixedTime(FIXED_NOW);
  // Reduced motion: no View Transition when switching skins, no scanline drift
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
};

/**
 * The grain/static overlays (pseudo-elements of each skin's root, a direct child of body)
 * are noise: about a third of every baseline's weight in incompressible pixels, and they
 * say nothing about layout, so the snapshots leave them out.
 */
const HIDE_OVERLAYS =
  'body > div:has(main)::before, body > div:has(main)::after { display: none !important; }';

/** next/image lazy-loads below the fold: load every image before the full-page shot */
const settle = async (page: Page) => {
  await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
    Promise.all(
      images.map((image) => {
        image.loading = 'eager';
        return image.decode().catch(() => undefined);
      })
    )
  );
  await page.addStyleTag({ content: HIDE_OVERLAYS });
  await page.evaluate(() => document.fonts.ready);
};

// No pixel tolerance: same machine, same pixels. A few-pixel change (a list marker) is a regression
const SHOT = { fullPage: true, animations: 'disabled' } as const;

for (const { lang, path } of LANGS) {
  for (const skin of SKINS) {
    for (const theme of THEMES) {
      test(`${skin} looks the same in ${theme} "${lang}"`, async ({ page }) => {
        await prepare(page, theme);
        await page.goto(path);
        await selectSkin(page, skin);
        await settle(page);

        await expect(page).toHaveScreenshot(`${skin}-${theme}-${lang}.png`, SHOT);
      });
    }
  }

  test(`the privacy notice looks the same in "${lang}"`, async ({ page }) => {
    await prepare(page, 'light');
    await page.goto(lang === 'en' ? '/privacy' : '/es/privacy');
    await settle(page);

    await expect(page).toHaveScreenshot(`privacy-${lang}.png`, SHOT);
  });
}
