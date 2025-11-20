# Next Steps - Phase 2 Implementation Plan

## ✅ Completed (Phase 1 - Authentication)

### Core Setup

- ✅ Next.js 14+ project with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS with custom theme
- ✅ shadcn/ui components installed
- ✅ Zustand store structure
- ✅ TanStack Query (React Query) configured
- ✅ Axios instance with interceptors
- ✅ Environment variables setup
- ✅ Folder structure established
- ✅ ESLint + Prettier configured

### Authentication Features

- ✅ Login form with validation
- ✅ Registration form with email verification
- ✅ Forgot password flow
- ✅ Reset password with token validation
- ✅ MFA verification
- ✅ Email verification
- ✅ JWT token management
- ✅ Protected route middleware
- ✅ Role-based access control (admin routes)
- ✅ Session expiration handling
- ✅ Theme system (light/dark mode)
- ✅ Dynamic brand colors
- ✅ Logo integration

---

## 🚀 Phase 2: Dashboard Layout & Tenant Management (Weeks 3-4)

### Priority 1: Dashboard Layout Foundation

#### 2.1 Layout Components (Week 3, Days 1-2)

**Goal**: Create the main dashboard layout structure that all protected pages will use.

**Tasks**:

- [ ] Create responsive sidebar component
  - Navigation menu with icons
  - Collapsible/expandable functionality
  - Active route highlighting
  - Multi-level menu support (parent/child items)
  - User profile section at bottom

- [ ] Create top header/navbar component
  - Search bar (global search)
  - Notifications dropdown
  - User avatar with dropdown menu
  - Theme toggle (already exists, integrate)
  - Breadcrumb navigation

- [ ] Create main dashboard layout wrapper
  - Sidebar + content area
  - Responsive behavior (mobile drawer)
  - Loading states
  - Error boundaries

- [ ] Create footer component (optional)
  - Copyright info
  - Quick links
  - Version info

**Files to Create**:

```
src/components/layout/
├── DashboardLayout.tsx          # Main layout wrapper
├── Sidebar.tsx                  # Navigation sidebar
├── Navbar.tsx                   # Top navigation bar
├── MobileSidebar.tsx           # Mobile drawer
├── UserMenu.tsx                # User dropdown menu
├── NotificationsDropdown.tsx   # Notifications bell
└── SearchBar.tsx               # Global search

src/hooks/
├── useNavigation.ts            # Navigation state
└── useSidebar.ts              # Sidebar state (collapsed/expanded)
```

**Component APIs**:

```typescript
// DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

// Sidebar.tsx
interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  children?: SidebarItem[];
  requiredRole?: string[];
}

// Navbar.tsx
interface NavbarProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}
```

#### 2.2 Navigation Structure (Week 3, Days 3-4)

**Tasks**:

- [ ] Define navigation menu structure
- [ ] Implement role-based menu filtering
- [ ] Add keyboard navigation (Cmd+K for search)
- [ ] Create navigation constants/config
- [ ] Add route guards with ProtectedRoute component

**Navigation Menu Items**:

```typescript
const navigationItems: SidebarItem[] = [
  // Dashboard
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },

  // Learning
  {
    id: 'learning',
    label: 'Learning',
    icon: BookOpen,
    children: [
      { id: 'courses', label: 'All Courses', href: '/courses' },
      { id: 'my-courses', label: 'My Courses', href: '/my-courses' },
      { id: 'learning-paths', label: 'Learning Paths', href: '/learning-paths' },
    ],
  },

  // Assessments
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheck, href: '/assessments' },

  // Certificates
  { id: 'certificates', label: 'Certificates', icon: Award, href: '/certificates' },

  // Reports (Admin/Manager only)
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    href: '/reports',
    requiredRole: ['TENANT_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
  },

  // Users (Admin only)
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/users',
    requiredRole: ['TENANT_ADMIN', 'SUPER_ADMIN'],
  },

  // Settings
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];
```

#### 2.3 Dashboard Home Page (Week 3, Day 5)

**Tasks**:

- [ ] Create dashboard home page with key metrics
- [ ] Display user's active courses
- [ ] Show recent activity
- [ ] Display compliance status
- [ ] Add quick action cards
- [ ] Integrate with existing dashboard page

**Metrics to Display**:

- Courses in progress
- Courses completed
- Certificates earned
- Compliance score
- Upcoming deadlines
- Recent achievements

### Priority 2: Tenant Management (Week 4)

#### 2.4 Tenant Settings Page (Week 4, Days 1-2)

**Tasks**:

- [ ] Create tenant settings page (admin only)
- [ ] Organization profile form
  - Tenant name
  - Logo upload
  - Favicon upload
  - Primary/secondary colors (integrate BrandColorPicker)
  - Contact information

- [ ] Branding preview
- [ ] Save/update tenant settings API integration
- [ ] Success/error handling

**Files**:

```
src/app/(dashboard)/admin/tenant/
├── page.tsx                    # Tenant settings page
└── components/
    ├── TenantProfileForm.tsx
    ├── BrandingSettings.tsx
    └── TenantPreview.tsx

src/lib/api/endpoints/
└── tenant.ts                   # Tenant API endpoints

src/hooks/
└── useTenant.ts               # Tenant management hooks
```

#### 2.5 Multi-Tenant Support (Week 4, Days 3-5)

**Tasks**:

- [ ] Implement tenant context provider
- [ ] Apply tenant branding dynamically
- [ ] Tenant-specific routing/subdomain support (if needed)
- [ ] Tenant switching for super admins
- [ ] Tenant isolation in API calls

---

## 📦 Phase 3: User Management (Week 5)

### 3.1 User List & Table (Days 1-3)

**Tasks**:

- [ ] Create users page with TanStack Table
- [ ] Implement filters (role, status, department)
- [ ] Add search functionality
- [ ] Pagination support
- [ ] Bulk actions (activate, deactivate, delete)
- [ ] Export users to CSV

**Features**:

- Sort by columns
- Column visibility toggle
- Row selection
- Quick actions menu per row

### 3.2 User Management Forms (Days 4-5)

**Tasks**:

- [ ] Create new user form
- [ ] Edit user form
- [ ] Assign roles
- [ ] Assign to departments
- [ ] Assign courses
- [ ] User profile view page

---

## 🎯 Phase 4: Course Management (Weeks 6-7)

### 4.1 Course List & Catalog (Week 6, Days 1-3)

**Tasks**:

- [ ] Create course catalog page
- [ ] Course cards with progress indicators
- [ ] Filter by category, difficulty, status
- [ ] Search courses
- [ ] Course enrollment

### 4.2 Course Player (Week 6, Days 4-5)

**Tasks**:

- [ ] Create course player page
- [ ] Video player integration (Video.js)
- [ ] Course content navigation
- [ ] Progress tracking
- [ ] Lesson completion

### 4.3 Course Management (Admin) (Week 7)

**Tasks**:

- [ ] Create/edit course forms
- [ ] Upload course materials
- [ ] Manage lessons and modules
- [ ] Quiz creation interface
- [ ] Course publishing workflow

---

## 📊 Phase 5: Analytics & Reporting (Week 8)

### 5.1 Analytics Dashboard (Days 1-3)

**Tasks**:

- [ ] User progress analytics
- [ ] Course completion charts
- [ ] Engagement metrics
- [ ] Time-based analytics

### 5.2 Custom Reports (Days 4-5)

**Tasks**:

- [ ] Report builder interface
- [ ] Pre-defined report templates
- [ ] Export reports (PDF, CSV)
- [ ] Schedule automated reports

---

## 🔔 Phase 6: Notifications & Real-time Features (Week 9)

### 6.1 Notifications System

**Tasks**:

- [ ] Notification center page
- [ ] Real-time notifications (WebSocket)
- [ ] Notification preferences
- [ ] Mark as read/unread
- [ ] Browser push notifications

### 6.2 Real-time Updates

**Tasks**:

- [ ] Live course enrollment updates
- [ ] Real-time progress tracking
- [ ] Online user presence
- [ ] Live chat support (if needed)

---

## 🎨 Phase 7: UI/UX Enhancements (Week 10)

### 7.1 Polish & Refinement

**Tasks**:

- [ ] Loading skeletons for all pages
- [ ] Empty states with illustrations
- [ ] Error states with retry actions
- [ ] Smooth transitions and animations
- [ ] Accessibility improvements (ARIA labels)
- [ ] Keyboard shortcuts guide

### 7.2 Mobile Optimization

**Tasks**:

- [ ] Mobile-responsive design for all pages
- [ ] Touch-friendly interactions
- [ ] Mobile navigation drawer
- [ ] Responsive tables and charts

---

## 🧪 Phase 8: Testing & Quality Assurance (Week 11)

### 8.1 Unit Tests

**Tasks**:

- [ ] Component unit tests (Vitest)
- [ ] Hook tests
- [ ] Utility function tests
- [ ] API client tests

### 8.2 Integration Tests

**Tasks**:

- [ ] Auth flow tests
- [ ] User management tests
- [ ] Course enrollment tests

### 8.3 E2E Tests

**Tasks**:

- [ ] Critical user journeys (Playwright)
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## 🚀 Phase 9: Performance & Optimization (Week 12)

### 9.1 Performance Optimization

**Tasks**:

- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Bundle size analysis
- [ ] Lighthouse audit improvements

### 9.2 Caching Strategy

**Tasks**:

- [ ] React Query cache configuration
- [ ] Browser caching headers
- [ ] Service worker (PWA)

---

## 📚 Phase 10: Documentation (Week 13)

### 10.1 Developer Documentation

**Tasks**:

- [ ] Component documentation (Storybook)
- [ ] API documentation
- [ ] Architecture documentation
- [ ] Deployment guide

### 10.2 User Documentation

**Tasks**:

- [ ] User guide
- [ ] Admin guide
- [ ] Video tutorials

---

## 🎯 Immediate Next Actions (This Week)

### High Priority (Must Do)

1. **Create DashboardLayout component** (2-3 hours)
   - Sidebar with navigation
   - Top navbar with search and notifications
   - Responsive behavior
   - Integrate ProtectedRoute

2. **Update existing dashboard page** (1 hour)
   - Wrap with DashboardLayout
   - Add key metrics cards
   - Add recent activity section

3. **Create navigation configuration** (1 hour)
   - Define menu items with roles
   - Create navigation constants
   - Implement role-based filtering

4. **Build Sidebar component** (2-3 hours)
   - Navigation items with icons
   - Active state highlighting
   - Collapse/expand functionality
   - Mobile drawer

5. **Create Navbar component** (2 hours)
   - Search bar
   - Notifications dropdown
   - User menu dropdown
   - Breadcrumbs

### Medium Priority (Should Do)

6. **Tenant settings page** (3-4 hours)
   - Organization profile form
   - Branding settings
   - Integration with BrandColorPicker

7. **Users list page** (4-5 hours)
   - TanStack Table setup
   - Filters and search
   - Pagination

### Low Priority (Nice to Have)

8. **Notifications system** (TBD)
9. **Analytics dashboard** (TBD)
10. **Advanced reporting** (TBD)

---

## 🎨 Design System Enhancements Needed

### New Components to Create

- **Sidebar**: Navigation sidebar with multi-level support
- **Navbar**: Top navigation bar
- **SearchBar**: Global search with command palette (Cmd+K)
- **NotificationBell**: Notification dropdown with badge
- **UserMenu**: User avatar dropdown
- **MetricCard**: Dashboard metric display cards
- **DataTable**: Reusable table component with TanStack Table
- **EmptyState**: Placeholder for empty data
- **LoadingSkeleton**: Loading placeholders
- **ErrorState**: Error handling UI

### Icons Needed

- Already using Lucide React ✅
- Additional icons for navigation menu

---

## 📝 Technical Debt to Address

1. **API Integration**
   - Connect all auth hooks to real backend APIs
   - Test token refresh mechanism
   - Error handling consistency

2. **Type Safety**
   - Remove `as any` type assertions
   - Create proper types for all API responses
   - Add JSDoc comments for complex functions

3. **Testing**
   - Add unit tests for critical components
   - Set up E2E testing with Playwright
   - Create test data factories

4. **Performance**
   - Implement code splitting
   - Add loading states everywhere
   - Optimize bundle size

---

## 🎯 Success Metrics

### Phase 2 Goals

- [ ] Dashboard layout fully functional
- [ ] Navigation works with role-based access
- [ ] Tenant settings can be updated
- [ ] Responsive design works on mobile
- [ ] Zero TypeScript errors
- [ ] Build time under 60 seconds

### Phase 3+ Goals

- [ ] All CRUD operations functional
- [ ] Real-time updates working
- [ ] Analytics dashboard complete
- [ ] Test coverage > 70%
- [ ] Lighthouse score > 90

---

**Status**: Ready to start Phase 2 - Dashboard Layout & Tenant Management
**Estimated Time**: 2 weeks
**Dependencies**: Phase 1 Complete ✅
