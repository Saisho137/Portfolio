import { expect, test } from '@playwright/test';

import { LANGS } from './helpers';

const SITE_URL = 'https://santiago-betancur-duque.vercel.app';
const CANONICALS = { en: SITE_URL, es: `${SITE_URL}/es` };

for (const { lang, path, profile } of LANGS) {
  test.describe(`SEO head in "${lang}"`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('has its title, canonical and every hreflang version', async ({ page }) => {
      await expect(page).toHaveTitle(`${profile.name} — ${profile.role}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', CANONICALS[lang]);

      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('hreflang')));
      expect(alternates.sort()).toEqual(['en', 'es', 'x-default']);
    });

    test('serves a social image in its language', async ({ page, request }) => {
      const image = await page.locator('meta[property="og:image"]').getAttribute('content');
      const response = await request.get(new URL(image ?? '').pathname);

      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
        'content',
        `${profile.name} — ${profile.role}`
      );
      expect(response.headers()['content-type']).toBe('image/png');
    });

    test('describes the page with valid JSON-LD in its language', async ({ page }) => {
      const json = await page.locator('script[type="application/ld+json"]').textContent();
      const { '@graph': graph } = JSON.parse(json ?? '{}') as {
        '@graph': { '@type': string; inLanguage?: string }[];
      };

      expect(graph.find((node) => node['@type'] === 'ProfilePage')?.inLanguage).toBe(lang);
    });
  });
}
