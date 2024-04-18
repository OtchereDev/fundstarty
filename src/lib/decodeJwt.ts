import { jwtDecode } from 'jwt-decode'
import { getBearerToken } from './auth'
import { NextApiRequest } from 'next'

export function getJWTPayload(token: string): Record<string, string | number | boolean> {
  return jwtDecode(token)
}

export function getUserEmail(req: NextApiRequest): string{
  const payload = getJWTPayload(getBearerToken(req))

  return (payload.email as string) ?? ""
}
