import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BaseLayout from './BaseLayout';

describe('BaseLayout', () => {
  it('renders header, main content and footer', () => {
    render(
      <BaseLayout>
        <div>Test</div>
      </BaseLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Test');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
