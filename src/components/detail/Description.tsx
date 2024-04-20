import Comment from '@/components/detail/Comment'
import { Category, Fundraiser, User as Sponsor, Comment as SponsorComment } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Tag, User } from 'lucide-react'

export default function Description({
  fundraiser,
}: Readonly<{
  fundraiser: Fundraiser & { category: Category; organizer: Sponsor; comments: SponsorComment[] }
}>) {
  // console.log(fundraiser.comments)
  return (
    <div className="w-full border-b px-4   lg:w-8/12 lg:px-10">
      <h1 className="my-2  text-3xl font-semibold capitalize lg:text-5xl">{fundraiser.title}</h1>

      <div>
        <div className={`my-2 flex items-center border-b  p-1`}>
          <div className="text-#541975 mr-4 flex h-10  w-10 items-center justify-center rounded-full bg-[#541975] bg-opacity-10">
            <User />
          </div>
          <div>
            <h3 className="">
              {(fundraiser?.organizer as any)?.first_name}{' '}
              {(fundraiser?.organizer as any)?.last_name} is organizing this fundraiser.
            </h3>
          </div>
        </div>

        <div className="flex flex-col py-3 md:flex-row md:items-center">
          <span className="md:mr-2">
            Created{' '}
            {formatDistanceToNow(Date.parse(fundraiser.createdAt as any), { addSuffix: true })}
          </span>
          <span className="flex items-center">
            | <Tag className="m-2 text-lg text-[#541975]" />
            <span className="cursor-pointer p-1 hover:bg-gray-100 ">
              {fundraiser?.category?.name}
            </span>
          </span>
        </div>
        <p className="tracking-wide text-gray-800 ">{fundraiser.description}</p>
      </div>

      <div className="mt-3">
        <h3 className="border-b pb-2 text-xl font-bold">Organizer</h3>

        <div className="my-2 flex  items-center  p-1">
          <div className="text-#541975 mr-4 flex h-10  w-10 items-center justify-center rounded-full bg-[#541975] bg-opacity-10">
            <User />
          </div>
          <div className="w-full lg:flex">
            <div className="lg:w-10/12">
              <h3 className="">
                {(fundraiser?.organizer as any)?.first_name}{' '}
                {(fundraiser?.organizer as any)?.last_name}
              </h3>
              <h5 className="my-1 text-sm">Organiser</h5>
            </div>
            <div className="w-2/12">
              <button
                // onClick={onContactClick}
                className="text-#541975 rounded-md border border-[#541975] bg-white px-3 py-1 font-semibold outline-none hover:bg-[#541975] hover:bg-opacity-10"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className=" pb-2 text-2xl font-bold">Comments ({fundraiser.comments.length})</h3>

        {fundraiser.comments.length ? (
          fundraiser.comments.map((comment) => <Comment key={comment.id} comment={comment} />)
        ) : (
          <h3 className="my-5 text-center">No comments</h3>
        )}

        {fundraiser.comments.length > 5 ? (
          <div className="my-3">
            <button
              //   onClick={onCommentClick}
              className="border-#541975 text-#541975 w-full rounded-md border bg-white py-2 font-semibold outline-none hover:bg-[#541975] hover:bg-opacity-10 lg:w-4/12 "
            >
              Show More
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
