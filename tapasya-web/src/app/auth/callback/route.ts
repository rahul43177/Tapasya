import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'

const VALID_EMAIL_OTP_TYPES: EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard'
  }

  return next
}

function redirectToLogin(origin: string, error: string, details?: string) {
  const redirectUrl = new URL('/login', origin)
  redirectUrl.searchParams.set('error', error)

  if (details) {
    redirectUrl.searchParams.set('details', details)
  }

  return NextResponse.redirect(redirectUrl)
}

function redirectToClientCallback(
  origin: string,
  params: {
    code?: string | null
    tokenHash?: string | null
    type?: string | null
    next: string
  }
) {
  const redirectUrl = new URL('/auth/client-callback', origin)
  redirectUrl.searchParams.set('next', params.next)

  if (params.code) {
    redirectUrl.searchParams.set('code', params.code)
  }

  if (params.tokenHash) {
    redirectUrl.searchParams.set('token_hash', params.tokenHash)
  }

  if (params.type) {
    redirectUrl.searchParams.set('type', params.type)
  }

  return NextResponse.redirect(redirectUrl)
}

function shouldUseClientFallback(message: string) {
  return process.env.NODE_ENV !== 'production' && message.toLowerCase().includes('fetch failed')
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const providerError = searchParams.get('error_description') ?? searchParams.get('error')
  const next = getSafeNextPath(searchParams.get('next'))

  if (providerError) {
    return redirectToLogin(origin, 'auth_callback_failed', providerError)
  }

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      if (shouldUseClientFallback(error.message)) {
        return redirectToClientCallback(origin, { code, next })
      }

      return redirectToLogin(origin, 'auth_callback_failed', error.message)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  if (tokenHash && type && VALID_EMAIL_OTP_TYPES.includes(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    })

    if (error) {
      if (shouldUseClientFallback(error.message)) {
        return redirectToClientCallback(origin, { tokenHash, type, next })
      }

      return redirectToLogin(origin, 'auth_callback_failed', error.message)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  if (tokenHash && type) {
    return redirectToLogin(origin, 'auth_callback_invalid_type', `Unsupported auth type: ${type}`)
  }

  return redirectToLogin(origin, 'auth_callback_missing_token')
}
