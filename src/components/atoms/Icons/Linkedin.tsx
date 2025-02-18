import { FC } from 'react';

interface SvgProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Linkedin: FC<SvgProps> = ({ width = '19', height = '19', className = '' }) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M16 7C12.1 7 9 10.1 9 14V21C9 21.6 9.4 22 10 22H14C14.6 22 15 21.6 15 21V14C15 13.4 15.4 13 16 13C16.6 13 17 13.4 17 14V21C17 21.6 17.4 22 18 22H22C22.6 22 23 21.6 23 21V14C23 10.1 19.9 7 16 7ZM21 20H19V14C19 12.3 17.7 11 16 11C14.3 11 13 12.3 13 14V20H11V14C11 11.2 13.2 9 16 9C18.8 9 21 11.2 21 14V20Z'
      fill='currentColor'
    />
    <path
      d='M6 8H2C1.4 8 1 8.4 1 9V21C1 21.6 1.4 22 2 22H6C6.6 22 7 21.6 7 21V9C7 8.4 6.6 8 6 8ZM5 20H3V10H5V20Z'
      fill='currentColor'
    />
    <path
      d='M4 1C2.3 1 1 2.3 1 4C1 5.7 2.3 7 4 7C5.7 7 7 5.7 7 4C7 2.3 5.7 1 4 1ZM4 5C3.4 5 3 4.6 3 4C3 3.4 3.4 3 4 3C4.6 3 5 3.4 5 4C5 4.6 4.6 5 4 5Z'
      fill='currentColor'
    />
  </svg>
);
