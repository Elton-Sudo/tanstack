/**
 * Dashboard Skeleton Loaders
 * Consistent loading states for all dashboard variants
 */

import {
  CardSkeleton,
  ChartSkeleton,
  MetricCardSkeleton,
  Skeleton,
} from '@/components/ui/skeleton';

/**
 * Employee Dashboard Skeleton
 * Loading state for user/learner dashboard
 */
export function EmployeeDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="40%" height={36} />
          <Skeleton variant="text" width="30%" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="rectangular" width={192} height={8} className="rounded-full" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Course Cards Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width="20%" height={32} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Achievements & Deadlines Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Recommended Courses Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width="25%" height={32} />
          <Skeleton variant="rectangular" width={140} height={36} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Performance Overview Skeleton */}
      <CardSkeleton />
    </div>
  );
}

/**
 * Tenant Admin Dashboard Skeleton
 * Loading state for admin/manager dashboard
 */
export function TenantAdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="20%" height={36} />
        <Skeleton variant="text" width="40%" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Department Performance Skeleton */}
      <ChartSkeleton />

      {/* Activity Feed Skeleton */}
      <CardSkeleton />
    </div>
  );
}

/**
 * Super Admin Dashboard Skeleton
 * Loading state for super admin dashboard
 */
export function SuperAdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={36} />
        <Skeleton variant="text" width="50%" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Growth Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Activity & Quick Actions Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* System Alerts Skeleton */}
      <CardSkeleton />
    </div>
  );
}

/**
 * Generic Dashboard Skeleton
 * Fallback loading state
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton variant="text" width="25%" height={36} />
        <Skeleton variant="text" width="40%" className="mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
