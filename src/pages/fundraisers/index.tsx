import { Search } from '@/components/assets/icons'
import Fundraiser from '@/components/dashboard/Fundraiser'
import Analystics from '@/components/layouts/analytics'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { prisma } from '@/lib/prismaClient'
import { Category, FundInvestment, Fundraiser as IFundraiser, User } from '@prisma/client'
import { GetServerSideProps } from 'next'

export default function Index({
  fundraisers,
  categories,
}: {
  fundraisers: (IFundraiser & {
    category: Category
    organizer: User
    _count: { investments: number }
    investments: FundInvestment[]
  })[]
  categories: Category[]
}) {
  return (
    <Analystics activeLink="Fundraisers" title="Available Investment opportunity">
      <section className="pb-14 pt-32 lg:mb-20 lg:px-4">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div>
            <h1 className="text-3xl font-semibold lg:text-4xl">Top Fundraisers</h1>
            <p className="mt-4 text-sm text-gray-500 lg:mt-3">
              Search your favourite category , follow the interesting campaign
            </p>
          </div>

          <div className="mt-5 flex w-full items-center gap-2 overflow-hidden rounded-lg bg-[#f5f6f7] px-4 py-2.5 lg:mt-0 lg:w-[377px]">
            <input className=" flex-1 bg-transparent text-lg outline-none" placeholder="Search" />
            <Search />
          </div>
        </div>

        <section className="mt-10 flex items-center justify-between lg:mt-16">
          <Select>
            <SelectTrigger className="w-full bg-[#f5f6f7] lg:w-[300px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        <section className="mt-20 flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 ">
          {fundraisers?.map((fundraiser) => (
            <Fundraiser fundraiser={fundraiser} key={fundraiser.id} />
          ))}
        </section>

        <button className="mt-10 w-full rounded-lg bg-[#541975] py-2.5 font-semibold text-white lg:hidden">
          Start a Fundstart
        </button>
      </section>
    </Analystics>
  )
}

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const fundraisers = await prisma.fundraiser.findMany({
    include: {
      _count: {
        select: {
          investments: true,
        },
      },
      investments: true,
      category: true,
      organizer: true,
    },
  })

  const categories = await prisma.category.findMany()

  return {
    props: {
      fundraisers: JSON.parse(JSON.stringify(fundraisers)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  }
}
