import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import { formatInviteCode, getCurrentWeekRangeISO } from '@/lib/utils/squads'
import MemberList from '@/components/squads/member-list'
import ActivityFeed from '@/components/squads/activity-feed'
import SquadLeaderboard from '@/components/squads/squad-leaderboard'
import CopyInviteButton from '@/components/squads/copy-invite-button'

interface SquadPageProps {
  params: Promise<{ id: string }>
}

export default async function SquadPage({ params }: SquadPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch squad details
  const { data: squad, error: squadError } = await supabase
    .from('squads')
    .select('*')
    .eq('id', id)
    .single()

  if (squadError || !squad) {
    notFound()
  }

  // Check if user is a member
  const { data: membership, error: membershipError } = await supabase
    .from('squad_members')
    .select('*')
    .eq('squad_id', id)
    .eq('user_id', user.id)
    .single()

  // If not a member and squad is not public, deny access
  if (membershipError && !squad.is_public) {
    notFound()
  }

  const isMember = !!membership

  // Fetch all squad members with profile data
  const { data: members, error: membersError } = await supabase
    .from('squad_members')
    .select(`
      user_id,
      role,
      joined_at,
      profile:profiles (
        full_name,
        username,
        avatar_url,
        current_global_streak,
        total_hours
      )
    `)
    .eq('squad_id', id)

  if (membersError) {
    console.error('Failed to fetch members:', membersError)
  }

  // Get current week range for leaderboard
  const { start: weekStart, end: weekEnd } = getCurrentWeekRangeISO()

  // Fetch weekly activity for leaderboard
  const { data: weeklyActivities, error: weeklyError } = await supabase
    .from('focus_sessions')
    .select('user_id, duration')
    .in('user_id', (members || []).map(m => m.user_id))
    .gte('start_time', weekStart)
    .lte('start_time', weekEnd)

  if (weeklyError) {
    console.error('Failed to fetch weekly activities:', weeklyError)
  }

  // Calculate weekly stats for each member (filter out null profiles)
  const leaderboardEntries = (members || [])
    .filter(member => member.profile !== null)
    .map(member => {
      const userWeeklySessions = (weeklyActivities || []).filter(
        activity => activity.user_id === member.user_id
      )
      // Duration is stored in MINUTES, so divide by 60 to get hours
      const weeklyHours = userWeeklySessions.reduce(
        (sum, session) => sum + session.duration,
        0
      ) / 60

      return {
        user_id: member.user_id,
        full_name: member.profile!.full_name,
        username: member.profile!.username,
        avatar_url: member.profile!.avatar_url,
        current_global_streak: member.profile!.current_global_streak,
        weekly_hours: weeklyHours,
        weekly_sessions: userWeeklySessions.length,
      }
    })

  // Fetch recent activity feed (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentActivities, error: activitiesError } = await supabase
    .from('focus_sessions')
    .select(`
      id,
      user_id,
      duration,
      start_time,
      skill_id,
      profile:profiles (
        full_name,
        username
      ),
      skill:skills (
        name,
        icon,
        color
      )
    `)
    .in('user_id', (members || []).map(m => m.user_id))
    .gte('start_time', sevenDaysAgo.toISOString())
    .order('start_time', { ascending: false })
    .limit(20)

  if (activitiesError) {
    console.error('Failed to fetch activities:', activitiesError)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/squads"
          className="inline-flex items-center gap-2 text-xs font-sans text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Squads
        </Link>

        {/* Squad Header */}
        <div className="mb-8 p-6 bg-surface-container border border-surface-container-highest">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-newsreader text-3xl md:text-4xl italic font-bold text-on-surface mb-2">
                {squad.name}
              </h1>
              {squad.description && (
                <p className="font-sans text-sm text-on-surface-variant mb-4">
                  {squad.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-xs">
                {squad.focus_skill_name && (
                  <div>
                    <span className="uppercase tracking-widest font-sans text-on-surface-variant">Focus: </span>
                    <span className="font-sans text-on-surface">{squad.focus_skill_name}</span>
                  </div>
                )}
                <div>
                  <span className="uppercase tracking-widest font-sans text-on-surface-variant">Members: </span>
                  <span className="font-mono text-on-surface">
                    {members?.length || 0}/{squad.max_members}
                  </span>
                </div>
              </div>
            </div>

            {/* Invite Code */}
            <div className="bg-background border border-surface-container-highest p-4 text-center">
              <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant mb-2">
                Invite Code
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-2xl tracking-widest text-secondary font-bold">
                  {formatInviteCode(squad.invite_code)}
                </p>
                <CopyInviteButton inviteCode={squad.invite_code} />
              </div>
            </div>
          </div>
        </div>

        {/* Not a Member Notice */}
        {!isMember && (
          <div className="mb-6 px-4 py-3 bg-secondary/10 border-l-2 border-secondary text-sm font-sans text-on-surface">
            You are viewing this public squad. Join to participate in the leaderboard.
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-1">
            <MemberList members={members || []} currentUserId={user.id} />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed
              activities={recentActivities || []}
              currentUserId={user.id}
            />
          </div>

          {/* Weekly Leaderboard */}
          <div className="lg:col-span-1">
            <SquadLeaderboard
              entries={leaderboardEntries}
              currentUserId={user.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
