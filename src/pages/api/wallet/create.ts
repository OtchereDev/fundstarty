import { NextApiRequest, NextApiResponse } from 'next'
import { RedactService, VaultService } from 'pangea-node-sdk'
import { v4 as uuid } from 'uuid'

import pangea from '@/constants/pangea'
import { CardRegex, NumberStringRegex } from '@/constants/regex'
import { getBearerToken, validateToken } from '@/lib/auth'
import { getUserEmail } from '@/lib/decodeJwt'
import { prisma } from '@/lib/prismaClient'

export default async function WalletCreate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = getBearerToken(req)
    if (!(await validateToken(token))) return res.status(400).json({ message: 'Unauthenticated' })

    const body = req.body
    const error: string[] = []

    if (!CardRegex.test(body.cardNumber)) {
      error.push('Provide a valid card number')
    }
    if (!NumberStringRegex.test(body.cvv) || body.cvv?.length < 4 || body.cvv?.length > 5) {
      error.push('Provide a valid cvv')
    }
    if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(body.expiryDate)) {
      error.push('provide a valid expiry date')
    }
    if (!body.cardHolder?.length) {
      error.push('provide card holder name')
    }

    const email = getUserEmail(req)
    const user = await prisma.user.findFirst({ where: { email } })

    if (error.length == 0) {
      const token = process.env.NEXT_PANGEA_REDACT_TOKEN as string
      const vToken = process.env.NEXT_PANGEA_VAULT_TOKEN as string

      const redact = new RedactService(token, pangea)
      const vault = new VaultService(vToken, pangea)

      const response = await redact.redact(body.cardNumber, {
        rulesets: ['FIN'],
      })
      const vaultRes = await vault.secretStore(body.cvv, uuid(), { folder: 'cvv' })
      const card = {
        ...body,
        isDeleted: false,
        cvv: vaultRes.result.id,
        cardNumber: response.result.redacted_text,
      }

      await prisma.wallet.create({
        data: {
          user: {
            connect: { id: user?.id as string },
          },
          ...card,
        },
      })

      // TODO: log here
      return res.json({
        message: 'Successfully added card',
      })
    } else {
      return res.status(400).json({ message: 'Validation error', errors: error })
    }
  } else {
    return res.status(403).json({ message: 'Method not allowed' })
  }
}
