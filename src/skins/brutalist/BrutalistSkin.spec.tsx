import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { itFulfillsTheSkinContract } from '@/test/skinContract';
import { skinProps } from '@/test/skinProps';

import BrutalistSkin from './BrutalistSkin';

describe('BrutalistSkin', () => {
  itFulfillsTheSkinContract(BrutalistSkin);

  it('lists projects as a numbered catalogue', () => {
    const props = skinProps('en');
    render(<BrutalistSkin {...props} />);

    const list = screen.getByRole('heading', { name: /Selected Projects/ }).closest('section');

    expect(list?.querySelectorAll('li')).toHaveLength(props.profile.projects.length);
  });

  it('builds the logo from the name initials', () => {
    const { profile } = skinProps('en');
    render(<BrutalistSkin {...skinProps('en')} />);

    expect(screen.getByRole('link', { name: `${profile.name}, back to top` })).toHaveTextContent(
      'sbd.'
    );
  });

  it.each([
    ['en', 'Selected Projects / Proyectos', 'es'],
    ['es', 'Proyectos / Selected Projects', 'en']
  ] as const)(
    'labels sections in "%s" first and tags the other language',
    (lang, heading, altLang) => {
      render(<BrutalistSkin {...skinProps(lang)} />);

      const kicker = screen.getByRole('heading', { name: heading });

      expect(kicker.querySelector('span')).toHaveAttribute('lang', altLang);
    }
  );
});
