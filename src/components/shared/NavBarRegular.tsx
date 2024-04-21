import { useAuth } from '@pangeacyber/react-auth'
import Link from 'next/link'
import { Bars, Logo } from '../assets/icons'
import NavDrawer from './NavDrawer'

export default function NavBarRegular() {
  const { authenticated, login } = useAuth()
  return (
    <nav className="fixed left-0 top-0 z-10 w-full bg-[#e8f4fd] lg:pt-5">
      <div className="flex items-center justify-between  px-4 py-5 lg:mx-auto lg:max-w-[1280px]">
        <div className="lg:flex lg:items-center lg:gap-4">
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>

        <div className="items-center lg:flex lg:gap-5">
          <Link href={'/fundraisers'}>
            <p className="hidden cursor-pointer lg:block">Invest</p>
          </Link>
          <p className="hidden cursor-pointer lg:block">Contact us</p>
          <p className="hidden cursor-pointer lg:block">About</p>
          <NavDrawer>
            <button>
              <Bars className="lg:hidden" />
            </button>
          </NavDrawer>
          {authenticated ? (
            <Link href={'/dashboard'}>
              <button className="hidden rounded-lg border px-3 py-1.5 lg:block">Dashboard</button>
            </Link>
          ) : (
            <button onClick={login} className="nav-button  bg-[#D2DEEB]">
              Login / Singup
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
