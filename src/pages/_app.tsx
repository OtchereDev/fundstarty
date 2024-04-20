import '@/styles/globals.css'
import { AuthProvider } from '@pangeacyber/react-auth'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

export default function App({ Component, pageProps }: AppProps) {
  const hostedLoginURL = process?.env?.NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL ?? ''
  const redirectUrl = process?.env?.NEXT_PUBLIC_REDIRECT_URL ?? ''
  const authConfig = {
    clientToken: process?.env?.NEXT_PUBLIC_AUTHN_CLIENT_TOKEN ?? '',
    domain: process?.env?.NEXT_PUBLIC_PANGEA_DOMAIN ?? '',
  }

  return (
    <AuthProvider
      cookieOptions={{ cookieName: 'fundstartAuth', useCookie: true }}
      loginUrl={hostedLoginURL}
      redirectUri={redirectUrl}
      config={authConfig}
    >
      <>
        <NextNProgress color="#541975" />
        <Component {...pageProps} />
      </>
    </AuthProvider>
  )
}
