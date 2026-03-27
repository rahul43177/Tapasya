'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginValues = z.infer<typeof loginSchema>
type OAuthProvider = 'google' | 'github'

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: 'Authentication failed. Please try again.',
  auth_callback_invalid_type: 'This confirmation link is not supported. Please request a new one.',
  auth_callback_missing_token: 'This sign-in link is incomplete or expired. Please try again.',
}

const inputClass = 'w-full px-4 py-3 bg-surface-container border border-surface-container-highest text-on-surface font-sans text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
const oauthBtnBase = 'flex items-center justify-center gap-3 w-full py-3.5 px-6 font-sans font-semibold text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

interface LoginFormProps {
  error?: string
  message?: string
  details?: string
}

export default function LoginForm({ error, message, details }: LoginFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const isLoading = isSubmitting || oauthLoading !== null
  const errorMessage = serverError ?? details ?? (error ? (ERROR_MESSAGES[error] ?? error) : null)

  async function onSubmit(values: LoginValues) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
    if (error) { setServerError(error.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  async function signInWithOAuth(provider: OAuthProvider) {
    setOauthLoading(provider)
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    })

    if (error) {
      setOauthLoading(null)
      setServerError(error.message)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <Link href="/" className="inline-block">
          <span className="font-newsreader text-3xl italic font-bold text-brand-copper">Tapasya</span>
        </Link>
        <h1 className="mt-4 font-newsreader text-2xl italic text-on-surface">Welcome back</h1>
        <p className="mt-1 font-sans text-sm text-on-surface-variant">Sign in to continue your practice</p>
      </div>

      {errorMessage && (
        <div className="mb-6 px-4 py-3 bg-error-container border-l-2 border-error text-sm font-sans text-error">{errorMessage}</div>
      )}
      {message === 'check-your-email' && (
        <div className="mb-6 px-4 py-3 bg-surface-container border-l-2 border-secondary text-sm font-sans text-on-surface">
          Check your email for a confirmation link before signing in.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest font-sans text-on-surface-variant mb-2">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="you@example.com" disabled={isLoading} {...register('email')} className={inputClass} />
          {errors.email && <p className="mt-1.5 text-xs font-sans text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-xs uppercase tracking-widest font-sans text-on-surface-variant">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" disabled={isLoading} {...register('password')} className={cn(inputClass, 'pr-12')} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1" tabIndex={-1}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-sans text-error">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 w-full py-4 px-6 mt-2 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Sign In
        </button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-surface-container-highest" />
        <span className="text-xs uppercase tracking-widest text-on-surface-variant opacity-50 font-sans">or</span>
        <div className="flex-1 h-px bg-surface-container-highest" />
      </div>

      <div className="space-y-3">
        <button type="button" onClick={() => signInWithOAuth('google')} disabled={isLoading} className={cn(oauthBtnBase, 'bg-white text-neutral-800 hover:bg-neutral-100')}>
          {oauthLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>
        <button type="button" onClick={() => signInWithOAuth('github')} disabled={isLoading} className={cn(oauthBtnBase, 'bg-surface-container-highest text-on-surface border border-surface-container-highest hover:border-outline')}>
          {oauthLoading === 'github' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitHubIcon />}
          Continue with GitHub
        </button>
      </div>

      <p className="mt-8 text-xs font-sans text-on-surface-variant text-center">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary hover:text-on-surface transition-colors underline underline-offset-2">Create one</Link>
      </p>
    </div>
  )
}
