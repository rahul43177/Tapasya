'use client'

import Link from 'next/link'
import { Play, BarChart3 } from 'lucide-react'
import type { Tables } from '@/lib/types'

type Skill = Tables<'skills'>

interface SkillsSectionProps {
  skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const handlePlayClick = () => {
    // Scroll to focus timer at the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className="bg-surface-container border border-surface-container-highest">
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-highest">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Skills</p>
        <Link href="/skills" className="text-xs font-sans text-brand-copper hover:text-primary transition-colors">Manage →</Link>
      </div>
      <div className="divide-y divide-surface-container-highest">
        {skills.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="font-sans text-sm text-on-surface-variant">No skills yet.</p>
            <Link href="/onboarding" className="text-xs text-brand-copper hover:text-primary transition-colors mt-1 inline-block">+ Add skill</Link>
          </div>
        )}
        {skills.map((skill) => {
          const pct = Math.min(Math.round((skill.total_hours / skill.target_hours) * 100), 100)
          return (
            <div key={skill.id} className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{skill.icon}</span>
                  <span className="font-sans text-sm font-medium text-on-surface">{skill.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-on-surface-variant">{skill.total_hours.toFixed(1)}/{skill.target_hours}h</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handlePlayClick}
                      className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-brand-copper transition-colors"
                      aria-label={`Start focus session for ${skill.name}`}
                      title="Start focus session"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/skills/${skill.id}/analytics`}
                      className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-primary-container transition-colors"
                      aria-label={`View analytics for ${skill.name}`}
                      title="View analytics"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-surface-container-highest">
                <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: skill.color }} />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] font-sans text-on-surface-variant">{pct}% to mastery</span>
                {skill.current_streak > 0 && (
                  <span className="text-[10px] font-sans text-secondary">🔥 {skill.current_streak}d</span>
                )}
              </div>
            </div>
          )
        })}
        <div className="px-6 py-3">
          <Link href="/skills/new" className="text-xs font-sans text-on-surface-variant hover:text-brand-copper transition-colors">+ Add skill</Link>
        </div>
      </div>
    </div>
  )
}
