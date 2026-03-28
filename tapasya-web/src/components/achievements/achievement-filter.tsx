'use client'

import Link from 'next/link'

const categories = [
  { id: 'all', label: 'All Achievements' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'streak', label: 'Streaks' },
  { id: 'consistency', label: 'Consistency' },
  { id: 'mastery', label: 'Mastery' },
  { id: 'special', label: 'Special' },
]

interface AchievementFilterProps {
  selectedCategory: string
}

export default function AchievementFilter({ selectedCategory }: AchievementFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map(category => {
        const isActive = selectedCategory === category.id
        return (
          <Link
            key={category.id}
            href={`/achievements${category.id === 'all' ? '' : `?category=${category.id}`}`}
            className={`px-4 py-2 font-sans text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-copper text-white'
                : 'bg-surface-container border border-surface-container-highest text-on-surface hover:border-brand-copper'
            }`}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}
