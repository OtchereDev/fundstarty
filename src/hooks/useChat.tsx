import {} from 'openai'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useChat = ({ authKey }: { authKey: string }) => {
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
      setThreadId(response.thread.id)
      setMessages([
        ...messages,
        {
          role: response.messages[0]?.role,
          content: response.messages[0]?.content[0]?.text?.value,
        },
      ])
    }
  }

  useEffect(() => {
    if (!messages?.length && !threadId?.length) {
      initializeChat()
    }
  }, [messages, threadId])

  const addMessage = async (message: string) => {
    setIsLoadingAnswer(true)
    if (!threadId.length) return toast.error('Error', { description: 'Thread not initialized' })
    try {
      const newMessages = [...messages, { content: message, role: 'user' }]
      setMessages(newMessages)
      const request = await fetch(`/api/chat/add`, {
        method: 'POST',
        body: JSON.stringify({ message, threadId }),
      })
      if (request.ok) {
        const response = await request.json()
        setMessages((curr) => [
          ...curr,
          { role: 'assistant', content: response[0]?.content[0]?.text?.value as string },
        ])
      } else {
        return toast.error('Error', {
          description: 'There was an error',
        })
      }
    } catch (error) {
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return {
    addMessage,
    isLoadingAnswer,
    messages,
    initializeChat,
  }
}

export default useChat
