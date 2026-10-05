import { afterEach, describe, expect, it } from 'vitest';

import {
  isTheme,
  syncThemeColor,
  THEME_COLORS,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY
} from './theme';

// The script ships as a string inlined in <head>; evaluating that exact string is the point
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const runInitScript = new Function(THEME_INIT_SCRIPT) as () => void;

const firstThemeColor = () =>
  document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

const addOsThemeColorMeta = () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.setAttribute('media', '(prefers-color-scheme: light)');
  meta.content = THEME_COLORS.light;
  document.head.append(meta);
};

describe('THEME_INIT_SCRIPT', () => {
  afterEach(() => document.head.querySelectorAll('meta').forEach((meta) => meta.remove()));

  it('applies a stored theme to <html> before paint', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    runInitScript();

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('puts a theme-color for the stored theme first, leaving the OS ones untouched', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    addOsThemeColorMeta();

    runInitScript();

    expect(firstThemeColor()?.content).toBe(THEME_COLORS.dark);
    expect(firstThemeColor()?.hasAttribute('media')).toBe(false);
    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(2);
  });

  it('ignores missing or tampered values, leaving the OS preference in charge', () => {
    runInitScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(firstThemeColor()).toBeNull();

    localStorage.setItem(THEME_STORAGE_KEY, '"><img src=x>');
    runInitScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});

describe('syncThemeColor', () => {
  afterEach(() => document.head.querySelectorAll('meta').forEach((meta) => meta.remove()));

  it('reuses a single manual theme-color, first in <head>', () => {
    addOsThemeColorMeta();

    syncThemeColor('dark');
    syncThemeColor('light');

    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(2);
    expect(firstThemeColor()?.content).toBe(THEME_COLORS.light);
    expect(firstThemeColor()?.hasAttribute('media')).toBe(false);
  });
});

describe('isTheme', () => {
  it('only accepts light and dark', () => {
    expect(['light', 'dark', 'auto', null].map(isTheme)).toEqual([true, true, false, false]);
  });
});
