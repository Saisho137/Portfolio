import { expect, test } from '@playwright/test';

import { LANGS } from './helpers';

test.describe('routes', () => {
  for (const { lang, path, profile } of LANGS) {
    test(`serves the "${lang}" page at ${path}`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      // Accessible name: raw-bw wraps the name in decorative (aria-hidden) brackets
      await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(profile.name);
    });
  }

  test('folds the prefixed default language into / with a permanent redirect', async ({
    request
  }) => {
    const response = await request.get('/en', { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location ?? '', 'http://x').pathname).toBe('/');
  });

  for (const path of ['/fr', '/es/nope']) {
    test(`answers ${path} with a bilingual 404 that has a language`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
      await expect(page.getByRole('link', { name: /Ir al inicio/ })).toHaveAttribute('href', '/es');
    });
  }

  test('lists both languages with hreflang in the sitemap', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();

    expect(sitemap.match(/<loc>/g)).toHaveLength(2);
    expect(sitemap).toContain('hreflang="x-default"');
  });
});
