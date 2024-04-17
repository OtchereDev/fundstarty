import Footer from '../shared/Footer'
import NavBar from '../shared/NavBar'

export default function Dashboard({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#f5f6f7]">
      <NavBar />
      <section className="page-max mx-auto  lg:pb-20 lg:pt-20">{children}</section>
      <Footer />
    </main>
  )
}
