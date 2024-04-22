import { NextApiRequest, NextApiResponse } from 'next'
import { AuditService, AuthN, AuthNService } from 'pangea-node-sdk'

import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body

    if (!data.token || !data.code || data.code?.length < 6) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const auth = new AuthNService(AUTHN_TOKEN, pangea)
    const SecureAudut = new AuditService(process.env.NEXT_PANGEA_SECURE_AUDIT as string, pangea)

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

      await SecureAudut.log({
        action: 'login_complete',
        actor: response.result.refresh_token.email,
        status: 'success',
        message: `User successfully logged in`,
        source: 'mobile',
      })

      return res.json({ messge: 'Successful', response: JSON.parse(response.toJSON()) })
    } else {
      await SecureAudut.log({
        action: 'login_complete',
        actor: 'Unknown',
        status: 'error',
        message: `Error logging in : ${codeUpdate.summary}`,
        source: 'mobile',
      })

      return res.status(401).json({ messge: 'Unauthenticated' })
    }
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
