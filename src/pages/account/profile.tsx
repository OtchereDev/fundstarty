import NameUpdate from '@/components/account/NameUpdate'
import PhoneUpdate from '@/components/account/PhoneUpdate'
import { Camera } from '@/components/assets/icons'
import Account from '@/components/layouts/account'
import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { getJWTPayload } from '@/lib/decodeJwt'
import cookie from 'cookie'
import { GetServerSideProps } from 'next'
import { AuthNService } from 'pangea-node-sdk'
import { useState } from 'react'

function EditButton() {
  return (
    <button className="rounded-xl border border-gray-300 px-7 py-3.5 text-lg font-semibold">
      Edit
    </button>
  )
}

export default function Settings({
  data,
  fundstartAuth,
}: Readonly<{ data: any; fundstartAuth: string }>) {
  console.log({ data })
  const [profile, setProfile] = useState({
    firstName: data?.result?.profile?.first_name,
    lastName: data?.result?.profile?.last_name,
    phone: data?.result?.profile?.phone ?? '',
  })

  const updateProfile = (profile: { firstName: string; lastName: string; phone: string }) => {
    setProfile((p) => ({ ...p, ...profile }))
  }
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
                <p className="mt-3 text-lg">
                  {profile?.firstName} {profile?.lastName}
                </p>
              </div>
              <NameUpdate callback={updateProfile} data={profile} fundraiserAuth={fundstartAuth}>
                <button className="rounded-xl border border-gray-300 px-7 py-3.5 text-lg font-semibold">
                  Edit
                </button>
              </NameUpdate>
            </div>
            <div className="borde-2  flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Phone number</p>
                <p className="mt-3 text-lg">{profile?.phone}</p>
              </div>
              <PhoneUpdate callback={updateProfile} data={profile} fundraiserAuth={fundstartAuth}>
                <button className="rounded-xl border border-gray-300 px-7 py-3.5 text-lg font-semibold">
                  Edit
                </button>
              </PhoneUpdate>
            </div>
            <div className="borde-2  flex items-center border-t border-gray-300 py-8">
              <div className="flex-1">
                <p className="text-lg font-semibold">Email</p>
                <p className="mt-3 text-lg">{data?.result?.email}</p>
              </div>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.headers.cookie) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let { fundstartAuth } = cookie.parse(req.headers.cookie)
  if (!fundstartAuth)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const auth = new AuthNService(AUTHN_TOKEN, pangea)

  const email = getJWTPayload(fundstartAuth).email as string

  const data = await auth.user.profile.getProfile({
    email,
  })

  return {
    props: {
      data: JSON.parse(data.toJSON()),
      fundstartAuth,
    },
  }
}
