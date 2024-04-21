import OpenAI from 'openai'
import { prisma } from './prismaClient'

const client = new OpenAI({})

async function createAssistant() {
  return await client.beta.assistants.create({
    model: 'gpt-4-turbo',
    instructions:
      'You are a investment assistant that help people to select investment or fundraising opportunity that they want to invest in. When asked to select a fundraiser, select one investment at a time.Use the provided functions to answer questions.Only use this context ',
    tools: [
      {
        type: 'function',
        function: {
          name: 'getListInvestments',
          description:
            'Get the list of investment or fundraising that are available for invest to invest in',
          parameters: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      },
    ],
  })
}

async function handleRunStatus(run: any, threadId: string) {
  if (run.status === 'completed') {
    let messages = await client.beta.threads.messages.list(threadId)
    return messages.data
  } else if (run.status === 'requires_action') {
    return await handleRequiresAction(run, threadId)
  } else {
    console.error('Run did not complete:', run)
  }
}

async function handleRequiresAction(run: any, threadId: string): Promise<any> {
  if (
    run.required_action ??
    run.required_action.submit_tool_outputs ??
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    const fundraisers = await prisma.fundraiser.findMany({
      include: { category: true, organizer: true, investments: true },
    })

    const toolOutputs = [
      {
        tool_call_id: run.required_action.submit_tool_outputs.tool_calls[0].id,
        output: JSON.stringify({ fundraisers }),
      },
    ]

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      run = await client.beta.threads.runs.submitToolOutputsAndPoll(threadId, run.id, {
        tool_outputs: toolOutputs,
      })
    } else {
    }

    return handleRunStatus(run, threadId)
  }
}

export async function createThread() {
  const thread = await client.beta.threads.create()
  const messages = await addMessage('Tell me about yourself', thread.id)

  return {
    thread,
    messages,
  }
}

export async function addMessage(message: string, threadId: string) {
  const assistant = await createAssistant()

  client.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  })

  let run = await client.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistant.id,
  })

  return await handleRunStatus(run, threadId)
}

export async function getThreadMessage(threadId: string) {
  const response = await client.beta.threads.messages.list(threadId)

  return response
}
