import CategoryITem from '@/components/create/CategoryITem'
import Sushi from '@/components/detail/Sushi'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { prisma } from '@/lib/prismaClient'
import { Category } from '@prisma/client'
import cookie from 'cookie'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'
import SparkMD5 from 'spark-md5'

export default function Create({
  categories,
  fundstartAuth,
}: Readonly<{
  categories: Category[]
  fundstartAuth: string
}>) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [amountRaising, setAmountRaising] = useState('')

  const [imageUrl, setImageUrl] = useState<undefined | null | string | ArrayBuffer>(undefined)
  const [md5Imge, setMD5Imge] = useState('')

  const handleImage = (e: any) => {
    if (e) {
      const file = e.target.files[0]
      const spark = new SparkMD5.ArrayBuffer()

      if (file) {
        const reader = new FileReader()
        reader.onloadend = function () {
          if (reader.result) {
            setImageUrl(() => reader.result)
          }
          const md5 = spark.append(reader.result as ArrayBuffer)
          const url = md5.end()

          setMD5Imge(url)
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const handleClear = () => {
    setImageUrl(() => undefined)
    setMD5Imge('')
  }

  const handleSubmit = async () => {
    if (!selectedCategory) {
      return toast.error('Error', {
        description: 'Provide a category',
      })
    }
    if (!businessName.length) {
      return toast.error('Error', {
        description: 'Provide a business name',
      })
    }
    if (!description.length) {
      return toast.error('Error', {
        description: 'Provide a description',
      })
    }
    if (!amountRaising.length || parseFloat(amountRaising) <= 0) {
      return toast.error('Error', {
        description: 'Provide a valid amount',
      })
    }
    if (!imageUrl) {
      return toast.error('Error', {
        description: 'Provide a cover image',
      })
    }

    try {
      const auth = fundstartAuth.split(',')[0]
      setIsLoading(true)
      const request = await fetch('/api/file/inspect', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${auth}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ file: md5Imge }),
      })

      if (request.ok) {
        const upload = await fetch('/api/fundraisers', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${auth}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            title: businessName,
            description,
            image: imageUrl,
            amountRaising: parseFloat(amountRaising),
            categoryId: selectedCategory,
            expiryDate: '2024-12-23T18:25:43.511Z',
          }),
        })
        if (upload.ok) {
          toast.success('Successful', {
            description: 'Successfully created fundraiser',
          })
          Router.push('/your-campaign')
          return
        } else {
          const response = await upload.json()
          response.errors?.forEach((error: string) => {
            toast.error('Error', { description: error })
          })
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
        toast.error('Error', { description: 'The Cover image is corrupted. Please change it.' })
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Error', { description: 'There was an unknown error' })
    }
  }

  return (
    <Sushi stage={'category'}>
      <div className="mt-7 lg:mt-0  lg:flex lg:h-full lg:flex-col  lg:justify-between lg:overflow-hidden">
        <div className="overflow-y-auto lg:row-start-1  lg:px-20">
          <p className="mb-10 mt-24 hidden text-2xl lg:block">Your Campaign Details</p>
          <div className="pb-10 lg:w-[80%]">
            <div>
              <div>
                <Label className="mb-3 inline-block text-lg">
                  What best describes why you&apos;re fundraising?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CategoryITem
                      key={category.id}
                      category={category.name}
                      id={category.id}
                      selected={selectedCategory == category.id}
                      callBack={(v) => setSelectedCategory(v)}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-1 inline-block text-lg" htmlFor={'businessName'}>
                  Business name
                </Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  id="businessName"
                  placeholder="Business Name"
                  type="text"
                />
              </div>
              <div className="mt-4">
                <Label className="mb-1 inline-block text-lg" htmlFor={'story'}>
                  Tell your idea / startup
                </Label>
                <Textarea
                  className="min-h-[150px]"
                  id="story"
                  placeholder="Hi, my name is Oliver and I am fundraising to start a company called Pangea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Label className="mb-1 inline-block text-lg" htmlFor={'target'}>
                  Your Initial Target (£)
                </Label>
                <Input
                  value={amountRaising}
                  onChange={(e) => setAmountRaising(e.target.value)}
                  id="target"
                  placeholder="600"
                  type="number"
                />
              </div>
              <div className="mt-4">
                <Label className="mb-1 inline-block text-lg">Add a cover photo</Label>
                {!imageUrl ? (
                  <div className="relative flex h-[100px] items-center justify-center rounded-2xl border border-dashed">
                    <button className="rounded-lg bg-[#541975] px-4 py-1 text-white">Add</button>
                    <input
                      onChange={(e) => {
                        handleImage(e)
                      }}
                      className="absolute left-0 top-0 h-full w-full opacity-0"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <>
                    <div className="h-[250px] w-full overflow-hidden rounded-2xl">
                      <img src={imageUrl as string} className="w-full object-cover" />
                    </div>
                    <button onClick={handleClear} className="mt-2 text-red-700">
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-5 w-full lg:row-start-2 lg:flex lg:flex-col lg:justify-end lg:border-t lg:bg-white lg:px-6 lg:py-10">
          <p className="mb-2 text-sm lg:text-right">
            By clicking the continue button below, you agree to the Fundstart{' '}
            <span className="underline">Terms of Service</span> and acknowledge the{' '}
            <span className="underline">Privacy Notice</span>.
          </p>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-lg bg-[#541975] py-3 font-semibold text-white lg:ml-auto lg:inline-block lg:w-auto lg:px-10"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </Sushi>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.headers.cookie) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let { fundstartAuth } = cookie.parse(req.headers.cookie)
  if (!fundstartAuth)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  const categories = await prisma.category.findMany({})

  return {
    props: {
      fundstartAuth,
      categories: JSON.parse(JSON.stringify(categories)),
    },
  }
}
