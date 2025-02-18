// ! Its mandatory to type 'use client' on each page where its needed, it doesnt affect child pages/routes.

import type { Metadata } from 'next';

import { Icons, Title } from '@/components/atoms';
import { authService, toastService } from '@/shared/services';
import { NUMBER_ONE, NUMBER_ZERO, NUMBERS } from '@/utils/constants';
import { transformToCapital, transformToLowerCase, transformToNumber } from '@/utils/helpers';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Home Page - My Static App',
  description: 'This is a statically generated page with SEO metadata.'
}; // ! Poner en README cuál Metadata elegir.

export default function Home() {
  // Test the helpers and constans
  console.log(transformToNumber('1'));
  console.log(transformToCapital('hello'));
  console.log(transformToLowerCase('HELLO'));
  console.log(NUMBER_ZERO, NUMBER_ONE, NUMBERS.TWO, NUMBERS.THREE);
  authService.login();
  toastService.showSuccess('Success message');

  return (
    <section>
      <Title title='Root content' />
      <div className={styles['icons-container']}>
        <Icons.Linkedin className={styles['icons-container__icon']} width='40' height='40' />
        <Icons.X width='25' height='25' />
        <Icons.Facebook className={styles['icons-container__icon']} />
        <Icons.Instagram />
      </div>
    </section>
  );
}
