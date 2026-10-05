import type { MetadataRoute } from 'next';

import { languageAlternates, LOCALES, localeUrl } from '@/i18n/config';
import { getContentUpdatedAt } from '@/utils/helpers/contentDate';

/**
 * One entry per language, each listing every version (hreflang + x-default), with the
 * same URLs as the canonicals. lastModified is the last commit that changed the content,
 * never the build date: one that changes on every deploy is inaccurate, and Google
 * ignores lastmod once it proves unreliable. Unknown date: no lastmod.
 * changefreq/priority are left out, Google ignores them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();
  const lastModified = getContentUpdatedAt();

  return LOCALES.map((lang) => ({
    url: localeUrl(lang),
    ...(lastModified && { lastModified }),
    alternates: { languages }
  }));
}
