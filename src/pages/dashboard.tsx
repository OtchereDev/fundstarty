import cookie from 'cookie'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { AuthNService, PangeaConfig } from 'pangea-node-sdk'
import { useState } from 'react'

import { getJWTPayload } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'
import { FundInvestment, Fundraiser, Transaction, Wallet } from '@prisma/client'

import { DownwardTrend, UpwardTrending } from '@/components/assets/icons'
import { AddWalletDialog } from '@/components/dashboard/AddCard'
import CardStack from '@/components/dashboard/CardStack'
import LineChart from '@/components/dashboard/LineChart'
import Analystics from '@/components/layouts/analytics'
import Empty from '@/components/shared/Empty'
import { formatMoney } from '@/lib/formatMoney'
import { calculateRaised } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function Dashbaord({
  fundstartAuth,
  profile,
  wallet,
  amountInvested,
  proposedProfit,
  percentage,
  investedIn,
  fundraisersPercentage,
  investedPercentage,
  transactions,
  otherInvestments,
}: Readonly<{
  fundstartAuth: string
  profile: any
  wallet: Wallet
  amountInvested: number
  proposedProfit: number
  percentage: number
  investedIn: number
  fundraisersPercentage: number
  investedPercentage: number
  transactions: Transaction[]
  otherInvestments: (Fundraiser & { investments: FundInvestment[] })[]
}>) {
  const [userCard, setUserCard] = useState(wallet)
  return (
    <Analystics title={'Dashboard'} activeLink={'Dashboard'}>
      <main className=" flex-1  lg:grid lg:grid-cols-[70%,30%] lg:gap-5">
        <div className="overflow-y-scroll pt-32 lg:pb-20 lg:pt-10">
          <h1 className="mb-5 text-2xl font-semibold lg:mb-10 lg:text-3xl">Dashboard</h1>
          <div className="flex   items-center gap-4">
            <div className="relative h-[55px] w-[55px] overflow-hidden rounded-full">
              <img
                src="https://images.pexels.com/photos/6646975/pexels-photo-6646975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="banner"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-bold">
                Welcome {profile?.profile?.first_name} {profile?.profile?.last_name} 👋🏽
              </p>
              <p className="text-sm text-gray-500">Let&apos;s manage your investments</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 lg:flex-row">
            <div className="relative min-h-[100px] flex-1 rounded-xl bg-[#e5f5fa] p-4  lg:min-h-[180px] lg:p-6">
              <UpwardTrending className="absolute right-6 top-4 w-[70px]" />
              <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-600">
                +{investedPercentage?.toFixed(2)}%
              </p>
              <h3 className="mt-5 font-semibold">Total invested</h3>
              <h2 className="mt-3 text-3xl font-bold">£{formatMoney(amountInvested)}</h2>
            </div>
            <div className="relative min-h-[100px] flex-1 rounded-xl bg-[#e5f5fa] p-4 lg:min-h-[180px] lg:p-6">
              <DownwardTrend className="absolute right-6 top-4 w-[70px]" />
              <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-600">
                +{fundraisersPercentage?.toFixed(2)}%
              </p>
              <h3 className="mt-5 font-semibold">Total fundraisers invested in</h3>
              <h2 className="mt-3 text-3xl font-bold">{investedIn}</h2>
            </div>
            <div className="relative min-h-[100px] flex-1 rounded-xl bg-[#e2fbe5] p-4 lg:min-h-[180px] lg:p-6">
              <UpwardTrending className="absolute right-6 top-4 w-[70px]" />
              <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-600">
                +{percentage?.toFixed(2)}%
              </p>
              <h3 className="mt-5 font-semibold">Total profit</h3>
              <h2 className="mt-3 text-3xl font-bold">£{formatMoney(proposedProfit)}</h2>
            </div>
          </div>
          <div className="relative mt-16 h-[350px] overflow-hidden rounded-xl border lg:py-6">
            <LineChart />
          </div>
          <div className="mt-7 rounded-2xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction history</h3>

              <div className=" hidden gap-3 lg:flex">
                <button className="rounded-lg border px-4 py-2 font-semibold">Newest</button>
                <button className="rounded-lg px-4 py-2 font-semibold">Oldest</button>
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Transaction
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {profile.profile.first_name} {profile.profile.last_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {transaction.transType}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              £{formatMoney(parseFloat(transaction.amount.toString()))}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {dayjs(transaction.createdAt.toString()).format('DD MMM, YYYY')}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4  text-sm font-medium text-green-600 sm:pr-6">
                              Created
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pb-10  lg:mt-0 lg:border-l lg:pb-0 lg:pt-10">
          <div className="lg:sticky lg:top-20">
            <div className="   border-b pb-14 lg:p-5 lg:pb-14">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">My Cards</h2>
                <AddWalletDialog
                  onSuccess={(wallet: Wallet) => {
                    setUserCard(wallet)
                  }}
                  authKey={fundstartAuth}
                >
                  <button className="flex gap-1 font-medium">
                    <Plus className="w-4" />
                    Add Card
                  </button>
                </AddWalletDialog>
              </div>
              <div>
                <CardStack wallet={userCard} />
              </div>
            </div>

            <div className="lg:p-5">
              <p className="text-lg font-semibold ">Investment that might interest you</p>
              <div className="mt-5 flex flex-col gap-5">
                {otherInvestments.map((invest) => (
                  <div key={invest.id} className="rounded-xl border p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-lg">
                        <img
                          src={invest.image}
                          alt="banner"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="line-clamp-1 font-semibold">{invest.title}</h3>
                        <p className="text-sm text-gray-500">
                          Target: £{formatMoney(parseFloat(invest.amountRaising.toString()))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold">
                        Raised: £{formatMoney(calculateRaised(invest))}
                      </p>
                      <div className="mt-2 w-full">
                        <div className="relative h-1 w-full overflow-hidden rounded-3xl bg-gray-200">
                          <div
                            style={{
                              width: `${(calculateRaised(invest) / parseFloat(invest.amountRaising.toString())) * 100}%`,
                            }}
                            className="absolute left-0 top-0 h-full w-3/12 rounded-3xl bg-[#541975]"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {otherInvestments.length === 0 && <Empty />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Analystics>
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

  const pangea = new PangeaConfig({ domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN })

  const payload = getJWTPayload(fundstartAuth)
  const auth = new AuthNService(process.env.NEXT_AUTHN_TOKEN ?? '', pangea)

  const email = payload.email as string
  const data = await auth.user.profile.getProfile({
    email,
  })

  const user = await prisma.user.findFirst({
    where: { email: { contains: email, mode: 'insensitive' } },
    select: { id: true },
  })

  const wallet = await prisma.wallet.findFirst({
    where: { userId: user?.id },
    orderBy: { createdAt: 'desc' },
  })

  const amountInvested = await prisma.fundInvestment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      User: {
        email,
      },
    },
  })

  const transactions = await prisma.transaction.findMany({
    where: {
      user: {
        email,
      },
    },
  })

  const otherInvestments = await prisma.fundraiser.findMany({
    where: {
      NOT: {
        organizer: {
          email,
        },
      },
    },
    include: {
      investments: true,
    },
    take: 3,
  })

  const investedIn = await prisma.fundInvestment.count({ where: { User: { email } } })
  const invested = amountInvested._sum.amount?.toNumber() ?? 0
  const percentage = Math.random()
  return {
    props: {
      fundstartAuth,
      profile: data.result,
      wallet: JSON.parse(JSON.stringify(wallet)),
      amountInvested: invested,
      proposedProfit: invested == 0 ? 0 : invested + invested * percentage,
      percentage: percentage,
      investedIn: investedIn ?? 0,
      fundraisersPercentage: invested == 0 ? 0 : Math.ceil(100 * Math.random()),
      investedPercentage: invested == 0 ? 0 : Math.ceil(100 * Math.random()),
      transactions: JSON.parse(JSON.stringify(transactions)),
      otherInvestments: JSON.parse(JSON.stringify(otherInvestments)),
    },
  }
}
