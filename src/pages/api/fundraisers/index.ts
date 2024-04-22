import { v2 as cloudinary } from 'cloudinary'
import joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'

import { SecureAudut } from '@/constants/pangea'
import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

cloudinary.config({
  cloud_name: 'otcheredev',
  api_key: '679348964986479',
  api_secret: 'rT8gPo3f1JZHhTLL5x96-xH4YFk',
})

const fundraiserSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.string().dataUri().required(),
  amountRaising: joi.number().required(),
  categoryId: joi.number().required(),
  expiryDate: joi.string().isoDate(),
})

export default async function Fundraisers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const search = req.query.search
    let category: string | number = (req.query.category as string) ?? ''

    if (!category.length && !isNaN(parseInt(category))) {
      category = parseInt(category)
    } else {
      category = 0
    }

    const fundraisers = await prisma.fundraiser.findMany({
      select: {
        _count: {
          select: {
            investments: true,
          },
        },
        title: true,
        category: true,
        description: true,
        id: true,
        userId: true,
        organizer: true,
        investments: true,
        comments: true,
        categoryId: true,
        amountRaising: true,
        image: true,
        expiryDate: true,
        createdAt: true,
      },
      where: {
        ...(search?.length ? { title: { contains: search as string, mode: 'insensitive' } } : {}),
        ...(category > 0 ? { category: { id: category } } : {}),
      },
    })

    return res.json({ message: 'Sucessfully', fundraisers })
  } else if (req.method === 'POST') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const { error, value } = fundraiserSchema.validate(req.body, { abortEarly: false })

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }

    const email = getUserEmail(req)
    const user = await prisma.user.findFirst({ where: { email } })

    const imgResult = await cloudinary.uploader.upload(value.image, {
      access_mode: 'public',
      folder: 'fundstart',
    })

    const catId = value.categoryId
    delete value.categoryId
    const f = await prisma.fundraiser.create({
      data: {
        ...value,
        image: imgResult.url,
        category: { connect: { id: catId } },
        organizer: { connect: { id: user?.id as string } },
      },
    })

    await SecureAudut.log({
      action: 'fundraiser_create',
      target: 'fundraiser',
      actor: user?.email ?? 'user',
      status: 'success',
      message: `Successfully created fundraiser ${f.id} by ${user?.email}`,
    })

    return res.json({ message: 'Successfully' })
  } else {
    return res.status(404).json({ message: 'Method not supported' })
  }
}
