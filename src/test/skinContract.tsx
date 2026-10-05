import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/content';
import { LOCALES, localePath, otherLocales, PAGES, pagePath } from '@/i18n/config';
import { formatYearMonth } from '@/i18n/format';
import type { SkinProps } from '@/skins/types';

import { skinProps, textNodes, textsOnlyIn } from './skinProps';

/**
 * Every skin renders the same profile with its own markup, in every language.
 * This is the shared contract: one h1, a <main id="main"> for the skip link, every
 * section + nav anchor, all the content, links to every language, no text from another
 * language and no axe violations.
 */
export const itFulfillsTheSkinContract = (Skin: ComponentType<SkinProps>) => {
  describe.each(LOCALES)('in "%s"', (lang) => {
    const props = skinProps(lang);
    const { profile, dict } = props;
    const renderSkin = () => render(<Skin {...props} />);

    it('renders a single h1 named after the profile', () => {
      renderSkin();

      const headings = screen.getAllByRole('heading', { level: 1 });

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveAccessibleName(profile.name);
    });

    it('exposes <main id="main"> as the skip link target', () => {
      renderSkin();

      expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    });

    it('has no axe violations', async () => {
      const { container } = renderSkin();
      // jsdom has no layout/computed colors: contrast is checked in a real browser instead
      const { violations } = await axe.run(container, {
        rules: { 'color-contrast': { enabled: false } }
      });

      expect(violations.map(({ id, help, nodes }) => `${id}: ${help} (${nodes.length})`)).toEqual(
        []
      );
    });

    it('renders every shared section and a primary nav link to each', () => {
      const { container } = renderSkin();
      const nav = screen.getByRole('navigation', { name: dict.nav.primary });

      SECTION_IDS.forEach((id) => {
        expect(container.querySelector(`#${id}`)).toBeInTheDocument();
        expect(
          within(nav)
            .getAllByRole('link')
            .map((link) => link.getAttribute('href'))
        ).toContain(`#${id}`);
      });
    });

    it('renders all the profile content', () => {
      const { container } = renderSkin();
      const text = container.textContent?.toLowerCase() ?? '';

      [
        profile.summary,
        ...profile.about,
        ...profile.projects.map((project) => project.name),
        ...profile.skills.flatMap(({ category, items }) => [category, ...items]),
        ...profile.experience.flatMap((job) => [job.role, job.company, ...(job.highlights ?? [])]),
        ...profile.education.flatMap((item) => [item.institution, ...(item.honors ?? [])]),
        ...profile.certifications.flatMap((certification) => [
          certification.name,
          certification.issuer
        ]),
        ...profile.languages.flatMap((language) => [language.name, language.level])
      ].forEach((value) => expect(text).toContain(value.toLowerCase()));
    });

    it('dates positions, studies and certifications in the page language', () => {
      const { container } = renderSkin();
      const text = container.textContent ?? '';

      [
        ...profile.experience.flatMap(({ start, end }) => [start, end]),
        ...profile.education.map(({ end }) => end),
        ...profile.certifications.map(({ date }) => date)
      ]
        .filter((date): date is string => Boolean(date))
        .forEach((date) => expect(text).toContain(formatYearMonth(date, lang)));
    });

    it('links to every profile', () => {
      renderSkin();

      const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));

      expect(hrefs).toContain(profile.links.github);
      expect(hrefs).toContain(profile.links.linkedin);
      if (profile.links.email) expect(hrefs).toContain(`mailto:${profile.links.email}`);
      profile.certifications.forEach(({ url }) => url && expect(hrefs).toContain(url));
    });

    it('links to the privacy notice in its language from the footer', () => {
      renderSkin();

      const footer = screen.getByRole('contentinfo');

      expect(
        within(footer).getByRole('link', { name: new RegExp(dict.legal.privacy, 'i') })
      ).toHaveAttribute('href', pagePath(lang, PAGES.privacy));
    });

    it('links to every language version with real links, marking the current one', () => {
      renderSkin();

      const nav = screen.getByRole('navigation', { name: dict.nav.language });

      LOCALES.forEach((locale) => {
        const link = within(nav)
          .getAllByRole('link')
          .find((item) => item.getAttribute('hreflang') === locale);

        expect(link).toHaveAttribute('href', localePath(locale));
        expect(link).toHaveAttribute('lang', locale);
        if (locale === lang) expect(link).toHaveAttribute('aria-current', 'page');
        else expect(link).not.toHaveAttribute('aria-current');
      });
    });

    it('shows no text that belongs to another language', () => {
      const { container } = renderSkin();
      const foreign = new Set(otherLocales(lang).flatMap((other) => textsOnlyIn(other, lang)));

      expect(textNodes(container).filter((text) => foreign.has(text))).toEqual([]);
    });
  });
};
