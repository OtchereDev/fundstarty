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
import { useState } from 'react'

export function AddWalletDialog({ children }: Readonly<{ children: React.ReactNode }>) {
  const [cvv, setCvv] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  function addWallet() {}
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="cardNumber" className="mb-2 inline-block text-right">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              onChange={(e) => setCardNumber(e.target.value)}
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
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
