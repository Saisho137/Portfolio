import type { Metadata } from 'next';

import { Home, Projects } from '@/features';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Home Page - My Static App',
  description: 'This is a statically generated page with SEO metadata.'
};

export default function HomePage() {
  return (
    <section className={styles.container}>
      <Home />
      <Projects />
    </section>
  );
}
