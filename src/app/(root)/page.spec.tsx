import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { profile } from '@/content';

import Home from './page';

vi.mock('@next/third-parties/google', () => ({ sendGTMEvent: vi.fn() }));

describe('Home Page', () => {
  it('renders the raw-bw skin as default content', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(profile.name);
  });

  // What crawlers and no-JS visitors get: only raw-bw, complete, once
  it('server-renders the whole profile once, without the lazy skins', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html.match(/<h1/g)).toHaveLength(1);
    [profile.summary, ...profile.projects.map((project) => project.name)].forEach((text) =>
      expect(html).toContain(text)
    );
    // Markers that only exist in raw-color / brutalist
    expect(html).not.toContain('view-source:');
    expect(html).not.toContain('Selected Projects');
  });
});
