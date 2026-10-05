import type { NextConfig } from 'next';

import { DEFAULT_LOCALE, PAGES } from './src/i18n/config';
import { LEGACY_HOST, SITE_URL } from './src/utils/constants/site';

/**
 * Hardening that can't break the page. No script-src: on a prerendered page Next's inline
 * scripts (and GA) would need 'unsafe-inline', so it would add nothing against XSS.
 * These still forbid framing (clickjacking), plugins, <base> hijacking and form posts.
 */
const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'none'"
  },
  // frame-ancestors for browsers without CSP level 2
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
];

// No trailingSlash: it forced a 308 on extensionless routes such as the generated
// /opengraph-image, which Next references without the slash in og:image
const nextConfig: NextConfig = {
  // The root layout lives under [lang]: unmatched URLs need app/global-not-found.tsx
  // to get a full document (with <html lang>) instead of Next's bare fallback
  experimental: { globalNotFound: true },
  // Every response, static files included. Vercel applies them at the edge
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: SECURITY_HEADERS }]);
  },
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
      { source: `/${DEFAULT_LOCALE}`, destination: '/', permanent: true },
      // Same for the other pages of the default language: /en/privacy → /privacy
      ...Object.values(PAGES).map((page) => ({
        source: `/${DEFAULT_LOCALE}/${page}`,
        destination: `/${page}`,
        permanent: true
      }))
    ]);
  },
  // `/` (and /privacy) serve the prerendered default-language pages; applied at the edge
  rewrites() {
    return Promise.resolve({
      beforeFiles: [
        { source: '/', destination: `/${DEFAULT_LOCALE}` },
        ...Object.values(PAGES).map((page) => ({
          source: `/${page}`,
          destination: `/${DEFAULT_LOCALE}/${page}`
        }))
      ],
      afterFiles: [],
      fallback: []
    });
  }
};

export default nextConfig;
