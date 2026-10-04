import { describe, expect, it } from 'vitest';

import { LOCALES } from '@/i18n/config';

import { getProjectImage, getProfile, projectImages, SECTION_IDS, type Profile } from '.';

/** Everything that must not change between languages: only texts are translated */
const languageNeutral = ({ name, links, projects, experience, education, skills }: Profile) => ({
  name,
  links,
  projects: projects.map(({ name: project, url, image, tags }) => ({
    project,
    url,
    image: image?.id,
    tags
  })),
  experience: experience.map(({ company, url, start, end }) => ({ company, url, start, end })),
  education: education.map(({ institution, url }) => ({ institution, url })),
  skills: skills.length
});

describe.each(LOCALES)('profile content in "%s"', (lang) => {
  const profile = getProfile(lang);

  it('has the required identity fields', () => {
    expect(profile.name).toBeTruthy();
    expect(profile.role).toBeTruthy();
    expect(profile.summary).toBeTruthy();
    expect(profile.about.length).toBeGreaterThan(0);
  });

  it('uses absolute https links', () => {
    const urls = [
      profile.links.github,
      profile.links.linkedin,
      ...profile.experience.map((job) => job.url),
      ...profile.education.map((item) => item.url),
      ...profile.projects.map((project) => project.url)
    ].filter(Boolean);

    urls.forEach((url) => expect(url).toMatch(/^https:\/\//));
  });

  it('references only registered project images, with alt text', () => {
    profile.projects.forEach(({ image }) => {
      if (!image) return;

      expect(Object.keys(projectImages)).toContain(image.id);
      expect(image.alt).toBeTruthy();
    });
  });

  it('has unique project names and skills', () => {
    const names = profile.projects.map((project) => project.name);

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(profile.skills).size).toBe(profile.skills.length);
  });
});

describe('profile translations', () => {
  it('share every language-neutral field (URLs, dates, images, tags, counts)', () => {
    const [reference, ...rest] = LOCALES.map((lang) => languageNeutral(getProfile(lang)));

    rest.forEach((translation) => expect(translation).toEqual(reference));
  });

  it('are actually translated', () => {
    const [en, es] = LOCALES.map(getProfile);

    expect(es.summary).not.toBe(en.summary);
    expect(es.role).not.toBe(en.role);
  });
});

describe('project images', () => {
  it('has no unused images in the registry', () => {
    const used = getProfile('en').projects.flatMap((project) => project.image?.id ?? []);

    expect(Object.keys(projectImages).sort()).toEqual([...new Set(used)].sort());
  });

  it('throws on unknown image ids', () => {
    expect(() => getProjectImage('does-not-exist')).toThrow(/does-not-exist/);
  });
});

describe('SECTION_IDS', () => {
  it('defines unique section ids', () => {
    expect(new Set(SECTION_IDS).size).toBe(SECTION_IDS.length);
  });
});
