'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import { formatDistanceToNow } from 'date-fns'

interface BadgeCardProps {
  achievement: {
    name: string
    description: string
    icon: string
    rarity: string
  }
  unlocked?: boolean
  unlockedAt?: string
  progress?: { current: number; required: number; percentage: number }
}

export default function BadgeCard({ achievement, unlocked = false, unlockedAt, progress }: BadgeCardProps) {
  const rarityColors: Record<string, string> = {
    common: 'text-on-surface-variant',
    rare: 'text-[#4A90E2]',
    epic: 'text-[#9B59B6]',
    legendary: 'text-secondary',
  }

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={`bg-surface-container border border-surface-container-highest p-4 text-center cursor-pointer hover:border-brand-copper transition-colors ${!unlocked ? 'opacity-40' : ''}`}>
            <p className={`text-4xl mb-2 ${!unlocked ? 'grayscale' : ''}`}>{achievement.icon}</p>
            <p className="font-sans text-xs font-semibold text-on-surface mb-1">{achievement.name}</p>
            <p className={`text-[10px] uppercase tracking-widest font-sans ${rarityColors[achievement.rarity] || 'text-on-surface-variant'}`}>
              {achievement.rarity}
            </p>
            {progress && !unlocked && (
              <div className="mt-2">
                <div className="h-1 bg-surface-container-highest">
                  <div className="h-full bg-brand-copper" style={{ width: `${progress.percentage}%` }} />
                </div>
                <p className="text-[10px] font-mono text-on-surface-variant mt-1">
                  {progress.current}/{progress.required}
                </p>
              </div>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-surface-container-highest border border-surface-container-highest px-3 py-2 max-w-xs z-50"
            sideOffset={5}
          >
            <p className="font-sans text-sm text-on-surface mb-1">{achievement.description}</p>
            {unlockedAt && (
              <p className="text-xs font-sans text-on-surface-variant">
                Unlocked {formatDistanceToNow(new Date(unlockedAt), { addSuffix: true })}
              </p>
            )}
            <Tooltip.Arrow className="fill-surface-container-highest" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
