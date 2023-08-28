import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className='' >
        <p>A passionate Software Engineer in training from Colombia</p>
      </section>
    </Layout>
  );
}
