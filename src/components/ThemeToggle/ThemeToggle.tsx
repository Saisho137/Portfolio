'use client';

import { FC, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

import { isTheme, THEME_STORAGE_KEY, type Theme } from '@/utils/theme';

import styles from './ThemeToggle.module.css';

const DARK_QUERY = '(prefers-color-scheme: dark)';

// Effective theme: the manual choice on <html data-theme>, otherwise the OS preference
const getTheme = (): Theme => {
  const forced = document.documentElement.dataset.theme;
  if (isTheme(forced)) return forced;

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY);
  const observer = new MutationObserver(onChange);

  media.addEventListener('change', onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });

  return () => {
    media.removeEventListener('change', onChange);
    observer.disconnect();
  };
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / blocked storage: the theme still applies for this visit
  }
};

const SunIcon: FC = () => (
  <svg viewBox='0 0 24 24' width={20} height={20} aria-hidden='true'>
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
  </svg>
);

const MoonIcon: FC = () => (
  <svg viewBox='0 0 24 24' width={20} height={20} aria-hidden='true'>
    <path d='M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a7 7 0 0 0 10.6 10.6Z' />
  </svg>
);

const ThemeToggle: FC = () => {
  // null on the server: the real theme is only known in the browser
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  const toggle = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof document.startViewTransition === 'function' && !reduceMotion) {
      document.startViewTransition(() => flushSync(() => applyTheme(next)));
    } else {
      applyTheme(next);
    }
  };

  return (
    <button
      type='button'
      className={styles.toggle}
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} theme` : 'Toggle color theme'}
      title={theme ? `Switch to ${next} theme` : undefined}
    >
      {/* Shows the theme you get by pressing it */}
      {next === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
