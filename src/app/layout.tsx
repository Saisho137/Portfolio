import { ReactNode } from 'react';

import { BaseLayout } from '@/components/templates';
import { roboto } from '@/config/fonts';

import '@/styles/globals.scss';

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='es' data-testid='root-html'>
      <body className={`${roboto.variable}`}>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
