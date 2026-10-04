import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmailAddress from './EmailAddress';

describe('EmailAddress', () => {
  it('offers a line break right after the @ without changing the text', () => {
    const { container } = render(<EmailAddress email='name@example.com' />);

    expect(container).toHaveTextContent('name@example.com');
    expect(container.innerHTML).toBe('name@<wbr>example.com');
  });

  it('renders anything without an @ as is', () => {
    const { container } = render(<EmailAddress email='not-an-email' />);

    expect(container.innerHTML).toBe('not-an-email');
  });
});
