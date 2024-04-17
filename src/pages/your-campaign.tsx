import { Chevron, CirclePlus } from '@/components/assets/icons'
import CampaignCard from '@/components/dashboard/CampaignCard'
import Dashboard from '@/components/layouts/dashboard'

export default function YourCampaign() {
  return (
    <Dashboard>
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
          {[1, 2, 3].map((i) => (
            <CampaignCard key={i} />
          ))}
        </div>

        <div className="flex justify-between pt-16 lg:pt-20">
          <h3 className=" text-2xl lg:text-3xl lg:font-semibold">
            <span className="text-[#196875]">Popular</span> Campaigns
          </h3>

          <button className="hidden items-center gap-3 rounded-lg border border-[#541975] px-4 py-2 text-[#541975] lg:flex">
            Category
            <Chevron />
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-y-10 lg:mt-12 lg:justify-between lg:gap-y-16">
          {[1, 2, 3].map((i) => (
            <CampaignCard key={i} />
          ))}
        </div>
        <button className="mx-auto mt-10 block rounded-lg bg-[#541975] px-4 py-2 text-white">
          See More Campaigns
        </button>
      </section>
    </Dashboard>
  )
}
