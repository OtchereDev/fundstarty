import { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'

import { stripe } from '@/constants/stripe'
import { prisma } from '@/lib/prismaClient'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function verifyWebhook(req: NextApiRequest, signature: string) {
  const rawBody = await getRawBody(req)
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK as string)
}

export default async function Webhook(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string

  if (req.method === 'POST') {
    try {
      const event = await verifyWebhook(req, sig)

      if (event.type == 'payment_intent.succeeded') {
        const paymentIntent = event.data.object

        const intent = await prisma.paymentIntent.findFirstOrThrow({
          where: { intentId: paymentIntent.id },
        })

        const donationAmount = paymentIntent.amount / 100 - ((intent.tip as any) ?? 0)

        await prisma.fundInvestment.create({
          data: {
            amount: donationAmount,
            fundraiserId: intent.fundraiserId,
            userId: intent.userId,
          },
        })
        await prisma.transaction.create({
          data: {
            transType: 'EXPENSE',
            userId: intent.userId,
            amount: donationAmount,
          },
        })
      } else {
        throw new Error('errored')
      }
    } catch (error) {
      return res.status(401).json({})
    }
  } else {
    return res.status(401).json({ message: 'Method not allowed' })
  }
}
