import Head from 'next/head'
import Footer from '../shared/Footer'
import NavBar from '../shared/NavBar'

export default function Dashboard({
  children,
  title,
  activeLink,
}: Readonly<{ children: React.ReactNode; title: string; activeLink: string }>) {
  return (
    <main className="min-h-screen bg-[#f5f6f7]">
      <Head>
        <title>FundStart - {title}</title>
      </Head>
      <NavBar activeLink={activeLink} />
      <section className="page-max mx-auto  lg:pb-20 lg:pt-20">{children}</section>
      <Footer />
    </main>
  )
}
