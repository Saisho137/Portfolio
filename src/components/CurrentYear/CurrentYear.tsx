'use client';

import { type FC, useSyncExternalStore } from 'react';

// The year never changes while the page is open: nothing to subscribe to
const subscribe = () => () => undefined;
const getYear = () => new Date().getFullYear();

/**
 * The page is prerendered at build time, so the HTML carries the build year. Hydration
 * starts from that same value (no mismatch) and then swaps in the visitor's current year:
 * the footer stays right on January 1st without a redeploy.
 */
const CurrentYear: FC<{ buildYear: number }> = ({ buildYear }) =>
  useSyncExternalStore(subscribe, getYear, () => buildYear);

export default CurrentYear;
