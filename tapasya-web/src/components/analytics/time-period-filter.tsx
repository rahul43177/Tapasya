'use client'

import * as Tabs from '@radix-ui/react-tabs'
import type { TimePeriod } from '@/lib/utils/analytics'

interface TimePeriodFilterProps {
  currentPeriod: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
}

const periodOptions: { value: TimePeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All Time' }
]

export default function TimePeriodFilter({ currentPeriod, onPeriodChange }: TimePeriodFilterProps) {
  return (
    <Tabs.Root value={currentPeriod} onValueChange={(value) => onPeriodChange(value as TimePeriod)}>
      <Tabs.List className="flex gap-px bg-surface-container-highest border border-surface-container-highest overflow-x-auto">
        {periodOptions.map((option) => (
          <Tabs.Trigger
            key={option.value}
            value={option.value}
            className="flex-1 min-w-[80px] px-4 sm:px-6 py-2.5 sm:py-3 font-sans text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-surface-container-high data-[state=active]:text-on-surface data-[state=active]:border-b-2 data-[state=active]:border-[#E05C00] data-[state=inactive]:text-on-surface-variant data-[state=inactive]:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E05C00] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {option.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
