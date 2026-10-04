import { notFound } from 'next/navigation';

import { hasLocale, LOCALES, type Locale } from '@/i18n/config';

export interface LangParams {
  params: Promise<{ lang: string }>;
}

/** Every language is prerendered at build time; nothing else matches [lang] */
export const generateLangParams = () => LOCALES.map((lang) => ({ lang }));

/** Narrows the segment to a Locale. dynamicParams = false already 404s the rest */
export const resolveLang = async ({ params }: LangParams): Promise<Locale> => {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang;
};
