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
    <div className="mb-4 flex gap-5 lg:max-w-[70%]">
      <div className=" flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 shadow-md">
        <Wand />
      </div>
      <div className="flex-1 rounded-xl bg-gray-200 p-3">
        <span>
          {displayResponse}
          {!completedTyping && <Cursor />}
        </span>
      </div>
    </div>
  )
}
