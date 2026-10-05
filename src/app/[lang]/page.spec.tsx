import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getProfile } from '@/content';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import Home from './page';

const renderHome = (lang: Locale) => Home({ params: Promise.resolve({ lang }) });

describe('Home Page', () => {
  it('renders the raw-bw skin as default content', async () => {
    render(await renderHome('en'));

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(getProfile('en').name);
  });

  // What crawlers and no-JS visitors get: only raw-bw, complete, once, in one language
  it.each(['en', 'es'] as const)(
    'server-renders the whole "%s" profile once, without the lazy skins',
    async (lang) => {
      const profile = getProfile(lang);
      const html = renderToStaticMarkup(await renderHome(lang));

      expect(html.match(/<h1/g)).toHaveLength(1);
      [profile.summary, ...profile.projects.map((project) => project.name)].forEach((text) =>
        expect(html).toContain(text)
      );
      // Markers that only exist in raw-color / brutalist
      expect(html).not.toContain('view-source:');
      expect(html).not.toContain(getDictionary(lang).brutalist.greeting);
    }
  );
});
