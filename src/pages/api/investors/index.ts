import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthNService } from 'pangea-node-sdk'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    let investors = await prisma.user.findMany({
      where: {},
      orderBy: {
        investments: {
          _count: 'desc',
        },
      },
      take: 5,
    })

    const auth = new AuthNService(AUTHN_TOKEN, pangea)

    if (investors.length) {
      const newInvestors = []
      for (let investment of investors) {
        let investor = investment

        const sponsor = await auth.user.profile.getProfile({
          email: investment.email,
        })
        const profile = sponsor.result.profile
        investor = { ...investor, ...(profile as any) }
        newInvestors.push(investor)
      }

      investors = newInvestors
    }

    return res.json({ message: 'Successfull', investors })
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}

export default handler
