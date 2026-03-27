import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import SessionsList from '@/components/sessions/sessions-list'
import Link from 'next/link'

const PAGE_SIZE = 20

interface SessionsPageProps {
  searchParams: Promise<{ skill?: string; page?: string }>
}

export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  const params = await searchParams
  const currentSkillId = params.skill ?? ''
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10))
  const offset = (currentPage - 1) * PAGE_SIZE

  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch skills for the filter dropdown
  const { data: skills } = await supabase
    .from('skills')
    .select('id, name, icon')
    .eq('user_id', user.id)
    .order('order', { ascending: true })

  // Build sessions query
  let query = supabase
    .from('focus_sessions')
    .select('id, duration, start_time, end_time, focus_rating, notes, type, skill_id, skills(name, icon)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (currentSkillId) {
    query = query.eq('skill_id', currentSkillId)
  }

  const { data: sessions, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">History</p>
          <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mt-1">Sessions</h1>
        </div>
        <Link href="/dashboard" className="text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors">← Dashboard</Link>
      </div>

      <SessionsList
        sessions={sessions ?? []}
        skills={skills ?? []}
        currentSkillId={currentSkillId}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={count ?? 0}
      />
    </div>
  )
}
