import { Caveat, Schibsted_Grotesk } from 'next/font/google';

// Lazy skin: never preload, the fonts arrive with the skin chunk on demand
export const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--brutalist-sans',
  preload: false
});

export const hand = Caveat({
  subsets: ['latin'],
  weight: '600',
  variable: '--brutalist-hand',
  preload: false
});
