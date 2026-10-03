import { Bricolage_Grotesque, Fragment_Mono } from 'next/font/google';

export const mono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--raw-bw-mono'
});

export const sans = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--raw-bw-sans'
});
