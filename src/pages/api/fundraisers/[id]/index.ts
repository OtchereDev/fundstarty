import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthNService } from 'pangea-node-sdk'

export default async function Fundraiser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query

    const auth = new AuthNService(AUTHN_TOKEN, pangea)

    const fundraiser = await prisma.fundraiser.findFirst({
      where: { id: id as string },
      include: {
        category: true,
        organizer: true,
        investments: {
          include: {
            User: true,
          },
        },
        comments: {
          include: {
            sponsor: {
              select: { email: true },
            },
          },
        },
      },
    })
    const organizer = await auth.user.profile.getProfile({
      email: fundraiser?.organizer?.email as string,
    })

    const profile = organizer.result.profile
    fundraiser!.organizer = { ...fundraiser!.organizer, ...profile }

    if (fundraiser?.comments.length) {
      const comments = []
      for (let comment of fundraiser.comments) {
        const newComment = comment

        const sponsor = await auth.user.profile.getProfile({
          email: comment?.sponsor?.email,
        })
        const profile = sponsor.result.profile
        newComment.sponsor = { ...newComment.sponsor, ...profile }
        comments.push(newComment)
      }

      fundraiser.comments = comments
    }

    if (fundraiser?.investments.length) {
      const investments = []
      for (let investment of fundraiser.investments) {
        const newComment = investment

        const sponsor = await auth.user.profile.getProfile({
          email: investment?.User?.email as string,
        })
        const profile = sponsor.result.profile
        newComment.User = { ...newComment.User, ...(profile as any) }
        investments.push(newComment)
      }

      fundraiser.investments = investments
    }

    return res.json({ message: 'Successful', fundraiser })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
