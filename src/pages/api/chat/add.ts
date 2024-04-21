import { NextApiRequest, NextApiResponse } from 'next'

// import { getBearerToken, validateToken } from '@/lib/auth'
import { addMessage } from '@/lib/openai'
import Joi from 'joi'

const schema = Joi.object({
  message: Joi.string().required(),
  threadId: Joi.string().required(),
})

export default async function Index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // const token = getBearerToken(req)
    // if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const { error, value } = schema.validate(req.body)

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }

    const response = await addMessage(value.message, value.threadId)

    return res.json({ response })
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}
