import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// next/font only works inside the Next compiler
const font = () => ({ className: 'font', variable: '--font', style: { fontFamily: 'font' } });

vi.mock('next/font/local', () => ({ default: font }));
vi.mock('next/font/google', () => ({
  Bricolage_Grotesque: font,
  Caveat: font,
  Fragment_Mono: font,
  Martian_Mono: font,
  Newsreader: font,
  Schibsted_Grotesk: font
}));

// jsdom has no matchMedia: default to light scheme and no reduced motion. Tests can
// override it with vi.stubGlobal('matchMedia', ...)
export const mockMatchMedia = (matches: (query: string) => boolean) =>
  vi.fn((query: string) => ({
    matches: matches(query),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    mockMatchMedia(() => false)
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  // Specs that opt into `@vitest-environment node` have no DOM
  if (typeof document === 'undefined') return;
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});
