import { NextApiRequest, NextApiResponse } from 'next'

import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

export default async function WalletList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)

    const user = await prisma.user.findFirst({
      where: { email: { contains: email, mode: 'insensitive' } },
      select: { id: true },
    })

    const wallets = await prisma.wallet.findMany({ where: { userId: user?.id } })

    return res.json({ message: 'Successfully fetched wallet', wallets })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
