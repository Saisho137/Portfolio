import { FC, ReactNode } from 'react';

import { Footer, Header } from '@/components/organisms';

import styles from './BaseLayout.module.scss';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <section className={styles.container}>
      <Header />
      <main>{children}</main>
      <Footer />
    </section>
  );
};

export default BaseLayout;
