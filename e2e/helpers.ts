import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

import en from '../src/content/profile.en.json';
import es from '../src/content/profile.es.json';

export const LANGS = [
  { lang: 'en', path: '/', profile: en },
  { lang: 'es', path: '/es', profile: es }
] as const;

export const SKINS = ['raw-bw', 'raw-color', 'brutalist'] as const;
export type Skin = (typeof SKINS)[number];

export const THEMES = ['light', 'dark'] as const;

/** Elements only a lazy skin renders: proof that it finished loading */
const SKIN_MARKERS: Record<Exclude<Skin, 'raw-bw'>, string> = {
  'raw-color': '[data-t="body"]',
  brutalist: 'filter#brutalist-rough'
};

/** Picks a skin the way a visitor does: hover (prefetch) then click its radio */
export const selectSkin = async (page: Page, skin: Skin) => {
  if (skin === 'raw-bw') return;

  const radio = page.locator(`input[name="skin"][value="${skin}"]`);
  await page.locator('label', { has: radio }).hover();
  // Not check(): the radio only turns checked once the skin chunk has loaded
  await radio.click();
  await expect(radio).toBeChecked();
  await expect(page.locator(SKIN_MARKERS[skin])).toBeAttached();
};

/** Full axe run, contrast included (the part jsdom can't check) */
export const expectNoAxeViolations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();

  expect(violations.map(({ id, nodes }) => `${id} (${nodes.length})`)).toEqual([]);
};
