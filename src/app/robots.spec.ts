import { describe, expect, it, vi } from 'vitest';

import { SITE_URL } from '@/utils/constants';

import robots from './robots';
import sitemap from './sitemap';

const getContentUpdatedAt = vi.hoisted(() => vi.fn<() => string | undefined>());
vi.mock('@/utils/helpers/contentDate', () => ({ getContentUpdatedAt }));

describe('robots.txt', () => {
  it('allows everything and points to the sitemap on the site domain', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${SITE_URL}/sitemap.xml`
    });
  });
});

describe('sitemap.xml', () => {
  const languages = { en: SITE_URL, es: `${SITE_URL}/es`, 'x-default': SITE_URL };

  it('lists each language canonical with every hreflang version and the content date', () => {
    getContentUpdatedAt.mockReturnValue('2026-10-04T21:00:00-05:00');

    expect(sitemap()).toEqual([
      { url: SITE_URL, lastModified: '2026-10-04T21:00:00-05:00', alternates: { languages } },
      {
        url: `${SITE_URL}/es`,
        lastModified: '2026-10-04T21:00:00-05:00',
        alternates: { languages }
      }
    ]);
  });

  it('leaves lastmod out when the content date is unknown, never the build date', () => {
    getContentUpdatedAt.mockReturnValue(undefined);

    expect(sitemap().every((entry) => !('lastModified' in entry))).toBe(true);
  });
});
