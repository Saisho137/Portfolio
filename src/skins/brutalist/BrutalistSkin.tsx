'use client';

import { FC } from 'react';

import { profile } from '@/content';

import { hand, sans } from './fonts';

import styles from './BrutalistSkin.module.css';

const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toLowerCase();

/** Hand-drawn monitor; each path is stroked in with stroke-dashoffset on mount */
const Doodle: FC = () => (
  <svg className={styles.doodle} viewBox='0 0 420 380' aria-hidden='true'>
    <text x='40' y='70' transform='rotate(-4 40 70)'>
      ¡hola!!!
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
const BrutalistSkin: FC = () => {
  const { name, role, summary, about, links, projects, experience, education, skills } = profile;
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
        <a className={styles.logo} href='#about' aria-label={`${name}, back to top`}>
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
          <a href={links.github}>↓ {links.github.replace('https://', '')} / View source</a>
        </p>
      </aside>

      <header className={styles.masthead}>
        <nav aria-label='Primary'>
          <div className={styles.row}>
            <a href='#about'>About</a>
            <a href='#experience'>Experience</a>
            <a href='#skills'>Skills</a>
            {links.email && <a href={`mailto:${links.email}`}>{links.email}</a>}
            <div className={styles.rowEnd}>
              <a href={links.linkedin}>LinkedIn</a>
              <a href={links.github}>GitHub</a>
            </div>
          </div>
          <div className={`${styles.row} ${styles.rowPrimary}`}>
            <a href='#work'>All Projects</a>
            <div className={styles.rowEnd}>
              <a className={styles.btn} href='#contact'>
                Contact ( → )
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id='main' className={styles.main}>
        <section id='about' className={styles.entry}>
          <div className={styles.doodleWrap}>
            <Doodle />
          </div>
          <div>
            <p className={styles.kicker}>
              <span lang='es'>Información</span> / Information
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
                  <dt>Currently:</dt>
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
                <span lang='es'>Proyectos</span> / Selected Projects
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
              <span lang='es'>Experiencia</span> / Experience
            </h2>
            <dl className={styles.credits}>
              {experience.map((job) => (
                <div key={`${job.company}-${job.role}`}>
                  <dt>
                    {job.start || job.end ? `${job.start ?? ''} — ${job.end ?? 'Present'}` : 'Role'}
                  </dt>
                  <dd>
                    <strong>{job.role}</strong>,{' '}
                    {job.url ? <a href={job.url}>{job.company}</a> : job.company}
                  </dd>
                </div>
              ))}
              {education.map((item) => (
                <div key={item.institution}>
                  <dt>Education:</dt>
                  <dd>
                    {item.degree && (
                      <>
                        {item.degree}
                        <br />
                      </>
                    )}
                    {item.url ? <a href={item.url}>{item.institution}</a> : item.institution}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section id='skills'>
            <h2 className={styles.kicker}>
              <span lang='es'>Habilidades</span> / Skills
            </h2>
            <ul className={styles.tags}>
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>

        <section id='contact' className={styles.entry}>
          <h2 className={styles.kicker}>
            <span lang='es'>Contacto</span> / Contact
          </h2>
          <div>
            <ul className={styles.bigLinks}>
              {links.email && (
                <li>
                  <a href={`mailto:${links.email}`}>{links.email}</a>
                </li>
              )}
              <li>
                <a href={links.linkedin}>LinkedIn</a>
              </li>
              <li>
                <a href={links.github}>GitHub</a>
              </li>
            </ul>
            <p>Open to frontend roles and collaborations.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          © {year} {name}
        </span>
        <a href='#about'>↑ Back to top</a>
        <div className={styles.rowEnd}>
          <a href={links.linkedin}>LinkedIn</a>
          <a href={links.github}>GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default BrutalistSkin;
