import { useAuth } from '@pangeacyber/react-auth'
import Link from 'next/link'
import { Bars, CirclePerson, Cog, Logo, Zap } from '../assets/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import NavDrawer from './NavDrawer'

export default function NavBar({ activeLink }: { activeLink?: string }) {
  const { authenticated, login, logout } = useAuth()
  return (
    <nav className="fixed left-0 top-0 z-10 w-full bg-white shadow">
      <div className="flex items-center justify-between  px-4 py-5 lg:mx-auto lg:max-w-[1280px]">
        <div className="lg:flex lg:items-center lg:gap-4">
          <Link href={'/'}>
            <Logo />
          </Link>
          <Link href={'/dashboard'}>
            <button className={`nav-button ${activeLink == 'Dashboard' ? 'bg-[#D2DEEB]' : ''}`}>
              Dashboard
            </button>
          </Link>
          <Link href={'/your-campaign'}>
            <button className={`nav-button ${activeLink == 'YourCampaign' ? 'bg-[#D2DEEB]' : ''}`}>
              Your campaign
            </button>
          </Link>
          <Link href={'/fundraisers'}>
            <button className={`nav-button ${activeLink == 'Fundraisers' ? 'bg-[#D2DEEB]' : ''}`}>
              Fundraiser
            </button>
          </Link>
        </div>

        <div className="items-center lg:flex lg:gap-5">
          <NavDrawer>
            <button>
              <Bars className="lg:hidden" />
            </button>
          </NavDrawer>
          {authenticated ? (
            <>
              <button className="hidden rounded-lg border px-3 py-1.5 lg:block">
                <Zap />
              </button>

              <Link href={'/account/profile'}>
                <button className=" hidden lg:block">
                  <Cog />
                </button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className=" hidden lg:block">
                    <CirclePerson />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>

                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Email</DropdownMenuItem>
                          <DropdownMenuItem>Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>New Team</DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
