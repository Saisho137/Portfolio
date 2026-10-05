import type { FC } from 'react';

import styles from './SkinSwitcher.module.css';

// Decorative: the radio labels carry the accessible names
const svgProps = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
} as const;

export const BrushIcon: FC = () => (
  <svg {...svgProps} stroke='currentColor'>
    <path d='M18.4 2.6a2 2 0 0 1 2.9 2.9L11 15.8l-3-3Z' />
    <path d='M8 12.8c-2.2 0-4 1.8-4 4 0 1.5-.8 2.7-2 3.2 1 .7 2.4 1 4 1 3.3 0 5-2 5-5.2' />
  </svg>
);

export const CodeColorIcon: FC = () => (
  <svg {...svgProps}>
    <path className={styles.codeLt} d='M8 6 2 12l6 6' />
    <path className={styles.codeSlash} d='M14 4 10 20' />
    <path className={styles.codeGt} d='m16 6 6 6-6 6' />
  </svg>
);

export const CodeBwIcon: FC = () => (
  <svg {...svgProps} stroke='currentColor'>
    <path d='M8 6 2 12l6 6' />
    <path d='M14 4 10 20' />
    <path d='m16 6 6 6-6 6' />
  </svg>
);
