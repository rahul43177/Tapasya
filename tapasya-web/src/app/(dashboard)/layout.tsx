import { createClient } from '@/lib/supabase/server'
import { requireAuthenticatedUser } from '@/lib/supabase/auth'
import Sidebar from '@/components/nav/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const user = await requireAuthenticatedUser(supabase)

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, total_hours, role')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name ?? profile?.username ?? user.email ?? 'Practitioner'
  const totalHours = Number(profile?.total_hours ?? 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar displayName={displayName} totalHours={totalHours} role={profile?.role} />
      <main className="flex-1 min-w-0 lg:ml-64 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
