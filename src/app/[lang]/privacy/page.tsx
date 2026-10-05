import type { Metadata } from 'next';

import { getProfile } from '@/content';
import { getLanguageLinks, PAGES, pageAlternates, pagePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { formatYearMonth } from '@/i18n/format';

import { type LangParams, resolveLang } from '../params';

import { getNotice, NOTICE_UPDATED } from './notice';

import styles from './page.module.css';

// Inherits the site metadata from the [lang] layout; only what differs is set here.
// Out of search results and the sitemap: it is reachable from every footer
export const generateMetadata = async (props: LangParams): Promise<Metadata> => {
  const lang = await resolveLang(props);
  const { title, description } = getNotice(lang, null);
  const languages = pageAlternates(PAGES.privacy);

  return {
    title,
    description,
    alternates: { canonical: languages[lang], languages },
    robots: { index: false, follow: true }
  };
};

/** Static privacy notice: no client JS, works the same in every skin and without JS */
export default async function PrivacyPage(props: LangParams) {
  const lang = await resolveLang(props);
  const { name, links } = getProfile(lang);
  const email = links.email ? <a href={`mailto:${links.email}`}>{links.email}</a> : name;
  const notice = getNotice(lang, email);

  return (
    <main id='main' className={styles.page}>
      <nav className={styles.top} aria-label={getDictionary(lang).nav.language}>
        <ul>
          {getLanguageLinks(lang).map(({ locale, name: language, current }) => (
            <li key={locale}>
              <a
                href={pagePath(locale, PAGES.privacy)}
                hrefLang={locale}
                lang={locale}
                aria-current={current ? 'page' : undefined}
              >
                {language}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <h1>{notice.title}</h1>
      {notice.sections.map(({ heading, body }) => (
        <section key={heading}>
          <h2>{heading}</h2>
          <p>{body}</p>
        </section>
      ))}
      <p className={styles.dim}>
        {notice.updated}:{' '}
        <time dateTime={NOTICE_UPDATED}>{formatYearMonth(NOTICE_UPDATED, lang)}</time>
      </p>
      <p>
        <a href={getLanguageLinks(lang).find(({ current }) => current)?.href}>← {notice.home}</a>
      </p>
    </main>
  );
}
