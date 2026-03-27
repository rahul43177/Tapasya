import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-container-high',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-container border border-surface-container-highest p-6">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-2 w-full mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}
