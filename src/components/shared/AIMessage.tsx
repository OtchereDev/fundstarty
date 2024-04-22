import { Wand } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Cursor } from '../assets/icons'

export default function AIMessage({ message }: Readonly<{ message: string }>) {
  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0
    const stringResponse = message

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i))

      i++

      if (i > stringResponse.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 20)

    return () => clearInterval(intervalId)
  }, [message])

  return (
    <div className="mb-4 flex flex-col gap-2 lg:max-w-[70%] lg:flex-row lg:gap-5">
      <div className="hidden h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 shadow-md lg:flex">
        <Wand />
      </div>
      <div className="flex-1 rounded-xl bg-gray-200 p-3">
        <span>
          {displayResponse}
          {!completedTyping && <Cursor />}
        </span>
      </div>
      <p className="text-xs text-gray-500 lg:hidden">From Debby</p>
    </div>
  )
}
