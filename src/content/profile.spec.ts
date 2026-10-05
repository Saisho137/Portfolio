import { describe, expect, it } from 'vitest';

import { LOCALES } from '@/i18n/config';

import { getProjectImage, getProfile, projectImages, SECTION_IDS, type Profile } from '.';

/** Everything that must not change between languages: only texts are translated */
const languageNeutral = ({
  name,
  location,
  links,
  projects,
  experience,
  education,
  certifications,
  languages,
  skills
}: Profile) => ({
  name,
  location,
  links,
  projects: projects.map(({ name: project, url, image, tags }) => ({
    project,
    url,
    image: image?.id,
    tags
  })),
  experience: experience.map(({ company, url, start, end, highlights }) => ({
    company,
    url,
    start,
    end,
    highlights: highlights?.length
  })),
  education: education.map(({ institution, url, end, honors }) => ({
    institution,
    url,
    end,
    honors: honors?.length
  })),
  // Certification names are proper names: identical in every language
  certifications,
  languages: languages.map(({ code }) => code),
  skills: skills.map(({ items }) => items.length)
});

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const NOW = '9999-99';

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
      ...profile.certifications.map((certification) => certification.url),
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

  it('dates everything as YYYY-MM', () => {
    [
      ...profile.experience.flatMap(({ start, end }) => [start, end]),
      ...profile.education.map(({ end }) => end),
      ...profile.certifications.map(({ date }) => date)
    ]
      .filter(Boolean)
      .forEach((date) => expect(date).toMatch(YEAR_MONTH));
  });

  // Current positions first (the first one is the main job: "Currently", JSON-LD worksFor),
  // then by end date. Parallel roles keep the JSON order
  it('lists current positions first, then the rest by end date, newest first', () => {
    const ends = profile.experience.map(({ end }) => end ?? NOW);

    expect(profile.experience[0]?.end).toBeUndefined();
    expect(ends).toEqual([...ends].sort().reverse());
  });

  it('lists certifications newest first', () => {
    const dates = profile.certifications.map(({ date }) => date);

    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('uses no emoji (they render inconsistently across the skins fonts)', () => {
    expect(JSON.stringify(profile)).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('has unique project names, skill categories and skills', () => {
    const names = profile.projects.map((project) => project.name);
    const categories = profile.skills.map(({ category }) => category);
    const skills = profile.skills.flatMap(({ items }) => items);

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(categories).size).toBe(categories.length);
    expect(new Set(skills).size).toBe(skills.length);
  });
});

describe('profile translations', () => {
  it('share every language-neutral field (URLs, dates, images, tags, counts)', () => {
    const [reference, ...rest] = LOCALES.map((lang) => languageNeutral(getProfile(lang)));

    rest.forEach((translation) => expect(translation).toEqual(reference));
  });

  it('are actually translated', () => {
    const en = getProfile('en');
    const es = getProfile('es');

    expect(es.summary).not.toBe(en.summary);
    es.about.forEach((paragraph, index) => expect(paragraph).not.toBe(en.about[index]));
    es.experience.forEach(({ highlights = [] }, job) =>
      highlights.forEach((text, index) =>
        expect(text).not.toBe(en.experience[job]?.highlights?.[index])
      )
    );
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
