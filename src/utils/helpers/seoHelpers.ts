import type { Metadata } from 'next';

import { profile } from '@/content';
import {
  HOME_URL,
  OG_LOCALE,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_TITLE,
  SITE_URL
} from '@/utils/constants';

const [firstName, ...lastNames] = profile.name.split(' ');

/**
 * Site-wide metadata for the root layout. og:image / twitter:image are not set here:
 * they come from the file-based app/opengraph-image.tsx and app/twitter-image.tsx.
 */
export const buildSiteMetadata = (): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${profile.name}`
  },
  description: SITE_DESCRIPTION,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: HOME_URL }],
  creator: profile.name,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'profile',
    firstName,
    lastName: lastNames.join(' '),
    url: '/',
    siteName: profile.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: OG_LOCALE
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  }
});

const PERSON_ID = `${HOME_URL}#person`;
const WEBSITE_ID = `${HOME_URL}#website`;

/** schema.org graph: the site, the profile page and the person it is about */
export const generateJsonLd = () => {
  const [currentJob] = profile.experience;
  const [university] = profile.education;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: HOME_URL,
        name: profile.name,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANG,
        publisher: { '@id': PERSON_ID }
      },
      {
        '@type': 'ProfilePage',
        '@id': `${HOME_URL}#profile`,
        url: HOME_URL,
        name: SITE_TITLE,
        inLanguage: SITE_LANG,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID }
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        url: HOME_URL,
        jobTitle: profile.role,
        description: SITE_DESCRIPTION,
        sameAs: [profile.links.github, profile.links.linkedin],
        knowsAbout: profile.skills,
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
