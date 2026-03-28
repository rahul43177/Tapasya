export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton for summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-container-highest">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-surface-container px-6 py-5">
            <div className="h-3 w-20 bg-surface-container-highest mb-2" />
            <div className="h-8 w-16 bg-surface-container-highest" />
          </div>
        ))}
      </div>

      {/* Skeleton for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-surface-container border border-surface-container-highest p-6">
            <div className="h-3 w-32 bg-surface-container-highest mb-4" />
            <div className="h-48 bg-surface-container-high" />
          </div>
        ))}
      </div>

      {/* Skeleton for time-of-day and insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container border border-surface-container-highest p-6">
          <div className="h-48 bg-surface-container-high" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container-high border border-surface-container-highest p-4">
              <div className="h-8 w-8 bg-surface-container-highest mb-2" />
              <div className="h-4 w-full bg-surface-container-highest" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
