import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { getBearerToken, validToken } from '@/lib/auth'
import { getJWTPayload } from '@/lib/decodeJwt'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthNService } from 'pangea-node-sdk'

export default async function CheckUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!(await validToken(req))) return res.status(400).json({ message: 'Unauthorized' })
    const payload = getJWTPayload(getBearerToken(req))
    const auth = new AuthNService(AUTHN_TOKEN, pangea)

    const data = await auth.user.profile.getProfile({
      email: payload.email as string,
    })

    return res.json({ data: JSON.parse(data.toJSON()) })
  } else {
    return res.status(403).json({ message: 'Method not supported' })
  }
}
