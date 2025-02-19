import type { Metadata } from 'next';
import Image from 'next/image';

import Photo from '@/assets/images/Photo.png';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Home Page - My Static App',
  description: 'This is a statically generated page with SEO metadata.'
};

export default function Home() {
  return (
    <section className={styles.home}>
      <section className={styles.home__content}>
        <h1 className={styles.home__name}>Santiago Betancur Duque</h1>
        <h2 className={styles.home__rol}>Frontend Developer</h2>
        <div className={styles.home__paragraphs}>
          <p className={styles.home__introduction}>
            👋 Hi! I&apos;m a Computer Scientist and Frontend Developer with experience in building
            responsive, accessible, secure and SEO-optimized web applications using technologies
            like Angular and React.
          </p>
          <p className={styles.home__introduction}>
            🌟 My passion lies in solving complex problems through concise solutions, focusing on
            creating seamless and user-friendly experiences. I enjoy collaborating in teams to drive
            projects toward success.
          </p>
        </div>
      </section>
      <aside>
        <Image className={styles.home__image} alt='' src={Photo} width={400} />
      </aside>
    </section>
  );
}
