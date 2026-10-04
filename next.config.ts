import type { NextConfig } from 'next';

import { DEFAULT_LOCALE } from './src/i18n/config';
import { LEGACY_HOST, SITE_URL } from './src/utils/constants/site';

// No trailingSlash: it forced a 308 on extensionless routes such as the generated
// /opengraph-image, which Next references without the slash in og:image
const nextConfig: NextConfig = {
  // The root layout lives under [lang]: unmatched URLs need app/global-not-found.tsx
  // to get a full document (with <html lang>) instead of Next's bare fallback
  experimental: { globalNotFound: true },
  // The old Vercel domain is indexed by Google: 308 every path to the new one so
  // rankings and links carry over. Vercel applies this at the edge, no function runs.
  redirects() {
    const fromLegacy = [{ type: 'host' as const, value: LEGACY_HOST }];

    return Promise.resolve([
      // Root straight to the canonical home URL
      { source: '/', has: fromLegacy, destination: `${SITE_URL}/`, permanent: true },
      {
        source: '/:path*',
        has: fromLegacy,
        destination: `${SITE_URL}/:path*`,
        permanent: true
      },
      // The default language lives at `/` (the URL Google already indexed): its prefixed
      // twin would be duplicate content. Only the page; /en/opengraph-image/... stays
      { source: `/${DEFAULT_LOCALE}`, destination: '/', permanent: true }
    ]);
  },
  // `/` serves the prerendered default-language page; applied at the edge, no function
  rewrites() {
    return Promise.resolve({
      beforeFiles: [{ source: '/', destination: `/${DEFAULT_LOCALE}` }],
      afterFiles: [],
      fallback: []
    });
  }
};

export default nextConfig;
