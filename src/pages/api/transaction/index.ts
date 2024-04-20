import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)

    const transactions = await prisma.transaction.findMany({
      where: {
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    })

    return res.json({ message: 'Success', transactions })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}

export default handler
