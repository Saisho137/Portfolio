import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { itFulfillsTheSkinContract } from '@/test/skinContract';
import { skinProps } from '@/test/skinProps';

import RawColorSkin from './RawColorSkin';

describe('RawColorSkin', () => {
  itFulfillsTheSkinContract(RawColorSkin);

  it('lists projects in a raw table, one row each', () => {
    const props = skinProps('en');
    render(<RawColorSkin {...props} />);

    // header row + one per project
    expect(screen.getAllByRole('row')).toHaveLength(props.profile.projects.length + 1);
  });

  it('keeps the fake <head> out of the accessibility tree', () => {
    const { container } = render(<RawColorSkin {...skinProps('en')} />);

    expect(container.querySelector('[data-t="head"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('prints the view-source URL of the current language', () => {
    render(<RawColorSkin {...skinProps('es')} />);

    expect(screen.getByText(/\/es$/)).toBeInTheDocument();
  });
});
