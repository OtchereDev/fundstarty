export default function Header({
  title,
  beneficiary,
  organizer,
  image,
}: Readonly<{
  title: string
  beneficiary?: string
  organizer: string
  image: string
}>) {
  return (
    <div className="flex flex-col md:flex-row md:items-center ">
      <div className="relative h-52 w-full overflow-hidden  md:h-32 md:w-3/12 md:rounded-2xl lg:w-4/12">
        <img src={image} alt="banner" className="h-full w-full object-cover" />
      </div>
      <div className="mb-3 border-b py-5 md:mb-0 md:border-0 md:py-0">
        <h3 className="px-3 pt-3">
          You&apos;re supporting <span className="ml-2 text-lg font-semibold">{title}</span>
        </h3>
        {typeof beneficiary == 'string' && beneficiary.length > 0 ? (
          <h4 className="px-3 pt-3 text-sm text-gray-600 lg:pt-1">
            Your investment will benefit{' '}
            <span className="ml-2 text-base font-semibold">{beneficiary}</span>
          </h4>
        ) : (
          <h4 className="px-3 pt-3 text-sm text-gray-600 lg:pt-1">
            This investment is organized by{' '}
            <span className="ml-2 text-base font-semibold">{organizer}</span>
          </h4>
        )}
      </div>
    </div>
  )
}
