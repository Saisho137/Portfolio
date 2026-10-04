import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { itFulfillsTheSkinContract } from '@/test/skinContract';
import { skinProps } from '@/test/skinProps';

import RawBwSkin from './RawBwSkin';

describe('RawBwSkin', () => {
  itFulfillsTheSkinContract(RawBwSkin);

  it('renders project screenshots and a placeholder for projects without image', () => {
    const props = skinProps('es');
    render(<RawBwSkin {...props} />);

    props.profile.projects
      .flatMap((project) => project.image ?? [])
      .forEach((image) => expect(screen.getByRole('img', { name: image.alt })).toBeInTheDocument());
    expect(screen.queryAllByText(props.dict.rawBw.noImage)).toHaveLength(
      props.profile.projects.filter((project) => !project.image).length
    );
  });
});
