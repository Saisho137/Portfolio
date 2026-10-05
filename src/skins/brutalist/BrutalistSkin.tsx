'use client';

import type { FC } from 'react';

import { CopyEmail } from '@/components/CopyEmail';
import type { SectionId } from '@/content/types';
import { getLanguageLinks, PAGES, pagePath } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { formatPeriod, formatYearMonth } from '@/i18n/format';
import type { SkinProps } from '@/skins/types';

import { hand, sans } from './fonts';

import styles from './BrutalistSkin.module.css';

const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toLowerCase();

/** Bilingual label in the utrecht.jp way: active language first, the other one after */
const Kicker: FC<{ kickers: Dictionary['brutalist']['kickers']; id: SectionId }> = ({
  kickers,
  id
}) => (
  <>
    {kickers[id].main} / <span lang={kickers.altLang}>{kickers[id].alt}</span>
  </>
);

/** Hand-drawn monitor; each path is stroked in with stroke-dashoffset on mount */
const Doodle: FC<{ greeting: string }> = ({ greeting }) => (
  <svg className={styles.doodle} viewBox='0 0 420 380' aria-hidden='true'>
    <text x='40' y='70' transform='rotate(-4 40 70)'>
      {greeting}
    </text>
    <path
      className={styles.draw}
      pathLength={1}
      d='M70 130 Q205 118 340 132 L334 280 Q205 270 76 284 Z'
    />
    <path
      className={styles.draw}
      pathLength={1}
      d='M150 186 L122 206 L150 226 M262 186 L290 206 L262 226 M226 172 L188 242'
    />
    <path className={styles.draw} pathLength={1} d='M168 284 L156 336 Q206 328 258 336 L246 284' />
    <path className={styles.draw} pathLength={1} d='M300 92 Q330 70 346 96 Q360 120 382 98' />
    <rect className={styles.blink} x='306' y='242' width='14' height='22' />
  </svg>
);

/**
 * Brutalist skin inspired by utrecht.jp, loaded on demand by the SkinSwitcher:
 * one ink color on paper, 1px rules as structure, catalogue-like listings.
 */
const BrutalistSkin: FC<SkinProps> = ({ profile, dict, lang }) => {
  const { name, role, summary, about, links, projects, experience, education } = profile;
  const { certifications, languages, skills } = profile;
  const t = dict.brutalist;
  const [currentJob] = experience;
  const year = new Date().getFullYear();

  return (
    <div className={`${styles.skin} ${sans.variable} ${hand.variable}`}>
      <svg width='0' height='0' className={styles.defs} aria-hidden='true'>
        <filter id='brutalist-rough'>
          <feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves={2} seed={4} />
          <feDisplacementMap in='SourceGraphic' scale={3.5} />
        </filter>
      </svg>

      <aside className={styles.rail}>
        <a className={styles.logo} href='#about' aria-label={`${name}, ${t.backToTop}`}>
          <span className={styles.logoWord}>{initials(name)}.</span>
          <svg viewBox='0 0 120 92' aria-hidden='true'>
            <path d='M6 10 Q60 2 114 10 L112 66 Q60 60 8 66 Z' />
            <path d='M38 30 L26 38 L38 46 M82 30 L94 38 L82 46 M66 24 L54 54' />
            <path d='M44 66 L40 86 Q60 82 80 86 L76 66' />
          </svg>
        </a>
        <p className={styles.address}>
          <span>
            {name} / {role}
          </span>
          <a href={links.github}>
            ↓ {links.github.replace('https://', '')} / {t.viewSource}
          </a>
        </p>
      </aside>

      <header className={styles.masthead}>
        <nav className={styles.languages} aria-label={dict.nav.language}>
          {getLanguageLinks(lang).map(({ locale, href, name: language, current }) => (
            <a
              key={locale}
              href={href}
              hrefLang={locale}
              lang={locale}
              aria-current={current ? 'page' : undefined}
            >
              {language}
            </a>
          ))}
        </nav>
        <nav aria-label={dict.nav.primary}>
          <div className={styles.row}>
            <a href='#about'>{t.nav.about}</a>
            <a href='#experience'>{t.nav.experience}</a>
            <a href='#skills'>{t.nav.skills}</a>
            {links.email && <CopyEmail email={links.email} labels={dict.email} />}
            <div className={styles.rowEnd}>
              <a href={links.linkedin}>LinkedIn</a>
              <a href={links.github}>GitHub</a>
            </div>
          </div>
          <div className={`${styles.row} ${styles.rowPrimary}`}>
            <a href='#work'>{t.nav.work}</a>
            <div className={styles.rowEnd}>
              <a className={styles.btn} href='#contact'>
                {t.nav.contact} ( → )
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id='main' className={styles.main}>
        <section id='about' className={styles.entry}>
          <div className={styles.doodleWrap}>
            <Doodle greeting={t.greeting} />
          </div>
          <div>
            <p className={styles.kicker}>
              <Kicker kickers={t.kickers} id='about' />
            </p>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.lede}>
              <span className='visually-hidden'>{role}. </span>
              {summary}
            </p>
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <dl className={styles.credits}>
              {currentJob && (
                <div>
                  <dt>{t.currently}</dt>
                  <dd>
                    {currentJob.role} @{' '}
                    {currentJob.url ? (
                      <a href={currentJob.url}>{currentJob.company}</a>
                    ) : (
                      currentJob.company
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        <section id='work' className={styles.entry}>
          <div className={styles.listing}>
            <div className={styles.listingHead}>
              <h2 className={styles.kicker}>
                <Kicker kickers={t.kickers} id='work' />
              </h2>
              <span aria-hidden='true'>( {String(projects.length).padStart(2, '0')} )</span>
            </div>
            <ol className={styles.list}>
              {projects.map((project, index) => (
                <li key={project.name} className={styles.item}>
                  <span className={styles.num} aria-hidden='true'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {project.url ? (
                    <a className={styles.name} href={project.url}>
                      {project.name}
                    </a>
                  ) : (
                    <span className={styles.name}>{project.name}</span>
                  )}
                  <span className={styles.meta}>
                    {[project.description, project.tags?.join(', ')].filter(Boolean).join(' · ')}
                  </span>
                  {project.url && (
                    <span className={styles.arrow} aria-hidden='true'>
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className={styles.entry}>
          <section id='experience'>
            <h2 className={styles.kicker}>
              <Kicker kickers={t.kickers} id='experience' />
            </h2>
            <dl className={styles.credits}>
              {experience.map((job) => (
                <div key={`${job.company}-${job.role}`}>
                  <dt>{job.start || job.end ? formatPeriod(job, lang, t.present) : t.role}</dt>
                  <dd>
                    <strong>{job.role}</strong>,{' '}
                    {job.url ? <a href={job.url}>{job.company}</a> : job.company}
                    {job.highlights && (
                      <ul>
                        {job.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              ))}
              {education.map((item) => (
                <div key={item.institution}>
                  <dt>{t.education}</dt>
                  <dd>
                    {item.degree && (
                      <>
                        {item.degree}
                        <br />
                      </>
                    )}
                    {item.url ? <a href={item.url}>{item.institution}</a> : item.institution}
                    {item.end && <>, {formatYearMonth(item.end, lang)}</>}
                    {item.honors && <span className={styles.note}>{item.honors.join(' / ')}</span>}
                  </dd>
                </div>
              ))}
              {certifications.map((certification) => (
                <div key={certification.name}>
                  <dt>{t.certification}</dt>
                  <dd>
                    <strong>
                      {certification.url ? (
                        <a href={certification.url}>{certification.name}</a>
                      ) : (
                        certification.name
                      )}
                    </strong>
                    , {certification.issuer}, {formatYearMonth(certification.date, lang)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section id='skills'>
            <h2 className={styles.kicker}>
              <Kicker kickers={t.kickers} id='skills' />
            </h2>
            {skills.map(({ category, items }) => (
              <div key={category} className={styles.group}>
                <h3 className={styles.groupName}>{category}</h3>
                <ul className={styles.tags}>
                  {items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
            <dl className={styles.credits}>
              <div>
                <dt>{t.languages}</dt>
                {languages.map(({ name: language, level }) => (
                  // One text node: a language name alone could equal another language's label
                  <dd key={language}>{`${language} — ${level}`}</dd>
                ))}
              </div>
            </dl>
          </section>
        </div>

        <section id='contact' className={styles.entry}>
          <h2 className={styles.kicker}>
            <Kicker kickers={t.kickers} id='contact' />
          </h2>
          <div>
            <ul className={styles.bigLinks}>
              {links.email && (
                <li>
                  <CopyEmail email={links.email} labels={dict.email} />
                </li>
              )}
              <li>
                <a href={links.linkedin}>LinkedIn</a>
              </li>
              <li>
                <a href={links.github}>GitHub</a>
              </li>
            </ul>
            <p>{t.contactNote}</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          © {year} {name}
        </span>
        <a href={pagePath(lang, PAGES.privacy)}>{dict.legal.privacy}</a>
        <a href='#about'>↑ {t.top}</a>
        <div className={styles.rowEnd}>
          <a href={links.linkedin}>LinkedIn</a>
          <a href={links.github}>GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default BrutalistSkin;
