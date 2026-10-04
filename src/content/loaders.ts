import type { Locale } from '@/i18n/config';

import type { Profile } from './types';

// One chunk per language: a lazy skin only downloads the active one
const profileLoaders: Record<Locale, () => Promise<{ default: Profile }>> = {
  en: () => import('./profile.en.json'),
  es: () => import('./profile.es.json')
};

export const loadProfile = (lang: Locale): Promise<Profile> =>
  profileLoaders[lang]().then((module) => module.default);
