import { render, screen, fireEvent } from '@testing-library/react';

import ClientComponent from './ClientComponent';

describe('ClientComponent', () => {
  it('renders initial message correctly', () => {
    render(<ClientComponent initialMessage='Mensaje inicial' />);

    expect(screen.getByText('Este es un componente del cliente')).toBeInTheDocument();
    expect(screen.getByText('Mensaje inicial: Mensaje inicial')).toBeInTheDocument();
  });

  it('updates message on button click', () => {
    render(<ClientComponent initialMessage='Mensaje inicial' />);

    const button = screen.getByText('Actualizar mensaje');
    fireEvent.click(button);

    expect(
      screen.getByText('Mensaje inicial: Mensaje actualizado desde el cliente!')
    ).toBeInTheDocument();
  });
});
