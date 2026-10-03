import type { NextConfig } from 'next';

import { LEGACY_HOST, SITE_URL } from './src/utils/constants/site';

// No trailingSlash: it forced a 308 on extensionless routes such as the generated
// /opengraph-image, which Next references without the slash in og:image
const nextConfig: NextConfig = {
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
      }
    ]);
  }
};

export default nextConfig;
