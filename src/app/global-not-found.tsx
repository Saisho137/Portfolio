import type { Metadata } from 'next';

import { getLanguageLinks } from '@/i18n/config';
import { THEME_INIT_SCRIPT } from '@/utils/theme';

// globals.css first: its @layer order must be the first one the browser sees, and this
// file's CSS ships with every page (the module below would otherwise register `skin` first)
import '@/styles/globals.css';

import styles from './global-not-found.module.css';

export const metadata: Metadata = {
  title: '404 — Page not found / Página no encontrada'
};

/**
 * Unmatched URLs never reach the [lang] root layout, so this page owns <html> and
 * can't know the visitor's language: it speaks both, each tagged with its `lang`.
 */
export default function GlobalNotFound() {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main className={styles.page}>
          <h1 className={styles.code}>404</h1>
          <p>This page doesn&apos;t exist.</p>
          <p lang='es'>Esta página no existe.</p>
          <ul className={styles.links}>
            {getLanguageLinks('en').map(({ locale, href, name }) => (
              <li key={locale}>
                <a href={href} hrefLang={locale} lang={locale}>
                  {locale === 'en' ? 'Go to the home page' : 'Ir al inicio'} ({name})
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
