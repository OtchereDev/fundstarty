import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_PAYSTACK_KEY as string)
