import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { profile, SECTIONS } from '@/content';

import RawBwSkin from './RawBwSkin';

describe('RawBwSkin', () => {
  it('renders a single h1 with the name as accessible text', () => {
    render(<RawBwSkin />);

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(profile.name);
  });

  it('renders every shared section and a nav link to each', () => {
    const { container } = render(<RawBwSkin />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    SECTIONS.forEach(({ id, label }) => {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`);
    });
  });

  it('renders all the content from the JSON', () => {
    render(<RawBwSkin />);

    profile.projects.forEach((project) =>
      expect(screen.getByRole('heading', { level: 3, name: project.name })).toBeInTheDocument()
    );
    profile.skills.forEach((skill) =>
      expect(screen.getByText(skill.toLowerCase())).toBeInTheDocument()
    );
    profile.experience.forEach((job) => expect(screen.getByText(job.role)).toBeInTheDocument());
    profile.projects
      .flatMap((project) => project.image ?? [])
      .forEach((image) => expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument());
  });

  it('shows a decorative placeholder for projects without image', () => {
    render(<RawBwSkin />);

    const withoutImage = profile.projects.filter((project) => !project.image);

    expect(screen.queryAllByText('no image')).toHaveLength(withoutImage.length);
  });
});
