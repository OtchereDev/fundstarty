import { jwtDecode } from 'jwt-decode'

export function getJWTPayload(token: string): Record<string, string | number | boolean> {
  return jwtDecode(token)
}
