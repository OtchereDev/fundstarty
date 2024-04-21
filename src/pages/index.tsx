import Image from 'next/image'
import Marquee from 'react-fast-marquee'

import Hero from '@/components/assets/undraw_environment_iaus.svg'
import NavBarRegular from '@/components/shared/NavBarRegular'
import { BadgePercent, Bot, Fingerprint, PieChart } from 'lucide-react'

import { Logo } from '@/components/assets/icons'
import Logo1 from '@/components/assets/images/logo-1.jpg'
import Logo2 from '@/components/assets/images/logo-2.png'
import Logo3 from '@/components/assets/images/logo-3.jpg'
import Logo4 from '@/components/assets/images/logo-4.webp'
import Logo5 from '@/components/assets/images/logo-5.png'
import Logo6 from '@/components/assets/images/logo-6.webp'

export default function Home() {
  return (
    <main>
      <NavBarRegular />
      <div className="bg-[#e8f4fd] px-5 pb-20 pt-32 lg:px-0">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center lg:flex-row lg:px-10">
          <div className="order-2 flex-1 lg:order-1">
            <h1 className="text-center text-[40px] font-bold lg:text-left lg:text-5xl">
              Invest in untapped <br className="inline lg:block" /> potentials.
            </h1>
            <p className="mt-5 text-center text-gray-800 lg:w-[70%] lg:text-left">
              With our plaform, you can directly invest and raise capital to grow your startup
            </p>
            <div className="mt-10 flex flex-col gap-4  lg:flex-row">
              <button className="rounded-xl bg-[#533075] px-6 py-3 text-white">
                Raise capital
              </button>
              <button className="rounded-xl border-2 border-[#533075] px-6 py-3 font-bold text-[#533075]">
                Invest now
              </button>
            </div>
          </div>
          <div className="order-1 flex flex-1 justify-center lg:order-2">
            <Image src={Hero} alt="hero" />
          </div>
        </div>
      </div>

      <div className="bg-white py-10 lg:py-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-10 lg:flex-row lg:gap-0 lg:px-10">
          <div>
            <h3 className="text-center text-4xl font-semibold  lg:text-left lg:text-6xl">600+</h3>
            <p className="text-center text-lg font-semibold  lg:text-left lg:text-2xl">investors</p>
          </div>
          <div>
            <h3 className="text-center text-4xl font-semibold  lg:text-left lg:text-6xl">£ 750K</h3>
            <p className="text-center text-lg font-semibold lg:text-left lg:text-2xl">raised</p>
          </div>
          <div>
            <h3 className="text-center text-4xl font-semibold  lg:text-left lg:text-6xl">250+</h3>
            <p className="text-center text-lg font-semibold  lg:text-left lg:text-2xl">
              funded deals
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#e8f4fd] px-5 lg:px-0">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-20 py-16 lg:flex-row lg:px-10 lg:py-28">
          <div className="flex-1">
            <p className="text-blue-500">Why FundStart</p>
            <h3 className="mt-4 text-3xl font-bold lg:w-[80%] lg:text-4xl">
              We make sure the very best opportunities see the light of day
            </h3>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-10">
            <div className="w-full rounded-2xl bg-white px-5 py-10 lg:w-[calc(50%-40px)]">
              <BadgePercent color={'#533075'} />
              <p className="mt-5 text-lg font-bold">Zero Transaction fee</p>
              <p className="text-sm text-gray-500">
                All investment made are give to entrepreneurs without any charge
              </p>
            </div>
            <div className="w-full rounded-2xl bg-white px-5 py-10 lg:mt-10 lg:w-[calc(50%-40px)]">
              <Fingerprint color={'#533075'} />
              <p className="mt-5 text-lg font-bold">Secured</p>
              <p className="text-sm text-gray-500">
                Every activity is fingerprinter and secure by Pangea.cloud
              </p>
            </div>
            <div className="w-full rounded-2xl bg-white px-5 py-10 lg:w-[calc(50%-40px)]">
              <Bot color={'#533075'} />
              <p className="mt-5 text-lg font-bold">Investor AI </p>
              <p className="text-sm text-gray-500">
                Equiped with one of the best ai to assist you in making decision in which project to
                invest in
              </p>
            </div>
            <div className="w-full rounded-2xl bg-white px-5 py-10 lg:mt-10 lg:w-[calc(50%-40px)]">
              <PieChart color={'#533075'} />
              <p className="mt-5 text-lg font-bold">Earn rewards </p>
              <p className="text-sm text-gray-500">Enjoy exclusive rewards, discount and more!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="mx-auto  max-w-[1280px] items-center justify-between lg:px-10">
          <div>
            <h3 className="text-center text-4xl font-semibold">Our Investors</h3>
            <div className="mt-10">
              <Marquee className="w-full" gradient>
                {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6].map((img, idx) => (
                  <div
                    key={idx}
                    className=" ml-10 flex h-[161.9px] w-[185.3px] items-center justify-center lg:ml-20"
                  >
                    <Image className="w-auto" alt="company-logo" src={img} />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#e8f4fd] py-5">
        <div className="relative mx-auto lg:max-w-[1280px]">
          <Logo className="absolute -top-2 left-2 my-auto hidden lg:left-0 lg:block" />
          <p className="text-center text-sm text-[#9EAEC8]">
            copyright & all rights Reserved to Fundstart
          </p>
        </div>
      </footer>
    </main>
  )
}
