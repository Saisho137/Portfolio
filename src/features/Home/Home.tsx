import Image from 'next/image';
import { FC } from 'react';

import Photo from '@/assets/images/ProfilePhoto.png';

import styles from './Home.module.scss';

const Home: FC = () => {
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
        <Image className={styles.home__image} alt='' src={Photo} width={400} priority />
      </aside>
    </section>
  );
};

export default Home;
