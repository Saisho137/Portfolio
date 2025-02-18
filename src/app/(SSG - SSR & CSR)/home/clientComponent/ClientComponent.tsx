'use client';

import { FC, useState } from 'react';

import styles from './clientComponent.module.scss';

interface ClientComponentProps {
  initialMessage: string;
}

const ClientComponent: FC<ClientComponentProps> = ({ initialMessage }) => {
  const [message, setMessage] = useState(initialMessage);

  return (
    <section className={styles.container}>
      <h2>Este es un componente del cliente</h2>
      <p>Mensaje inicial: {message}</p>
      <button onClick={() => setMessage('Mensaje actualizado desde el cliente!')}>
        Actualizar mensaje
      </button>
    </section>
  );
};

export default ClientComponent;
