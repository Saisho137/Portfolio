import Image from 'next/image';
import { FC } from 'react';

import { getProjectImage, SECTION_IDS } from '@/content';
import { getLanguageLinks } from '@/i18n/config';
import type { SkinProps } from '@/skins/types';

import { mono, sans } from './fonts';

import styles from './RawBwSkin.module.css';

/**
 * Default skin and canonical content: the only one rendered in the HTML.
 * Every element with `data-el` is drawn as a DevTools-like inspected box,
 * with the selector printed on its corner (decoration hidden from AT in CSS).
 */
const RawBwSkin: FC<SkinProps> = ({ profile, dict, lang }) => {
  const { name, role, summary, about, links, projects, experience, education, skills } = profile;
  const t = dict.rawBw;
  const year = new Date().getFullYear();

  return (
    <div className={`${styles.skin} ${mono.variable} ${sans.variable}`}>
      <header className={styles.bar} data-el='header.bar'>
        <nav className={styles.flat} data-el='nav' aria-label={dict.nav.primary}>
          <ul className={styles.nav}>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{dict.sections[id]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav className={styles.flat} data-el='nav.lang' aria-label={dict.nav.language}>
          <ul className={styles.nav}>
            {getLanguageLinks(lang).map(({ locale, href, name: language, current }) => (
              <li key={locale}>
                <a
                  href={href}
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
      </header>

      <main id='main' className={styles.main} data-el='main'>
        <section id='about' className={styles.hero} data-el='section#about'>
          <h1 data-el='h1'>
            <span className={styles.bracket} aria-hidden='true'>
              &lt;
            </span>
            {name}
            <span className={styles.bracket} aria-hidden='true'>
              /&gt;
            </span>
            <span className={styles.caret} aria-hidden='true' />
          </h1>
          <div className={styles.heroRow}>
            <p className={`${styles.lede} ${styles.flat}`} data-el='p.lede'>
              <span className='visually-hidden'>{role}. </span>
              {summary}
            </p>
            <div className={styles.about}>
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section id='work' data-el='section#work'>
          <h2>{t.work}</h2>
          <div className={styles.grid}>
            {projects.map((project) => (
              <article key={project.name} className={styles.card} data-el='article.card'>
                {project.image ? (
                  <Image
                    className={styles.shot}
                    src={getProjectImage(project.image.id)}
                    alt={project.image.alt}
                    placeholder='blur'
                    sizes='(width >= 62rem) 30vw, (width >= 40rem) 45vw, 90vw'
                  />
                ) : (
                  <div className={`${styles.shot} ${styles.placeholder}`} aria-hidden='true'>
                    {t.noImage}
                  </div>
                )}
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                {(project.tags || project.url) && (
                  <div className={styles.meta}>
                    {project.tags && <span>{project.tags.join(' · ')}</span>}
                    {project.url && (
                      <a href={project.url}>
                        {t.view}
                        <span className='visually-hidden'> {project.name}</span> →
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <div className={styles.cols}>
          <section id='experience' data-el='section#experience'>
            <h2>{t.experience}</h2>
            <ol className={styles.timeline}>
              {experience.map((job) => (
                <li key={`${job.company}-${job.role}`}>
                  {(job.start || job.end) && (
                    <span className={styles.dim}>
                      {job.start} — {job.end ?? t.now}
                    </span>
                  )}
                  <span>
                    <strong>{job.role}</strong> ·{' '}
                    {job.url ? <a href={job.url}>{job.company}</a> : job.company}
                  </span>
                </li>
              ))}
            </ol>
            <h3 className={styles.subhead}>{t.education}</h3>
            <ul className={styles.timeline}>
              {education.map((item) => (
                <li key={item.institution}>
                  {item.degree && <strong>{item.degree}</strong>}
                  <span>
                    {item.url ? <a href={item.url}>{item.institution}</a> : item.institution}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id='skills' data-el='section#skills'>
            <h2>{t.skills}</h2>
            <ul className={styles.skills}>
              {skills.map((skill) => (
                <li key={skill}>{skill.toLowerCase()}</li>
              ))}
            </ul>
          </section>
        </div>

        <section id='contact' className={styles.contact} data-el='section#contact'>
          <p className={styles.dim}>{t.contactNote}</p>
          <h2>{t.contact}</h2>
          <ul className={styles.contactLinks}>
            {links.email && (
              <li>
                <a href={`mailto:${links.email}`}>{links.email}</a>
              </li>
            )}
            <li>
              <a href={links.github}>github</a>
            </li>
            <li>
              <a href={links.linkedin}>linkedin</a>
            </li>
          </ul>
        </section>
      </main>

      <footer className={styles.foot} data-el='footer'>
        <span>
          © {year} {name.toLowerCase()}
        </span>
        <span>
          <a href={links.github}>github</a> · <a href={links.linkedin}>linkedin</a>
        </span>
      </footer>
    </div>
  );
};

export default RawBwSkin;
