import { render, screen } from '@testing-library/react';

import Home from './page';

describe('Home Page', () => {
  it('renders the Home component', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Root content/i });
    expect(heading).toBeInTheDocument();
  });

  /*  it('has correct metadata', () => {
    expect(document.title).toBe('Home Page - My Static App');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('This is a statically generated page with SEO metadata.');
  }); */
});
