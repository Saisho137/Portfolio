// Relative on purpose: next.config.ts imports this file and can't resolve the `@/` alias
import { SITE_URL } from '../utils/constants/site';

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

/** Served at `/` without prefix: the URL Google already indexed. Also the x-default */
export const DEFAULT_LOCALE: Locale = 'en';

export const hasLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Endonyms: each language is named in itself, so anyone can find theirs */
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', es: 'es_CO' };

export const otherLocales = (lang: Locale): Locale[] => LOCALES.filter((locale) => locale !== lang);

/** Public path of a locale's home: `/` for the default, `/es` for the rest */
export const localePath = (lang: Locale) => (lang === DEFAULT_LOCALE ? '/' : `/${lang}`);

/** Pages besides each language's home, by their path segment */
export const PAGES = { privacy: 'privacy' } as const;
export type Page = (typeof PAGES)[keyof typeof PAGES];

/** Public path of a page: unprefixed in the default language (`/privacy`, `/es/privacy`) */
export const pagePath = (lang: Locale, page: Page) =>
  lang === DEFAULT_LOCALE ? `/${page}` : `/${lang}/${page}`;

/** hreflang map of a page, like languageAlternates() for the home */
export const pageAlternates = (page: Page): Record<string, string> => ({
  ...Object.fromEntries(LOCALES.map((locale) => [locale, `${SITE_URL}${pagePath(locale, page)}`])),
  'x-default': `${SITE_URL}${pagePath(DEFAULT_LOCALE, page)}`
});

/** Absolute canonical URL; no trailing slash on the root, as Next prints it */
export const localeUrl = (lang: Locale) =>
  lang === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${localePath(lang)}`;

/** hreflang map shared by <link rel="alternate">, the sitemap and nothing else */
export const languageAlternates = (): Record<string, string> => ({
  ...Object.fromEntries(LOCALES.map((locale) => [locale, localeUrl(locale)])),
  'x-default': localeUrl(DEFAULT_LOCALE)
});

export interface LanguageLink {
  locale: Locale;
  href: string;
  name: string;
  current: boolean;
}

/** Plain links (work without JS): every skin renders them with its own markup */
export const getLanguageLinks = (lang: Locale): LanguageLink[] =>
  LOCALES.map((locale) => ({
    locale,
    href: localePath(locale),
    name: LOCALE_NAMES[locale],
    current: locale === lang
  }));
