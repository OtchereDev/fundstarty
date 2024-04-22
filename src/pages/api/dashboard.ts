import { NextApiRequest, NextApiResponse } from 'next'

import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

export default async function WalletList(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)
    const amountInvested = await prisma.fundInvestment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        User: {
          email,
        },
      },
    })

    const investedIn = await prisma.fundInvestment.count({ where: { User: { email } } })
    const invested = amountInvested._sum.amount?.toNumber() ?? 0
    const percentage = Math.random()

    return res.json({
      data: {
        investedIn: investedIn ?? 0,
        fundraisersPercentage: invested == 0 ? 0 : Math.ceil(100 * Math.random()),
        amountInvested: invested,
        investedPercentage: invested == 0 ? 0 : Math.ceil(100 * Math.random()),
        proposedProfit: invested == 0 ? 0 : invested + invested * percentage,
        profitPercentage: percentage,
      },
    })
  } else {
    return res.status(403).json({ message: 'Invalid Method' })
  }
}
