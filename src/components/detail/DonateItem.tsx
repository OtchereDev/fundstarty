import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { User } from 'lucide-react'

const DonateItem = ({
  borderClass,
  donate,
  className,
}: {
  borderClass?: string
  donate: { name: string; amount: number; createdAt: string }
  className?: string
}) => {
  return (
    <div className={`my-2 flex ${borderClass} items-center py-2 text-[#541975] ${className}`}>
      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#541975] bg-opacity-10">
        <User />
      </div>
      <div>
        <h3 className="text-lg">{donate.name}</h3>
        <div className="flex items-center">
          <span className="mr-2 text-lg">${donate.amount}</span>

          <span className="text-sm">
            {formatDistanceToNow(Date.parse(donate.createdAt), { addSuffix: false })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DonateItem
