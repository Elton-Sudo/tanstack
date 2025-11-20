# Frontend Testing Plan - Real API Integration

## Overview

This document outlines the comprehensive testing strategy to ensure all frontend pages are functional and properly integrated with the backend microservices.

## Current State Analysis

### ✅ Completed Infrastructure

- [x] Next.js 14 project setup
- [x] TypeScript configuration
- [x] API client with service-specific clients (9 microservices)
- [x] Service layer implementations (auth, course, analytics)
- [x] Type definitions for all major entities
- [x] Route protection middleware
- [x] Zustand store for auth state

### ⚠️ Issues Identified

- [ ] All pages currently use mock/hardcoded data
- [ ] No React Query hooks for data fetching
- [ ] No loading/error states on pages
- [ ] Missing environment variable configuration
- [ ] No integration tests
- [ ] No E2E tests
- [ ] Components not connected to real APIs

---

## Testing Strategy

### Phase 1: Environment & API Setup ✅

**Priority: CRITICAL**

#### Tasks:

1. **Environment Configuration**
   - Create `.env.local` file with all service URLs
   - Verify all backend services are running
   - Test connectivity to each service
   - Document service health endpoints

2. **API Client Verification**

   ```bash
   # Test each service endpoint
   curl http://localhost:3001/health  # Auth Service
   curl http://localhost:3002/health  # Tenant Service
   curl http://localhost:3003/health  # User Service
   curl http://localhost:3004/health  # Course Service
   curl http://localhost:3005/health  # Content Service
   curl http://localhost:3006/health  # Analytics Service
   curl http://localhost:3007/health  # Reporting Service
   curl http://localhost:3008/health  # Notification Service
   curl http://localhost:3009/health  # Integration Service
   ```

3. **Database Seeding**
   - Verify database has seed data
   - Create test tenant
   - Create test users (admin, instructor, learner)
   - Create test courses with modules/chapters
   - Create test enrollments

**Success Criteria:**

- All services respond to health checks
- Database contains test data
- API client can authenticate and fetch data

---

### Phase 2: React Query Integration 🔥

**Priority: HIGH**

Create custom hooks for all data fetching operations using React Query.

#### Files to Create:

##### 1. `/frontend/src/hooks/use-auth.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query for user profile
  const useProfile = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: authService.getProfile,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Login mutation
  const useLogin = () => {
    return useMutation({
      mutationFn: (data: LoginRequest) => authService.login(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // Register mutation
  const useRegister = () => {
    return useMutation({
      mutationFn: (data: RegisterRequest) => authService.register(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // Logout mutation
  const useLogout = () => {
    return useMutation({
      mutationFn: authService.logout,
      onSuccess: () => {
        queryClient.clear();
      },
    });
  };

  return {
    useProfile,
    useLogin,
    useRegister,
    useLogout,
  };
};
```

##### 2. `/frontend/src/hooks/use-courses.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/course.service';

export const useCourses = () => {
  const queryClient = useQueryClient();

  // Get all courses
  const useGetCourses = (filters?: any) => {
    return useQuery({
      queryKey: ['courses', filters],
      queryFn: () => courseService.getCourses(filters),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Get single course
  const useGetCourse = (id: string) => {
    return useQuery({
      queryKey: ['course', id],
      queryFn: () => courseService.getCourse(id),
      enabled: !!id,
    });
  };

  // Get my enrollments
  const useMyEnrollments = () => {
    return useQuery({
      queryKey: ['my-enrollments'],
      queryFn: () => courseService.getMyEnrollments(),
      staleTime: 1 * 60 * 1000,
    });
  };

  // Enroll in course
  const useEnrollCourse = () => {
    return useMutation({
      mutationFn: (courseId: string) => courseService.enrollCourse(courseId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
        queryClient.invalidateQueries({ queryKey: ['courses'] });
      },
    });
  };

  return {
    useGetCourses,
    useGetCourse,
    useMyEnrollments,
    useEnrollCourse,
  };
};
```

##### 3. `/frontend/src/hooks/use-analytics.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export const useAnalytics = () => {
  // Get dashboard metrics
  const useDashboardMetrics = (params?: any) => {
    return useQuery({
      queryKey: ['dashboard-metrics', params],
      queryFn: () => analyticsService.getDashboardMetrics(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get my risk score
  const useMyRiskScore = () => {
    return useQuery({
      queryKey: ['my-risk-score'],
      queryFn: analyticsService.getMyRiskScore,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Get compliance metrics
  const useComplianceMetrics = (framework: string) => {
    return useQuery({
      queryKey: ['compliance-metrics', framework],
      queryFn: () => analyticsService.getComplianceMetrics(framework as any),
      enabled: !!framework,
    });
  };

  return {
    useDashboardMetrics,
    useMyRiskScore,
    useComplianceMetrics,
  };
};
```

**Testing Tasks:**

- [ ] Create all React Query hooks
- [ ] Test hooks in isolation with mock API responses
- [ ] Verify query caching works correctly
- [ ] Test error handling in hooks
- [ ] Test loading states

---

### Phase 3: Page Integration Testing 📄

**Priority: HIGH**

Update each page to use real API data through React Query hooks.

#### Pages to Update:

##### 1. Dashboard Page (`/dashboard`)

**Current State:** Uses mock metrics data
**Goal:** Fetch real dashboard metrics from reporting service

**Test Cases:**

- [ ] Page loads dashboard metrics successfully
- [ ] Shows loading state while fetching
- [ ] Displays error message on API failure
- [ ] Metrics update when date range changes
- [ ] Charts render with real data
- [ ] Recent activity loads from API
- [ ] Department metrics display correctly

**API Endpoints:**

```
POST /api/v1/reports/dashboard/executive
GET  /api/v1/risk-scores
GET  /api/v1/analytics/trends
```

##### 2. Courses Page (`/courses`)

**Current State:** Uses mock course array
**Goal:** Fetch real courses from course service

**Test Cases:**

- [ ] Loads all published courses
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Difficulty filtering works
- [ ] Course cards display correct data (title, duration, enrolled count)
- [ ] Pagination works correctly
- [ ] "Enroll Now" button creates enrollment
- [ ] Shows user enrollment status if already enrolled

**API Endpoints:**

```
GET  /api/v1/courses?status=PUBLISHED
POST /api/v1/courses/:id/enroll
GET  /api/v1/courses/:id/stats
```

##### 3. My Courses Page (`/my-courses`)

**Current State:** Uses mock enrollment data
**Goal:** Fetch real enrollments from course service

**Test Cases:**

- [ ] Loads user's enrolled courses
- [ ] Shows correct progress percentage
- [ ] Stats cards show accurate counts (in progress, completed, total hours)
- [ ] "Continue" button navigates to correct course
- [ ] Progress bar reflects actual completion
- [ ] Shows last accessed timestamp
- [ ] Filters by status (in progress, completed)

**API Endpoints:**

```
GET /api/v1/enrollments/my
GET /api/v1/enrollments/:id
PUT /api/v1/enrollments/:id/progress
```

##### 4. Course Detail Page (`/courses/[id]`)

**Current State:** Needs implementation
**Goal:** Show complete course details with modules and chapters

**Test Cases:**

- [ ] Loads course with all modules
- [ ] Shows module and chapter hierarchy
- [ ] Displays course description and metadata
- [ ] Shows enrollment button if not enrolled
- [ ] Shows "Start Course" if enrolled
- [ ] Tracks chapter completion
- [ ] Video player works (if applicable)
- [ ] Quiz links work

**API Endpoints:**

```
GET /api/v1/courses/:id
GET /api/v1/courses/:id/modules
POST /api/v1/courses/:id/enroll
```

##### 5. Risk Dashboard Page (`/risk`)

**Current State:** Needs implementation
**Goal:** Display risk scores and analytics

**Test Cases:**

- [ ] Shows user's risk score
- [ ] Displays risk trend chart
- [ ] Shows risk factors breakdown
- [ ] Displays department risk comparison
- [ ] Recommendations section populated
- [ ] Historical risk data displayed

**API Endpoints:**

```
GET /api/v1/risk-scores/my
GET /api/v1/risk-scores?departmentId=:id
GET /api/v1/analytics/risk-trends
```

##### 6. Compliance Page (`/compliance`)

**Current State:** Needs implementation
**Goal:** Display compliance metrics and status

**Test Cases:**

- [ ] Shows compliance framework metrics
- [ ] Displays completion percentages
- [ ] Shows required vs completed trainings
- [ ] Certificate status displayed
- [ ] Deadline tracking works
- [ ] Framework selector works (GDPR, HIPAA, SOC2, etc.)

**API Endpoints:**

```
GET /api/v1/reports/compliance/:framework
GET /api/v1/certificates/my
```

##### 7. Profile Page (`/profile`)

**Current State:** Needs real data integration
**Goal:** Display and update user profile

**Test Cases:**

- [ ] Loads user profile data
- [ ] Shows user details (name, email, role, department)
- [ ] Profile picture upload works
- [ ] Edit profile updates successfully
- [ ] Shows enrolled courses count
- [ ] Displays certificates earned
- [ ] Shows learning streak

**API Endpoints:**

```
GET  /api/v1/auth/profile
PUT  /api/v1/auth/profile
GET  /api/v1/users/:id
```

##### 8. Profile Security Page (`/profile/security`)

**Current State:** Uses mock session data
**Goal:** Real MFA and session management

**Test Cases:**

- [ ] Shows MFA status (enabled/disabled)
- [ ] Enable MFA shows QR code
- [ ] Disable MFA requires verification
- [ ] Lists active sessions with real data
- [ ] "Log out all sessions" works
- [ ] Password change form works
- [ ] Shows login history

**API Endpoints:**

```
POST /api/v1/auth/mfa/enable
POST /api/v1/auth/mfa/disable
POST /api/v1/auth/change-password
GET  /api/v1/auth/sessions
POST /api/v1/auth/sessions/revoke-all
```

##### 9. Reports Page (`/reports`)

**Current State:** Needs implementation
**Goal:** List and generate reports

**Test Cases:**

- [ ] Lists all generated reports
- [ ] Shows report metadata (type, date, status)
- [ ] Download report works
- [ ] Delete report works
- [ ] "Generate Report" button navigates correctly
- [ ] Filters by report type
- [ ] Scheduled reports displayed

**API Endpoints:**

```
GET    /api/v1/reports
GET    /api/v1/reports/:id/download
DELETE /api/v1/reports/:id
GET    /api/v1/reports/schedules
```

##### 10. Notifications Page (`/notifications`)

**Current State:** Needs implementation
**Goal:** Display user notifications

**Test Cases:**

- [ ] Loads all notifications
- [ ] Shows unread count
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Delete notification works
- [ ] Real-time updates (WebSocket)
- [ ] Notification filters work

**API Endpoints:**

```
GET    /api/v1/notifications/my
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
```

---

### Phase 4: Error Handling & Loading States 🎯

**Priority: MEDIUM**

#### Tasks:

- [ ] Implement consistent loading skeletons for all pages
- [ ] Create error boundary components
- [ ] Add toast notifications for errors
- [ ] Implement retry logic for failed requests
- [ ] Add offline detection and handling
- [ ] Create fallback UI for empty states

**Components to Create:**

```typescript
// /frontend/src/components/ui/loading-skeleton.tsx
// /frontend/src/components/ui/error-boundary.tsx
// /frontend/src/components/ui/empty-state.tsx
```

---

### Phase 5: Integration Testing 🧪

**Priority: MEDIUM**

#### Setup Integration Tests

##### 1. Install Dependencies

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event vitest @vitejs/plugin-react jsdom
```

##### 2. Create Test Files

**Test Structure:**

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── integration/
│   │   │   ├── auth.test.tsx
│   │   │   ├── courses.test.tsx
│   │   │   ├── dashboard.test.tsx
│   │   │   └── profile.test.tsx
│   │   └── utils/
│   │       ├── test-utils.tsx
│   │       └── mock-server.ts
```

##### 3. Mock Service Worker (MSW) Setup

```typescript
// /frontend/src/__tests__/utils/mock-server.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3001/api/v1/auth/profile', () => {
    return HttpResponse.json({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'LEARNER',
    });
  }),

  http.get('http://localhost:3004/api/v1/courses', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'course-1',
          title: 'Test Course',
          description: 'Test Description',
          category: 'PHISHING',
        },
      ],
      pagination: { total: 1, page: 1, limit: 20 },
    });
  }),
];

export const server = setupServer(...handlers);
```

**Test Cases:**

- [ ] Test authentication flow
- [ ] Test course listing and filtering
- [ ] Test enrollment process
- [ ] Test dashboard data fetching
- [ ] Test profile updates
- [ ] Test MFA setup flow

---

### Phase 6: End-to-End Testing 🚀

**Priority: MEDIUM**

#### Setup Playwright

##### 1. Install Playwright

```bash
cd frontend
npm install --save-dev @playwright/test
npx playwright install
```

##### 2. Create E2E Tests

**Test Structure:**

```
frontend/
├── e2e/
│   ├── auth.spec.ts
│   ├── courses.spec.ts
│   ├── enrollment.spec.ts
│   ├── dashboard.spec.ts
│   └── reports.spec.ts
```

**Critical User Flows:**

- [ ] Login → Dashboard → View Metrics
- [ ] Browse Courses → Enroll → Start Learning
- [ ] Complete Course → Take Quiz → Get Certificate
- [ ] Generate Report → Download Report
- [ ] Update Profile → Change Password
- [ ] Enable MFA → Verify with TOTP

**Example E2E Test:**

```typescript
// e2e/enrollment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Course Enrollment Flow', () => {
  test('user can browse and enroll in a course', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'learner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to courses
    await page.goto('http://localhost:3000/courses');
    await expect(page).toHaveURL(/.*courses/);

    // Search for a course
    await page.fill('input[type="search"]', 'Phishing');
    await page.waitForTimeout(500);

    // Click on first course
    await page.click('text=Phishing Awareness Training');

    // Enroll
    await page.click('button:has-text("Enroll Now")');
    await expect(page.locator('text=Enrolled')).toBeVisible();

    // Verify in My Courses
    await page.goto('http://localhost:3000/my-courses');
    await expect(page.locator('text=Phishing Awareness Training')).toBeVisible();
  });
});
```

---

### Phase 7: Performance Testing ⚡

**Priority: LOW**

#### Tasks:

- [ ] Measure page load times
- [ ] Test with large datasets (1000+ courses)
- [ ] Verify infinite scroll/pagination performance
- [ ] Test image loading and lazy loading
- [ ] Measure time to interactive (TTI)
- [ ] Test on slow network (3G simulation)

**Tools:**

- Lighthouse CI
- Web Vitals
- React Developer Tools Profiler

---

### Phase 8: Accessibility Testing ♿

**Priority: LOW**

#### Tasks:

- [ ] Keyboard navigation works on all pages
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements

**Tools:**

- axe DevTools
- WAVE Browser Extension
- Lighthouse Accessibility Audit

---

## Test Data Requirements

### Database Seed Data Needed:

#### Tenants

- 1 test tenant with branding

#### Users

- 1 Super Admin
- 1 Tenant Admin
- 2 Instructors
- 5 Learners (with various progress states)

#### Courses

- 10 published courses across all categories
- 5 courses with enrollments
- Each course should have:
  - 3-5 modules
  - 8-12 chapters per course
  - 2-3 quizzes

#### Enrollments

- 20 enrollments with various statuses
- Progress ranging from 0% to 100%
- Some completed, some in progress

#### Reports

- 5 generated reports
- 3 scheduled reports

#### Notifications

- 10 notifications (read and unread)

---

## Success Metrics

### ✅ Definition of Done

A page is considered "functional and using real data" when:

1. **Data Fetching**
   - [ ] Uses React Query hooks
   - [ ] No hardcoded mock data
   - [ ] Fetches from correct API endpoint

2. **Error Handling**
   - [ ] Shows loading state
   - [ ] Handles and displays errors
   - [ ] Has retry mechanism
   - [ ] Shows empty states appropriately

3. **User Interactions**
   - [ ] All buttons/links functional
   - [ ] Forms submit to real APIs
   - [ ] Updates reflect immediately
   - [ ] Optimistic updates where appropriate

4. **Testing**
   - [ ] Unit tests for components
   - [ ] Integration tests for hooks
   - [ ] E2E test for critical path
   - [ ] Accessibility checks pass

5. **Performance**
   - [ ] Loads in < 3 seconds on 3G
   - [ ] No unnecessary re-renders
   - [ ] Images lazy loaded
   - [ ] Code split appropriately

---

## Testing Checklist Summary

### Environment Setup

- [ ] Backend services running
- [ ] Database seeded with test data
- [ ] Environment variables configured
- [ ] API connectivity verified

### React Query Hooks

- [ ] use-auth.ts created and tested
- [ ] use-courses.ts created and tested
- [ ] use-analytics.ts created and tested
- [ ] use-reports.ts created and tested
- [ ] use-notifications.ts created and tested

### Page Integrations

- [ ] Dashboard page - real data
- [ ] Courses page - real data
- [ ] My Courses page - real data
- [ ] Course detail page - real data
- [ ] Risk page - real data
- [ ] Compliance page - real data
- [ ] Profile page - real data
- [ ] Security page - real data
- [ ] Reports page - real data
- [ ] Notifications page - real data

### Testing Infrastructure

- [ ] Integration tests setup (Vitest + MSW)
- [ ] E2E tests setup (Playwright)
- [ ] CI/CD pipeline for tests
- [ ] Test coverage > 70%

### Quality Assurance

- [ ] All pages have loading states
- [ ] All pages handle errors
- [ ] All forms validated
- [ ] All pages responsive
- [ ] Accessibility standards met
- [ ] Performance benchmarks met

---

## Timeline Estimate

| Phase                      | Duration    | Priority |
| -------------------------- | ----------- | -------- |
| Phase 1: Environment Setup | 1 day       | CRITICAL |
| Phase 2: React Query Hooks | 2 days      | HIGH     |
| Phase 3: Page Integration  | 5 days      | HIGH     |
| Phase 4: Error Handling    | 2 days      | MEDIUM   |
| Phase 5: Integration Tests | 3 days      | MEDIUM   |
| Phase 6: E2E Tests         | 2 days      | MEDIUM   |
| Phase 7: Performance       | 1 day       | LOW      |
| Phase 8: Accessibility     | 1 day       | LOW      |
| **Total**                  | **17 days** |          |

---

## Next Steps

1. **Immediate Actions:**
   - Verify all backend services are running
   - Create `.env.local` file with service URLs
   - Run database migrations and seed
   - Test API connectivity

2. **Week 1:**
   - Create all React Query hooks
   - Update Dashboard, Courses, and My Courses pages
   - Implement loading and error states

3. **Week 2:**
   - Update remaining pages
   - Set up integration testing
   - Begin E2E test coverage

4. **Week 3:**
   - Complete all tests
   - Performance optimization
   - Accessibility audit
   - Documentation updates

---

## Resources

### Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [Playwright Docs](https://playwright.dev/)
- [MSW Docs](https://mswjs.io/)
- [Vitest Docs](https://vitest.dev/)

### Internal Docs

- `/docs/API_COURSE_SERVICE.md`
- `/docs/API_AUTH_SERVICE.md`
- `/docs/API_REPORTING_SERVICE.md`
- `/frontend/IMPLEMENTATION.md`

---

## Contact & Support

For questions or issues during testing:

- Review API documentation in `/docs`
- Check backend service logs
- Verify database state with Prisma Studio
- Test APIs with Swagger UI at each service's `/api/docs` endpoint
