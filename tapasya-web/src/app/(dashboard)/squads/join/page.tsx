import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import JoinSquadForm from '@/components/squads/join-squad-form'

export default async function JoinSquadPage() {
  const supabase = await createClient()
  await requireAuthenticatedUser(supabase)

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-12">
      {/* Decorative corner elements */}
      <div className="fixed top-8 left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="w-px h-8 bg-secondary" />
      </div>
      <div className="fixed top-8 right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="self-end w-px h-8 bg-secondary" />
      </div>

      <div className="w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/squads"
          className="inline-flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors mb-8"
        >
          ← Back to Squads
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-newsreader text-3xl italic font-bold text-on-surface mb-2">
            Join a Squad
          </h1>
          <p className="font-sans text-sm text-on-surface-variant">
            Enter an invite code to join an existing squad and start competing with friends.
          </p>
        </div>

        {/* Form */}
        <JoinSquadForm />
      </div>
    </div>
  )
}
