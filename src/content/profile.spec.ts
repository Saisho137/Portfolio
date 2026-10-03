import { describe, expect, it } from 'vitest';

import { profile, SECTIONS } from '.';

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

  it('serves every image from /public with its intrinsic size', () => {
    const images = [profile.photo, ...profile.projects.flatMap((p) => p.image ?? [])];

    images.forEach((image) => {
      expect(image.src).toMatch(/^\/images\//);
      expect(image.alt).toBeTruthy();
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    });
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
