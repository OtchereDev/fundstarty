import cookie from 'cookie'
import { GetServerSideProps } from 'next'

import { prisma } from '@/lib/prismaClient'

import { CirclePlus } from '@/components/assets/icons'
import CampaignCard from '@/components/dashboard/CampaignCard'
import Dashboard from '@/components/layouts/dashboard'
import Empty from '@/components/shared/Empty'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getJWTPayload } from '@/lib/decodeJwt'
import { Category, FundInvestment, Fundraiser } from '@prisma/client'

interface IResponse {
  popular: (Fundraiser & {
    _count: {
      investments: number
    }
    investments: FundInvestment[]
  })[]
  fundraisers: (Fundraiser & {
    _count: {
      investments: number
    }
    investments: FundInvestment[]
  })[]
  category: Category[]
}

export default function YourCampaign({ popular, fundraisers, category }: Readonly<IResponse>) {
  return (
    <Dashboard title={'Your Campaign'}>
      <section className="px-5 pb-20 pt-32 lg:px-0 lg:pb-0 lg:pt-0">
        <div className="flex items-center justify-between lg:pt-20">
          <h3 className=" text-2xl font-semibold lg:text-3xl">
            <span className="text-[#196875]">3 Active </span> Campaigns
          </h3>

          <button className="flex items-center gap-3 rounded-lg bg-[#541975] px-4 py-2 text-white">
            <CirclePlus /> <span className="hidden lg:inline-block">Start Campaign</span>
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-y-10 lg:mt-12 lg:justify-between lg:gap-y-16">
          {fundraisers.map((fund) => (
            <CampaignCard fundraiser={fund} key={fund.id} />
          ))}
        </div>

        {fundraisers.length == 0 && <Empty />}

        <div className="flex justify-between pt-16 lg:pt-20">
          <h3 className=" text-2xl lg:text-3xl lg:font-semibold">
            <span className="text-[#196875]">Popular</span> Campaigns
          </h3>

          <Select>
            <SelectTrigger className="hidden w-full lg:flex lg:w-[300px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {category?.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                    className="capitalize"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-10 flex flex-wrap  justify-center gap-y-10 lg:mt-12 lg:justify-between lg:gap-y-16">
          {popular.map((fund) => (
            <CampaignCard fundraiser={fund} key={fund.id} />
          ))}
        </div>
      </section>
    </Dashboard>
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

  const email = getJWTPayload(fundstartAuth).email as string

  const fundraisers = await prisma.fundraiser.findMany({
    where: {
      organizer: {
        email,
      },
    },
    include: {
      _count: {
        select: {
          investments: true,
        },
      },
      investments: true,
    },
  })

  const popular = await prisma.fundraiser.findMany({
    where: {
      NOT: {
        organizer: {
          email,
        },
      },
    },
    include: {
      _count: {
        select: {
          investments: true,
        },
      },
      investments: true,
    },
    orderBy: {
      investments: {
        _count: 'desc',
      },
    },
    take: 6,
  })

  const category = await prisma.category.findMany({ where: {} })

  return {
    props: {
      popular: JSON.parse(JSON.stringify(popular)),
      fundraisers: JSON.parse(JSON.stringify(fundraisers)),
      category: JSON.parse(JSON.stringify(category)),
    },
  }
}
