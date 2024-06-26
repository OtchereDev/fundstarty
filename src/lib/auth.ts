import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export const getBearerToken = (req: NextApiRequest) => {
  const authorizationHeader =
    req.headers instanceof Headers
      ? req.headers.get('authorization')
      : (req.headers as any)?.authorization
  // console.log(authorizationHeader)

  const authorizationHeaderParts = authorizationHeader?.split(' ')

  const bearerToken =
    authorizationHeaderParts?.[0]?.toLowerCase() === 'bearer' && authorizationHeaderParts?.[1]
  return bearerToken
}

export const validateToken = async (token: string) => {
  const result = false

  if (token) {
    const SERVICEURL = `https://authn.${process.env.NEXT_PUBLIC_PANGEA_DOMAIN}/v2/client/token/check`
    try {
      const response = await fetch(SERVICEURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_AUTHN_TOKEN ?? ''}`,
        },
        body: JSON.stringify({ token: token }),
      })

      const responseJSON = await response.json()

      return responseJSON.status === 'Success'
    } catch (error) {
      console.error(
        "Error occured during token validation. Looks like environment variables haven't been set correctly, or the service token has expired",
        error
      )
    }
  }
  console.log('resilre', result)
  return result
}

export const withAPIAuthentication = (apiHandler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check the environment variables
    if (!process.env.NEXT_PUBLIC_PANGEA_DOMAIN || process.env.AUTHN_SERVICE_TOKEN) {
      console.error(
        'Missing environment variables, please make sure you have NEXT_PUBLIC_PANGEA_DOMAIN and AUTHN_SERVICE_TOKEN set in your .env file'
      )
      return new Response('Unauthorized', { status: 401 })
    }

    const isTokenValid = await validateToken(getBearerToken(req))

    // Authentication failed, return 401
    if (!isTokenValid) {
      return new Response('Unauthorized', { status: 401 })
    }

    // We are good to continue
    return await apiHandler(req, res)
  }
}

export async function validToken(req: NextApiRequest) {
  const token = getBearerToken(req)
  // console.log('token', token)
  const resp = await validateToken(token)
  console.log('resp', resp)
  return resp
}
