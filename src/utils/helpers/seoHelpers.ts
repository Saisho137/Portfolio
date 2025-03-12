import { Metadata } from 'next';

import { SITE_URL, AUTHOR } from '@/utils/constants';

interface MetadataInfo {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt?: string;
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

export const generateMetadata = ({
  title,
  description,
  url,
  image,
  imageAlt = 'Portfolio Image',
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
    images: [{ url: image, alt: imageAlt }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image]
  }
});
