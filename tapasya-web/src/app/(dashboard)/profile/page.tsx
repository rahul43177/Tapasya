import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { getMasteryLevel } from '@/lib/utils/mastery'
import ProfileHeader from '@/components/profile/profile-header'

export default async function ProfilePage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const [profileRes, skillsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('skills').select('*').eq('user_id', user.id).eq('is_active', true).order('total_hours', { ascending: false }),
  ])

  const profile = profileRes.data
  const skills = skillsRes.data ?? []
  const totalHours = Number(profile?.total_hours ?? 0)
  const level = getMasteryLevel(totalHours)

  // Calculate average hours per day since joining
  const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date()
  const now = new Date()
  const daysSinceJoining = Math.max(1, Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
  const avgPerDay = totalHours > 0 ? (totalHours / daysSinceJoining).toFixed(1) + 'h' : '0h'

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Profile Header */}
      <ProfileHeader
        userId={user.id}
        fullName={profile?.full_name ?? 'Practitioner'}
        username={profile?.username}
        avatarUrl={profile?.avatar_url}
        createdAt={profile?.created_at ?? new Date().toISOString()}
      />

      {/* Stats Overview */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Statistics</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-container-highest">
          {[
            { label: 'Total Hours', value: totalHours.toFixed(1), sublabel: 'All time practice' },
            { label: 'Current Streak', value: `${profile?.current_global_streak ?? 0}d`, sublabel: '🔥 Keep it going!' },
            { label: 'Total Sessions', value: profile?.total_sessions ?? 0, sublabel: 'Focus sessions' },
            { label: 'Longest Streak', value: `${profile?.longest_streak ?? 0}d`, sublabel: 'Personal best' },
            { label: 'Active Skills', value: skills.length, sublabel: 'In progress' },
            { label: 'Level', value: level, sublabel: 'Mastery level' },
            { label: 'Daily Goal', value: `${((profile?.daily_goal_minutes ?? 120) / 60).toFixed(1)}h`, sublabel: 'Target per day' },
            { label: 'Avg/Day', value: avgPerDay, sublabel: 'Since joining' },
          ].map(({ label, value, sublabel }) => (
            <div key={label} className="bg-surface-container px-6 py-5">
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-1">{label}</p>
              <p className="font-mono text-2xl font-bold text-on-surface mb-1">{value}</p>
              <p className="text-[10px] font-sans text-on-surface-variant">{sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Skills */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Active Skills</p>
        </div>
        {skills.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="font-sans text-sm text-on-surface-variant">No skills yet. Start by adding your first skill!</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-highest">
            {skills.map((skill) => {
              const pct = Math.min(Math.round((skill.total_hours / skill.target_hours) * 100), 100)
              return (
                <Link key={skill.id} href={`/skills/${skill.id}/analytics`} className="block px-6 py-4 hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="font-sans text-sm font-medium text-on-surface hover:text-brand-copper transition-colors">{skill.name}</span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">{skill.total_hours.toFixed(1)}/{skill.target_hours}h</span>
                  </div>
                  <div className="h-1 bg-surface-container-highest">
                    <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: skill.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-sans text-on-surface-variant">{pct}% to mastery</span>
                    {skill.current_streak > 0 && (
                      <span className="text-[10px] font-sans text-secondary">🔥 {skill.current_streak}d streak</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Achievements - Placeholder for Phase 4 */}
      <div className="bg-surface-container border border-surface-container-highest">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Achievements</p>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="font-newsreader italic text-lg text-on-surface mb-2">Coming Soon</p>
          <p className="text-sm font-sans text-on-surface-variant max-w-md mx-auto">
            Achievement badges, milestone history, and more gamification features are coming in Phase 4!
          </p>
        </div>
      </div>
    </div>
  )
}
