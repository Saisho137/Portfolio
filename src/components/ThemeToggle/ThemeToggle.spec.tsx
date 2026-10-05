import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getDictionary } from '@/i18n/dictionaries';
import { THEME_COLORS, THEME_STORAGE_KEY } from '@/utils/theme';

import { mockMatchMedia } from '../../../vitest.setup';

import ThemeToggle from './ThemeToggle';

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock('@/utils/analytics', () => ({ trackEvent }));

const labels = getDictionary('en').settings.theme;

const renderToggle = () => ({
  user: userEvent.setup(),
  ...render(<ThemeToggle labels={labels} />)
});

const addThemeColorMetas = () =>
  ['light', 'dark'].forEach((scheme) => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.setAttribute('media', `(prefers-color-scheme: ${scheme})`);
    document.head.append(meta);
  });

const darkOS = () =>
  vi.stubGlobal(
    'matchMedia',
    mockMatchMedia((q) => q.includes('dark'))
  );

describe('ThemeToggle', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition');
    document.head.querySelectorAll('meta').forEach((meta) => meta.remove());
  });

  it('offers the opposite of the OS scheme when nothing is stored', () => {
    darkOS();
    renderToggle();

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('follows a theme already applied by the init script', () => {
    document.documentElement.dataset.theme = 'dark';
    renderToggle();

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('applies and persists the next theme on click', async () => {
    const { user } = renderToggle();

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    await act(() => Promise.resolve()); // MutationObserver notifies asynchronously

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(trackEvent).toHaveBeenCalledWith('theme_change', { theme: 'dark' });
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('paints the browser UI (theme-color) with the chosen theme, whatever the OS says', async () => {
    addThemeColorMetas();
    const { user } = renderToggle();

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content).toBe(
      THEME_COLORS.dark
    );
  });

  it('uses the labels of the page language', () => {
    render(<ThemeToggle labels={getDictionary('es').settings.theme} />);

    expect(screen.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument();
  });

  it('still applies the theme when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { user } = renderToggle();

    await user.click(screen.getByRole('button'));

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('animates with a View Transition unless reduced motion is requested', async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    const { user, unmount } = renderToggle();

    await user.click(screen.getByRole('button'));
    expect(startViewTransition).toHaveBeenCalledTimes(1);

    unmount();
    vi.stubGlobal(
      'matchMedia',
      mockMatchMedia((q) => q.includes('reduce'))
    );
    renderToggle();
    await user.click(screen.getByRole('button'));
    expect(startViewTransition).toHaveBeenCalledTimes(1);
  });
});
