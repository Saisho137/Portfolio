import { describe, expect, it } from 'vitest';

import { profile } from '@/content';
import { HOME_URL, SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants';

import { buildSiteMetadata, generateJsonLd, serializeJsonLd } from './seoHelpers';

describe('buildSiteMetadata', () => {
  const metadata = buildSiteMetadata();

  it('uses name + role as default title and the profile summary as description', () => {
    expect(metadata.title).toEqual({ default: SITE_TITLE, template: `%s | ${profile.name}` });
    expect(metadata.description).toBe(SITE_DESCRIPTION);
  });

  it('keeps title and description within what search engines display', () => {
    expect(SITE_TITLE.length).toBeLessThanOrEqual(60);
    expect(SITE_DESCRIPTION.length).toBeGreaterThanOrEqual(50);
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });

  it('declares a self-referencing canonical and an indexable profile page', () => {
    expect(metadata.alternates?.canonical).toBe(HOME_URL);
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ type: 'profile', firstName: 'Santiago' });
  });

  it('verifies the Search Console property', () => {
    expect(metadata.verification?.google).toBeTruthy();
  });

  it('leaves og/twitter images to the file-based image routes', () => {
    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(metadata.twitter).not.toHaveProperty('images');
  });
});

describe('generateJsonLd', () => {
  const { '@graph': graph } = generateJsonLd();
  const byType = (type: string) => graph.find((node) => node['@type'] === type);

  it('links website, profile page and person by @id', () => {
    const person = byType('Person');

    expect(byType('WebSite')).toMatchObject({
      url: HOME_URL,
      publisher: { '@id': person?.['@id'] }
    });
    expect(byType('ProfilePage')).toMatchObject({ mainEntity: { '@id': person?.['@id'] } });
  });

  it('describes the person from profile.json, without a personal image', () => {
    expect(byType('Person')).toMatchObject({
      name: profile.name,
      jobTitle: profile.role,
      sameAs: [profile.links.github, profile.links.linkedin],
      knowsAbout: profile.skills
    });
    expect(byType('Person')).not.toHaveProperty('image');
  });
});

describe('serializeJsonLd', () => {
  it('escapes "<" so the payload cannot close its script tag', () => {
    expect(serializeJsonLd({ text: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
});
