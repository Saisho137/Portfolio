import type { Locale } from '@/i18n/config';

import en from './profile.en.json';
import es from './profile.es.json';
import type { Profile } from './types';

// Typing the JSON here makes `tsc` fail if a profile drifts from the schema
const profiles: Record<Locale, Profile> = { en, es };

/**
 * Server-side lookup. Client code must not import this module (it would bundle every
 * language): lazy skins use `loadProfile` from './loaders'.
 */
export const getProfile = (lang: Locale): Profile => profiles[lang];

export { getProjectImage, projectImages } from './images';
export { SECTION_IDS } from './sections';
export type * from './types';
