import { describe, expect, it } from 'vitest';

import { HOME_URL, SITE_URL } from '@/utils/constants';

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
  it('lists the canonical home URL without a per-build lastmod', () => {
    expect(sitemap()).toEqual([{ url: HOME_URL }]);
  });
});
