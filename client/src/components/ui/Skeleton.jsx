// client/src/components/ui/Skeleton.jsx

// What is this file?
// A reusable skeleton loader component.
// The `animate-pulse` Tailwind class makes it fade in and out —
// this motion signals to users that content is loading.

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  )
}

// Pre-built skeleton for stat cards
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <Skeleton className="w-8 h-8 mb-3" />
      <Skeleton className="w-12 h-7 mb-1" />
      <Skeleton className="w-16 h-3" />
    </div>
  )
}
export function DiscoveryStatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex flex-col items-start">
        <Skeleton className="w-12 h-8" />
        <Skeleton className="w-16 h-3 mt-2" />
      </div>
    </div>
  )
}
// Pre-built skeleton for table rows
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-16 h-5 rounded-full" />
      <Skeleton className="w-16 h-4" />
    </div>
  )
}

// Pre-built skeleton for discovery cards
export function DiscoveryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton className="w-36 h-4 mb-2" />
          <Skeleton className="w-24 h-3" />
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <div className="flex gap-2 mb-3">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-full h-3" />
    </div>
  )
}

// Pre-built skeleton for chart panels
export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <Skeleton className="w-32 h-4 mb-4" />
      <Skeleton className="w-full h-48" />
    </div>
  )
}