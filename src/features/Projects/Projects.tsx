import { FC } from 'react';

import ComfamaImage from '@/assets/images/Agenda-Comfama-screenshot.png';
import BeathubImage from '@/assets/images/Beathub-screenshot.png';
import { Card } from '@/components/molecules';

import styles from './Projects.module.scss';

const Projects: FC = () => {
  return (
    <section className={styles.projects}>
      <h2 className={styles.projects__name}>Projects</h2>
      <section className={styles.projects__content}>
        <Card title='Agenda Comfama' theme='green' imageSrc={ComfamaImage} imageAlt='Comfama' />
        <Card
          title='Perfilador Financiero'
          theme='dark'
          imageSrc={BeathubImage}
          imageAlt='Comfama'
        />
        <Card title='BeatHub' theme='light' imageSrc={BeathubImage} imageAlt='Comfama' />
      </section>
    </section>
  );
};

export default Projects;
