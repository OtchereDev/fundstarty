import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthNService } from 'pangea-node-sdk'

import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { PasswordRegex } from '@/constants/regex'
import { getBearerToken, validToken } from '@/lib/auth'
import { getJWTPayload } from '@/lib/decodeJwt'
import { generateRandomId } from '@/lib/keys'

const joiScheme = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().regex(PasswordRegex).required(),
})

export default async function ChangePassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!(await validToken(req))) return res.status(400).json({ message: 'Unauthorized' })
    const payload = getJWTPayload(getBearerToken(req))
    const auth = new AuthNService(AUTHN_TOKEN, pangea)
    const pui = generateRandomId()

    const body = req.body
    const { value, error } = joiScheme.validate(body)

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    const data = await auth.user.profile.getProfile({ email: payload.email as string })
    // const data = await auth.client.password.change(pui, value.oldPassword, value.newPassword)

    return res.json({ data: JSON.parse(data.toJSON()) })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
