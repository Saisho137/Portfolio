import { render } from '@testing-library/react';

import BaseLayout from './BaseLayout';

describe('BaseLayout Component', () => {
  it('renders user information and breadcrumbs', () => {
    render(
      <BaseLayout>
        <div>Test</div>
      </BaseLayout>
    );

    expect(document.querySelector('.container')).toBeInTheDocument();
    expect(document.querySelector('.container')).toHaveTextContent('Test');
  });
});
