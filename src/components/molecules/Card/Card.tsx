import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import { Icons } from '@/components/atoms';

import styles from './Card.module.scss';

interface CardProps {
  title: string;
  theme: 'light' | 'dark' | 'green';
  imageSrc?: string | StaticImageData;
  link?: string;
  imageAlt?: string;
}

const Card: FC<CardProps> = ({ title, theme, imageSrc, link = '#', imageAlt = 'Card Image' }) => {
  return (
    <article className={`${styles.card} ${styles['card--' + theme]}`}>
      <div className={styles.card__content}>
        <h2>
          {title.split(' ').map((word, index) => (
            <span
              className={`${styles['card__title-item']} ${styles['card__title-item--' + theme]}`}
              key={index + 1}
            >
              {word}{' '}
            </span>
          ))}
        </h2>
        <a href={link} className={`${styles.card__link} ${styles['card__link--' + theme]}`}>
          <Icons.LinkArrow className={`${styles.card__icon} ${styles['card__icon--' + theme]}`} />
          <span>Learn more</span>
        </a>
      </div>
      {imageSrc && <Image className={styles.card__image} src={imageSrc} alt={imageAlt} />}
    </article>
  );
};

export default Card;
