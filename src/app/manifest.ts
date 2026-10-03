import type { MetadataRoute } from 'next';

import { profile } from '@/content';
import { SITE_DESCRIPTION, SITE_LANG, SITE_TITLE } from '@/utils/constants';

// Colors of the default (raw-bw) skin. No `orientation`: locking it fails WCAG 1.3.4
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: profile.name.split(' ')[0],
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0b0b0b',
    theme_color: '#0b0b0b',
    lang: SITE_LANG,
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
