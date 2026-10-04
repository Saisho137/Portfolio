import type { Locale } from './config';
import en from './dictionaries/en.json';
import es from './dictionaries/es.json';

/** English is the reference shape: `tsc` fails if another dictionary misses a key */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, es };

/**
 * Server-side lookup. Client code must not import this module (it would bundle every
 * language): lazy skins use `loadDictionary` from './loaders'.
 */
export const getDictionary = (lang: Locale): Dictionary => dictionaries[lang];
