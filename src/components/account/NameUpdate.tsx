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

export default function NameUpdate({
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
  const [firstName, setFirstName] = useState(data.firstName)
  const [lastName, setLastName] = useState(data.lastName)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateName = async () => {
    if (!lastName.length || !firstName.length) {
      return toast.error('Error', { description: 'Please fill in both the first and last names' })
    }
    const auth = fundraiserAuth.split(',')[0]
    setIsLoading(true)
    const req = await fetch(`/api/auth/change-profile`, {
      method: 'POST',
      headers: {
        authorization: `bearer ${auth}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName }),
    })

    if (req.ok) {
      toast.success('Sucessfully', {
        description: 'Successfully updated profile',
      })
      callback({ firstName, lastName, phone: data.phone })
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label text="First Name" htmlFor="firstName" />
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
            />
          </div>
          <div className="mt-1">
            <Label text="Last Name" htmlFor="lastName" />
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={updateName}
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
