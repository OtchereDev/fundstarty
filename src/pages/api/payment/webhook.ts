// import { NextApiRequest, NextApiResponse } from 'next'

// import { stripe } from '@/constants/stripe'
// import { prisma } from '@/lib/prismaClient'
// import Stripe from 'stripe'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// const buffer = (req: NextApiRequest) => {
//   return new Promise<Buffer>((resolve, reject) => {
//     const chunks: Buffer[] = []

//     req.on('data', (chunk: Buffer) => {
//       chunks.push(chunk)
//     })

//     req.on('end', () => {
//       resolve(Buffer.concat(chunks))
//     })

//     req.on('error', reject)
//   })
// }

// async function verifyWebhook(req: NextApiRequest, signature: string) {
//   const body = await buffer(req)
//   return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK as string)
// }

// export default async function Webhook(req: NextApiRequest, res: NextApiResponse) {
//   // const sig = req.headers['stripe-signature'] as string

//   if (req.method === 'POST') {
//     try {
//       // const event = await verifyWebhook(req, sig)
//       const sig = req.headers['stripe-signature'] as string
//       const webhookSecret: string = process.env.STRIPE_WEBHOOK as string

//       let event: Stripe.Event

//       try {
//         const body = await buffer(req)
//         event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
//       } catch (err: any) {
//         // On error, log and return the error message
//         console.log(`❌ Error message: ${err.message}`)
//         res.status(400).send(`Webhook Error: ${err.message}`)
//         return
//       }

//       if (event.type == 'payment_intent.succeeded') {
//         const paymentIntent = event.data.object

//         const intent = await prisma.paymentIntent.findFirstOrThrow({
//           where: { intentId: paymentIntent.id },
//         })

//         const donationAmount = paymentIntent.amount / 100 - ((intent.tip as any) ?? 0)

//         await prisma.fundInvestment.create({
//           data: {
//             amount: donationAmount,
//             fundraiserId: intent.fundraiserId,
//             userId: intent.userId,
//           },
//         })
//         await prisma.transaction.create({
//           data: {
//             transType: 'EXPENSE',
//             userId: intent.userId,
//             amount: donationAmount,
//           },
//         })
//       } else {
//         throw new Error('errored')
//       }
//     } catch (error: any) {
//       return res.status(401).json({ err: error.message })
//     }
//   } else {
//     return res.status(401).json({ message: 'Method not allowed' })
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next'
import { default as Stripe } from 'stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!

    if (!sig)
      return res.status(400).json({
        message: 'Invalid signature',
      })

    let event: Stripe.Event

    console.log('body is', req.body)

    try {
      event = req.body
      return res.json({ received: true, event })
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      })
      return
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id)

    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`💰 PaymentIntent status: ${stripeObject.status}`)
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge
      console.log(`💵 Charge id: ${charge.id}`)
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler
