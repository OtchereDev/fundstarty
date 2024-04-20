import { useState } from 'react'
import { toast } from 'sonner'
import Label from '../shared/Label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'

export default function PhoneUpdate({
  children,
  data,
  fundraiserAuth,
  callback,
}: Readonly<{
  children: React.ReactNode
  data: {
    firstName: string
    lastName: string
    phone: string
  }
  fundraiserAuth: string
  callback: (data: { firstName: string; lastName: string; phone: string }) => void
}>) {
  const [phone, setPhone] = useState(data.phone)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updatePhone = async () => {
    if (!phone.length) {
      return toast.error('Error', { description: 'Please fill in phone input' })
    }
    const auth = fundraiserAuth.split(',')[0]
    setIsLoading(true)
    const req = await fetch(`/api/auth/change-profile`, {
      method: 'POST',
      headers: {
        authorization: `bearer ${auth}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName, phone }),
    })

    if (req.ok) {
      toast.success('Sucessfully', {
        description: 'Successfully updated profile',
      })
      callback({ firstName: data.firstName, lastName: data.lastName, phone })
      setOpen(false)
    } else {
      toast.success('Error', {
        description: 'There was an unexpected error',
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Phone</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label text="Phone Number" htmlFor="phone" />
            <Input
              type={'tel'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={updatePhone}
            className="w-full rounded-xl bg-[#541975] px-5 py-3 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Loading....' : 'Save changes'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
