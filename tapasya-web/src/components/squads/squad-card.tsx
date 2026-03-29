import Link from 'next/link'
import { Users, Target } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SquadCardProps {
  id: string
  name: string
  description: string | null
  focus_skill_name: string | null
  member_count: number
  max_members: number | null
  is_owner: boolean
}

export default function SquadCard({
  id,
  name,
  description,
  focus_skill_name,
  member_count,
  max_members,
  is_owner,
}: SquadCardProps) {
  return (
    <Link
      href={`/squads/${id}`}
      className={cn(
        'block p-6 bg-surface-container border border-surface-container-highest',
        'hover:border-outline transition-colors group'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-newsreader text-xl italic font-bold text-on-surface mb-1 group-hover:text-brand-copper transition-colors truncate">
            {name}
          </h3>
          {description && (
            <p className="font-sans text-sm text-on-surface-variant line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {is_owner && (
          <div className="ml-3 px-2 py-1 border border-secondary/40 text-secondary text-xs font-sans uppercase tracking-wider flex-shrink-0">
            Owner
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 pt-4 border-t border-surface-container-highest">
        {/* Members */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-on-surface-variant" />
          <span className="font-mono text-xs text-on-surface-variant">
            {member_count}/{max_members ?? '∞'}
          </span>
        </div>

        {/* Focus Skill */}
        {focus_skill_name && (
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-on-surface-variant" />
            <span className="font-sans text-xs text-on-surface-variant truncate">
              {focus_skill_name}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
