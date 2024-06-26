import { formatMoney } from '@/lib/formatMoney'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { User } from 'lucide-react'

const DonateItem = ({
  borderClass,
  donate,
  className,
}: {
  borderClass?: string
  donate: { User: { first_name: string; last_name: string }; amount: any; createdAt: any }
  className?: string
}) => {
  return (
    <div className={`my-2 flex ${borderClass} items-center py-2 text-[#541975] ${className}`}>
      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#541975] bg-opacity-10">
        <User />
      </div>
      <div>
        <h3 className="font-semibold">
          {donate.User.first_name} {donate.User.last_name}
        </h3>
        <div className="flex items-center">
          <span className="mr-2">£{formatMoney(donate.amount)}</span>

          <span className="text-sm">
            {formatDistanceToNow(Date.parse(donate.createdAt), { addSuffix: false })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DonateItem
