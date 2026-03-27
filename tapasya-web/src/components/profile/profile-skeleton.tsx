import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-8">
      {/* Profile Header Skeleton */}
      <div className="bg-surface-container border border-surface-container-highest p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-container-highest">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-container px-6 py-5">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="bg-surface-container border border-surface-container-highest mb-6">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="divide-y divide-surface-container-highest">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-1 w-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
