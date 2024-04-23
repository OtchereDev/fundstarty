export default function CategoryITem({
  category,
  selected,
  callBack,
  id,
}: Readonly<{
  category: string
  selected?: boolean
  callBack: (v: number) => void
  id: number
}>) {
  return (
    <div
      onClick={() => callBack(id)}
      className={`cursor-pointer rounded-full px-4 py-2 ${!selected ? 'border-[1.5px] border-gray-400' : 'border-2 border-[#541975] bg-[#f3f4f5] '}`}
    >
      <p>{category}</p>
    </div>
  )
}
