// * Important: 'use client' doesnt change render type on Pages.

import { ReactNode } from 'react';

import { BaseLayout } from '@/components/templates';
import { roboto, robotoItalic } from '@/config/fonts';

import '@/styles/globals.scss';

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='es' data-testid='root-html'>
      <body className={`${roboto.variable} ${robotoItalic.variable}`}>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
