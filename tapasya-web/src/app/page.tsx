import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LandingAuthButtons from '@/components/auth/landing-auth-buttons'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="relative min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* Corner anchors — sacred geometry decoration */}
      <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="w-px h-8 bg-secondary" />
      </div>
      <div className="absolute top-8 right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="self-end w-px h-8 bg-secondary" />
      </div>
      <div className="absolute bottom-8 left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-px h-8 bg-secondary" />
        <div className="w-8 h-px bg-secondary" />
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="self-end w-px h-8 bg-secondary" />
        <div className="w-8 h-px bg-secondary" />
      </div>

      {/* Subtle mandala watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
        <svg
          fill="none"
          strokeWidth="0.5"
          viewBox="0 0 200 200"
          width="600"
          height="600"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="90" stroke="#e9c349" />
          <circle cx="100" cy="100" r="70" stroke="#e9c349" />
          <circle cx="100" cy="100" r="50" stroke="#e9c349" />
          <circle cx="100" cy="100" r="30" stroke="#e9c349" />
          <path stroke="#e9c349" d="M100 10 L100 190 M10 100 L190 100 M29 29 L171 171 M171 29 L29 171" />
          <rect
            x="60"
            y="60"
            width="80"
            height="80"
            stroke="#e9c349"
            transform="rotate(45 100 100)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">

        {/* Logo + tagline */}
        <div className="text-center">
          <h1 className="font-newsreader text-8xl font-extrabold italic tracking-tight text-brand-copper leading-none">
            Tapasya
          </h1>
          <p className="mt-3 font-newsreader text-base italic text-on-surface-variant">
            The ancient practice of becoming great
          </p>
        </div>

        {/* Mandala divider */}
        <div className="flex items-center gap-4 w-full opacity-30">
          <div className="flex-1 h-px bg-outline-variant" />
          <svg fill="none" strokeWidth="0.8" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#a88a7e" />
            <circle cx="12" cy="12" r="5" stroke="#a88a7e" />
            <path stroke="#a88a7e" d="M12 2 L12 22 M2 12 L22 12" />
          </svg>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Value proposition */}
        <div className="text-center space-y-2">
          <p className="font-sans text-lg text-on-surface">
            Track your journey to 10,000 hours
          </p>
          <p className="font-newsreader text-sm italic text-on-surface-variant">
            Every 100 hours changes who you are.
          </p>
        </div>

        {/* Auth buttons */}
        <LandingAuthButtons />

        {/* Trust indicators */}
        <ul className="w-full space-y-2">
          {[
            'Track time toward mastery',
            'See your progress visually',
            'Build daily discipline',
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-4 h-4 flex items-center justify-center text-brand-copper text-xs">
                ✓
              </span>
              <span className="font-sans text-sm text-on-surface-variant">{item}</span>
            </li>
          ))}
        </ul>

        {/* Already have an account */}
        <p className="text-xs font-sans text-on-surface-variant text-center">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-primary hover:text-on-surface transition-colors underline underline-offset-2"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
