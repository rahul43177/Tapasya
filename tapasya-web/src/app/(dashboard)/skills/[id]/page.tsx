import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import EditSkillForm from '@/components/skills/edit-skill-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!skill) redirect('/skills')

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      <div className="mb-8">
        <Link href="/skills" className="text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors">
          ← Back to Skills
        </Link>
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Editing</p>
          <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">
            {skill.icon} {skill.name}
          </h1>
        </div>
      </div>

      <div className="max-w-md">
        <EditSkillForm skill={skill} />
      </div>
    </div>
  )
}
