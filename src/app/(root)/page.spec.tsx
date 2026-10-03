import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { profile } from '@/content';

import Home from './page';

describe('Home Page', () => {
  it('renders the raw-bw skin as default content', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(profile.name);
  });
});
