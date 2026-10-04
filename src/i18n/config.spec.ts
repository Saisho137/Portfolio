import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/utils/constants';

import {
  getLanguageLinks,
  hasLocale,
  languageAlternates,
  localePath,
  localeUrl,
  otherLocales
} from './config';
import { format, formatPeriod, formatYearMonth } from './format';

describe('i18n config', () => {
  it('only accepts the supported locales', () => {
    expect(['en', 'es', 'fr', 'EN', ''].map(hasLocale)).toEqual([true, true, false, false, false]);
  });

  it('serves the default language at the root and the rest under their prefix', () => {
    expect([localePath('en'), localePath('es')]).toEqual(['/', '/es']);
    expect([localeUrl('en'), localeUrl('es')]).toEqual([SITE_URL, `${SITE_URL}/es`]);
  });

  it('points x-default to the default language', () => {
    expect(languageAlternates()).toEqual({
      en: SITE_URL,
      es: `${SITE_URL}/es`,
      'x-default': SITE_URL
    });
  });

  it('lists the other languages', () => {
    expect(otherLocales('es')).toEqual(['en']);
  });

  it('builds language links named in their own language, marking the current one', () => {
    expect(getLanguageLinks('es')).toEqual([
      { locale: 'en', href: '/', name: 'English', current: false },
      { locale: 'es', href: '/es', name: 'Español', current: true }
    ]);
  });
});

describe('format', () => {
  it('fills known placeholders and leaves unknown ones untouched', () => {
    expect(format('{a} y {b}', { a: 'uno' })).toBe('uno y {b}');
  });
});

describe('formatYearMonth / formatPeriod', () => {
  it('formats YYYY-MM in each language, without time-zone drift', () => {
    expect(formatYearMonth('2024-02', 'en')).toBe('Feb 2024');
    expect(formatYearMonth('2024-02', 'es')).toBe('feb 2024');
  });

  it('closes open periods with the current-position label', () => {
    expect(formatPeriod({ start: '2026-03' }, 'en', 'now')).toBe('Mar 2026 — now');
    expect(formatPeriod({ start: '2024-11', end: '2026-03' }, 'es', 'hoy')).toBe(
      'nov 2024 — mar 2026'
    );
  });
});
