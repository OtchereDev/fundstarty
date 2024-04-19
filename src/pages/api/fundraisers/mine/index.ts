import { NextApiRequest, NextApiResponse } from 'next'

import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

export default async function Fundraisers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)

    const fundraisers = await prisma.fundraiser.findMany({
      where: {
        organizer: {
          email,
        },
      },
    })

    return res.json({ message: 'Sucessfully', fundraisers })
  } else {
    return res.status(404).json({ message: 'Method not supported' })
  }
}
