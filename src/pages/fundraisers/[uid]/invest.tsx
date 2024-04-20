import cookie from 'cookie'
import { Handshake } from 'lucide-react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AuthNService } from 'pangea-node-sdk'
import { useEffect, useState } from 'react'

import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { Category, FundInvestment, Fundraiser, User } from '@prisma/client'

import { Chevron } from '@/components/assets/icons'
import Header from '@/components/invest/Header'
import PayForm from '@/components/invest/PayForm'
import Dashboard from '@/components/layouts/dashboard'

export default function Invest({
  fundraiser,
}: {
  fundraiser: Fundraiser & {
    investments: (FundInvestment & { User: { first_name: string; last_name: string } })[]
    category: Category
    organizer: User
  }
}) {
  const [donationData, setDonationData] = useState<any>()
  const [donation, setDonation] = useState('')
  const [tip, setTip] = useState('0')
  const [showPayment, setShowPayment] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [intentId, setIntentId] = useState('')

  const { query } = useRouter()
  const { uid } = query

  async function getPaymentId() {
    const req = await fetch('/api/payment/create-payment', {
      method: 'POST',
      body: JSON.stringify({
        amount: parseFloat(donation),
        tip: parseFloat(tip),
        fundraiserId: fundraiser.id,
        name: donorName,
      }),
    })

    if (req.ok) {
      const response = await req.json()
      setIntentId(response.intentId)
      return response.clientSecret
    }
  }

  // const user  = useSelector(state => state.user?.email);

  // useEffect(() => {
  //   if (user) setDonorName(user);
  // }, [user]);

  const handleShowPayment = () => {
    if (donation.length && (tip.length || tip == '0') && donorName.length) {
      setDonationData({
        amount: (parseInt(donation) + parseFloat(tip)) * 100,
        name: donorName,
        fundraiser_id: uid,
        tip: parseFloat(tip),
      })
      setShowPayment(true)
    } else if (!donorName.length) {
      // toast.error("Please provide your full name ");
    } else {
      // toast.error("Please provide a valid donation amount and tip value");
    }
  }

  useEffect(() => {
    if (donation.length <= 0) undefined
    else if (donation.length || !tip.length || tip == '0') {
      setTip((parseInt(donation.length ? donation : '0') * 0.15).toFixed(2))
    }
  }, [donation])

  return (
    <Dashboard activeLink="Fundraisers" title="Donate To">
      <div className="flex h-full w-full flex-col md:pt-10 lg:mx-auto lg:min-w-[1280px] lg:flex-row  lg:pb-20 lg:pt-10">
        <div className="w-full bg-white md:px-5  md:py-4 lg:w-7/12 lg:rounded-md lg:py-2">
          <div className="mb-3 hidden border-b px-3 lg:block">
            <Link href={`/fundraisers/${fundraiser.id}/`}>
              <button className="my-5 flex items-center rounded-md bg-gray-100 px-3 py-2 font-semibold text-gray-800  shadow-sm outline-none">
                <Chevron className="mr-2 h-5 rotate-90" />
                <span>Go Back</span>
              </button>
            </Link>
          </div>
          <Header
            title={fundraiser.title}
            organizer={`${(fundraiser.organizer as any).first_name} ${(fundraiser.organizer as any).last_name}`}
            image={fundraiser.image}
          />

          <div className="border-b px-3 py-4 md:py-8">
            <h5 className="text-lg font-semibold text-gray-800">Enter your investment amount</h5>
            <div className="my-3 flex items-center rounded-md border p-3">
              <h3 className="text-2xl font-bold">GBP</h3>

              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  value={donation}
                  onChange={(e) => setDonation(e.target.value)}
                  onFocus={(e) => setShowPayment(false)}
                  className="block w-full appearance-none text-right text-4xl font-semibold outline-none md:text-5xl"
                />
                <h3 className="mb-0 text-4xl font-semibold text-gray-800 md:text-5xl">.00</h3>
              </div>
            </div>
          </div>

          <div className="border-b px-3 pb-4">
            <h6 className="my-3 font-semibold text-gray-800">Investor Name</h6>
            <input
              type="text"
              placeholder="Please provide your full name"
              value={donorName}
              onFocus={() => setShowPayment(false)}
              onChange={(e) => setDonorName(e.target.value)}
              className="block w-full appearance-none rounded-md  border px-2 py-2 outline-none"
            />
          </div>

          <div className="border-b px-3 py-4 md:py-8">
            <h5 className="text-lg font-semibold text-gray-800">Tip FundStart Services</h5>
            <p className="mt-3 text-sm text-gray-500">
              FundStart has a 0% platform fee for organisers. FundStart will continue offering its
              services thanks to donors who leave an optional amount here:
            </p>
            <h6 className="my-3 font-semibold text-gray-800">Tip amount</h6>
            <input
              type="number"
              min="0"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              onFocus={(e) => setShowPayment(false)}
              className="block w-full appearance-none rounded-md border px-2 py-2 font-semibold outline-none md:w-6/12"
            />

            {!showPayment && (
              <div className="my-3">
                <button
                  onClick={handleShowPayment}
                  className="w-full rounded-md bg-[#541975] px-4 py-3 font-semibold text-gray-50 shadow-md  md:w-3/12"
                >
                  Continue
                </button>
              </div>
            )}

            <div className={`${showPayment ? 'block' : 'hidden'} my-3`}>
              {showPayment && <PayForm donationData={donationData} />}
            </div>
          </div>

          <div className="my-2 flex  items-center px-2 py-3 md:px-0">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Handshake />
            </div>
            <div className="w-11/12">
              <h3 className=" font-semibold text-gray-800">FundStart Guarantee</h3>

              <p className="text-sm text-gray-500">
                In the rare event that something isn&apos;t right, we will work with you to
                determine if misuse has occurred. Learn more.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/12 ">
          <div className="ml-10 hidden w-full rounded-md bg-white px-4 py-5 shadow-md lg:block">
            <h4 className="my-4 text-lg font-semibold ">Your investment</h4>

            <div className="text-lg text-gray-500">
              <div className="flex items-center justify-between">
                <h5>Your investment</h5>
                <h5>{donation.length ? donation : 0}.00</h5>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <h5>FundStart Tip</h5>
                <h5>{tip}</h5>
              </div>

              <div className="flex items-center justify-between pt-2">
                <h5>Total Due today</h5>
                <h5>£{donation.length ? parseInt(donation) + parseFloat(tip) : '0.00'}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { uid } = query as any

  if (!req.headers.cookie) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let { fundstartAuth } = cookie.parse(req.headers.cookie)

  const auth = new AuthNService(AUTHN_TOKEN, pangea)

  const fundraiser = await prisma.fundraiser.findFirst({
    where: { id: uid as string },
    include: {
      category: true,
      organizer: true,
    },
  })

  if (fundraiser?.organizer?.email) {
    const organizer = await auth.user.profile.getProfile({
      email: fundraiser?.organizer?.email as string,
    })

    const profile = organizer.result.profile
    fundraiser!.organizer = { ...fundraiser!.organizer, ...profile }
  }

  return {
    props: { fundraiser: JSON.parse(JSON.stringify(fundraiser)), fundstartAuth },
  }
}
