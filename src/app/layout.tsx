import Script from 'next/script';
import { ReactNode } from 'react';

import { BaseLayout } from '@/components/templates';
import { roboto } from '@/config/fonts';
import { SITE_URL } from '@/utils/constants';
import { generateJsonLd } from '@/utils/helpers';
import '@/styles/globals.scss';

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const jsonLd = generateJsonLd();

  return (
    <html lang='en-US' data-testid='root-html'>
      <head>
        <Script
          id='google-tag-manager'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KH8PJXT6');
          `
          }}
        />
        <Script
          id='json-ld'
          strategy='beforeInteractive'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
        />
        <link rel='sitemap' type='application/xml' href={`${SITE_URL}/sitemap.xml`} />
      </head>
      <body className={`${roboto.variable}`}>
        <noscript>
          <iframe
            title='google tag manager'
            src={`https://www.googletagmanager.com/ns.html?id=GTM-KH8PJXT6`}
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
