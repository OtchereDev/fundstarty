import { getBearerToken, validateToken } from '@/lib/auth'
import { getJWTPayload } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Fundraiser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const token = getBearerToken(req)
    const result = await validateToken(token)
    if (!result) return res.status(400).json({ message: 'Unauthenticated' })

    const payload = getJWTPayload(token)
    const email = payload.email as string

    const { intentId } = req.query
    const body = req.body

    try {
      const intent = await prisma.paymentIntent.findFirstOrThrow({
        where: {
          intentId: intentId as string,
        },
        include: {
          fundraiser: true,
        },
      })

      await prisma.comment.create({
        data: {
          message: body.message,
          Fundraiser: {
            connect: {
              id: intent.fundraiser.id,
            },
          },
          sponsor: {
            connect: {
              email,
            },
          },
        },
      })

      return res.status(200).json({ message: 'Successfully created' })
    } catch (error: any) {
      return res.status(400).json({ error: error.message ?? 'Unexpected error' })
    }
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}
