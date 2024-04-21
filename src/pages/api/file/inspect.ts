import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'
import { FileIntelService } from 'pangea-node-sdk'

import pangea from '@/constants/pangea'

const schema = Joi.object({
  file: Joi.string().required(),
})

export default async function Index(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { error, value } = schema.validate(req.body)

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }

    const fileIntel = new FileIntelService(process.env.NEXT_PANGEA_FileIntel as string, pangea)
    const result = await fileIntel.hashReputation(value.file, 'md5')

    return res.json({ response: JSON.parse(result.toJSON()) })
  } else {
    return res.status(403).json({ message: 'Invalid method' })
  }
}
