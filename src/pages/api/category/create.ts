import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prismaClient'

export default async function CreateCategory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const name = req.body.name

    if (!name) return res.status(400).json({ message: 'Category name is required' })

    await prisma.category.create({ data: { name } })

    // TODO: log here
    return res.status(200).json({ message: 'Category created successfully' })
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
