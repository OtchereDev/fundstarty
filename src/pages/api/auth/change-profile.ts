import Joi from 'joi'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuditService, AuthNService } from 'pangea-node-sdk'

import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { getBearerToken, validToken } from '@/lib/auth'
import { getJWTPayload } from '@/lib/decodeJwt'

const joiScheme = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string(),
})

export default async function ChangePassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!(await validToken(req))) return res.status(400).json({ message: 'Unauthorized' })
    const payload = getJWTPayload(getBearerToken(req))
    const auth = new AuthNService(AUTHN_TOKEN, pangea)
    const SecureAudut = new AuditService(process.env.NEXT_PANGEA_SECURE_AUDIT as string, pangea)

    const body = req.body
    const { value, error } = joiScheme.validate(body)

    if (error !== undefined) {
      const errors = error.details.map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    await auth.user.profile.update({
      email: payload.email as string,
      profile: {
        first_name: value.firstName,
        last_name: value.lastName,
        phone: value.phone,
      },
    })

    await SecureAudut.log({
      action: 'update_profile',
      actor: payload.email,
      target: payload.email,
      status: 'success',
      message: `User successfully updated profile`,
    })

    return res.json({ message: 'Successfully updated profile' })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
