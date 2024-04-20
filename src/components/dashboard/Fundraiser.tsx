import { calculateRaised } from '@/lib/utils'
import { Category, FundInvestment, Fundraiser as IFundraiser, User } from '@prisma/client'
import { BadgePoundSterling, Info, Stars } from 'lucide-react'
import Link from 'next/link'

export default function Fundraiser({
  fundraiser,
}: Readonly<{
  fundraiser: IFundraiser & {
    category: Category
    organizer: User
    _count: { investments: number }
    investments: FundInvestment[]
  }
}>) {
  const total = calculateRaised(fundraiser)
  return (
    <div className="max-w-[400px] overflow-hidden rounded-2xl border bg-white p-4 shadow lg:flex-row">
      <Link href={`/fundraisers/${fundraiser.id}`}>
        <div className="h-[250px] w-full overflow-hidden rounded-3xl">
          <img className="h-full w-full object-cover" alt="banner" src={fundraiser.image} />
        </div>
      </Link>

      <div>
        <p className="mt-4 text-sm text-green-500">{fundraiser.category.name}</p>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-[#fdeed7]">
            <Stars color="#f6b149" className="w-[20px]" />
          </div>
          <div className="flex-1">
            <Link href={`/fundraisers/${fundraiser.id}`}>
              <h1 className="text-lg font-bold text-gray-700">{fundraiser.title}</h1>
            </Link>
            <p className="text-xs text-gray-400">{fundraiser.organizer.email}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex gap-5">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-[#d8eaf5]">
              {/* <Info className="w-[20px]" color="#3e95cc" /> */}
              <BadgePoundSterling className="w-[20px]" color="#3e95cc" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Amount being raised</p>
              <h3 className="text-xl font-semibold">£{fundraiser.amountRaising.toString()}</h3>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-[#d8eaf5]">
              <Info className="w-[20px]" color="#3e95cc" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Current investors</p>
              <h3 className="text-xl font-semibold">{fundraiser._count.investments}</h3>
            </div>
          </div>
        </div>
        <div className="relative mt-5 h-1 w-full overflow-hidden rounded-3xl bg-gray-200">
          <div
            style={{
              width: `${(total / parseFloat(fundraiser.amountRaising.toString())) * 100}%`,
            }}
            className="absolute left-0 top-0 h-full w-3/12 rounded-3xl bg-[#541975]"
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {`${((total / parseFloat(fundraiser.amountRaising.toString())) * 100).toFixed(2)}%`}{' '}
          funded
        </p>
        <Link href={`/fundraisers/${fundraiser.id}`}>
          <button className="mt-5 block w-full rounded-lg border border-gray-300 bg-[#541975] px-5 py-3 text-white lg:py-2 ">
            Invest Now
          </button>
        </Link>
      </div>
    </div>
  )
}
