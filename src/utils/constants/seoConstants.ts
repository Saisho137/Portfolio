import { profile } from '@/content';

import { SITE_URL } from './site';

export { LEGACY_HOST, SITE_URL } from './site';
/** Canonical URL of the home page, shared by canonical, sitemap, OG and JSON-LD */
// No trailing slash: it's how Next prints the root canonical; for the root both forms are the same URL
export const HOME_URL = SITE_URL;
export const SITE_TITLE = `${profile.name} — ${profile.role}`;
export const SITE_DESCRIPTION = profile.summary;
export const SITE_LANG = 'en';
export const OG_LOCALE = 'en_US';
export const GTM_ID = 'GTM-KH8PJXT6';
