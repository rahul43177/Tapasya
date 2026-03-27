import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import CreateSkillForm from '@/components/onboarding/create-skill-form'

export default async function NewSkillPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-12">
      <div className="fixed top-8 left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="w-px h-8 bg-secondary" />
      </div>
      <div className="fixed top-8 right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="self-end w-px h-8 bg-secondary" />
      </div>
      <div className="w-full max-w-md">
        <Link href="/skills" className="inline-flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors mb-8">
          ← Back to Skills
        </Link>
        <CreateSkillForm userId={user.id} />
      </div>
    </div>
  )
}
