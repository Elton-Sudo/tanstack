# Skeleton Loaders - Usage Guide

## Overview

Skeleton loaders provide visual feedback while content is loading, improving perceived performance and user experience.

## Available Skeleton Components

### Dashboard Skeletons

Located in: `/src/components/skeletons/DashboardSkeleton.tsx`

- **`EmployeeDashboardSkeleton`** - For user/learner dashboard
- **`TenantAdminDashboardSkeleton`** - For admin/manager dashboard
- **`SuperAdminDashboardSkeleton`** - For platform admin dashboard
- **`DashboardSkeleton`** - Generic fallback

### Page Skeletons

Located in: `/src/components/skeletons/PageSkeleton.tsx`

- **`CourseCatalogSkeleton`** - For `/courses` page
- **`MyCoursesSkeletonLoader`** - For `/my-courses` page
- **`CourseDetailSkeleton`** - For `/courses/[id]` page
- **`CoursePlayerSkeleton`** - For `/courses/[id]/player` page
- **`ProfileSkeleton`** - For `/profile` page
- **`SettingsSkeleton`** - For `/settings` pages
- **`ReportsSkeleton`** - For `/reports` page
- **`UserManagementSkeleton`** - For `/manage/users` page
- **`AdminPlatformSkeleton`** - For `/admin/platform` page
- **`TenantManagementSkeleton`** - For `/admin/tenants` page
- **`GenericPageSkeleton`** - Fallback for any page

### Base Skeletons

Located in: `/src/components/ui/skeleton.tsx`

- **`Skeleton`** - Base component with variants (text, circular, rectangular)
- **`CardSkeleton`** - Generic card loading state
- **`TableSkeleton`** - Table rows loading state
- **`ChartSkeleton`** - Chart/graph loading state
- **`MetricCardSkeleton`** - Metric/stat card loading state

## Usage Examples

### Basic Usage with API Loading

```typescript
'use client';

import { CourseCatalogSkeleton } from '@/components/skeletons';
import { useCourses } from '@/hooks/use-courses';

export default function CoursesPage() {
  const { data: courses, isLoading } = useCourses();

  if (isLoading) {
    return <CourseCatalogSkeleton />;
  }

  return (
    <div>
      {/* Your course content */}
    </div>
  );
}
```

### Dashboard with Role-Based Skeletons

```typescript
'use client';

import {
  EmployeeDashboardSkeleton,
  TenantAdminDashboardSkeleton,
  SuperAdminDashboardSkeleton,
} from '@/components/skeletons';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  // Show appropriate skeleton while loading
  if (!user) {
    return <TenantAdminDashboardSkeleton />;
  }

  // Route to correct dashboard
  if (user.role === 'USER') {
    return <EmployeeDashboard />;
  }

  if (user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  return <TenantAdminDashboard />;
}
```

### Custom Skeleton Components

```typescript
import { Skeleton } from '@/components/skeletons';

function CustomSkeleton() {
  return (
    <div className="space-y-4">
      {/* Text skeleton */}
      <Skeleton variant="text" width="60%" height={32} />

      {/* Circular skeleton (avatars) */}
      <Skeleton variant="circular" width={80} height={80} />

      {/* Rectangular skeleton (images, cards) */}
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}
```

### Combining Skeleton Components

```typescript
import {
  Skeleton,
  MetricCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from '@/components/skeletons';

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton variant="text" width="30%" height={36} />
        <Skeleton variant="text" width="50%" />
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Table */}
      <div className="border rounded-lg p-6">
        <TableSkeleton rows={10} />
      </div>
    </div>
  );
}
```

## When to Use Skeleton Loaders

### ✅ DO use skeletons for:

- Initial page loads
- Data fetching from APIs
- Search results loading
- Infinite scroll loading
- Tab content switching
- Any async operation over 200ms

### ❌ DON'T use skeletons for:

- Instant client-side operations
- Form submissions (use button loading states instead)
- Very fast operations (<100ms)
- Error states (show error UI instead)

## Best Practices

### 1. Match Content Structure

Skeleton should mirror the actual content layout:

```typescript
// ✅ Good - matches actual course card
<div className="border rounded-lg p-4 space-y-3">
  <Skeleton variant="text" width="70%" height={24} />
  <Skeleton variant="text" width="100%" />
  <Skeleton variant="rectangular" height={120} />
  <Skeleton variant="rectangular" width={100} height={36} />
</div>

// ❌ Bad - generic skeleton doesn't match content
<div className="animate-pulse bg-gray-200 h-40" />
```

### 2. Use Role-Specific Skeletons

Show the appropriate skeleton for the user's role to maintain consistency:

```typescript
// ✅ Good
if (user.role === 'SUPER_ADMIN') {
  return <SuperAdminDashboardSkeleton />;
}

// ❌ Bad - generic skeleton for everyone
if (!user) {
  return <div>Loading...</div>;
}
```

### 3. Accessibility

All skeleton components include proper ARIA attributes:

```typescript
<Skeleton
  aria-live="polite"
  aria-busy="true"
/>
```

### 4. Consistent Timing

Show skeletons for at least 300ms to avoid flashing:

```typescript
const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  if (!isLoading && data) {
    // Delay hiding skeleton to avoid flash
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 300);
    return () => clearTimeout(timer);
  }
}, [isLoading, data]);
```

## Animation Variants

Skeletons support two animation types:

```typescript
// Pulse animation (default)
<Skeleton animation="pulse" />

// Wave animation
<Skeleton animation="wave" />

// No animation
<Skeleton animation="none" />
```

## Customization

### Custom Dimensions

```typescript
<Skeleton width={200} height={100} />
<Skeleton width="75%" height={40} />
```

### Custom Styling

```typescript
<Skeleton
  className="bg-blue-100 dark:bg-blue-900"
  variant="rectangular"
/>
```

## Integration Checklist

When adding skeleton loaders to a page:

- [ ] Import appropriate skeleton component
- [ ] Add loading state check
- [ ] Return skeleton before actual content
- [ ] Verify skeleton matches content structure
- [ ] Test with slow network throttling
- [ ] Check accessibility (screen reader)
- [ ] Verify no layout shift when content loads

## Examples by Page Type

### List/Grid Pages

```typescript
// Courses, Users, Reports, etc.
if (isLoading) return <CourseCatalogSkeleton />;
```

### Detail Pages

```typescript
// Course detail, User profile, etc.
if (isLoading) return <CourseDetailSkeleton />;
```

### Form Pages

```typescript
// Settings, Profile edit, etc.
if (isLoading) return <SettingsSkeleton />;
```

### Dashboard Pages

```typescript
// Analytics, Overview, etc.
if (isLoading) return <TenantAdminDashboardSkeleton />;
```

## Performance Tips

1. **Lazy load skeletons for better bundle size:**

```typescript
const DashboardSkeleton = dynamic(
  () => import('@/components/skeletons').then((mod) => mod.DashboardSkeleton),
  { ssr: false },
);
```

2. **Reuse skeleton components:**

```typescript
// Don't create unique skeletons for similar content
// Reuse existing ones where possible
```

3. **Avoid nested skeletons:**

```typescript
// ✅ Good - single skeleton component
<CourseCatalogSkeleton />

// ❌ Bad - unnecessary nesting
<div>
  <Skeleton />
  <Skeleton />
  <div>
    <Skeleton />
  </div>
</div>
```

## Future Enhancements

Planned skeleton loader improvements:

- [ ] Shimmer animation variant
- [ ] Auto-generated skeletons from components
- [ ] Skeleton theme customization
- [ ] Progressive loading skeletons
- [ ] Stagger animation for lists
