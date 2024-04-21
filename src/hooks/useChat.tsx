import {} from 'openai'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useChat = ({ authKey, open }: { authKey: string; open: boolean }) => {
  const [messages, setMessages] = useState<{ content: string; role: string }[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [threadId, setThreadId] = useState('')

  const initializeChat = async () => {
    const request = await fetch('/api/chat/init', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${authKey}`,
      },
    })

    if (request.ok) {
      const response = await request.json()
      setThreadId(response.response.thread.id)
      setMessages([
        {
          role: response.response.messages[0]?.role,
          content: response.response.messages[0]?.content[0]?.text?.value,
        },
        ...messages,
      ])
    }
  }

  useEffect(() => {
    if (!threadId?.length && open && authKey.length) {
      initializeChat()
    }
  }, [open, threadId, authKey])

  const addMessage = async (message: string) => {
    setIsLoadingAnswer(true)
    if (!threadId.length) {
      toast.error('Error', { description: 'Thread not initialized' })
      return false
    }
    try {
      const newMessages = [{ content: message, role: 'user' }, ...messages]
      setMessages(newMessages)
      const request = await fetch(`/api/chat/add`, {
        method: 'POST',
        body: JSON.stringify({ message, threadId }),
        headers: {
          'content-type': 'application/json',
        },
      })
      if (request.ok) {
        const response = await request.json()
        setMessages((curr) => [
          { role: 'assistant', content: response.response[0]?.content[0]?.text?.value as string },
          ...curr,
        ])
        return true
      } else {
        toast.error('Error', {
          description: 'There was an error',
        })
        return false
      }
    } catch (error) {
      return false
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return {
    addMessage,
    isLoadingAnswer,
    messages,
    initializeChat,
    isInitialized: threadId.length > 0,
  }
}

export default useChat
