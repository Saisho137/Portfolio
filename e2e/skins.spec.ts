import { expect, type Page, test } from '@playwright/test';

import { LANGS, selectSkin } from './helpers';

/** Bodies of every script chunk the page downloads from now on */
const collectScripts = (page: Page) => {
  const scripts: Promise<string>[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') scripts.push(response.text());
  });

  return () => Promise.all(scripts);
};

for (const { lang, path, profile } of LANGS) {
  const other = LANGS.find((item) => item.lang !== lang);

  test(`lazy skins load only the "${lang}" content`, async ({ page }) => {
    const scripts = collectScripts(page);
    await page.goto(path);

    await selectSkin(page, 'brutalist');
    await selectSkin(page, 'raw-color');

    const bodies = (await scripts()).join('\n');
    expect(bodies).toContain(profile.summary);
    expect(bodies).not.toContain(other?.profile.summary);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(profile.name);
  });
}

test('keeps the server skin when going back to raw-bw', async ({ page }) => {
  await page.goto('/');
  await selectSkin(page, 'brutalist');

  await page.locator('input[name="skin"][value="raw-bw"]').click();

  await expect(page.locator('[data-el="h1"]')).toBeVisible();
  await expect(page.getByText('Style: Raw HTML, black and white')).toBeAttached();
});
