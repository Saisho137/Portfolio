import type { MetadataRoute } from 'next';

import { languageAlternates, LOCALES, localeUrl } from '@/i18n/config';

/**
 * One entry per language, each listing every version (hreflang + x-default), with the
 * same URLs as the canonicals. No lastModified: a date that changes on every build is
 * inaccurate, and Google ignores lastmod once it proves unreliable.
 * changefreq/priority are left out too, Google ignores them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();

  return LOCALES.map((lang) => ({ url: localeUrl(lang), alternates: { languages } }));
}
