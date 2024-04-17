import { VerticalEllipse } from '../assets/icons'

export default function CampaignCard() {
  return (
    <div className="max-w-[327px] overflow-hidden rounded-lg border lg:min-w-[327px] lg:flex-1 lg:flex-shrink-0">
      <div className="h-[138px]">
        <img
          src="https://images.pexels.com/photos/6646975/pexels-photo-6646975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="banner"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <div className="flex justify-between gap-2 p-4">
          <h2 className="line-clamp-2 flex-1 text-lg text-[#101828]">
            Raising Capital for inhouse Ev Startup
          </h2>
          <VerticalEllipse />
        </div>

        <p className="mb-4 line-clamp-3 px-4 text-sm text-[#667085]">
          A unique Concept EV for everyday transport, leisure & Biking fun
        </p>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">
              <span className="font-normal text-[#3A7519]">Raised of</span> $5000
            </p>

            <p className="text-xl font-bold">
              <span className="font-normal text-[#196875]">Investor</span> 50
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-block rounded-lg bg-[#3A7519] px-2 py-0.5">
                <p className="text-sm text-[#D2E892]">Raise</p>
              </div>
              <p className="text-xl font-bold text-[#196875]">$3000</p>
            </div>

            <p className="font-semibold text-[#667085]">Remaning Days: 184</p>
          </div>
        </div>
        <div className="h-[8px] bg-[#541975]" />
      </div>
    </div>
  )
}
