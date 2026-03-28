import Link from 'next/link'
import { Plus, UserPlus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import SquadCard from '@/components/squads/squad-card'

export default async function SquadsPage() {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  // Fetch user's squads with member counts
  const { data: squadMemberships, error } = await supabase
    .from('squad_members')
    .select(`
      role,
      squads (
        id,
        name,
        description,
        focus_skill_name,
        max_members
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to fetch squads:', error)
  }

  // Get member counts for each squad
  const squadsWithCounts = await Promise.all(
    (squadMemberships || []).map(async (membership) => {
      if (!membership.squads) return null

      const { count } = await supabase
        .from('squad_members')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', membership.squads.id)

      return {
        ...membership.squads,
        member_count: count || 0,
        is_owner: membership.role === 'owner',
      }
    })
  )

  const squads = squadsWithCounts.filter(Boolean)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-newsreader text-4xl italic font-bold text-on-surface mb-2">
                Your Squads
              </h1>
              <p className="font-sans text-sm text-on-surface-variant">
                Accountability groups for focused practice and friendly competition
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link
                href="/squads/join"
                className="px-4 py-2.5 border border-surface-container-highest text-on-surface font-sans text-sm font-semibold hover:border-outline transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Join Squad
              </Link>
              <Link
                href="/squads/new"
                className="px-4 py-2.5 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Squad
              </Link>
            </div>
          </div>
        </div>

        {/* Squads Grid */}
        {squads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {squads.map((squad) => (
              <SquadCard
                key={squad.id}
                id={squad.id}
                name={squad.name}
                description={squad.description}
                focus_skill_name={squad.focus_skill_name}
                member_count={squad.member_count}
                max_members={squad.max_members}
                is_owner={squad.is_owner}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 bg-surface-container border border-surface-container-highest flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-on-surface-variant" />
            </div>
            <h2 className="font-newsreader text-2xl italic font-bold text-on-surface mb-2">
              No squads yet
            </h2>
            <p className="font-sans text-sm text-on-surface-variant mb-8 text-center max-w-md">
              Create your first squad to start building accountability with friends, or join an existing squad with an invite code.
            </p>
            <div className="flex gap-3">
              <Link
                href="/squads/join"
                className="px-6 py-3 border border-surface-container-highest text-on-surface font-sans text-sm font-semibold hover:border-outline transition-colors"
              >
                Join Squad
              </Link>
              <Link
                href="/squads/new"
                className="px-6 py-3 bg-brand-copper text-white font-sans text-sm font-semibold hover:bg-primary-container transition-colors"
              >
                Create Squad
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
