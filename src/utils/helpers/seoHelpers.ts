import { Metadata } from 'next';

import { SITE_URL, AUTHOR } from '@/utils/constants';

interface MetadataInfo {
  title: string;
  description: string;
  url: string;
  index?: boolean;
  follow?: boolean;
}

export const generateJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: AUTHOR.name,
  url: SITE_URL,
  jobTitle: AUTHOR.jobTitle,
  sameAs: [AUTHOR.github, AUTHOR.linkedin],
  knowsAbout: AUTHOR.skills,
  worksFor: {
    '@type': 'Organization',
    name: AUTHOR.company.name,
    url: AUTHOR.company.url
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: AUTHOR.university.name,
    url: AUTHOR.university.url
  }
});

// Escapes `<` so the payload can't close the <script> tag it lives in.
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

// og:image / twitter:image come from app/opengraph-image.tsx and app/twitter-image.tsx
export const generateMetadata = ({
  title,
  description,
  url,
  index = true,
  follow = true
}: MetadataInfo): Metadata => ({
  title,
  description,
  alternates: {
    canonical: url
  },
  robots: {
    index,
    follow
  },
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description
  }
});
