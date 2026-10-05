import { expect, type Locator, test } from '@playwright/test';

const filterOf = (element: Locator) => element.evaluate((node) => getComputedStyle(node).filter);

// Runs in the `mobile` project: touch screen, so (hover: none)
test.describe('screenshots on touch screens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
  });

  test('turn to color while crossing the middle of the viewport', async ({ page }) => {
    expect(await page.evaluate(() => matchMedia('(hover: none)').matches)).toBe(true);
    const shot = page.locator('#work img').first();

    await shot.evaluate((node) => node.scrollIntoView({ block: 'end' }));
    expect(await filterOf(shot)).toContain('grayscale');

    await shot.evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await expect.poll(() => filterOf(shot)).toBe('none');
  });

  test('stay in color with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const shot = page.locator('#work img').first();

    await shot.evaluate((node) => node.scrollIntoView({ block: 'end' }));

    expect(await filterOf(shot)).toBe('none');
  });
});
