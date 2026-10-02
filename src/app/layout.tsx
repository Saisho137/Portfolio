import { GoogleTagManager } from '@next/third-parties/google';
import { ReactNode } from 'react';

import { BaseLayout } from '@/components/templates';
import { roboto } from '@/config/fonts';
import { GTM_ID, SITE_URL } from '@/utils/constants';
import { generateJsonLd, serializeJsonLd } from '@/utils/helpers';
import '@/styles/globals.scss';

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en-US' data-testid='root-html'>
      <GoogleTagManager gtmId={GTM_ID} />
      <head>
        <link rel='sitemap' type='application/xml' href={`${SITE_URL}/sitemap.xml`} />
      </head>
      <body className={`${roboto.variable}`}>
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
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
