import { describe, expect, it } from 'vitest';

import { getProjectImage, profile, projectImages, SECTIONS } from '.';

describe('profile content', () => {
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

  it('has no unused images in the registry', () => {
    const used = profile.projects.flatMap((project) => project.image?.id ?? []);

    expect(Object.keys(projectImages).sort()).toEqual([...new Set(used)].sort());
  });

  it('throws on unknown image ids', () => {
    expect(() => getProjectImage('does-not-exist')).toThrow(/does-not-exist/);
  });

  it('has unique project names and skills', () => {
    const names = profile.projects.map((project) => project.name);

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(profile.skills).size).toBe(profile.skills.length);
  });

  it('defines unique section ids', () => {
    const ids = SECTIONS.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
