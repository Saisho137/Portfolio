import { describe, expect, it, vi } from 'vitest';

import { getProfile } from '@/content';
import { LOCALES } from '@/i18n/config';
import { SITE_URL } from '@/utils/constants';

import { buildSiteMetadata, generateJsonLd, getSiteTitle, serializeJsonLd } from './seoHelpers';

const UPDATED_AT = '2026-10-04T21:00:00-05:00';
vi.mock('./contentDate', () => ({ getContentUpdatedAt: () => UPDATED_AT }));

const URLS = { en: SITE_URL, es: `${SITE_URL}/es` };
const LANGUAGES = { ...URLS, 'x-default': SITE_URL };

describe.each(LOCALES)('buildSiteMetadata("%s")', (lang) => {
  const profile = getProfile(lang);
  const metadata = buildSiteMetadata(lang);
  const title = getSiteTitle(profile);

  it('uses name + role as default title and the profile summary as description', () => {
    expect(metadata.title).toEqual({ default: title, template: `%s | ${profile.name}` });
    expect(metadata.description).toBe(profile.summary);
  });

  it('keeps title and description within what search engines display', () => {
    expect(title.length).toBeLessThanOrEqual(60);
    expect(profile.summary.length).toBeGreaterThanOrEqual(50);
    expect(profile.summary.length).toBeLessThanOrEqual(160);
  });

  it('declares a self-referencing canonical plus every hreflang version and x-default', () => {
    expect(metadata.alternates).toEqual({ canonical: URLS[lang], languages: LANGUAGES });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('describes the page language in Open Graph, with the other one as alternate', () => {
    expect(metadata.openGraph).toMatchObject({
      type: 'profile',
      firstName: 'Santiago',
      url: URLS[lang],
      locale: lang === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: [lang === 'en' ? 'es_CO' : 'en_US']
    });
  });

  it('verifies the Search Console property', () => {
    expect(metadata.verification?.google).toBeTruthy();
  });

  it('leaves og/twitter images to the file-based image routes', () => {
    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(metadata.twitter).not.toHaveProperty('images');
  });
});

describe.each(LOCALES)('generateJsonLd("%s")', (lang) => {
  const profile = getProfile(lang);
  const { '@graph': graph } = generateJsonLd(lang);
  const byType = (type: string) => graph.find((node) => node['@type'] === type);

  it('links website, profile page and person by @id, the same entities in every language', () => {
    const person = byType('Person');

    expect(person?.['@id']).toBe(`${SITE_URL}#person`);
    expect(byType('WebSite')).toMatchObject({
      url: SITE_URL,
      inLanguage: ['en', 'es'],
      publisher: { '@id': person?.['@id'] }
    });
    expect(byType('ProfilePage')).toMatchObject({
      '@id': `${URLS[lang]}#profile`,
      url: URLS[lang],
      inLanguage: lang,
      mainEntity: { '@id': person?.['@id'] },
      dateModified: UPDATED_AT
    });
  });

  it('describes the person from that language profile, without a personal image', () => {
    expect(byType('Person')).toMatchObject({
      name: profile.name,
      jobTitle: profile.role,
      sameAs: [profile.links.github, profile.links.linkedin],
      knowsAbout: profile.skills.flatMap(({ items }) => items)
    });
    expect(byType('Person')).not.toHaveProperty('image');
  });

  it('adds languages, location, verifiable credentials and honors to the person', () => {
    const person = byType('Person');

    expect(person).toMatchObject({
      knowsLanguage: profile.languages.map(({ code, name }) => ({
        '@type': 'Language',
        name,
        alternateName: code
      })),
      homeLocation: { address: { addressLocality: 'Medellín', addressCountry: 'CO' } },
      hasCredential: profile.certifications.map(({ name, issuer, date, url }) => ({
        '@type': 'EducationalOccupationalCredential',
        name,
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: issuer },
        dateCreated: date,
        ...(url && { url })
      })),
      award: profile.education.flatMap(({ honors = [] }) => honors)
    });
  });
});

describe('serializeJsonLd', () => {
  it('escapes "<" so the payload cannot close its script tag', () => {
    expect(serializeJsonLd({ text: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
});
