import { describe, expect, it } from 'vitest';

import { isTheme, THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from './theme';

// The script ships as a string inlined in <head>; evaluating that exact string is the point
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const runInitScript = new Function(THEME_INIT_SCRIPT) as () => void;

describe('THEME_INIT_SCRIPT', () => {
  it('applies a stored theme to <html> before paint', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    runInitScript();

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('ignores missing or tampered values, leaving the OS preference in charge', () => {
    runInitScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();

    localStorage.setItem(THEME_STORAGE_KEY, '"><img src=x>');
    runInitScript();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});

describe('isTheme', () => {
  it('only accepts light and dark', () => {
    expect(['light', 'dark', 'auto', null].map(isTheme)).toEqual([true, true, false, false]);
  });
});
