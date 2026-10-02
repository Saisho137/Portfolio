import { FC } from 'react';

import { Icons } from '@/components/atoms';
import { AUTHOR } from '@/utils/constants';

import styles from './Header.module.scss';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles['header__logo-container']}>
        <Icons.Logo />
        <span className={styles.header__title}>Home</span>
      </div>
      <nav className={styles.header__nav}>
        <ul className={styles['header__nav-list']}>
          <li className={styles['header__nav-item']}>Projects</li>
          <li className={styles['header__nav-item']}>Experience</li>
          <li className={styles['header__nav-item']}>Skills</li>
          <li className={styles['header__nav-item']}>Education</li>
        </ul>
        <a className={styles['header__contact-button']} href={AUTHOR.linkedin}>
          Contact me
        </a>
      </nav>
    </header>
  );
};

export default Header;
