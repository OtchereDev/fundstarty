import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prismaClient'

export default async function DeletCategory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const param = req.query.id as string

    if (!param || isNaN(parseInt(param))) return res.status(400).json({ message: 'ID is required' })

    const id = parseInt(param)

    await prisma.category.delete({
      where: { id },
    })

    // TODO: log here
    return res.json({ message: 'Successfully deleted' })
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
