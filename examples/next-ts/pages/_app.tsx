import { AppProps } from "next/app"
import Head from "next/head"
import { pkg } from "zagf"
import "../pages/style.css"

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className="page">
      <Head>
        <title>React Machines</title>
      </Head>

      <aside className="nav">
        <header>{pkg}</header>
        {router.pathname}
      </aside>
      <Component {...pageProps} />
    </div>
  )
}
