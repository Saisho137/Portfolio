import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Page - My Static App',
  description: 'This is a statically generated page with SEO metadata.'
};

export default function Home() {
  return (
    <section>
      <h1>Portfolio</h1>
    </section>
  );
}
