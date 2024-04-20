// import DonateItem from './DonateItem'

import { calculateRaised } from '@/lib/utils'
import { FundInvestment, Fundraiser } from '@prisma/client'
import { LineChart } from 'lucide-react'
import Link from 'next/link'
import { LogoWhite } from '../assets/icons'
import DonateItem from './DonateItem'

const Header = ({
  fundraiser,
}: {
  fundraiser: Fundraiser & {
    investments: (FundInvestment & { User: { first_name: string; last_name: string } })[]
  }
}) => {
  const onDonationClick = () => {
    // setModalChildren(<DonationCard/>)
    // setIsModalOpen(true)
  }

  const donations = [
    {
      name: 'Oliver',
      amount: 10,
      comment: 'This is good',
      createdAt: '2012-04-23T18:25:43.511Z',
    },
  ]

  const total = calculateRaised(fundraiser)
  return (
    <div className="flex w-full flex-col lg:flex-row lg:gap-10">
      <div className="w-full  items-center justify-center lg:flex lg:w-8/12 lg:py-10 ">
        <div className="relative h-[350px] w-full overflow-hidden  lg:h-[450px] lg:flex-1 lg:rounded-3xl ">
          <img src={fundraiser.image} alt="banner" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className=" top-0 w-full py-5  lg:mx-auto lg:w-4/12 lg:py-10">
        {/* Donate Card Part */}
        <div className="px-5 py-5 lg:sticky lg:top-28 lg:w-11/12 lg:rounded-md lg:shadow-lg ">
          <h2 className="text-2xl font-bold lg:text-3xl ">
            £{total} raised{' '}
            <span className=" text-sm font-normal ">of £{fundraiser.amountRaising.toString()}</span>
          </h2>

          <div className="my-2 w-full">
            <div className="relative h-1 w-full overflow-hidden rounded-3xl bg-gray-200">
              <div
                style={{
                  width: `${(total / parseFloat(fundraiser.amountRaising.toString())) * 100}%`,
                }}
                className="absolute left-0 top-0 h-full w-3/12 rounded-3xl bg-[#541975]"
              ></div>
            </div>
          </div>

          <Link href={`/fundraisers/${fundraiser.id}/invest`}>
            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#541975] px-4 py-3 text-white outline-none">
              <LogoWhite className="h-[30px] w-[70px]" />
              <span className="text-center text-lg font-semibold">Invest</span>
            </button>
          </Link>

          <div className="mt-3 flex w-full items-center text-purple-900">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-purple-100">
              <LineChart />
            </div>
            <span className="text-lg font-semibold">
              {fundraiser.investments.length == 0
                ? 'No investment yet'
                : donations.length + ' people just invested'}
            </span>
          </div>

          <div className="mt-3">
            {fundraiser.investments
              ?.slice(0, 4)
              .map((donation) => (
                <DonateItem key={donation.id} donate={donation} borderClass={'border-t'} />
              ))}

            {fundraiser.investments.length > 4 && (
              <div>
                <button
                  onClick={onDonationClick}
                  className="rounded-md border border-[#541975] bg-white px-4 py-1 font-semibold text-[#541975] hover:bg-[#541975] hover:bg-opacity-10 "
                >
                  See all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
