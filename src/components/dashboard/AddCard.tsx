import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatExpiryDate } from '@/lib/formatExpiryDate'
import { creditCardType } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

export function AddWalletDialog({
  children,
  authKey,
}: Readonly<{ children: React.ReactNode; authKey: string }>) {
  const [cvv, setCvv] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function addWallet() {
    if (!cardNumber) {
      return toast.error('Error', { description: 'Card number is required' })
    } else if (cardNumber?.toString()?.length <= 12) {
      return toast.error('Error', { description: 'Please provide a valid card' })
    } else if (cardNumber?.toString()?.length >= 18) {
      return toast.error('Error', { description: 'Please provide a valid card' })
    } else if (!creditCardType(cardNumber?.toString())) {
      return toast.error('Error', { description: 'Please provide a valid card' })
    }

    if (!fullName) {
      return toast.error('Error', { description: 'Please provide the name on the card' })
    }

    if (!expiryDate) {
      return toast.error('Error', { description: 'Expiry date is required' })
    } else if (expiryDate.length < 5) {
      return toast.error('Error', { description: 'Please provide a valid expiry date (MM/YY)' })
    }

    if (!cvv) {
      return toast.error('Error', { description: 'CVV is required' })
    } else if (cvv.toString()?.length < 3 || cvv?.toString()?.length > 4) {
      return toast.error('Error', { description: 'Please provide a valid CVV' })
    }

    const auth = authKey.split(',')[0]
    setIsLoading(true)
    const req = await fetch('/api/wallet/create', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${auth}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber,
        cvv,
        expiryDate,
        cardHolder: fullName,
      }),
    })
    setIsLoading(false)

    if (req.ok) {
      const response = await req.json()
      setOpen(false)
      return toast.success('Sucessfully created', { description: 'Successfully created wallet' })
    } else {
      return toast.error('Error creating', { description: 'There was an error creating' })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="firstName" className="mb-2 inline-block text-right">
              Full Name
            </Label>
            <Input
              id="firstName"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              className="col-span-3"
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="cardNumber" className="mb-2 inline-block text-right">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              onChange={(e) => setCardNumber(e.target.value.replace(/[^\d|^\/]*/g, ''))}
              value={cardNumber}
              className="col-span-3"
            />
          </div>
          <div className="flex gap-4">
            <div className=" flex-1">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => formatExpiryDate(e, (e: any) => setExpiryDate(e.target.value))}
                className="col-span-3"
                maxLength={7}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="cvv" className="mb-2 text-right">
                CVV
              </Label>
              <Input
                id="cvv"
                value={cvv}
                maxLength={5}
                onChange={(e) => setCvv(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addWallet} disabled={isLoading} type="submit">
            {isLoading ? 'Loading...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
