import { render, screen } from '@testing-library/react';

import Home from './page';

describe('Home Page', () => {
  it('renders the Home component', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Portfolio/i });
    expect(heading).toBeInTheDocument();
  });
});
