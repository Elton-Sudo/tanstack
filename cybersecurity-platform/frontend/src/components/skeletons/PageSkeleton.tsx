/**
 * Page-Level Skeleton Loaders
 * Loading states for various pages throughout the application
 */

import {
  CardSkeleton,
  ChartSkeleton,
  MetricCardSkeleton,
  Skeleton,
  TableSkeleton,
} from '@/components/ui/skeleton';

/**
 * Course Catalog Skeleton
 * Loading state for /courses page
 */
export function CourseCatalogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={36} />
        <Skeleton variant="text" width="50%" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton variant="rectangular" width={120} height={36} className="rounded-md" />
        <Skeleton variant="rectangular" width={120} height={36} className="rounded-md" />
        <Skeleton variant="rectangular" width={150} height={36} className="rounded-md" />
        <Skeleton variant="rectangular" width={200} height={36} className="rounded-md" />
      </div>

      {/* Course Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * My Courses Skeleton
 * Loading state for /my-courses page
 */
export function MyCoursesSkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Header & Stats Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton variant="text" width="25%" height={36} />
          <Skeleton variant="text" width="40%" />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={32} />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b">
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </div>

      {/* Course List Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Course Detail Skeleton
 * Loading state for /courses/[id] page
 */
export function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Course Header Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={80} height={24} className="rounded-md" />
          <Skeleton variant="rectangular" width={100} height={24} className="rounded-md" />
        </div>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
      </div>

      {/* Course Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="70%" height={28} />
          </div>
        ))}
      </div>

      {/* Curriculum & Sidebar Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton variant="text" width="30%" height={28} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" className="mt-2" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Course Player Skeleton
 * Loading state for /courses/[id]/player page
 */
export function CoursePlayerSkeleton() {
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Sidebar Skeleton */}
      <div className="w-96 flex-shrink-0 border-r pr-6 space-y-4">
        {/* Course Info */}
        <div className="space-y-3 pb-4 border-b">
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="rectangular" height={8} className="rounded-full" />
          <Skeleton variant="text" width="60%" />
        </div>

        {/* Chapters */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2">
            <Skeleton variant="text" width="70%" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex gap-3 p-2">
                <Skeleton variant="circular" width={16} height={16} />
                <div className="flex-1">
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Header */}
        <div className="space-y-2 pb-4 border-b">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" width={100} height={24} className="rounded-md" />
        </div>

        {/* Video/Content Area */}
        <Skeleton variant="rectangular" height={400} className="rounded-lg" />

        {/* Controls */}
        <div className="flex justify-between items-center">
          <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
          <Skeleton variant="text" width={100} />
          <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Profile Page Skeleton
 * Loading state for /profile page
 */
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="20%" height={36} />
        <Skeleton variant="text" width="40%" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="border rounded-lg p-6 space-y-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={80} height={80} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="rectangular" height={40} className="rounded-md" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton variant="rectangular" width={100} height={40} className="rounded-md" />
          <Skeleton variant="rectangular" width={100} height={40} className="rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Page Skeleton
 * Loading state for /settings pages
 */
export function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="25%" height={36} />
        <Skeleton variant="text" width="45%" />
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="rectangular" width={120} height={40} className="rounded-md mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reports Page Skeleton
 * Loading state for /reports page
 */
export function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width="20%" height={36} />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-3">
        <Skeleton variant="rectangular" width={180} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg p-6">
        <Skeleton variant="text" width="25%" height={24} className="mb-4" />
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
}

/**
 * User Management Skeleton
 * Loading state for /manage/users page
 */
export function UserManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width="25%" height={36} />
          <Skeleton variant="text" width="50%" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" />
          <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex gap-3">
        <Skeleton variant="rectangular" width={300} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
      </div>

      {/* Users Table */}
      <div className="border rounded-lg p-6">
        <TableSkeleton rows={10} />
      </div>
    </div>
  );
}

/**
 * Admin Platform Skeleton
 * Loading state for /admin/platform page
 */
export function AdminPlatformSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={36} />
        <Skeleton variant="text" width="45%" />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Activity & Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* System Status */}
      <CardSkeleton />
    </div>
  );
}

/**
 * Tenant Management Skeleton
 * Loading state for /admin/tenants page
 */
export function TenantManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width="25%" height={36} />
          <Skeleton variant="text" width="50%" />
        </div>
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Skeleton variant="rectangular" width={250} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={150} height={40} className="rounded-md" />
      </div>

      {/* Tenants Table */}
      <div className="border rounded-lg p-6">
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
}

/**
 * Generic Page Skeleton
 * Fallback loading state for any page
 */
export function GenericPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={36} />
        <Skeleton variant="text" width="50%" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
