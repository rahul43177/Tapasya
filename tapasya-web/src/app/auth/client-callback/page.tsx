'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2 } from 'lucide-react'
import type { Database } from '@/lib/types/database'

type EmailOtpType =
  | 'signup'
  | 'invite'
  | 'magiclink'
  | 'recovery'
  | 'email_change'
  | 'email'

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

function createFallbackClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        detectSessionInUrl: false,
      },
    }
  )
}

function buildLoginUrl(error: string, details?: string) {
  const params = new URLSearchParams({ error })

  if (details) {
    params.set('details', details)
  }

  return `/login?${params.toString()}`
}

export default function ClientCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) {
      return
    }

    hasStarted.current = true

    async function completeAuth() {
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      const providerError =
        searchParams.get('error_description') ?? searchParams.get('error')
      const next = getSafeNextPath(searchParams.get('next'))

      if (providerError) {
        router.replace(buildLoginUrl('auth_callback_failed', providerError))
        return
      }

      const supabase = createFallbackClient()

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          router.replace(buildLoginUrl('auth_callback_failed', error.message))
          return
        }

        router.replace(next)
        return
      }

      if (
        tokenHash &&
        type &&
        VALID_EMAIL_OTP_TYPES.includes(type as EmailOtpType)
      ) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        })

        if (error) {
          router.replace(buildLoginUrl('auth_callback_failed', error.message))
          return
        }

        router.replace(next)
        return
      }

      if (tokenHash && type) {
        router.replace(
          buildLoginUrl(
            'auth_callback_invalid_type',
            `Unsupported auth type: ${type}`
          )
        )
        return
      }

      router.replace(buildLoginUrl('auth_callback_missing_token'))
    }

    void completeAuth()
  }, [router, searchParams])

  return (
    <main className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-brand-copper" />
        </div>
        <h1 className="font-newsreader text-3xl italic font-bold text-on-surface">
          Finishing sign in
        </h1>
        <p className="mt-3 font-sans text-sm text-on-surface-variant">
          Completing your session and sending you back into the app.
        </p>
      </div>
    </main>
  )
}
