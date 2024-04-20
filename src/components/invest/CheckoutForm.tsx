import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CheckoutForm = ({
  donationData,
  fundraiserAuth,
}: {
  donationData: {
    amount: string
    name: string
    fundraiserId: string
    tip: string
  }
  fundraiserAuth: string
}) => {
  const [succeded, setSucceded] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [processing, setProcessing] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const [intentId, setIntentId] = useState()

  const stripe = useStripe()
  const element = useElements()

  const cardStyle = {
    style: {
      base: {
        color: '#541975',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#541975',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  useEffect(() => {
    async function getPaymentId() {
      const auth = fundraiserAuth.split(',')[0]
      const req = await fetch('/api/payment/create-payment', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(donationData.amount),
          tip: parseFloat(donationData.tip),
          fundraiserId: donationData.fundraiserId,
          name: donationData.name,
        }),
        headers: {
          authorization: `Bearer ${auth}`,
          'content-type': 'application/json',
        },
      })

      if (req.ok) {
        const response = await req.json()
        setIntentId(response.intentId)
        setClientSecret(response.clientSecret)
      }
    }

    if (fundraiserAuth.length) getPaymentId()
  }, [fundraiserAuth])

  const handleChange = async (e: any) => {
    setDisabled(e.empty)
    setError(e.error ? e.error.message : '')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setProcessing(true)

    const payload = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: element!.getElement(CardElement)!,
      },
    })

    if (payload?.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      setError(null)
      setProcessing(false)
      setSucceded(true)

      // redirect user here to add comment orr show comment box now
    }
  }

  const handleAddComment = async () => {
    if (!message.length)
      return toast.error('Error', {
        description: 'Please provide a message or click on the cancel button',
      })
    const auth = fundraiserAuth.split(',')[0]
    try {
      const res = await fetch(`/api/payment/${intentId}/add-comment`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({ message }),
      })
      if (res.ok) {
        toast.success('Success', {
          description: 'Comment sucessfully added',
        })
        router.push('/')
      } else {
        await res.json()
      }
    } catch (error) {
      toast.error('Error', { description: 'Sorry could not add message' })
    }
  }

  const handleMsgCancel = () => {
    router.push('/')
  }

  return (
    <>
      <form
        id="payment-form"
        className={`${succeded ? 'hidden' : 'block'}`}
        onSubmit={handleSubmit}
      >
        <CardElement
          id="card-element"
          className="mb-2 rounded-md border border-[#541975] px-2 py-3 text-lg !text-[#541975]"
          options={cardStyle}
          onChange={handleChange}
        />
        <button
          className="w-full rounded-md bg-[#541975] py-2 text-lg font-semibold text-gray-50 shadow-md"
          disabled={processing || disabled || succeded}
          id="submit"
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : 'Pay now'}
          </span>
        </button>
        {error && (
          <div className="card-error text-red-500" role="alert">
            {error}
          </div>
        )}
      </form>
      {/* Show a success message upon completion */}
      <div className={succeded ? 'block ' : 'hidden'}>
        <p className="text-[#541975]">
          Payment succeeded, Please leave a message for the founders (optional)
        </p>

        <textarea
          className="font-primary mt-4 h-52 w-full resize-none rounded-md border border-[#541975] p-3 outline-none"
          placeholder="Message*"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          className="w-full rounded-md bg-[#541975] py-2 text-lg font-semibold text-gray-50 shadow-md outline-none"
          disabled={!succeded}
          onClick={handleAddComment}
        >
          Submit
        </button>

        <button
          className="mt-2 w-full rounded-md border border-red-400 py-2 text-lg font-medium text-red-500 shadow-md outline-none"
          disabled={!succeded}
          onClick={handleMsgCancel}
        >
          Cancle, I don&apos;t want to leave a message
        </button>
      </div>
    </>
  )
}

export default CheckoutForm
