import PangeaConfig, { AUTHN_TOKEN } from '@/constants/pangea'
import { EmailRegex, PasswordRegex } from '@/constants/regex'
import { prisma } from '@/lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthN, AuthNService } from 'pangea-node-sdk'

export default async function Signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    const errors: string[] = []
    if (!data.firstName) {
      errors.push('First name is required')
    }
    if (!data.lastName) {
      errors.push('First name is required')
    }
    if (!PasswordRegex.test(data.password)) {
      errors.push('Provide a strong password')
    }

    if (!data.phone) {
      errors.push('Provide a phone')
    }
    if (!EmailRegex.test(data.email)) {
      errors.push('Provide a valid email')
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors,
      })
    }
    try {
      const auth = new AuthNService(AUTHN_TOKEN, PangeaConfig)
      const startResponse = await auth.flow.start({
        email: data.email,
        cb_uri: 'http://localhost:3000/dashboard',
        flow_types: [AuthN.FlowType.SIGNUP],
      })

      if (startResponse.status === 'Success') {
        const passwordUpdate = await auth.flow.update({
          flow_id: startResponse.result.flow_id,
          choice: AuthN.Flow.Choice.PASSWORD,
          data: { password: data.password },
        })

        if (passwordUpdate.success) {
          const profileUpdate = await auth.flow.update({
            flow_id: startResponse.result.flow_id,
            choice: AuthN.Flow.Choice.PROFILE,
            data: {
              profile: {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
              },
            },
          })

          if (profileUpdate.success) {
            try {
              // storing email to db persist
              await prisma.user.create({
                data: {
                  email: data.email,
                },
              })
            } catch (error) {}
            return res.json({ message: 'Successfully sign up...Please log in' })
          }
        }
      } else {
        throw new Error('Unathenticated')
      }
    } catch (error: any) {
      console.log(error)
      return res.status(400).json({
        message: error?.summary ?? 'Unexpected error occurred',
        errors: error?.errors ?? [],
      })
    }
  } else {
    return res.status(403).json({ message: 'Methon not allowed' })
  }
}
