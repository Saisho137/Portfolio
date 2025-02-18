import { ClientComponent } from './clientComponent';

export const metadata = {
  title: 'Página con Server y Client Components',
  description: 'This is a statically generated page with SEO metadata.'
};

async function fetchData() {
  return { message: 'Hola desde el servidor!' };
}

export default async function Page() {
  const data = await fetchData();

  return (
    <main>
      <h1>Datos cargados desde el servidor:</h1>
      <p>{data.message}</p>
      <br />
      <ClientComponent initialMessage={data.message} />
    </main>
  );
}
