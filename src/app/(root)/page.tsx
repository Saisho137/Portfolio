import type { Metadata } from 'next';

import { Home, Projects } from '@/features';

import styles from './page.module.scss';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Santiago Betancur Duque',
    url: 'https://portfolio-six-blond-30.vercel.app',
    jobTitle: 'Frontend Developer',
    sameAs: [
      'https://github.com/Saisho137',
      'https://www.linkedin.com/in/santiago-betancur-duque-79548024b/'
    ],
    knowsAbout: [
      'SEO',
      'React',
      'Next.js',
      'Node.js',
      'Angular',
      'HTML',
      'CSS',
      'Sass',
      'JavaScript',
      'TypeScript',
      'Core Web Vitals',
      'Web Accessibility',
      'Performance Optimization'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Pragma',
      url: 'https://www.pragma.co/es'
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Unilasallista Corporacion Universitaria',
      url: 'https://www.unilasallista.edu.co'
    }
  };

  return (
    <section className={styles.container}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
      <Projects />
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Santiago Betancur | Frontend Developer',
  description:
    'Frontend Developer with expertise in React, Next.js, SEO, and Performance Optimization. Passionate about building fast and accessible web applications.',
  openGraph: {
    title: 'Santiago Betancur | Frontend Developer',
    description:
      'Frontend Developer with expertise in React, Next.js, SEO, and Performance Optimization. Passionate about building fast and accessible web applications.',
    url: 'https://portfolio-six-blond-30.vercel.app',
    siteName: 'Santiago Betancur Portfolio',
    images: [
      {
        url: 'https://portfolio-six-blond-30.vercel.app/images/ProfilePhoto.png',
        alt: 'Mi Portafolio'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Santiago Betancur | Frontend Developer',
    description:
      'Frontend Developer with expertise in React, Next.js, SEO, and Performance Optimization. Passionate about building fast and accessible web applications.',
    images: ['https://portfolio-six-blond-30.vercel.app/images/ProfilePhoto.png']
  }
};
