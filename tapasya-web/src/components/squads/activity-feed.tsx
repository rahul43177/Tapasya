import { formatDistanceToNow } from 'date-fns'
import { Clock, Target } from 'lucide-react'

interface Activity {
  id: string
  user_id: string
  duration: number
  start_time: string
  skill_id: string
  profile: {
    full_name: string | null
    username: string | null
  } | null
  skill: {
    name: string
    icon: string
    color: string
  } | null
}

interface ActivityFeedProps {
  activities: Activity[]
  currentUserId: string
}

export default function ActivityFeed({ activities, currentUserId }: ActivityFeedProps) {
  // Sort by start_time descending (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  )

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-newsreader text-xl italic font-bold text-on-surface">
          Recent Activity
        </h2>
        <span className="font-mono text-xs text-on-surface-variant">
          Last 7 days
        </span>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {sortedActivities.map((activity) => {
          // Skip activities without profile or skill data
          if (!activity.profile || !activity.skill) return null

          const displayName = activity.profile.full_name || activity.profile.username || 'Anonymous'
          const isCurrentUser = activity.user_id === currentUserId
          const timeAgo = formatDistanceToNow(new Date(activity.start_time), { addSuffix: true })

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 border border-surface-container-highest hover:border-outline transition-colors"
            >
              {/* Skill Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: `${activity.skill.color}20` }}
              >
                {activity.skill.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-on-surface mb-1">
                  <span className="font-medium">
                    {isCurrentUser ? 'You' : displayName}
                  </span>
                  {' practiced '}
                  <span className="font-medium">{activity.skill.name}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(activity.duration)}
                  </span>
                  <span>·</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {sortedActivities.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <p className="font-sans text-sm text-on-surface-variant">
            No recent activity
          </p>
          <p className="font-sans text-xs text-on-surface-variant/60 mt-1">
            Complete sessions to see activity here
          </p>
        </div>
      )}
    </div>
  )
}
