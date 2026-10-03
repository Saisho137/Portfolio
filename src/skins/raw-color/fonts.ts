import { Martian_Mono, Newsreader } from 'next/font/google';

// Lazy skin: never preload, the fonts arrive with the skin chunk on demand
export const mono = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--raw-color-mono',
  preload: false
});

export const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--raw-color-serif',
  preload: false
});
