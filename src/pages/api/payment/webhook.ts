import pangea from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'

import { NextApiRequest, NextApiResponse } from 'next'
import { AuditService } from 'pangea-node-sdk'
import { default as Stripe } from 'stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!

    const SecureAudut = new AuditService(process.env.NEXT_PANGEA_SECURE_AUDIT as string, pangea)

    if (!sig)
      return res.status(400).json({
        message: 'Invalid signature',
      })

    let event: Stripe.Event

    try {
      event = req.body
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

        await SecureAudut.log({
          action: 'payment_intent.succeeded',
          target: 'payment',
          actor: 'payment_intent',
          status: 'success',
          message: `Successfully investment for fundraiser ${intent.fundraiserId} by ${intent.userId}`,
        })
      } else {
        throw new Error('errored')
      }
      return res.json({ received: true, event })
    } catch (err: any) {
      await SecureAudut.log({
        action: 'payment_intent.succeeded',
        target: 'payment',
        actor: 'payment_intent',
        status: 'error',
        message: `Error investment for fundraiser ${err.message}`,
      })
      res.status(400).json({
        message: err.message,
      })
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler
