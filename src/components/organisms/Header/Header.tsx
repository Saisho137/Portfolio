'use client';

import React, { FC } from 'react';

import { Icons } from '@/components/atoms';

import styles from './Header.module.scss';

const Header: FC = () => {
  const handleButtonClick = () => {
    console.log('Button clicked');

    if (window?.dataLayer) {
      window?.dataLayer?.push({
        event: 'button_click',
        category: 'User Actions',
        label: 'Clicked CTA Button'
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles['header__logo-container']}>
        <Icons.Logo />
        <span className={styles.header__title}>Home</span>
      </div>
      <nav className={styles.header__nav}>
        <ul className={styles['header__nav-list']}>
          <li className={styles['header__nav-item']}>Projects</li>
          <li className={styles['header__nav-item']}>Expirience</li>
          <li className={styles['header__nav-item']}>Skills</li>
          <li className={styles['header__nav-item']}>Education</li>
        </ul>
        <button className={styles['header__contact-button']} onClick={handleButtonClick}>
          Contact me
        </button>
      </nav>
    </header>
  );
};

export default Header;
