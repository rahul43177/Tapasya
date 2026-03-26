import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CreateSkillForm from '@/components/onboarding/create-skill-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If user already has skills, skip onboarding
  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count > 0) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-surface-container-lowest flex items-center justify-center px-4 py-12">
      {/* Corner anchors */}
      <div className="fixed top-8 left-8 flex flex-col gap-1 opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="w-px h-8 bg-secondary" />
      </div>
      <div className="fixed top-8 right-8 flex flex-col gap-1 items-end opacity-20 pointer-events-none">
        <div className="w-8 h-px bg-secondary" />
        <div className="self-end w-px h-8 bg-secondary" />
      </div>

      <CreateSkillForm userId={user.id} />
    </main>
  )
}
