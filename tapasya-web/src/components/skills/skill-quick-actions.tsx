'use client'

import Link from 'next/link'
import { Play, BarChart3 } from 'lucide-react'

interface SkillQuickActionsProps {
  skillId: string
  skillName: string
  onStartSession?: () => void
}

export default function SkillQuickActions({ skillId, skillName, onStartSession }: SkillQuickActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onStartSession}
        className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-brand-copper transition-colors"
        aria-label={`Start focus session for ${skillName}`}
        title="Start focus session"
      >
        <Play className="w-4 h-4" />
      </button>
      <Link
        href={`/skills/${skillId}`}
        className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-primary-container transition-colors"
        aria-label={`View analytics for ${skillName}`}
        title="View analytics"
      >
        <BarChart3 className="w-4 h-4" />
      </Link>
    </div>
  )
}
