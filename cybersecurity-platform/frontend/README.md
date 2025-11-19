# Cybersecurity Training Platform - Frontend

Modern, responsive Next.js frontend for the Enterprise Cybersecurity Training Platform with shadcn/ui components, Axios for API communication, and comprehensive state management.

## 🎯 Project Scope

### Core Features

#### Public Pages

- **Landing Page** (`/`) - Marketing page with platform features
- **Login** (`/login`) - Email/password authentication with MFA support
- **Register** (`/register`) - New user registration
- **Forgot Password** (`/forgot-password`) - Password reset flow
- **Reset Password** (`/reset-password`) - Password reset with token

#### Private Pages (Authenticated)

##### Dashboard & Analytics

- **Dashboard** (`/dashboard`) - Executive dashboard with metrics
  - Total users, active users, completion rates
  - Risk scores and phishing metrics
  - Department performance charts
  - Trend analysis graphs
- **My Progress** (`/my-progress`) - Personal learning progress
- **Analytics** (`/analytics`) - Advanced analytics and insights

##### Course Management

- **Course Catalog** (`/courses`) - Browse all available courses
- **Course Details** (`/courses/[id]`) - Individual course page
- **My Courses** (`/my-courses`) - Enrolled courses dashboard
- **Learning Paths** (`/learning-paths`) - Structured learning journeys
- **Quiz/Assessment** (`/courses/[id]/quiz`) - Interactive assessments

##### Risk & Compliance

- **Risk Dashboard** (`/risk`) - Risk score overview
- **Compliance Reports** (`/compliance`) - Compliance framework tracking
- **Phishing Simulations** (`/phishing`) - Simulated phishing campaigns

##### Reporting

- **Reports** (`/reports`) - Generate and download reports
- **Report Builder** (`/reports/builder`) - Custom report creation
- **Scheduled Reports** (`/reports/schedules`) - Automated reporting

##### Administration (Admin/Manager roles)

- **User Management** (`/admin/users`) - User CRUD operations
- **Course Management** (`/admin/courses`) - Course creation/editing
- **Department Management** (`/admin/departments`) - Organization structure
- **Tenant Settings** (`/admin/settings`) - Tenant configuration
- **Integration Settings** (`/admin/integrations`) - External integrations

##### User Profile

- **Profile** (`/profile`) - View/edit user profile
- **Settings** (`/settings`) - User preferences and security
- **Notifications** (`/notifications`) - System notifications
- **Certificates** (`/certificates`) - Earned certificates

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Type Safety**: TypeScript

### Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Executive dashboard
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Course catalog (list)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Course details (view)
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx  # Edit course (admin)
│   │   │   │       └── quiz/
│   │   │   │           └── page.tsx  # Take quiz
│   │   │   ├── my-courses/
│   │   │   │   └── page.tsx          # My enrolled courses
│   │   │   ├── learning-paths/
│   │   │   │   ├── page.tsx          # Learning paths list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Learning path details (view)
│   │   │   ├── risk/
│   │   │   │   └── page.tsx          # Risk dashboard
│   │   │   ├── compliance/
│   │   │   │   └── page.tsx          # Compliance overview
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx          # Reports list
│   │   │   │   ├── builder/
│   │   │   │   │   └── page.tsx      # Create custom report
│   │   │   │   ├── schedules/
│   │   │   │   │   ├── page.tsx      # Scheduled reports list
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx  # Create schedule
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx  # View schedule
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx  # Edit schedule
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # View report
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx          # View/edit profile
│   │   │   │   └── security/
│   │   │   │       └── page.tsx      # Security settings (MFA)
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # User preferences
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx          # Notifications list
│   │   │   └── certificates/
│   │   │       ├── page.tsx          # Certificates list
│   │   │       └── [id]/
│   │   │           └── page.tsx      # View certificate
│   │   ├── (admin)/                  # Admin-only routes
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   └── admin/
│   │   │       ├── users/
│   │   │       │   ├── page.tsx      # Users list
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx  # Create user
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx  # View user details
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx  # Edit user
│   │   │       ├── courses/
│   │   │       │   ├── page.tsx      # Courses list (admin)
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx  # Create course
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx  # Course management view
│   │   │       │       ├── edit/
│   │   │       │       │   └── page.tsx  # Edit course
│   │   │       │       └── modules/
│   │   │       │           ├── new/
│   │   │       │           │   └── page.tsx  # Add module
│   │   │       │           └── [moduleId]/
│   │   │       │               └── edit/
│   │   │       │                   └── page.tsx  # Edit module
│   │   │       ├── departments/
│   │   │       │   ├── page.tsx      # Departments list
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx  # Create department
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx  # View department
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx  # Edit department
│   │   │       ├── learning-paths/
│   │   │       │   ├── page.tsx      # Learning paths list (admin)
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx  # Create learning path
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx  # View learning path
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx  # Edit learning path
│   │   │       ├── integrations/
│   │   │       │   ├── page.tsx      # Integrations list
│   │   │       │   └── [type]/
│   │   │       │       └── page.tsx  # Configure integration
│   │   │       └── settings/
│   │   │           ├── page.tsx      # Tenant settings overview
│   │   │           ├── general/
│   │   │           │   └── page.tsx  # General settings
│   │   │           ├── branding/
│   │   │           │   └── page.tsx  # Branding customization
│   │   │           └── security/
│   │   │               └── page.tsx  # Security policies
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page (redirects)
│   │   ├── providers.tsx             # Global providers
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── metrics-card.tsx
│   │   │   ├── progress-chart.tsx
│   │   │   └── risk-gauge.tsx
│   │   ├── courses/                  # Course components
│   │   │   ├── course-card.tsx
│   │   │   ├── course-list.tsx
│   │   │   ├── module-viewer.tsx
│   │   │   └── quiz-component.tsx
│   │   ├── reports/                  # Report components
│   │   │   ├── report-builder.tsx
│   │   │   ├── report-preview.tsx
│   │   │   └── chart-selector.tsx
│   │   └── auth/                     # Auth components
│   │       ├── login-form.tsx
│   │       ├── register-form.tsx
│   │       └── mfa-dialog.tsx
│   │
│   ├── lib/                          # Core utilities
│   │   ├── api-client.ts             # Axios configuration
│   │   ├── auth.ts                   # Auth helpers
│   │   └── utils.ts                  # General utilities
│   │
│   ├── services/                     # API services
│   │   ├── auth.service.ts           # Authentication
│   │   ├── course.service.ts         # Courses & enrollments
│   │   ├── user.service.ts           # User management
│   │   ├── analytics.service.ts      # Analytics & reporting
│   │   ├── notification.service.ts   # Notifications
│   │   └── tenant.service.ts         # Tenant management
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts               # Auth hook
│   │   ├── use-courses.ts            # Course queries
│   │   ├── use-enrollments.ts        # Enrollment queries
│   │   ├── use-analytics.ts          # Analytics queries
│   │   └── use-debounce.ts           # Utility hooks
│   │
│   ├── store/                        # Zustand stores
│   │   ├── auth.store.ts             # Auth state
│   │   ├── ui.store.ts               # UI state (sidebar, modals)
│   │   └── filter.store.ts           # Filter state
│   │
│   ├── types/                        # TypeScript types
│   │   ├── auth.ts                   # Auth types
│   │   ├── course.ts                 # Course types
│   │   ├── user.ts                   # User types
│   │   ├── analytics.ts              # Analytics types
│   │   └── enums.ts                  # Enums
│   │
│   └── utils/                        # Helper functions
│       ├── formatters.ts             # Data formatters
│       ├── validators.ts             # Validation helpers
│       └── constants.ts              # App constants
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                        # Environment variables
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies

```

## 🔐 Authentication & Authorization

### Route Protection

- **Middleware**: Next.js middleware for route protection
- **Auth Guard**: HOC for protected pages
- **Role-based Access**: Different UI/routes based on user role

### Role Hierarchy

1. **SUPER_ADMIN**: Full platform access
2. **TENANT_ADMIN**: Tenant-wide administration
3. **MANAGER**: Department management
4. **INSTRUCTOR**: Course management
5. **USER**: Basic course access

## 🎨 UI Components (shadcn/ui)

### Core Components

- Button, Input, Select, Checkbox, Radio
- Card, Dialog, Sheet, Popover, Dropdown
- Table, DataTable, Pagination
- Form, FormField, FormMessage
- Tabs, Accordion, Collapsible
- Toast, Alert, Badge, Progress
- Avatar, Calendar, DatePicker
- Command, Combobox, Search

### Custom Components

- MetricsCard - Dashboard metrics display
- ProgressChart - Training progress visualization
- RiskGauge - Risk score visualization
- CourseCard - Course preview card
- EnrollmentStatus - Status badges
- CertificateBadge - Certificate display
- NotificationPanel - Notification list
- ReportBuilder - Interactive report creator

## 📊 Data Fetching Strategy

### TanStack Query (React Query)

```typescript
// Example: Fetching courses
const { data, isLoading, error } = useQuery({
  queryKey: ['courses', filters],
  queryFn: () => courseService.getCourses(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Example: Enrolling in course
const mutation = useMutation({
  mutationFn: (courseId: string) => courseService.enrollCourse(courseId),
  onSuccess: () => {
    queryClient.invalidateQueries(['enrollments']);
    toast.success('Successfully enrolled!');
  },
});
```

### Cache Management

- Automatic background refetching
- Optimistic updates for mutations
- Cache invalidation on success
- Error handling with retry logic

## 🔌 API Integration

### Service Architecture

Each microservice has a dedicated service file:

```typescript
// Auth Service (Port 3001)
authService.login();
authService.register();
authService.getProfile();

// Course Service (Port 3004)
courseService.getCourses();
courseService.enrollCourse();
courseService.getModules();

// Reporting Service (Port 3007)
analyticsService.getDashboardMetrics();
analyticsService.generateReport();
analyticsService.getComplianceMetrics();
```

### Error Handling

- Global error interceptor
- Toast notifications for errors
- Retry logic for failed requests
- 401 → Automatic logout and redirect

## 🎯 Key Features Implementation

### 1. Dashboard

- Real-time metrics using polling/SSE
- Interactive charts with Recharts
- Filterable by date range and department
- Export functionality (PDF/Excel)

### 2. Course Learning

- Video player integration
- Progress tracking
- Interactive quizzes
- Certificate generation

### 3. Risk Assessment

- Visual risk score gauge
- Trend charts
- Detailed breakdown by category
- Actionable recommendations

### 4. Reporting

- Report builder with drag-drop
- Multiple export formats
- Scheduled reports
- Template management

### 5. Administration

- User CRUD with search/filter
- Bulk operations
- Role assignment
- Department hierarchy

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
# Open http://localhost:3010
```

### Build

```bash
npm run build
npm start
```

### Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVICE=http://localhost:3001
NEXT_PUBLIC_COURSE_SERVICE=http://localhost:3004
NEXT_PUBLIC_REPORTING_SERVICE=http://localhost:3007
# ... other services
```

## 🧪 Testing & Demo Accounts

### Seeded Test Accounts

The platform comes with pre-seeded accounts for testing different roles:

| Role         | Email                   | Password     | Access Level                        |
| ------------ | ----------------------- | ------------ | ----------------------------------- |
| Super Admin  | superadmin@platform.com | Password123! | Full platform access, all tenants   |
| Tenant Admin | admin@acme.com          | Password123! | Full tenant access, user management |
| Manager      | manager@acme.com        | Password123! | Department management, reporting    |
| User         | user1@acme.com          | Password123! | Course access, personal dashboard   |

**Additional Users:**

- `user2@acme.com` through `user10@acme.com` (all Password123!) - Regular users with various course enrollments

### Testing Scenarios

**Login Flow:**

```bash
# Test with different roles to see role-based UI differences
# Super Admin sees all tenants and global settings
# Tenant Admin sees admin panel and user management
# Manager sees department reports and analytics
# User sees personal dashboard and course catalog
```

**Quick Start Testing:**

1. Login as `superadmin@platform.com`
2. Navigate to `/dashboard` - See executive metrics
3. Switch to `admin@acme.com` - Test user management at `/admin/users`
4. Switch to `user1@acme.com` - Test course enrollment at `/courses`

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- **Adaptive Layouts**: Different layouts for different screen sizes
- **Touch Optimized**: Touch-friendly UI elements

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance (WCAG 2.1)

## 🧪 Testing Strategy

- **Unit Tests**: Vitest for component testing
- **Integration Tests**: Testing Library
- **E2E Tests**: Playwright
- **Type Safety**: TypeScript strict mode

## 📈 Performance Optimization

- Code splitting and lazy loading
- Image optimization (Next.js Image)
- Bundle size optimization
- Caching strategies
- Memoization for expensive operations

## 🔒 Security

- XSS protection
- CSRF tokens
- Secure HTTP headers
- Content Security Policy
- Input validation and sanitization

## 📦 Deployment

- **Vercel**: Recommended for Next.js
- **Docker**: Containerized deployment
- **Static Export**: For CDN hosting
- **Environment-specific builds**

## 🛠️ Development Guidelines

### Code Style

- ESLint + Prettier
- TypeScript strict mode
- Consistent naming conventions
- Component composition over inheritance

### Git Workflow

- Feature branches
- Conventional commits
- Pull request reviews
- Automated CI/CD

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 👥 Team Collaboration

- Storybook for component documentation
- Shared design system
- API contract testing
- Regular code reviews
