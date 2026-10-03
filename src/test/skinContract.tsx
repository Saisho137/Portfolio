import { render, screen, within } from '@testing-library/react';
import type { ComponentType } from 'react';
import { expect, it } from 'vitest';

import { profile, SECTIONS } from '@/content';

/**
 * Every skin renders the same profile.json with its own markup.
 * This is the shared contract: one h1, every section + nav anchor, all the content.
 */
export const itFulfillsTheSkinContract = (Skin: ComponentType) => {
  it('renders a single h1 named after the profile', () => {
    render(<Skin />);

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(profile.name);
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
