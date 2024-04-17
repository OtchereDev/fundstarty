import PangeaConfig, { AUTHN_TOKEN } from '@/constants/pangea'
import { EmailRegex } from '@/constants/regex'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthN, AuthNService } from 'pangea-node-sdk'

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    if (!EmailRegex.test(data.email) || !data.password) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    try {
      const auth = new AuthNService(AUTHN_TOKEN, PangeaConfig)
      const startResponse = await auth.flow.start({
        email: req.body.email,
        cb_uri: 'http://localhost:3000/dashboard',
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
