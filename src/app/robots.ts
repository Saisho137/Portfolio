import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/utils/constants';

// Everything is public, AI crawlers included (blocking them drops the site from their citations)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
