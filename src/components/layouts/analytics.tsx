import Footer from '../shared/Footer'
import NavBar from '../shared/NavBar'

export default function Analystics({
  children,
  activeLink,
  title,
}: Readonly<{ children: React.ReactNode; activeLink: string; title: string }>) {
  return (
    <main className="min-h-screen bg-white">
      <NavBar activeLink={activeLink} />
      <section className="mx-auto  px-5 lg:mx-auto lg:max-w-[1280px] lg:pt-20 ">{children}</section>
      <Footer />
    </main>
  )
}
