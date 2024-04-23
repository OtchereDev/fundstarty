import { AuthMessages } from '@/constants/AuthDisplay'
import Link from 'next/link'
import { Logo } from '../assets/icons'

export default function Sushi({
  children,
  stage,
}: Readonly<{ children: React.ReactNode; stage: string }>) {
  const message = AuthMessages[stage]

  return (
    <main className="w-full overflow-y-hidden bg-white p-6 text-[#333] lg:grid lg:h-screen lg:grid-cols-[34%,66%] lg:bg-[#f3f4f5] lg:p-0">
      <div className=" lg:max-w-[80%] lg:flex-shrink-0 lg:bg-[#f3f4f5] lg:pl-16 lg:pt-16">
        <Link href="/">
          <Logo />
        </Link>

        <h4 className="mt-12 lg:mt-20">{message?.message}</h4>
        <h1 className="mt-5 text-[27px] lg:mt-10 lg:text-4xl">{message?.title}</h1>
      </div>

      <div className="relative rounded-tl-[72px] lg:h-full lg:flex-shrink-0 lg:overflow-y-scroll lg:bg-white lg:shadow-lg">
        {children}
      </div>
    </main>
  )
}
