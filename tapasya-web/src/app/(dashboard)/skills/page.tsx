import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import SkillsList from '@/components/skills/skills-list'

export default async function SkillsPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('order', { ascending: true })

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Your</p>
          <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">Skills</h1>
        </div>
        <Link href="/skills/new" className="flex items-center gap-2 px-4 py-2.5 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors">
          + New Skill
        </Link>
      </div>

      <SkillsList skills={skills ?? []} userId={user.id} />
    </div>
  )
}
