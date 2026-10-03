import { profile } from '@/content';

export const SITE_URL = 'https://portfolio-six-blond-30.vercel.app';
/** Canonical URL of the home page (next.config uses trailingSlash) */
export const HOME_URL = `${SITE_URL}/`;
export const SITE_TITLE = `${profile.name} — ${profile.role}`;
export const SITE_DESCRIPTION = profile.summary;
export const SITE_LANG = 'en';
export const OG_LOCALE = 'en_US';
export const GTM_ID = 'GTM-KH8PJXT6';
