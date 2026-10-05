import { expect, test } from '@playwright/test';

import { LANGS } from './helpers';

test.use({ javaScriptEnabled: false });

test('serves the whole profile and working language links without JavaScript', async ({ page }) => {
  const [en, es] = LANGS;
  await page.goto(en.path);

  // The settings bar can't work without JS, so it hides
  await expect(page.getByRole('complementary')).toBeHidden();
  await expect(page.getByText(en.profile.summary)).toBeVisible();

  await page.locator('a[hreflang="es"]').first().click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.getByText(es.profile.summary)).toBeVisible();

  await page.locator('a[hreflang="en"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
