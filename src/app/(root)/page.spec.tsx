import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1, name: /Santiago Betancur Duque/i });
    expect(heading).toBeInTheDocument();
  });
});
