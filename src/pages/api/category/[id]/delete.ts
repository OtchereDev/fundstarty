import { NextApiRequest, NextApiResponse } from 'next'

import pangea from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { AuditService } from 'pangea-node-sdk'

export default async function DeletCategory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const SecureAudut = new AuditService(process.env.NEXT_PANGEA_SECURE_AUDIT as string, pangea)

    const param = req.query.id as string

    if (!param || isNaN(parseInt(param))) return res.status(400).json({ message: 'ID is required' })

    const id = parseInt(param)

    await prisma.category.delete({
      where: { id },
    })

    await SecureAudut.log({
      action: 'category',
      target: req.query.id as string,
      actor: 'admin',
      status: 'success',
      message: `Successfully deleted category ${id}`,
    })
    return res.json({ message: 'Successfully deleted' })
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
