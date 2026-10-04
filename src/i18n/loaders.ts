import type { Locale } from './config';
import type { Dictionary } from './dictionaries';

// One chunk per language: a lazy skin only downloads the active one
const dictionaryLoaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import('./dictionaries/en.json'),
  es: () => import('./dictionaries/es.json')
};

export const loadDictionary = (lang: Locale): Promise<Dictionary> =>
  dictionaryLoaders[lang]().then((module) => module.default);
