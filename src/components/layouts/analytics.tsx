import Footer from '../shared/Footer'
import NavBar from '../shared/NavBar'

export default function Analystics({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-white">
      <NavBar />
      <section className="mx-auto  px-5 lg:mx-auto lg:max-w-[1280px] lg:pt-20 ">{children}</section>
      <Footer />
    </main>
  )
}
