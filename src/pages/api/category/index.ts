import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function CategoryList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const search = req.query.search as string

    const results = await prisma.category.findMany(
      search?.length ? { where: { name: { contains: search } } } : undefined
    )

    return res.json({ response: results })
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
