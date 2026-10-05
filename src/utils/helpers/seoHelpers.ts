import type { Metadata } from 'next';

import { getProfile, type Profile } from '@/content';
import {
  DEFAULT_LOCALE,
  languageAlternates,
  LOCALES,
  localeUrl,
  OG_LOCALES,
  otherLocales,
  type Locale
} from '@/i18n/config';
import { GOOGLE_SITE_VERIFICATION, SITE_URL } from '@/utils/constants';

export const getSiteTitle = ({ name, role }: Profile) => `${name} — ${role}`;

/**
 * Site-wide metadata for the [lang] root layout. og:image / twitter:image are not set
 * here: they come from the file-based [lang]/opengraph-image.tsx and twitter-image.tsx.
 */
export const buildSiteMetadata = (lang: Locale): Metadata => {
  const profile = getProfile(lang);
  const [firstName, ...lastNames] = profile.name.split(' ');
  const title = getSiteTitle(profile);
  const url = localeUrl(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${profile.name}` },
    description: profile.summary,
    applicationName: profile.name,
    authors: [{ name: profile.name, url }],
    creator: profile.name,
    // Absolute and identical to the sitemap <loc>; hreflang points to every version
    alternates: { canonical: url, languages: languageAlternates() },
    robots: { index: true, follow: true },
    verification: { google: GOOGLE_SITE_VERIFICATION },
    openGraph: {
      type: 'profile',
      firstName,
      lastName: lastNames.join(' '),
      url,
      siteName: profile.name,
      title,
      description: profile.summary,
      locale: OG_LOCALES[lang],
      alternateLocale: otherLocales(lang).map((locale) => OG_LOCALES[locale])
    },
    twitter: { card: 'summary_large_image', title, description: profile.summary }
  };
};

// Same entities in every language: only the page (and its texts) is per language
const PERSON_ID = `${SITE_URL}#person`;
const WEBSITE_ID = `${SITE_URL}#website`;

/** schema.org graph: the site, the profile page and the person it is about */
export const generateJsonLd = (lang: Locale) => {
  const profile = getProfile(lang);
  const url = localeUrl(lang);
  const [currentJob] = profile.experience;
  const [university] = profile.education;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: localeUrl(DEFAULT_LOCALE),
        name: profile.name,
        description: profile.summary,
        inLanguage: [...LOCALES],
        publisher: { '@id': PERSON_ID }
      },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profile`,
        url,
        name: getSiteTitle(profile),
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID }
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        url,
        jobTitle: profile.role,
        description: profile.summary,
        sameAs: [profile.links.github, profile.links.linkedin],
        knowsAbout: profile.skills.flatMap(({ items }) => items),
        ...(profile.links.email && { email: `mailto:${profile.links.email}` }),
        ...(currentJob && {
          worksFor: { '@type': 'Organization', name: currentJob.company, url: currentJob.url }
        }),
        ...(university && {
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: university.institution,
            url: university.url
          }
        })
      }
    ]
  };
};

// Escapes `<` so the payload can't close the <script> tag it lives in.
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');
