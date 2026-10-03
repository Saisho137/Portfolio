import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import RootLayout from './layout';

vi.mock('@next/third-parties/google', () => ({ GoogleTagManager: () => null }));

// RootLayout is a Server Component that owns <html>, so test its server output.
// DOMParser nodes live outside the jsdom realm, so jest-dom matchers don't apply.
const renderLayout = () =>
  new DOMParser().parseFromString(
    renderToStaticMarkup(
      <RootLayout>
        <p>test content</p>
      </RootLayout>
    ),
    'text/html'
  );

describe('RootLayout', () => {
  it('renders children inside the body', () => {
    const doc = renderLayout();

    expect(doc.body.textContent).toContain('test content');
  });

  it('sets the lang attribute on the html element', () => {
    const doc = renderLayout();

    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  it('includes the JSON-LD graph', () => {
    const doc = renderLayout();
    const script = doc.querySelector('script[type="application/ld+json"]');
    const { '@graph': graph } = JSON.parse(script?.textContent ?? '{}') as {
      '@graph': { '@type': string }[];
    };

    expect(graph.map((node) => node['@type'])).toEqual(['WebSite', 'ProfilePage', 'Person']);
  });
});
