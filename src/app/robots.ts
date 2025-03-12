import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    host: 'https://portfolio-six-blond-30.vercel.app',
    sitemap: 'https://portfolio-six-blond-30.vercel.app/sitemap.xml',
    rules: {
      userAgent: '*',
      allow: '/'
    }
  };
}
