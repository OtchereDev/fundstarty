import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { useAuth } from '@pangeacyber/react-auth'
import Link from 'next/link'
import Router from 'next/router'
import AiDrawer from './AiDrawer'

export default function NavDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
  const { authenticated, login, logout } = useAuth()

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex h-full w-full max-w-sm flex-col px-4">
          <div>
            {authenticated ? (
              <>
                <Link href={'/dashboardd'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Dashboard
                  </p>
                </Link>
                <Link href={'/your-campaign'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Your Campaign
                  </p>
                </Link>
                <Link href={'/fundraisers'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Fundraiser
                  </p>
                </Link>

                <AiDrawer>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Chat with Debby (AI Assistant)
                  </p>
                </AiDrawer>

                <Link href={'/account/profile'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Profile Settings
                  </p>
                </Link>

                <button
                  onClick={() => {
                    logout()
                    Router.push('/')
                  }}
                  className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500"
                >
                  Profile Settings
                </button>
              </>
            ) : (
              <>
                <p
                  onClick={login}
                  className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500"
                >
                  Sign in
                </p>

                <p
                  onClick={login}
                  className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500"
                >
                  Sign up
                </p>

                <Link href={'/'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    About Us
                  </p>
                </Link>
              </>
            )}
          </div>
          <hr className="my-2" />
          <div className="mt-10">
            <button className="w-full rounded-md bg-[#541975] px-2 py-3 font-semibold text-gray-50 shadow-md outline-none">
              Start a Fundstart
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
