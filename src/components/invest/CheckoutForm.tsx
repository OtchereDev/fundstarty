import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
// import { toast } from "react-toastify";
// import { APIURL } from "../../config/config";

const CheckoutForm = ({ donationData }: any) => {
  const [succeded, setSucceded] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [processing, setProcessing] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [message, setMessage] = useState('')
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

  //   useEffect(() => {
  //     fetch(`${APIURL}/payments/create-payment`, {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({ ...donationData }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setClientSecret(data?.clientSecret);
  //         setIntentId(data?.intent_id);
  //         // console.log("aa:", data);
  //       })
  //       .catch((error) => console.log(error));
  //   }, []);

  const handleChange = async (e: any) => {
    setDisabled(e.empty)
    setError(e.error ? e.error.message : '')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setProcessing(true)

    const payload = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: {
        card: element!.getElement(CardElement)!,
      },
    })

    if (payload.error) {
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
    // if (!message.length)
    //   return toast.error('Please provide a message or click on the cancel button')
    // try {
    //   const res = await fetch(`${APIURL}/payments/${intentId}/add-comment`, {
    //     method: 'POST',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //     body: JSON.stringify({ message }),
    //   })
    //   if (res.ok) {
    //     toast.success('Comment sucessfully added')
    //     setTimeout(() => {
    //     //   router.push('/')
    //     }, 1000)
    //   } else {
    //     const data = await res.json()
    //   }
    // } catch (error) {
    //   toast.error('Sorry could not add message')
    // }
  }

  const handleMsgCancel = () => {
    // router.push('/')
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
          //   hidePostalCode={true}
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
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="card-error text-red-500" role="alert">
            {error}
          </div>
        )}
      </form>
      {/* Show a success message upon completion */}
      <div className={succeded ? 'block ' : 'hidden'}>
        <p className="text-[#541975]">
          Payment succeeded, Please leave a message for the beneficiary (optional)
        </p>

        <textarea
          className="font-primary mt-4 h-52 w-full resize-none rounded-md border border-green-500 p-3 outline-none"
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
          className="mt-2 w-full rounded-md bg-red-400 py-2 text-lg font-medium text-gray-50 shadow-md outline-none"
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
