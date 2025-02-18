// layout.spec.tsx
import { render, screen } from '@testing-library/react';

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const childrenText = 'test content';

    render(
      <RootLayout>
        <div>{childrenText}</div>
      </RootLayout>
    );

    const htmlElement = document.documentElement;
    expect(htmlElement).toBeInTheDocument();

    const bodyElement = htmlElement.querySelector('body');
    expect(bodyElement).toBeInTheDocument();

    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });

  it('sets the correct lang attribute on the html element', () => {
    render(
      <RootLayout>
        <div>Contenido</div>
      </RootLayout>
    );

    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute('lang', 'es');
  });
});
