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

    expect(doc.documentElement.getAttribute('lang')).toBe('en-US');
  });

  it('includes the person JSON-LD', () => {
    const doc = renderLayout();
    const script = doc.querySelector('script[type="application/ld+json"]');

    expect(JSON.parse(script?.textContent ?? '{}')).toMatchObject({ '@type': 'Person' });
  });
});
