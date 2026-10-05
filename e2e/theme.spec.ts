import { expect, type Page, test } from '@playwright/test';

const firstThemeColor = (page: Page) =>
  page.locator('meta[name="theme-color"]').first().getAttribute('content');

test('applies, persists and paints the browser UI with the chosen theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/es');
  expect(await firstThemeColor(page)).toBe('#f2f2f0');

  await page.getByRole('button', { name: 'Cambiar a tema oscuro' }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await firstThemeColor(page)).toBe('#0b0b0b');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Cambiar a tema claro' })).toBeVisible();
  expect(await firstThemeColor(page)).toBe('#0b0b0b');
});
