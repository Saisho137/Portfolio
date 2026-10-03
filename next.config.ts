import type { NextConfig } from 'next';

import { LEGACY_HOST, SITE_URL } from './src/utils/constants/site';

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The old Vercel domain is indexed by Google: 308 every path to the new one so
  // rankings and links carry over. Vercel applies this at the edge, no function runs.
  redirects() {
    const fromLegacy = [{ type: 'host' as const, value: LEGACY_HOST }];

    return Promise.resolve([
      // Root straight to the canonical URL (trailing slash) to avoid a second hop
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
