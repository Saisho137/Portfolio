import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/utils/constants';

import robots from './robots';
import sitemap from './sitemap';

describe('robots.txt', () => {
  it('allows everything and points to the sitemap on the site domain', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${SITE_URL}/sitemap.xml`
    });
  });
});

describe('sitemap.xml', () => {
  it('lists each language canonical with every hreflang version, without lastmod', () => {
    const languages = { en: SITE_URL, es: `${SITE_URL}/es`, 'x-default': SITE_URL };

    expect(sitemap()).toEqual([
      { url: SITE_URL, alternates: { languages } },
      { url: `${SITE_URL}/es`, alternates: { languages } }
    ]);
  });
});
