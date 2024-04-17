import { Camera } from '@/components/assets/icons'
import Account from '@/components/layouts/account'

function EditButton() {
  return (
    <button className="rounded-xl border border-gray-300 px-7 py-3.5 text-lg font-semibold">
      Edit
    </button>
  )
}

export default function Settings() {
  return (
    <Account>
      <section className="px-5">
        <h2 className="mt-16 text-3xl font-semibold">Settings</h2>
        <div className="mt-10">
          <div>
            <p className="text-lg font-semibold">Profile photo</p>

            <div className="mx-auto mt-5 flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full border border-dashed border-gray-300 lg:ml-0 lg:mr-auto">
              <Camera />
              <p className="text-lg font-semibold">Add photo</p>
            </div>

            <div className="borde-2 mt-10 flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Name</p>
                <p className="mt-3 text-lg">Oliver</p>
              </div>
              <EditButton />
            </div>
            <div className="borde-2  flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Phone number</p>
                <p className="mt-3 text-lg">+44 7002 843562</p>
              </div>
              <EditButton />
            </div>
            <div className="borde-2  flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Email</p>
                <p className="mt-3 text-lg">Oliverotchere4@gmail.cm</p>
              </div>
              <EditButton />
            </div>
            <div className="borde-2  flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Password</p>
                <p className="mt-3 text-lg">●●●●●●●●●●●●</p>
              </div>
              <EditButton />
            </div>

            <div className="borde-2   border-t border-gray-300 py-8">
              <p>
                Deleting your account will remove all of your activity and campaigns, and you will
                no longer be able to sign in with this account.
              </p>
              <button className="mt-8 w-full rounded-xl border border-red-700 py-3.5 font-semibold text-red-700">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </section>
    </Account>
  )
}
