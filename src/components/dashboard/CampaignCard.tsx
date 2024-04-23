import { formatMoney } from '@/lib/formatMoney'
import { calculateRaised } from '@/lib/utils'
import { FundInvestment, Fundraiser } from '@prisma/client'
import { differenceInDays, parseISO } from 'date-fns'
import Link from 'next/link'
import { VerticalEllipse } from '../assets/icons'

export default function CampaignCard({
  fundraiser,
}: Readonly<{
  fundraiser: Fundraiser & {
    _count: {
      investments: number
    }
    investments: FundInvestment[]
  }
}>) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white lg:min-w-[327px] lg:max-w-[327px] lg:flex-1 lg:flex-shrink-0">
      <Link className="block" href={`/fundraisers/${fundraiser.id}`}>
        <div className="h-[138px]">
          <img src={fundraiser?.image ?? ''} alt="banner" className="h-full w-full object-cover" />
        </div>
      </Link>
      <div>
        <div className="flex justify-between gap-2 p-4">
          <Link className="block" href={`/fundraisers/${fundraiser.id}`}>
            <h2 className="line-clamp-2 flex-1 text-lg text-[#101828]">{fundraiser?.title}</h2>
          </Link>
          <VerticalEllipse />
        </div>

        <p className="mb-4 line-clamp-3 px-4 text-sm text-[#667085]">{fundraiser?.description}</p>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">
              <span className="font-normal text-[#3A7519]">Raised of</span> £
              {formatMoney(calculateRaised(fundraiser))}
            </p>

            <p className="text-xl font-bold">
              <span className="font-normal text-[#196875]">Investors:</span>{' '}
              {fundraiser._count?.investments ?? 0}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-block rounded-lg bg-[#3A7519] px-2 py-0.5">
                <p className="text-sm text-[#D2E892]">Raising</p>
              </div>
              <p className="text-xl font-bold text-[#196875]">
                £{formatMoney(parseFloat(fundraiser.amountRaising.toString()))}
              </p>
            </div>

            <p className="font-semibold text-[#667085]">
              Offer Ends:{' '}
              {differenceInDays(parseISO(fundraiser?.expiryDate?.toString() ?? ''), new Date())}{' '}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 h-[8px] w-full bg-[#541975]" />
      </div>
    </div>
  )
}
