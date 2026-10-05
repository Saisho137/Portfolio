import { test } from '@playwright/test';

import { expectNoAxeViolations, LANGS, selectSkin, SKINS, THEMES } from './helpers';

// Contrast differs per skin palette and theme, so every combination is scanned
for (const { lang, path } of LANGS) {
  for (const skin of SKINS) {
    for (const colorScheme of THEMES) {
      test(`${skin} in "${lang}" (${colorScheme}) has no axe violations`, async ({ page }) => {
        await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
        await page.goto(path);
        await selectSkin(page, skin);

        await expectNoAxeViolations(page);
      });
    }
  }
}
