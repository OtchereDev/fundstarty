import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthN, AuthNService } from 'pangea-node-sdk'

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body

    if (!data.token || !data.code || data.code?.length < 6) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const auth = new AuthNService(AUTHN_TOKEN, pangea)

    const codeUpdate = await auth.flow.update({
      flow_id: data.token,
      choice: AuthN.Flow.Choice.EMAIL_OTP,
      data: { code: data.code },
    })

    if (codeUpdate.success) {
      const response = await auth.flow.complete(data.token)
      const user = await prisma.user.findFirst({
        where: {
          email: response.result.refresh_token.email,
          pangeaUserId: null,
        },
      })
      if (user) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            pangeaUserId: response.result.refresh_token.identity,
          },
        })
      }
      return res.json({ messge: 'Successful', response: JSON.parse(response.toJSON()) })
    } else {
      throw new Error('unauthenticated')
    }
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
