import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Locale } from '@/i18n/config';

import RootLayout, { generateMetadata, generateStaticParams } from './layout';

vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <meta name='ga-test' content={gaId} />
}));

const params = (lang: string) => Promise.resolve({ lang });

// RootLayout is an async Server Component that owns <html>, so test its server output.
// DOMParser nodes live outside the jsdom realm, so jest-dom matchers don't apply.
const renderLayout = async (lang: Locale = 'en') =>
  new DOMParser().parseFromString(
    renderToStaticMarkup(await RootLayout({ params: params(lang), children: <p>test content</p> })),
    'text/html'
  );

describe('RootLayout', () => {
  it('prerenders one version per language', () => {
    expect(generateStaticParams()).toEqual([{ lang: 'en' }, { lang: 'es' }]);
  });

  it('renders children inside the body', async () => {
    const doc = await renderLayout();

    expect(doc.body.textContent).toContain('test content');
  });

  it.each(['en', 'es'] as const)('sets <html lang="%s"> from the route', async (lang) => {
    const doc = await renderLayout(lang);

    expect(doc.documentElement.getAttribute('lang')).toBe(lang);
  });

  it.each([
    ['en', 'Skip to content'],
    ['es', 'Saltar al contenido']
  ] as const)('starts with a skip link to the main content in "%s"', async (lang, text) => {
    const doc = await renderLayout(lang);
    const first = doc.body.querySelector('a');

    expect(first?.getAttribute('href')).toBe('#main');
    expect(first?.textContent).toBe(text);
  });

  it('runs the theme init script in <head>, before paint', async () => {
    const doc = await renderLayout();

    expect(doc.head.querySelector('script')?.textContent).toContain('dataset.theme');
  });

  it('includes the JSON-LD graph in the page language', async () => {
    const doc = await renderLayout('es');
    const script = doc.querySelector('script[type="application/ld+json"]');
    const { '@graph': graph } = JSON.parse(script?.textContent ?? '{}') as {
      '@graph': { '@type': string; inLanguage: unknown }[];
    };

    expect(graph.map((node) => node['@type'])).toEqual(['WebSite', 'ProfilePage', 'Person']);
    expect(graph.find((node) => node['@type'] === 'ProfilePage')?.inLanguage).toBe('es');
  });

  describe('analytics', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('loads GA4 on the production deployment', async () => {
      vi.stubEnv('VERCEL_ENV', 'production');
      const doc = await renderLayout();

      expect(doc.querySelector('meta[name="ga-test"]')?.getAttribute('content')).toBe(
        'G-Q7NJCZDQBL'
      );
    });

    it.each(['preview', undefined])('stays off elsewhere (VERCEL_ENV=%s)', async (env) => {
      vi.stubEnv('VERCEL_ENV', env);
      const doc = await renderLayout();

      expect(doc.querySelector('meta[name="ga-test"]')).toBeNull();
    });
  });

  it('has no no-JS tracking iframe (GA4 needs JavaScript)', async () => {
    const doc = await renderLayout();

    expect(doc.querySelector('iframe')).toBeNull();
  });

  it('builds the metadata of the requested language', async () => {
    const metadata = await generateMetadata({ params: params('es') });

    expect(metadata.openGraph).toMatchObject({ locale: 'es_CO' });
  });

  it('404s anything that is not a supported language', async () => {
    await expect(generateMetadata({ params: params('fr') })).rejects.toThrow();
  });
});
