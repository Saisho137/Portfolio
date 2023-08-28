import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/layout.module.css'

const name = 'Hi 👋, I\'m Santiago'
export const siteTitle = 'Portfolio'

export default function Layout({ children }) {
    return (
        <div style={{ minHeight: '60em' }}>
            <Head>
                <link rel="icon" href="/portfolio.ico" />
                <meta name="description" content="Santiago's Portfolio" />
                <meta name="og:title" content={siteTitle} />
            </Head>
            <header className='container'>
                <div className='row col-12 justify-content-center'>
                    <Image priority src="/images/profile.jpg" className='col-4'
                        height={400} width={300} alt="profile photo" />
                    <h1 className='col-12' >{name}</h1>
                </div>
            </header>

            <main> {children} </main>

            <footer> </footer>
        </div>
    )
}