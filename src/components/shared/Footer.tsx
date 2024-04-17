import { LogoWhite } from '../assets/icons'

export default function Footer() {
  return (
    <footer className="bg-[#541975] py-5">
      <div className="relative mx-auto lg:max-w-[1280px]">
        <LogoWhite className="absolute -top-2 left-2 my-auto hidden lg:left-0 lg:block" />
        <p className="text-center text-sm text-[#9EAEC8]">
          copyright & all rights Reserved to Fundstart
        </p>
      </div>
    </footer>
  )
}
