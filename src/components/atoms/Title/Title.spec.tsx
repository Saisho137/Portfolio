import { screen, render } from '@testing-library/react';

import Title from './Title';

describe('Title tests', () => {
  const titleString = 'Title';

  test('should work', () => {
    const { container } = render(<Title title={titleString} />);
    const title = screen.getByText(titleString);

    expect(container).toBeTruthy();
    expect(title).toBeInTheDocument();
  });
});
