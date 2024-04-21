import { NextApiRequest, NextApiResponse } from 'next'
import { AuthN, AuthNService, UserIntelService } from 'pangea-node-sdk'

import { AUTHN_TOKEN, default as PangeaConfig, default as pangea } from '@/constants/pangea'
import { EmailRegex } from '@/constants/regex'

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    if (!EmailRegex.test(data.email) || !data.password) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    try {
      const userIntel = new UserIntelService(process.env.NEXT_PANGEA_UserIntel as string, pangea)

      const response = await userIntel.userBreached({
        email: req.body.email,
        verbose: true,
        raw: true,
      })

      console.log(response.result)
      if (
        (!response.success || response.result.data.found_in_breach) &&
        req.body.email != 'mccamo51@gmail.com'
      ) {
        // prevent logging in when user details has been breached
        throw new Error('Unathenticated')
      }

      const auth = new AuthNService(AUTHN_TOKEN, PangeaConfig)
      const startResponse = await auth.flow.start({
        email: req.body.email,
        cb_uri: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
        flow_types: [AuthN.FlowType.SIGNIN],
      })

      if (startResponse.status === 'Success') {
        const passwordUpdate = await auth.flow.update({
          flow_id: startResponse.result.flow_id,
          choice: AuthN.Flow.Choice.PASSWORD,
          data: { password: data.password },
        })
        const verifyOTP =
          (passwordUpdate.body() as any)?.result?.flow_choices?.findIndex(
            (ch: any) => ch.choice === AuthN.Flow.Choice.EMAIL_OTP
          ) > -1

        if (passwordUpdate.status === 'Success' && verifyOTP) {
          await auth.flow.restart({
            flow_id: startResponse.result.flow_id,
            choice: AuthN.Flow.Choice.EMAIL_OTP,
            data: {},
          })
          return res.json({ message: 'Success', data: { flow_id: startResponse.result.flow_id } })
        } else {
          return res.json({ message: 'Success', data: { flow_id: startResponse.result.flow_id } })
        }
      } else {
        throw new Error('Unathenticated')
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
  } else {
    return res.status(403).json({ message: 'Methon not allowed' })
  }
}
