export default function DraftCard() {
  return (
    <div className="overflow-hidden rounded-lg border lg:flex lg:items-center lg:gap-3 lg:px-7 lg:py-3">
      <div className="h-[200px] overflow-hidden lg:h-[125px] lg:w-[175px] lg:rounded-lg">
        <img
          className="h-full w-full object-cover"
          alt="banner"
          src="https://d2g8igdw686xgo.cloudfront.net/79511523_1713189097238160_r.jpeg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">Untitled</h3>
        <p className="mt-2 text-sm text-gray-500">Fundraiser created 15 hrs ago</p>
        <button className="mt-7 w-full rounded-lg border py-2.5  font-semibold shadow lg:w-auto lg:px-7 lg:py-3.5 lg:shadow-none">
          Finish draft
        </button>
      </div>
    </div>
  )
}
