import type { MetadataRoute } from 'next';

import { HOME_URL } from '@/utils/constants';

/**
 * Same URL as the canonical. No lastModified: a date that changes on
 * every build is inaccurate, and Google ignores lastmod once it proves unreliable.
 * changefreq/priority are left out too, Google ignores them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: HOME_URL }];
}
