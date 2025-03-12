import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portfolio | Santiago Betancur Duque',
    short_name: 'Portfolio',
    description: 'My personal portfolio as a Frontend Developer',
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#191A23',
    theme_color: '#B9FF66',
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ]
  };
}
