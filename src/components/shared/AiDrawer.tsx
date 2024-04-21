import cookie from 'cookie'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import useChat from '@/hooks/useChat'

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
import { Bot, Send, X } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import AIMessage from './AIMessage'
import EllipseLoader from './EllipseLoader'

export default function AiDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false)
  const [authKey, setAuthKey] = useState('')
  const [conversations, setConversations] = useState<{ role: string; content: string }[]>([])
  const { addMessage, isLoadingAnswer, messages, isInitialized } = useChat({ authKey, open })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const cookies = document.cookie
    const result = cookie.parse(cookies)
    if (result.fundstartAuth) {
      setAuthKey(result.fundstartAuth)
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) setConversations((curr) => [...curr, messages[0]])
  }, [messages])

  const sendMessage = async () => {
    if (!message) return toast.error('Error', { description: 'message cannot be empty' })
    const resp = await addMessage(message)
    if (resp) {
      setMessage('')
    }
  }

  return (
    <Drawer dismissible onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-[1280px] px-5">
          <DrawerHeader>
            <DrawerTitle>Debby (Investment assistant AI)</DrawerTitle>
            <DrawerDescription>
              Here to make your investment journey on Fundstart easy
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex h-[450px] flex-col">
            {!isInitialized ? (
              <div>
                <p className="mt-5 text-center text-xl font-semibold">
                  Please wait whiles I initialize myself
                </p>
                <Bot className="mx-auto h-[140px] w-[140px] text-[#533075]" />
                <div className="flex justify-center">
                  <EllipseLoader />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-scroll pb-10">
                  {conversations.map((convo, idx) =>
                    convo.role === 'assistant' ? (
                      <AIMessage key={idx} message={convo.content} />
                    ) : (
                      <div
                        key={idx}
                        className="mb-4 ml-auto rounded-lg bg-gray-200 p-4 lg:max-w-[70%]"
                      >
                        {convo.content}
                      </div>
                    )
                  )}
                </div>

                {isLoadingAnswer && <EllipseLoader />}
                <div className="flex items-end gap-3">
                  <Textarea
                    disabled={isLoadingAnswer}
                    className="flex-1"
                    value={message}
                    placeholder="Type your message here."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    disabled={isLoadingAnswer}
                    className="rounded-xl bg-[#541975] px-3 py-3 text-white disabled:bg-opacity-90"
                    onClick={sendMessage}
                  >
                    <Send />
                  </button>
                </div>
              </>
            )}
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
