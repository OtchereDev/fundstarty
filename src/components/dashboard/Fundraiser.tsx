import { Message } from '../assets/icons'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function Fundraiser() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white lg:flex-row">
      <div className="h-[206px] w-full lg:w-[176px]">
        <img
          className="h-full w-full object-cover"
          alt="banner"
          src="https://d2g8igdw686xgo.cloudfront.net/79511523_1713189097238160_r.jpeg"
        />
      </div>

      <div className="flex w-full flex-1 flex-col">
        <div className="flex-1 grid-cols-[35%,20%,20%,20%]  items-center gap-4 p-4 lg:grid">
          <h2 className="line-clamp-3 text-xl font-bold text-[#101828]">
            Food Truck Startup for selling Fresh Baritos & Fast food items
          </h2>
          <div className="mt-4 flex items-center gap-4 lg:mt-0 lg:block">
            <h3 className="text-lg font-semibold text-gray-500 lg:font-medium">Milestone Amount</h3>
            <p className="text-center text-lg font-bold lg:mt-4 lg:text-3xl">$25000</p>
          </div>
          <div className="mt-4 flex items-center gap-4 lg:mt-0 lg:block">
            <h3 className="text-center text-lg font-medium text-gray-500">Category</h3>
            <button className="block rounded-lg border border-gray-200 px-5 py-2 lg:mx-auto lg:mt-3">
              Food
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 lg:mt-0 lg:block">
            <h3 className="text-center text-lg font-medium text-gray-500">Backers</h3>
            <div className="flex justify-center gap-2 lg:mt-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-2 items-center justify-between border-t p-4 lg:flex">
          <button className="flex items-center gap-3">
            <div className="bg- flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#E0EEFD] ">
              <Message />
            </div>
            <p>Message</p>
          </button>
          <p className="text-gray-500">Closing Date 9/11/2022</p>
          <button className="col-span-2 mt-5 block w-full rounded-lg border border-gray-300 bg-[#541975] px-5 py-3 text-white lg:mt-0 lg:w-auto lg:bg-white lg:py-2 lg:text-black">
            Invest Now
          </button>
        </div>
      </div>
    </div>
  )
}
