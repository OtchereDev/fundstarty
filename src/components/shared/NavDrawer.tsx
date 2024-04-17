import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import Link from 'next/link'

export default function NavDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = null
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm px-4">
          <div className="mb-3 text-right text-xl"></div>
          <div>
            {user ? (
              <span className="mr-2 cursor-pointer text-lg hover:text-gray-500">Profile</span>
            ) : (
              <>
                <Link href={'/sign-in'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Sign in
                  </p>
                </Link>
                <Link href={'/sign-up'}>
                  <p className="mb-4 mr-2 cursor-pointer text-xl font-semibold text-[#541975] hover:text-gray-500">
                    Sign up
                  </p>
                </Link>
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
          <DrawerFooter className="mt-20 px-0">
            <DrawerClose asChild>
              <button className="rounded-xl border py-2.5">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
