import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { profile } from '@/content';
import { itFulfillsTheSkinContract } from '@/test/skinContract';

import BrutalistSkin from './BrutalistSkin';

describe('BrutalistSkin', () => {
  itFulfillsTheSkinContract(BrutalistSkin);

  it('lists projects as a numbered catalogue', () => {
    render(<BrutalistSkin />);

    const list = screen.getByRole('heading', { name: /Selected Projects/ }).closest('section');

    expect(list?.querySelectorAll('li')).toHaveLength(profile.projects.length);
  });

  it('builds the logo from the name initials', () => {
    render(<BrutalistSkin />);

    expect(screen.getByRole('link', { name: `${profile.name}, back to top` })).toHaveTextContent(
      'sbd.'
    );
  });
});
