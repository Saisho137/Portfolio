import localFont from 'next/font/local';

export const roboto = localFont({
  src: '../assets/fonts/Roboto-Regular.ttf',
  variable: '--font-roboto',
  weight: '100 900'
});

export const robotoItalic = localFont({
  src: '../assets/fonts/Roboto-Italic.ttf',
  variable: '--font-roboto-italic',
  weight: '100 900'
});
