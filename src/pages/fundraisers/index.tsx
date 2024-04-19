import { Search } from '@/components/assets/icons'
import Fundraiser from '@/components/dashboard/Fundraiser'
import Dashboard from '@/components/layouts/dashboard'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Index() {
  return (
    <Dashboard title="Available Investment opportunity">
      <section className="px-4 pb-14 pt-32 lg:mb-20">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div>
            <h1 className="text-3xl font-semibold lg:text-4xl">Top Fundraisers</h1>
            <p className="mt-4 text-sm text-gray-500 lg:mt-3">
              Search your favourite category , follow the interesting campaign
            </p>
          </div>

          <div className="mt-5 flex w-[377px] items-center gap-2 overflow-hidden rounded-lg bg-white px-4 py-2.5 lg:mt-0">
            <input className=" flex-1 text-lg outline-none" placeholder="Search" />
            <Search />
          </div>
        </div>

        <section className="mt-10 flex items-center justify-between lg:mt-16">
          <Select>
            <SelectTrigger className="w-full lg:w-[300px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="hidden text-2xl font-semibold lg:block">
            <span className="text-[#3A7519]">Total Balance</span> $50,000
          </p>
        </section>

        <section className="mt-20 flex flex-col gap-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <Fundraiser key={i} />
          ))}
        </section>

        <button className="mt-10 w-full rounded-lg bg-[#541975] py-2.5 font-semibold text-white lg:hidden">
          Start a Fundstart
        </button>
      </section>
    </Dashboard>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {}
