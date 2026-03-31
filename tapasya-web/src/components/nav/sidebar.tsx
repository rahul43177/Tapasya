'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import LogoutButton from '@/components/auth/logout-button'
import { getMasteryLevel } from '@/lib/utils/mastery'

interface SidebarProps {
  displayName: string
  totalHours: number
  role: string | null | undefined
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home' },
  { href: '/skills', label: 'Skills', icon: 'menu_book' },
  { href: '/sessions', label: 'Sessions', icon: 'history' },
  { href: '/analytics', label: 'Analytics', icon: 'bar_chart' },
  { href: '/squads', label: 'Squads', icon: 'groups' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
  { href: '/achievements', label: 'Achievements', icon: 'emoji_events' },
  { href: '/profile', label: 'Profile', icon: 'person' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

export default function Sidebar({ displayName, totalHours, role }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-surface-container-highest z-40">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-surface-container-highest">
          <span className="font-newsreader text-2xl italic font-bold text-brand-copper">Tapasya</span>
        </div>

        {/* User info */}
        <div className="px-6 py-6 border-b border-surface-container-highest">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-newsreader italic text-base text-on-surface truncate">{displayName}</p>
            {role === 'admin' && (
              <span className="text-[10px] uppercase tracking-widest font-mono text-secondary px-1.5 py-0.5 border border-secondary/40 shrink-0">Admin</span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-widest font-sans text-on-surface-variant opacity-60">
            {getMasteryLevel(totalHours)} · {totalHours.toFixed(1)} hrs
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 transition-colors duration-200',
                  isActive
                    ? 'border-l-2 border-brand-copper text-brand-copper bg-brand-copper/5'
                    : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                )}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                <span className="font-sans text-sm font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-6 py-6 border-t border-surface-container-highest">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-container-highest flex items-center gap-2 px-3 py-2 z-40 overflow-x-auto">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 transition-colors flex-shrink-0 min-w-[68px]',
                isActive ? 'text-brand-copper' : 'text-on-surface-variant opacity-60'
              )}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans whitespace-nowrap">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
