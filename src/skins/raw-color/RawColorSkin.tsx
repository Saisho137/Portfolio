'use client';

import { FC } from 'react';

import { profile, SECTIONS } from '@/content';
import { SITE_URL } from '@/utils/constants';

import { mono, serif } from './fonts';

import styles from './RawColorSkin.module.css';

/**
 * "View source" skin, loaded on demand by the SkinSwitcher.
 * Elements with `data-t` print their own open/close tags (and `data-a` attributes)
 * through ::before/::after; the decoration is hidden from assistive tech in CSS.
 */
const RawColorSkin: FC = () => {
  const { name, role, summary, about, links, projects, experience, education, skills } = profile;
  const year = new Date().getFullYear();
  const showDescription = projects.some((project) => project.description);
  const showStack = projects.some((project) => project.tags?.length);

  return (
    <div className={`${styles.skin} ${mono.variable} ${serif.variable}`}>
      <div className={styles.chrome}>
        <span>
          view-source:<b>{SITE_URL}</b>
        </span>
      </div>

      <div className={styles.doctype} aria-hidden='true'>
        &lt;!DOCTYPE html&gt;
      </div>

      <div className={styles.b} data-t='head' aria-hidden='true'>
        <span className={`${styles.i} ${styles.titleLine}`} data-t='title'>
          {name} — {role}
        </span>
        <span
          className={styles.i}
          data-t='meta'
          data-a={` name="description" content="${summary}"`}
          data-void=''
        />
      </div>

      <div className={styles.b} data-t='body'>
        <header className={styles.b} data-t='header'>
          <nav className={styles.b} data-t='nav' aria-label='Primary'>
            <ul className={`${styles.b} ${styles.navList}`} data-t='ul'>
              {SECTIONS.map(({ id, label }) => (
                <li key={id} className={styles.i} data-t='li'>
                  <a data-t='a' data-a={` href="#${id}"`} href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className={styles.b} data-t='main'>
          <section id='about' className={styles.b} data-t='section' data-a=' id="about"'>
            <h1 className={styles.i} data-t='h1'>
              {name}
              <span className={styles.cursor} aria-hidden='true' />
            </h1>
            <p className={`${styles.i} ${styles.lede}`} data-t='p'>
              <span className='visually-hidden'>{role}. </span>
              {summary}
            </p>
            {about.map((paragraph) => (
              <p key={paragraph} className={styles.i} data-t='p'>
                {paragraph}
              </p>
            ))}
          </section>

          <section id='work' className={styles.b} data-t='section' data-a=' id="work"'>
            <h2 className={styles.i} data-t='h2'>
              Projects
            </h2>
            <span className={styles.comment} aria-hidden='true'>
              &lt;!-- selected work --&gt;
            </span>
            <div className={styles.b} data-t='table' data-a=' border="1"'>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>name</th>
                    {showDescription && <th scope='col'>what</th>}
                    {showStack && <th scope='col'>stack</th>}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.name}>
                      <td>{String(index + 1).padStart(2, '0')}</td>
                      <td>
                        <strong>
                          {project.url ? <a href={project.url}>{project.name}</a> : project.name}
                        </strong>
                      </td>
                      {showDescription && <td>{project.description}</td>}
                      {showStack && <td>{project.tags?.join(' · ')}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id='experience' className={styles.b} data-t='section' data-a=' id="experience"'>
            <h2 className={styles.i} data-t='h2'>
              Experience
            </h2>
            <dl className={`${styles.b} ${styles.dl}`} data-t='dl'>
              {experience.map((job) => (
                <div key={`${job.company}-${job.role}`}>
                  <dt className={styles.i} data-t='dt'>
                    {job.start || job.end ? `${job.start ?? ''} — ${job.end ?? 'now'}` : 'role'}
                  </dt>
                  <dd className={styles.i} data-t='dd'>
                    <strong>{job.role}</strong> at{' '}
                    {job.url ? (
                      <a data-t='a' href={job.url}>
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </dd>
                </div>
              ))}
              {education.map((item) => (
                <div key={item.institution}>
                  <dt className={styles.i} data-t='dt'>
                    education
                  </dt>
                  <dd className={styles.i} data-t='dd'>
                    {item.degree && <>{item.degree} — </>}
                    {item.url ? (
                      <a data-t='a' href={item.url}>
                        {item.institution}
                      </a>
                    ) : (
                      item.institution
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id='skills' className={styles.b} data-t='section' data-a=' id="skills"'>
            <h2 className={styles.i} data-t='h2'>
              Skills
            </h2>
            <ul className={`${styles.b} ${styles.skills}`} data-t='ul'>
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section id='contact' className={styles.b} data-t='section' data-a=' id="contact"'>
            <h2 className={styles.i} data-t='h2'>
              Contact
            </h2>
            <p className={styles.i} data-t='p'>
              Open to frontend roles and collaborations.
            </p>
            <ul className={styles.contact}>
              {links.email && (
                <li>
                  <a data-t='a' href={`mailto:${links.email}`}>
                    {links.email}
                  </a>
                </li>
              )}
              <li>
                <a data-t='a' href={links.github}>
                  GitHub
                </a>
              </li>
              <li>
                <a data-t='a' href={links.linkedin}>
                  LinkedIn
                </a>
              </li>
            </ul>
          </section>
        </main>

        <footer className={styles.b} data-t='footer'>
          <p className={styles.i} data-t='p'>
            © {year} {name}
          </p>
          <span className={styles.comment} aria-hidden='true'>
            &lt;!-- same content, different markup. try the other styles --&gt;
          </span>
        </footer>
      </div>
    </div>
  );
};

export default RawColorSkin;
