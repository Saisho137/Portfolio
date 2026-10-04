import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import GlobalNotFound from './global-not-found';

// Owns <html>, like the root layout: test its server output
const renderPage = () =>
  new DOMParser().parseFromString(renderToStaticMarkup(<GlobalNotFound />), 'text/html');

describe('GlobalNotFound', () => {
  it('is a full document with a language and a single h1', () => {
    const doc = renderPage();

    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
  });

  it('speaks both languages, tagging the Spanish text', () => {
    const doc = renderPage();

    expect(doc.querySelector('p[lang="es"]')?.textContent).toBe('Esta página no existe.');
  });

  it('links to the home page of every language', () => {
    const links = [...renderPage().querySelectorAll('a')].map((link) => [
      link.getAttribute('href'),
      link.getAttribute('hreflang')
    ]);

    expect(links).toEqual([
      ['/', 'en'],
      ['/es', 'es']
    ]);
  });
});
