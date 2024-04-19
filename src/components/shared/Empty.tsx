import { EmptyState } from '../assets/icons'

export default function Empty() {
  return (
    <div className="flex flex-col items-center">
      <EmptyState className="h-[150px] w-[150px]" />
      <p className="mt-3 font-semibold">No Data</p>
    </div>
  )
}
