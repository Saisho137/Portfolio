import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { getDictionary } from '@/i18n/dictionaries';
import { GTM_ID } from '@/utils/constants';
import { buildSiteMetadata, generateJsonLd, serializeJsonLd } from '@/utils/helpers';
import { THEME_COLORS, THEME_INIT_SCRIPT } from '@/utils/theme';

import { generateLangParams, type LangParams, resolveLang } from './params';

import '@/styles/globals.css';

export const generateStaticParams = generateLangParams;
export const dynamicParams = false;

// Site-wide SEO lives here; metadataBase resolves relative URLs (canonical, og images)
export const generateMetadata = async (props: LangParams): Promise<Metadata> =>
  buildSiteMetadata(await resolveLang(props));

export const viewport: Viewport = {
  // Lets the skins paint under notches/home bar; they pad with env(safe-area-inset-*)
  viewportFit: 'cover',
  colorScheme: 'light dark',
  // Browser UI tint, matching the default (raw-bw) skin background. ThemeToggle and
  // THEME_INIT_SCRIPT repaint these when the theme is chosen manually
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark }
  ]
};

export default async function RootLayout({
  children,
  ...props
}: Readonly<LangParams & { children: ReactNode }>) {
  const lang = await resolveLang(props);
  const dict = getDictionary(lang);

  return (
    // suppressHydrationWarning: THEME_INIT_SCRIPT sets data-theme on <html> before React
    // hydrates. It only covers this element's attributes, not its children
    <html lang={lang} suppressHydrationWarning>
      <GoogleTagManager gtmId={GTM_ID} />
      <head>
        {/* Blocking on purpose: must run before first paint to avoid a theme flash */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a className='skip-link' href='#main'>
          {dict.skipLink}
        </a>
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateJsonLd(lang)) }}
        />
        {children}
      </body>
    </html>
  );
}
