import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const investors = await prisma.user.findMany({
      where: {},
      orderBy: {
        investments: {
          _count: 'desc',
        },
      },
      take: 5,
    })

    return res.json({ message: 'Successfull', investors })
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}

export default handler
