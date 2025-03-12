import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1.0
    }
  ];
}
