import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';

import { GTM_ID, SITE_LANG } from '@/utils/constants';
import { buildSiteMetadata, generateJsonLd, serializeJsonLd } from '@/utils/helpers';
import '@/styles/globals.css';

// Site-wide SEO lives here; metadataBase resolves relative URLs (canonical, og images)
export const metadata: Metadata = buildSiteMetadata();

export const viewport: Viewport = {
  // Lets the skins paint under notches/home bar; they pad with env(safe-area-inset-*)
  viewportFit: 'cover',
  colorScheme: 'light dark',
  // Browser UI tint, matching the default (raw-bw) skin background
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0b' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang={SITE_LANG}>
      <GoogleTagManager gtmId={GTM_ID} />
      <body>
        <noscript>
          <iframe
            title='google tag manager'
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
