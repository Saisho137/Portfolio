import { describe, expect, it } from 'vitest';

import nextConfig from '../next.config';

describe('next.config', () => {
  it('308s every path of the old Vercel domain to the same path on the new one', async () => {
    const [root, rest] = (await nextConfig.redirects?.()) ?? [];

    expect(root).toMatchObject({
      source: '/',
      destination: 'https://santiago-betancur-duque.vercel.app/',
      permanent: true,
      has: [{ type: 'host', value: 'portfolio-six-blond-30.vercel.app' }]
    });
    expect(rest).toMatchObject({
      source: '/:path*',
      destination: 'https://santiago-betancur-duque.vercel.app/:path*',
      permanent: true
    });
  });

  it('serves the default language at `/` and folds its prefixed URL into it', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const rewrites = await nextConfig.rewrites?.();

    expect(redirects).toContainEqual({ source: '/en', destination: '/', permanent: true });
    expect(rewrites).toMatchObject({ beforeFiles: [{ source: '/', destination: '/en' }] });
  });
});
