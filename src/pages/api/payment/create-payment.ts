import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/constants/stripe'
import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

const intentSchema = Joi.object({
  amount: Joi.number().min(1),
  tip: Joi.number(),
  fundraiserId: Joi.string().uuid().required(),
  name: Joi.string().required(),
})

export default async function Payment(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const email = getUserEmail(req)

    const body = req.body
    const { value, error } = intentSchema.validate(body)

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }

    try {
      await prisma.fundraiser.findFirstOrThrow({
        where: {
          id: value.fundraiserId,
        },
      })

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: value.amount * 100,
        metadata: {
          name: value.name,
        },
      })

      await prisma.paymentIntent.create({
        data: {
          sponsor: {
            connect: {
              email,
            },
          },
          fundraiser: {
            connect: {
              id: value.fundraiserId,
            },
          },
          intentId: paymentIntent.id,
          amount: value.amount,
          tip: value.tip,
        },
      })

      return res.json({
        clientSecret: paymentIntent.client_secret,
        intentId: paymentIntent.id,
      })
    } catch (error) {
      return res.status(400).json({ message: 'Fundraiser does not exist' })
    }
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
