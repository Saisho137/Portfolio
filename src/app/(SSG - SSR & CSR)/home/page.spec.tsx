import { render, screen } from '@testing-library/react';

import Home from './page';

jest.mock('./clientComponent', () => ({
  ClientComponent: ({ initialMessage }: { initialMessage: string }) => <div>{initialMessage}</div>
}));

describe('Page component', () => {
  it('renders server data correctly', async () => {
    render(await Home());

    expect(await screen.findByText('Datos cargados desde el servidor:')).toBeInTheDocument();
    expect(await screen.findAllByText('Hola desde el servidor!')).toHaveLength(2);
  });

  it('renders ClientComponent with initial message', async () => {
    render(await Home());

    const elements = await screen.findAllByText('Hola desde el servidor!');
    expect(elements).toHaveLength(2);
  });
});
