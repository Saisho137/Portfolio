import { FC, ReactNode } from 'react';

import styles from './BaseLayout.module.scss';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <section className={styles.container}>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </section>
  );
};

export default BaseLayout;
