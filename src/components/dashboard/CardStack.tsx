import { Wallet } from '@prisma/client'
import MasterCard from './MasterCard'

export default function CardStack({ wallet }: { wallet: Wallet }) {
  return (
    <div className="mt-8">
      <MasterCard wallet={wallet} />
    </div>
  )
}
