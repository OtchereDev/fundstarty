import Description from '@/components/detail/Description'
import Header from '@/components/detail/Header'
import Dashboard from '@/components/layouts/dashboard'

export default function Detail() {
  return (
    <Dashboard>
      <main className="pb-10">
        <Header />
        <Description />
      </main>
    </Dashboard>
  )
}
