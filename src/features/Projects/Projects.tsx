import { FC } from 'react';

import { Icons } from '@/components/atoms';
import { Card } from '@/components/molecules';

import styles from './Projects.module.scss';

const Projects: FC = () => {
  return (
    <section className={styles.projects}>
      <h2 className={styles.projects__name}>Projects:</h2>
      <section className={styles.projects__content}>
        <Card title='Comfama' theme='green' child={<Icons.Linkedin width='100' height='100' />} />
        <Card title='Proteccion' theme='dark' child={<Icons.Linkedin width='100' height='100' />} />
        <Card title='BeatHub' theme='light' child={<Icons.Linkedin width='100' height='100' />} />
      </section>
    </section>
  );
};

export default Projects;
