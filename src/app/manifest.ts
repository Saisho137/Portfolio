import type { MetadataRoute } from 'next';

import { getProfile } from '@/content';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { getSiteTitle } from '@/utils/helpers';

// One manifest for the whole site, in the default language (it starts at `/`).
// Colors of the default (raw-bw) skin. No `orientation`: locking it fails WCAG 1.3.4
export default function manifest(): MetadataRoute.Manifest {
  const profile = getProfile(DEFAULT_LOCALE);

  return {
    name: getSiteTitle(profile),
    short_name: profile.name.split(' ')[0],
    description: profile.summary,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0b0b0b',
    theme_color: '#0b0b0b',
    lang: DEFAULT_LOCALE,
    dir: 'ltr',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      // Full-bleed background with the glyph in the safe zone: valid as maskable too
      { src: '/icon1.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon2.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon2.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
