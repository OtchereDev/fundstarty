import { NextApiRequest, NextApiResponse } from 'next'

import { getBearerToken, validateToken } from '@/lib/auth'
import { createThread } from '@/lib/openai'

export default async function Index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const response = await createThread()

    return res.json({ response })
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}
