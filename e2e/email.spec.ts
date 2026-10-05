import { expect, type Page, test } from '@playwright/test';

import { LANGS, selectSkin, SKINS } from './helpers';

const [, es] = LANGS;
const EMAIL = es.profile.links.email;

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

/** Position and size of every element in the contact section, except the toast itself */
const contactLayout = (page: Page) =>
  page.locator('#contact *:not([role="status"])').evaluateAll((nodes) =>
    nodes.map((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return [x, y, width, height].map(Math.round).join(',');
    })
  );

for (const skin of SKINS) {
  test(`${skin}: clicking the email copies it with a toast that moves nothing`, async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(es.path);
    await selectSkin(page, skin);
    const email = page.locator('#contact a[href^="mailto:"]');
    await email.scrollIntoViewIfNeeded();
    // Lazy skins fetch their fonts on demand: over the network they swap in late and
    // would move the layout between both measurements, toast or not
    await page.evaluate(() => document.fonts.ready);
    const before = await contactLayout(page);

    await email.click();

    const toast = page.getByRole('status').filter({ hasText: 'Correo copiado' });
    await expect(toast).toBeInViewport();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
    expect(page.url()).not.toContain('mailto:');
    expect(await contactLayout(page)).toEqual(before);
    await expect(toast).toBeHidden({ timeout: 4000 });
  });
}
