import { FC } from 'react';

interface SvgProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Facebook: FC<SvgProps> = ({ width = '19', height = '19', className = '' }) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M18 7C18.6 7 19 6.6 19 6V2C19 1.4 18.6 1 18 1H15C11.7 1 9 3.7 9 7V9H7C6.4 9 6 9.4 6 10V14C6 14.6 6.4 15 7 15H9V22C9 22.6 9.4 23 10 23H14C14.6 23 15 22.6 15 22V15H17C17.5 15 17.9 14.7 18 14.2L19 10.2C19.1 9.9 19 9.6 18.8 9.3C18.6 9 18.3 9 18 9H15V7H18ZM14 11H16.7L16.2 13H14C13.4 13 13 13.4 13 14V21H11V14C11 13.4 10.6 13 10 13H8V11H10C10.6 11 11 10.6 11 10V7C11 4.8 12.8 3 15 3H17V5H15C13.9 5 13 5.9 13 7V10C13 10.6 13.4 11 14 11Z'
      fill='currentColor'
    />
  </svg>
);
