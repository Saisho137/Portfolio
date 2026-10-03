import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// next/font only works inside the Next compiler
const font = () => ({ className: 'font', variable: '--font', style: { fontFamily: 'font' } });

vi.mock('next/font/local', () => ({ default: font }));
vi.mock('next/font/google', () => ({
  Bricolage_Grotesque: font,
  Fragment_Mono: font
}));

afterEach(() => {
  cleanup();
});
