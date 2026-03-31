'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { cn } from '@/lib/utils/cn'

interface SessionSkill {
  name: string
  icon: string
}

interface Session {
  id: string
  duration: number
  start_time: string
  end_time: string
  focus_rating: number | null
  notes: string | null
  type: string
  skill_id: string
  skills: SessionSkill | SessionSkill[] | null
}

interface SkillOption {
  id: string
  name: string
  icon: string
}

interface SessionsListProps {
  sessions: Session[]
  skills: SkillOption[]
  currentSkillId: string
  currentPage: number
  totalPages: number
  totalCount: number
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

export default function SessionsList({
  sessions,
  skills,
  currentSkillId,
  currentPage,
  totalPages,
  totalCount,
}: SessionsListProps) {
  const router = useRouter()

  function handleSkillChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const skill = e.target.value
    const params = new URLSearchParams()
    if (skill) params.set('skill', skill)
    router.push(`/sessions?${params.toString()}`)
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-xs uppercase tracking-widest font-sans text-on-surface-variant whitespace-nowrap">Skill</label>
          <select
            value={currentSkillId}
            onChange={handleSkillChange}
            className="w-full sm:w-auto px-3 py-2 bg-surface-container border border-surface-container-highest text-on-surface font-sans text-sm focus:outline-none focus:border-outline transition-colors appearance-none sm:min-w-[160px]"
          >
            <option value="">All skills</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.id}>{skill.icon} {skill.name}</option>
            ))}
          </select>
        </div>
        <p className="text-xs font-sans text-on-surface-variant sm:ml-auto">
          {totalCount} session{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sessions list */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        {sessions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-newsreader italic text-on-surface-variant">No sessions yet.</p>
            <p className="font-sans text-xs text-on-surface-variant mt-1">Start a focus session on the dashboard.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-highest">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_2fr] gap-4 px-6 py-3 bg-surface-container-highest/40">
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Skill</p>
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Date</p>
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant text-right">Duration</p>
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant text-center">Focus</p>
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Notes</p>
            </div>

            {sessions.map((session) => {
              const skill = Array.isArray(session.skills) ? session.skills[0] : session.skills
              const sessionDate = new Date(session.start_time)

              return (
                <div key={session.id} className="px-6 py-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_2fr] gap-2 md:gap-4 items-center">
                  {/* Skill */}
                  <div className="flex items-center gap-2">
                    <span className="text-base">{skill?.icon ?? '⏱'}</span>
                    <div>
                      <p className="font-sans text-sm font-medium text-on-surface">{skill?.name ?? 'Unknown'}</p>
                      <p className="md:hidden text-[10px] font-sans text-on-surface-variant">
                        {format(sessionDate, 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                    {session.type === 'pomodoro' && (
                      <span className="text-[10px] font-mono text-secondary border border-secondary/30 px-1 py-0.5 ml-1">POMO</span>
                    )}
                  </div>

                  {/* Date — desktop */}
                  <p className="hidden md:block font-sans text-sm text-on-surface-variant whitespace-nowrap">
                    {format(sessionDate, 'MMM d')}
                    <span className="text-[10px] text-on-surface-variant/60 block">{format(sessionDate, 'h:mm a')}</span>
                  </p>

                  {/* Duration */}
                  <p className="font-mono text-sm font-bold text-on-surface text-right whitespace-nowrap">
                    {formatDuration(session.duration)}
                  </p>

                  {/* Focus rating */}
                  <div className="text-center">
                    {session.focus_rating ? (
                      <span className={cn('font-mono text-sm font-bold', session.focus_rating >= 4 ? 'text-secondary' : session.focus_rating >= 3 ? 'text-brand-copper' : 'text-on-surface-variant')}>
                        {session.focus_rating}/5
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/40 text-sm">—</span>
                    )}
                  </div>

                  {/* Notes */}
                  <p className="font-sans text-xs text-on-surface-variant break-words md:truncate md:max-w-xs">
                    {session.notes ?? <span className="opacity-30">—</span>}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-sans text-on-surface-variant">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/sessions?${new URLSearchParams({ ...(currentSkillId ? { skill: currentSkillId } : {}), page: String(currentPage - 1) }).toString()}`}
                className="px-4 py-2 border border-surface-container-highest font-sans text-sm text-on-surface-variant hover:border-outline hover:text-on-surface transition-colors"
              >
                ← Prev
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/sessions?${new URLSearchParams({ ...(currentSkillId ? { skill: currentSkillId } : {}), page: String(currentPage + 1) }).toString()}`}
                className="px-4 py-2 border border-surface-container-highest font-sans text-sm text-on-surface-variant hover:border-outline hover:text-on-surface transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
