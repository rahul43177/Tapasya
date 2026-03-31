'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { getMasteryLevel } from '@/lib/utils/mastery'
import { Loader2 } from 'lucide-react'
import type { Tables } from '@/lib/types'

type Skill = Tables<'skills'>

interface SkillsListProps {
  skills: Skill[]
  userId: string
}

export default function SkillsList({ skills, userId }: SkillsListProps) {
  const router = useRouter()
  const [archiving, setArchiving] = useState<string | null>(null)

  async function archiveSkill(skillId: string) {
    setArchiving(skillId)
    const supabase = createClient()
    await supabase.from('skills').update({ is_active: false }).eq('id', skillId).eq('user_id', userId)
    router.refresh()
    setArchiving(null)
  }

  if (skills.length === 0) {
    return (
      <div className="bg-surface-container border border-surface-container-highest p-12 text-center">
        <p className="font-newsreader text-2xl italic text-on-surface-variant mb-2">No skills yet</p>
        <p className="font-sans text-sm text-on-surface-variant mb-6">Add your first skill to begin tracking your mastery journey.</p>
        <Link href="/skills/new" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-copper text-white font-sans font-semibold text-sm hover:bg-primary-container transition-colors">
          Add your first skill →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-px bg-surface-container-highest">
      {skills.map((skill) => {
        const totalHours = skill.total_hours + skill.initial_hours
        const pct = Math.min(Math.round((totalHours / skill.target_hours) * 100), 100)
        const hoursToNext = skill.target_hours - totalHours
        const level = getMasteryLevel(totalHours)

        return (
          <div key={skill.id} className="bg-surface-container p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-xl" style={{ backgroundColor: `${skill.color}20`, border: `1px solid ${skill.color}40` }}>
                  {skill.icon}
                </div>
                <div>
                  <h2 className="font-sans text-base font-semibold text-on-surface">{skill.name}</h2>
                  <p className="text-xs font-sans text-on-surface-variant">{level}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/skills/${skill.id}/analytics`} className="px-3 py-1.5 text-xs font-sans text-on-surface-variant border border-surface-container-highest hover:border-brand-copper hover:text-brand-copper transition-colors">
                  Analytics
                </Link>
                <Link href={`/skills/${skill.id}`} className="px-3 py-1.5 text-xs font-sans text-on-surface-variant border border-surface-container-highest hover:border-outline hover:text-on-surface transition-colors">
                  Edit
                </Link>
                <button
                  onClick={() => archiveSkill(skill.id)}
                  disabled={archiving === skill.id}
                  className={cn('px-3 py-1.5 text-xs font-sans border transition-colors disabled:opacity-50', 'text-on-surface-variant border-surface-container-highest hover:border-error hover:text-error')}
                >
                  {archiving === skill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Archive'}
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-0.5">Total Hours</p>
                <p className="font-mono text-lg font-bold text-on-surface">{totalHours.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-0.5">Sessions</p>
                <p className="font-mono text-lg font-bold text-on-surface">{skill.total_sessions}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-0.5">Streak</p>
                <p className="font-mono text-lg font-bold text-secondary">{skill.current_streak > 0 ? `🔥 ${skill.current_streak}d` : '—'}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-1.5">
                <span className="text-[10px] font-sans text-on-surface-variant">{pct}% toward {skill.target_hours.toLocaleString()}h mastery</span>
                <span className="text-[10px] font-mono text-on-surface-variant">{hoursToNext.toFixed(1)}h remaining</span>
              </div>
              <div className="h-1.5 bg-surface-container-highest">
                <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: skill.color }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
