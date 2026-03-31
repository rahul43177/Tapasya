import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import CreateSkillForm from '@/components/onboarding/create-skill-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // If user already has skills, skip onboarding
  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count > 0) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-12">
      {/* Corner anchors */}
      <div className="fixed top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="w-px h-8 bg-secondary" />
      </div>
      <div className="fixed top-4 right-4 sm:top-8 sm:right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="self-end w-px h-8 bg-secondary" />
      </div>

      <CreateSkillForm userId={user.id} />
    </main>
  )
}
