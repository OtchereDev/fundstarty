import { NextApiRequest, NextApiResponse } from 'next'
import { AuditService, AuthN, AuthNService, EmbargoService, IPIntelService } from 'pangea-node-sdk'
import requestIp from 'request-ip'

import { AUTHN_TOKEN, default as PangeaConfig, default as pangea } from '@/constants/pangea'
import { EmailRegex, PasswordRegex } from '@/constants/regex'
import { prisma } from '@/lib/prismaClient'

export default async function Signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const SecureAudut = new AuditService(
      process.env.NEXT_PANGEA_SECURE_AUDIT as string,
      PangeaConfig
    )

    const userIp = requestIp.getClientIp(req) ?? ''
    const IpIntel = new IPIntelService(process.env.NEXT_PANGEA_IP_Service as string, pangea)
    const reputation = await IpIntel.reputation(userIp)
    if (reputation.result.data.score > 20) {
      return res.status(503).json({ message: 'Fundstart is not available in your location' })
    }

    const embargo = new EmbargoService(process.env.NEXT_PANGEA_EMBARGO_Service as string, pangea)
    const embargoRes = await embargo.ipCheck(userIp)
    if (embargoRes.result.sanctions?.length > 0) {
      return res.status(503).json({ message: 'Fundstart is not available in your location' })
    }

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
        cb_uri: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
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

            await SecureAudut.log({
              action: 'signup',
              actor: data.email,
              status: 'success',
              message: `Successfully signed up`,
              source: 'mobile',
            })
            return res.json({ message: 'Successfully sign up...Please log in' })
          }
        }
      } else {
        throw new Error('Unathenticated')
      }
    } catch (error: any) {
      await SecureAudut.log({
        action: 'signup',
        actor: data.email,
        status: 'error',
        message: `Error signing up: ${error?.summary ?? error.message ?? 'Unexpected error occurred'}`,
        source: 'mobile',
      })
      return res.status(400).json({
        message: error?.summary ?? 'Unexpected error occurred',
        errors: error?.errors ?? [],
      })
    }
  } else {
    return res.status(403).json({ message: 'Methon not allowed' })
  }
}
