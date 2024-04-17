import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { User } from 'lucide-react'

const Comment = ({
  comment,
  removeBorderTop,
}: {
  comment: { name: string; amount: number; comment: string; createdAt: string }
  removeBorderTop?: boolean
}) => {
  return (
    <div className={` my-2 ${!removeBorderTop && 'border-t'} items-center py-2 text-[#541975]`}>
      <div className="flex items-center">
        <div className="mr-4 flex  h-10 w-10 items-center justify-center rounded-full bg-[#541975] bg-opacity-10">
          <User />
        </div>
        <h3 className="text-lg ">
          {comment.name} donated £{comment.amount}
        </h3>
      </div>
      <div>
        <p className="text-gray-800">{comment.comment}</p>
        <p className="text-sm">
          {formatDistanceToNow(Date.parse(comment.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}

export default Comment
