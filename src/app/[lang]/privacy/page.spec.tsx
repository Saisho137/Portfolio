import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import { getProfile } from '@/content';
import { LOCALES, type Locale } from '@/i18n/config';

import PrivacyPage, { generateMetadata } from './page';

const params = (lang: Locale) => ({ params: Promise.resolve({ lang }) });

const URLS = {
  en: 'https://santiago-betancur-duque.vercel.app/privacy',
  es: 'https://santiago-betancur-duque.vercel.app/es/privacy'
};

describe.each(LOCALES)('PrivacyPage in "%s"', (lang) => {
  const renderPage = async () => render(await PrivacyPage(params(lang)));

  it('is a single-h1 page with the skip link target and no axe violations', async () => {
    const { container } = await renderPage();
    const { violations } = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    });

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(violations.map(({ id }) => id)).toEqual([]);
  });

  // Decreto 1377 art. 15: controller + contact; Google Analytics terms, section 7
  it("names the controller, the contact email, Google Analytics and Google's required link", async () => {
    const { container } = await renderPage();
    const { name, links } = getProfile(lang);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));

    expect(container).toHaveTextContent(name);
    expect(container).toHaveTextContent('Google Analytics');
    expect(container).toHaveTextContent('14');
    expect(hrefs).toContain(`mailto:${links.email}`);
    expect(
      hrefs.some((href) =>
        href?.startsWith('https://policies.google.com/technologies/partner-sites')
      )
    ).toBe(true);
  });

  it('links to its version in every language and back home', async () => {
    await renderPage();

    const nav = screen.getByRole('navigation');

    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/privacy', '/es/privacy']);
    expect(screen.getByRole('link', { name: /←/ })).toHaveAttribute(
      'href',
      lang === 'en' ? '/' : '/es'
    );
  });

  it('keeps itself out of search results, with its own canonical and hreflang', async () => {
    const metadata = await generateMetadata(params(lang));

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toEqual({
      canonical: URLS[lang],
      languages: { ...URLS, 'x-default': URLS.en }
    });
  });
});
