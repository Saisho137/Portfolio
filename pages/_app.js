import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from 'react'
import "../styles/global.css"

export default function App({ Component, pageProps }) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  return (
    <>
      <Component {...pageProps} />
    </>
  )
}