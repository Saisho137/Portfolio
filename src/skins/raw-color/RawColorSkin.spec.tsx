import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { profile } from '@/content';
import { itFulfillsTheSkinContract } from '@/test/skinContract';

import RawColorSkin from './RawColorSkin';

describe('RawColorSkin', () => {
  itFulfillsTheSkinContract(RawColorSkin);

  it('lists projects in a raw table, one row each', () => {
    render(<RawColorSkin />);

    // header row + one per project
    expect(screen.getAllByRole('row')).toHaveLength(profile.projects.length + 1);
  });

  it('keeps the fake <head> out of the accessibility tree', () => {
    const { container } = render(<RawColorSkin />);

    expect(container.querySelector('[data-t="head"]')).toHaveAttribute('aria-hidden', 'true');
  });
});
