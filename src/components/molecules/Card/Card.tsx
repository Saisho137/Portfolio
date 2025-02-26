import { FC, ReactNode } from 'react';

import { Icons } from '@/components/atoms';

import styles from './Card.module.scss';

interface CardProps {
  title: string;
  theme: 'light' | 'dark' | 'green';
  child?: ReactNode;
  link?: string;
}

const Card: FC<CardProps> = ({ title, theme, child, link = '#' }) => {
  return (
    <article className={`${styles.card} ${styles['card--' + theme]}`}>
      <div className={styles.card__content}>
        <h2 className={`${styles.card__title} ${styles['card__title--' + theme]}`}>{title}</h2>
        <a href={link} className={`${styles.card__link} ${styles['card__link--' + theme]}`}>
          <Icons.LinkArrow className={`${styles.card__icon} ${styles['card__icon--' + theme]}`} />
          <span>Learn more</span>
        </a>
      </div>
      {child && <div className={styles.card__image}>{child}</div>}
    </article>
  );
};

export default Card;
