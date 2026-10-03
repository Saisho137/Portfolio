import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { profile } from '@/content';
import { itFulfillsTheSkinContract } from '@/test/skinContract';

import RawBwSkin from './RawBwSkin';

describe('RawBwSkin', () => {
  itFulfillsTheSkinContract(RawBwSkin);

  it('renders project screenshots and a placeholder for projects without image', () => {
    render(<RawBwSkin />);

    profile.projects
      .flatMap((project) => project.image ?? [])
      .forEach((image) => expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument());
    expect(screen.queryAllByText('no image')).toHaveLength(
      profile.projects.filter((project) => !project.image).length
    );
  });
});
