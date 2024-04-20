import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'

const promise = loadStripe(
  'pk_test_51P72zYP6LCSjRIMK8hCCwvhmBdfzl76YJmeC94vMPfmrhylfSQVBvcqyxTNVpW7QxrxzlpwC6lxH8fAMIBO58fKp00uSeUb83a'
)

export default function PayForm({ donationData, fundraiserAuth }: any) {
  return (
    <div>
      <Elements stripe={promise}>
        <CheckoutForm donationData={donationData} fundraiserAuth={fundraiserAuth} />
      </Elements>
    </div>
  )
}
