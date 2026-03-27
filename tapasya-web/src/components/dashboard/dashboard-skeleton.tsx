import { Skeleton, SkeletonCard } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Today's Tapa Skeleton */}
      <div className="bg-surface-container border border-surface-container-highest p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-1.5 w-full mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* Focus Timer Skeleton */}
      <div className="bg-surface-container border border-surface-container-highest p-6 mb-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Skeleton */}
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}
