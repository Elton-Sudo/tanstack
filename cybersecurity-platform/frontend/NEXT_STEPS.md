# Quick Start: Next Steps for Implementation

## ✅ What's Done (Phase 1 & 2)

- Fixed network error handling
- Dashboard page uses real data
- Error boundaries in place
- Backend startup documentation

## 🎯 Current Issue: Backend Not Running

The "Network Error" you saw is because the backend services aren't running. Here's how to fix it:

### Option 1: Start Backend Services (Recommended for Full Testing)

```bash
# From project root
cd /Users/eltonsudo/Sandbox/PlayGround/tanstack/cybersecurity-platform

# 1. Start Docker services (PostgreSQL, Redis, etc.)
npm run docker:dev

# 2. Wait 30 seconds, then run migrations
npm run prisma:migrate

# 3. Seed test data
npm run prisma:seed

# 4. Start all microservices
npm run start:dev
```

Then refresh your frontend - dashboard will show real data!

### Option 2: Continue Frontend Work Without Backend

The app now handles backend unavailability gracefully. You'll see helpful error messages instead of crashes. Continue implementing other pages:

```bash
# Frontend works fine without backend
cd frontend
npm run dev
```

## 📝 Next Implementation: Courses Page (Phase 3)

File: `frontend/src/app/(dashboard)/courses/page.tsx`

### Current Code (Mock Data):

```typescript
const courses = [
  { id: 1, title: 'Phishing...', ... },
  // hardcoded array
];
```

### Update To (Real Data):

```typescript
'use client';

import { useCourses } from '@/hooks/use-courses';
import { ServiceUnavailable } from '@/components/service-unavailable';

export default function CoursesPage() {
  const { useGetCourses } = useCourses();
  const { data, isLoading, isError, refetch } = useGetCourses({
    status: 'PUBLISHED'
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (isError) {
    return <ServiceUnavailable service="Course" onRetry={refetch} />;
  }

  const courses = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Your existing JSX */}
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Steps:

1. Import hooks and components
2. Replace mock data with `useGetCourses()`
3. Add loading state
4. Add error state
5. Map real data to UI

## 🚀 Quick Commands Reference

### Backend

```bash
# Check if services running
curl http://localhost:3001/health  # Auth
curl http://localhost:3004/health  # Course

# Start everything
npm run docker:dev && npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev              # Dev server
npm run test            # Unit tests
npm run test:e2e        # E2E tests
```

### Database

```bash
npm run prisma:studio   # Open DB browser
npm run prisma:seed     # Add test data
npm run prisma:reset    # Reset DB
```

## 📚 Implementation Pattern

For each page, follow this pattern:

### 1. Import Hook

```typescript
import { useCourses } from '@/hooks/use-courses';
```

### 2. Use Hook

```typescript
const { useGetCourses } = useCourses();
const { data, isLoading, isError, refetch } = useGetCourses();
```

### 3. Handle States

```typescript
if (isLoading) return <LoadingState />;
if (isError) return <ErrorState onRetry={refetch} />;
```

### 4. Use Data

```typescript
const items = data?.data || [];
return <div>{items.map(...)}</div>;
```

## 📋 Pages Priority Order

1. ✅ Dashboard - DONE
2. 🎯 Courses - NEXT (30 min)
3. My Courses (20 min)
4. Course Detail (45 min)
5. Profile (20 min)
6. Profile/Security (30 min)
7. Risk Dashboard (30 min)
8. Compliance (30 min)
9. Reports (30 min)

**Total Remaining: ~4 hours**

## 🎓 Learning Resources

- React Query Hooks: `frontend/src/hooks/use-*.ts`
- Error Components: `frontend/src/components/`
- Type Definitions: `frontend/src/types/`
- API Services: `frontend/src/services/`

## 💡 Tips

1. **Always test both states**: With and without backend
2. **Use TypeScript**: Let types guide you to correct API shapes
3. **Copy patterns**: Dashboard is a good reference
4. **Check types**: When stuck, look at `types/*.ts` files
5. **Test early**: Refresh browser frequently

## 🐛 Troubleshooting

### "Cannot find module @/hooks/use-courses"

✅ Already created! Just import it.

### "Property doesn't exist on type"

Check `frontend/src/types/*.ts` for correct property names.

### "Network Error"

Backend not running. Either start it or continue with error handling.

### Page shows error but backend is running

Check service URLs in `.env.local` match actual ports.

## ✨ Quick Wins

Want to see progress quickly? Update these simple pages first:

1. **Notifications** - Just a list, easy!
2. **Certificates** - Another simple list
3. **Settings** - Form with profile data

These will boost confidence and show immediate results.

## 🎉 You're Ready!

Everything is set up. The hard part (infrastructure) is done. Now it's just:

1. Import hook
2. Use hook
3. Map data
4. Test

Each page takes 15-30 minutes once you have the pattern down.

**Let's go! 🚀**
