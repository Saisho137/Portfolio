import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import type { ComponentType } from 'react';
import { expect, it } from 'vitest';

import { profile, SECTIONS } from '@/content';

/**
 * Every skin renders the same profile.json with its own markup.
 * This is the shared contract: one h1, a <main id="main"> for the skip link, every
 * section + nav anchor, all the content, and no axe violations.
 */
export const itFulfillsTheSkinContract = (Skin: ComponentType) => {
  it('renders a single h1 named after the profile', () => {
    render(<Skin />);

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(profile.name);
  });

  it('exposes <main id="main"> as the skip link target', () => {
    render(<Skin />);

    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Skin />);
    // jsdom has no layout/computed colors: contrast is checked in a real browser instead
    const { violations } = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    });

    expect(violations.map(({ id, help, nodes }) => `${id}: ${help} (${nodes.length})`)).toEqual([]);
  });

  it('renders every shared section and a primary nav link to each', () => {
    const { container } = render(<Skin />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    SECTIONS.forEach(({ id }) => {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
      expect(
        within(nav)
          .getAllByRole('link')
          .map((link) => link.getAttribute('href'))
      ).toContain(`#${id}`);
    });
  });

  it('renders all the profile content', () => {
    const { container } = render(<Skin />);
    const text = container.textContent?.toLowerCase() ?? '';

    [
      profile.summary,
      ...profile.about,
      ...profile.projects.map((project) => project.name),
      ...profile.skills,
      ...profile.experience.flatMap((job) => [job.role, job.company]),
      ...profile.education.map((item) => item.institution)
    ].forEach((value) => expect(text).toContain(value.toLowerCase()));
  });

  it('links to every profile', () => {
    render(<Skin />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));

    expect(hrefs).toContain(profile.links.github);
    expect(hrefs).toContain(profile.links.linkedin);
  });
};
