import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_STORAGE_KEY } from '@/utils/theme';

import { mockMatchMedia } from '../../../vitest.setup';

import ThemeToggle from './ThemeToggle';

const darkOS = () =>
  vi.stubGlobal(
    'matchMedia',
    mockMatchMedia((q) => q.includes('dark'))
  );

describe('ThemeToggle', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition');
  });

  it('offers the opposite of the OS scheme when nothing is stored', () => {
    darkOS();
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('follows a theme already applied by the init script', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('applies and persists the next theme on click', async () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    await act(() => Promise.resolve()); // MutationObserver notifies asynchronously

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('still applies the theme when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('animates with a View Transition unless reduced motion is requested', () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.assign(document, { startViewTransition });
    const { unmount } = render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button'));
    expect(startViewTransition).toHaveBeenCalledTimes(1);

    unmount();
    vi.stubGlobal(
      'matchMedia',
      mockMatchMedia((q) => q.includes('reduce'))
    );
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(startViewTransition).toHaveBeenCalledTimes(1);
  });
});
