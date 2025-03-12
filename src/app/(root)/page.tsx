import type { Metadata } from 'next';

import { Home, Projects } from '@/features';
import { PROFILE_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/constants';
import { generateMetadata } from '@/utils/helpers';

import styles from './page.module.scss';

export default function HomePage() {
  return (
    <section className={styles.container}>
      <Home />
      <Projects />
    </section>
  );
}

export const metadata: Metadata = generateMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: PROFILE_IMAGE
});
