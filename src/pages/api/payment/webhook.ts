import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '@/constants/stripe'
import { prisma } from '@/lib/prismaClient'

export const config = {
  api: {
    bodyParser: false,
  },
}

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      resolve(Buffer.concat(chunks))
    })

    req.on('error', reject)
  })
}

async function verifyWebhook(req: NextApiRequest, signature: string) {
  const body = await buffer(req)
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK as string)
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
    } catch (error: any) {
      return res.status(401).json({ err: error.message })
    }
  } else {
    return res.status(401).json({ message: 'Method not allowed' })
  }
}
