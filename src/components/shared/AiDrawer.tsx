import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Send, Wand, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Cursor } from '../assets/icons'
import { Textarea } from '../ui/textarea'

export default function AiDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0
    // const stringResponse = chatHistory[chatHistory.length - 1].content
    const stringResponse =
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis, alias odit delectus reiciendis neque ipsam quis libero dolorum eaque dolore magni commodi dignissimos. Maxime culpa, veritatis accusantium perferendis omnis molestiae!'

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i))

      i++

      if (i > stringResponse.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 20)

    return () => clearInterval(intervalId)
  }, [])
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-[1280px] px-5">
          <DrawerHeader>
            <DrawerTitle>Aisha (Investment assistant AI)</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-[450px] flex-col">
            <div className="flex-1">
              <div className="flex gap-5">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-100 shadow-md">
                  <Wand />
                </div>
                <div className="flex-1 rounded-xl bg-gray-200 p-3">
                  <span>
                    {displayResponse}
                    {!completedTyping && <Cursor />}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <Textarea className="flex-1" placeholder="Type your message here." />
              <button className="rounded-xl bg-[#541975] px-3 py-3 text-white">
                <Send />
              </button>
            </div>
          </div>
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <button className="absolute right-20 top-10">
                <X />
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
