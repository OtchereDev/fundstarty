import { CardLogo, CardVector } from '../assets/icons'

export default function MasterCard() {
  return (
    <div className="relative  h-[230px] w-full">
      <div className="absolute -bottom-8 z-[0] ml-[15%] h-full w-[70%] rounded-2xl bg-[#eeeeee]" />
      <div className="absolute -bottom-4 z-[0] ml-[5%] h-full w-[90%] rounded-2xl bg-[#c3c3c3]" />
      <div className="relative flex  h-full flex-col justify-end overflow-hidden  rounded-2xl bg-[#541975] p-6 text-white">
        <CardVector className="absolute -right-5 -top-6 w-[250px]" />
        <CardLogo className="absolute left-4 top-3 w-[30px]" />
        <div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-medium">**** 3090</p>

            <p>EXP 09/24</p>
          </div>
          <div className="mt-5">
            <p className="text-xl font-semibold">Peter Crouch</p>
          </div>
        </div>
      </div>
    </div>
  )
}
