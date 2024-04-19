import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Portfolio(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)

    const portfolio = await prisma.fundInvestment.findMany({
      where: {
        User: {
          email,
        },
      },
      include: {
        User: true,
        Fundraiser: true,
      },
    })

    return res.json({ message: 'Success', portfolio })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
