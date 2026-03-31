import { Crown, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Member {
  user_id: string
  role: string | null
  joined_at: string | null
  profile: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
    current_global_streak: number
    total_hours: number
  } | null
}

interface MemberListProps {
  members: Member[]
  currentUserId: string
}

export default function MemberList({ members, currentUserId }: MemberListProps) {
  // Sort members: owners first, then by total hours
  const sortedMembers = [...members].sort((a, b) => {
    const aRole = a.role || 'member'
    const bRole = b.role || 'member'
    if (aRole === 'owner' && bRole !== 'owner') return -1
    if (aRole !== 'owner' && bRole === 'owner') return 1
    return (b.profile?.total_hours ?? 0) - (a.profile?.total_hours ?? 0)
  })

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-newsreader text-xl italic font-bold text-on-surface">
          Members
        </h2>
        <span className="font-mono text-xs text-on-surface-variant">
          {members.length} total
        </span>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {sortedMembers.map((member) => {
          const displayName =
            member.profile?.full_name || member.profile?.username || 'Anonymous'
          const isCurrentUser = member.user_id === currentUserId
          const isOwner = (member.role || 'member') === 'owner'

          return (
            <div
              key={member.user_id}
              className={cn(
                'flex items-center gap-3 p-3 border transition-colors',
                isCurrentUser
                  ? 'bg-brand-copper/5 border-l-2 border-brand-copper'
                  : 'border-surface-container-highest'
              )}
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-surface-container-highest border border-surface-container-highest flex items-center justify-center flex-shrink-0">
                {member.profile?.avatar_url ? (
                  <img
                    src={member.profile.avatar_url}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-on-surface-variant" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-sans text-sm font-medium text-on-surface truncate">
                    {displayName}
                  </p>
                  {isOwner && (
                    <Crown className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  )}
                  {isCurrentUser && (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-brand-copper">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans text-on-surface-variant">
                    🔥 {member.profile?.current_global_streak ?? 0}d streak
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">
                    {(member.profile?.total_hours ?? 0).toFixed(1)}h total
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {members.length === 0 && (
        <div className="text-center py-8">
          <p className="font-sans text-sm text-on-surface-variant">
            No members yet
          </p>
        </div>
      )}
    </div>
  )
}
