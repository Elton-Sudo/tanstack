# Phased Frontend Implementation Plan

## Overview

This document outlines the complete 19-week phased implementation plan for the Cybersecurity Training Platform frontend, aligned with the existing backend schema and APIs.

## Tech Stack

### Core Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (with Redux Toolkit for complex scenarios)
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + React Testing Library + Playwright

### UI Libraries

- **Charts**: Recharts / Chart.js
- **Rich Text**: Tiptap / Lexical
- **Video Player**: Video.js / Plyr
- **File Upload**: react-dropzone
- **Notifications**: sonner / react-hot-toast
- **Tables**: TanStack Table
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Real-time & Communication

- **WebSocket**: Socket.io-client
- **Alternative**: Server-Sent Events (SSE)

---

## Phase 1: Foundation & Authentication (Weeks 1-2)

### 1.1 Core Setup

- [ ] Initialize Next.js 14+ project with App Router
- [ ] Configure TypeScript with strict mode
- [ ] Set up Tailwind CSS with custom theme
- [ ] Install and configure shadcn/ui components
- [ ] Set up Zustand store structure
- [ ] Configure TanStack Query (React Query)
- [ ] Set up Axios instance with interceptors
- [ ] Configure environment variables
- [ ] Set up folder structure
- [ ] Install ESLint + Prettier

**Files to Create:**

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   └── mfa/
│   │   └── (dashboard)/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── shared/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   └── auth/            # Auth-specific components
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints/
│   │   │       └── auth.ts
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   └── tokens.ts
│   │   ├── utils/
│   │   └── validations/
│   │       └── auth.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useUser.ts
│   ├── stores/
│   │   └── authStore.ts
│   ├── types/
│   │   ├── auth.ts
│   │   └── user.ts
│   └── constants/
│       └── routes.ts
```

### 1.2 Authentication Features

#### Login System

- [ ] Login page UI with email/password fields
- [ ] Form validation with Zod schema
- [ ] API integration with auth service
- [ ] Error handling and display
- [ ] Loading states
- [ ] "Remember me" functionality
- [ ] Failed login attempt tracking
- [ ] Account lockout handling

**API Endpoints Used:**

```typescript
POST / api / auth / login;
POST / api / auth / refresh;
POST / api / auth / logout;
GET / api / auth / session;
```

#### Multi-Factor Authentication (MFA)

- [ ] MFA setup page (QR code generation)
- [ ] MFA verification page (6-digit code input)
- [ ] MFA enable/disable toggle in settings
- [ ] Backup codes generation and display
- [ ] MFA recovery flow

**Components:**

- `MFASetup.tsx`
- `MFAVerification.tsx`
- `QRCodeDisplay.tsx`
- `BackupCodes.tsx`

#### Password Management

- [ ] Forgot password page
- [ ] Password reset email trigger
- [ ] Reset password page with token validation
- [ ] Password strength indicator
- [ ] Change password in user settings
- [ ] Password history validation (prevent reuse)

#### Email Verification

- [ ] Email verification page
- [ ] Resend verification email button
- [ ] Success/error states
- [ ] Redirect to dashboard after verification

#### Session Management

- [ ] Secure token storage (httpOnly cookies)
- [ ] Automatic token refresh logic
- [ ] Session expiry handling
- [ ] Concurrent session management
- [ ] Activity timeout warning modal
- [ ] Logout functionality (all devices option)

**Middleware:**

```typescript
// middleware.ts - Route protection
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

#### Protected Routes

- [ ] Create `ProtectedRoute` HOC
- [ ] Implement role-based access control
- [ ] Redirect unauthorized users
- [ ] Show loading state during auth check
- [ ] Implement permission-based rendering

**Example Usage:**

```typescript
<ProtectedRoute
  requiredRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}
  fallback="/unauthorized"
>
  <AdminPanel />
</ProtectedRoute>
```

### 1.3 User Profile Management

- [ ] Profile view page
- [ ] Profile edit form
- [ ] Avatar upload with preview
- [ ] Crop/resize avatar functionality
- [ ] Personal information fields
- [ ] Change password section
- [ ] MFA settings section
- [ ] Login history table
- [ ] Active sessions list
- [ ] Revoke session functionality
- [ ] Delete account option

**Profile Fields:**

- First Name
- Last Name
- Email (read-only, verified badge)
- Phone Number
- Department
- Position
- Avatar

### 1.4 Deliverables Checklist

- [x] Fully functional authentication system
- [ ] Responsive layouts (mobile, tablet, desktop)
- [ ] Comprehensive error handling
- [ ] Loading states for all async operations
- [ ] Success notifications
- [ ] Form validation with clear error messages
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Unit tests for auth utilities
- [ ] Integration tests for auth flows

### 1.5 API Integration Schema

**Zod Validation Schemas:**

```typescript
// lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const mfaSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

### 1.6 Success Metrics

- [ ] Login success rate > 95%
- [ ] MFA adoption rate tracking
- [ ] Average login time < 3 seconds
- [ ] Zero security vulnerabilities
- [ ] 100% test coverage for auth flows

---

## Phase 2: Admin Dashboard & Tenant Management (Weeks 3-4)

### 2.1 Super Admin Features

#### Tenant Management Dashboard

- [ ] Tenant listing table (sortable, filterable)
- [ ] Search tenants by name, slug, email
- [ ] Status filter (Active, Suspended, Trial, Expired)
- [ ] Tenant creation wizard (multi-step form)
- [ ] Tenant detail view
- [ ] Tenant edit functionality
- [ ] Tenant suspension/reactivation
- [ ] Tenant deletion (with confirmation)
- [ ] Bulk tenant operations

**Tenant Creation Wizard Steps:**

1. Basic Information (name, slug, description)
2. Contact Details (email, phone, website, domain)
3. Branding (logo, colors, favicon)
4. Subscription Plan (plan, max users, dates)
5. Features & Settings (feature flags, custom settings)
6. Review & Create

**Components:**

- `TenantList.tsx`
- `TenantTable.tsx`
- `TenantFilters.tsx`
- `TenantCreationWizard.tsx`
- `TenantCard.tsx`
- `TenantDetailsModal.tsx`

#### Subscription Management

- [ ] Subscription plans list
- [ ] Plan comparison table
- [ ] Upgrade/downgrade tenant plan
- [ ] Subscription renewal interface
- [ ] Trial extension
- [ ] Usage metrics per tenant
- [ ] Billing history
- [ ] Invoice generation

#### Tenant Analytics Overview

- [ ] Total tenants count
- [ ] Active vs suspended tenants
- [ ] Trial conversions chart
- [ ] Subscription expiry calendar
- [ ] User capacity usage across tenants
- [ ] Revenue metrics (if applicable)
- [ ] Tenant growth chart

**Metrics Displayed:**

```typescript
interface TenantMetrics {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  trialTenants: number;
  expiredTenants: number;
  totalUsers: number;
  avgUsersPerTenant: number;
  capacityUtilization: number;
  trialConversionRate: number;
}
```

#### Tenant Configuration Editor

- [ ] JSON editor for custom settings
- [ ] Feature flags toggle UI
- [ ] Preview changes before saving
- [ ] Validation of configuration
- [ ] Configuration history/audit log

### 2.2 Tenant Admin Dashboard

#### Organization Settings

- [ ] Organization profile page
- [ ] Edit organization details
- [ ] Contact information management
- [ ] Domain configuration
- [ ] Subscription details (read-only)
- [ ] Usage statistics

#### Branding Customization

- [ ] Logo upload (with size validation)
- [ ] Primary color picker
- [ ] Secondary color picker
- [ ] Favicon upload
- [ ] Preview of branding changes
- [ ] Reset to defaults button
- [ ] Live preview of changes

**Branding Form:**

```typescript
interface BrandingSettings {
  logo: File | string;
  primaryColor: string;
  secondaryColor: string;
  favicon: File | string;
}
```

#### User Capacity Monitoring

- [ ] Current users vs max users gauge
- [ ] User growth chart
- [ ] Department breakdown
- [ ] Role distribution
- [ ] Upgrade CTA when approaching limit
- [ ] User deactivation suggestions

#### Feature Flags Management

- [ ] Feature flags list with toggle switches
- [ ] Feature descriptions
- [ ] Enable/disable features
- [ ] Feature usage analytics
- [ ] Beta features section

**Available Feature Flags:**

- Advanced Analytics
- Phishing Simulations
- Custom Branding
- API Access
- SCORM Support
- SSO Integration
- Custom Certificates
- Webhooks
- Advanced Reporting

### 2.3 Department Management

#### Department Hierarchy

- [ ] Tree view of departments
- [ ] Drag-and-drop reordering
- [ ] Expand/collapse nodes
- [ ] Department creation form
- [ ] Department edit functionality
- [ ] Department deletion (cascade options)
- [ ] Move department to new parent

**Tree Structure Component:**

```typescript
interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: Department[];
  userCount: number;
}
```

#### Department Analytics

- [ ] Users per department
- [ ] Training completion rates by department
- [ ] Average risk score by department
- [ ] Course enrollment by department
- [ ] Department comparison chart

#### User Assignment

- [ ] Assign users to departments
- [ ] Bulk user reassignment
- [ ] View department members
- [ ] Department manager assignment

### 2.4 Deliverables Checklist

- [ ] Admin portal with role-based access
- [ ] Tenant isolation enforced in all views
- [ ] Real-time subscription tracking
- [ ] Responsive admin dashboard
- [ ] Tenant switcher (for super admins)
- [ ] Activity logs for admin actions
- [ ] Export tenant data functionality
- [ ] Comprehensive admin documentation

### 2.5 API Endpoints

```typescript
// Tenant Management
GET    /api/tenants
POST   /api/tenants
GET    /api/tenants/:id
PATCH  /api/tenants/:id
DELETE /api/tenants/:id
PATCH  /api/tenants/:id/status

// Department Management
GET    /api/departments
POST   /api/departments
GET    /api/departments/:id
PATCH  /api/departments/:id
DELETE /api/departments/:id
GET    /api/departments/:id/users
```

### 2.6 Success Metrics

- [ ] Tenant creation time < 2 minutes
- [ ] Zero tenant data leakage
- [ ] Admin task completion rate > 90%
- [ ] Dashboard load time < 2 seconds

---

## Phase 3: User Management & RBAC (Weeks 5-6)

### 3.1 User Administration

#### User Listing

- [ ] User table with pagination (10/25/50/100 per page)
- [ ] Sortable columns (name, email, role, department, created date)
- [ ] Multi-filter support (role, department, status)
- [ ] Search by name, email, or ID
- [ ] User avatar display
- [ ] Status indicators (active, locked, pending verification)
- [ ] Quick actions menu (edit, delete, reset password)
- [ ] Export users to CSV
- [ ] User count and statistics

**Table Columns:**

- Avatar
- Name (First + Last)
- Email
- Role
- Department
- Last Login
- Status
- Actions

#### Bulk User Import

- [ ] CSV template download
- [ ] CSV upload with validation
- [ ] Preview import data
- [ ] Error reporting for invalid rows
- [ ] Duplicate detection
- [ ] Import progress indicator
- [ ] Import summary (success/failed counts)
- [ ] Send welcome emails option

**CSV Format:**

```csv
email,firstName,lastName,role,department,phoneNumber,position
user@example.com,John,Doe,USER,Engineering,+1234567890,Developer
```

#### Individual User Creation

- [ ] User creation form
- [ ] Email uniqueness validation
- [ ] Auto-generate temporary password option
- [ ] Send welcome email toggle
- [ ] Role selection dropdown
- [ ] Department selection
- [ ] Set user properties
- [ ] Success notification with credentials

**User Creation Form Fields:**

```typescript
interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  departmentId?: string;
  phoneNumber?: string;
  position?: string;
  sendWelcomeEmail: boolean;
  requirePasswordChange: boolean;
}
```

#### Role Assignment

- [ ] Role dropdown with descriptions
- [ ] Role hierarchy visualization
- [ ] Permission preview for selected role
- [ ] Bulk role change
- [ ] Role change audit log
- [ ] Prevent self-demotion safeguard

**Role Definitions:**

```typescript
enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN', // Full system access
  TENANT_ADMIN = 'TENANT_ADMIN', // Tenant-wide admin
  MANAGER = 'MANAGER', // Department manager
  INSTRUCTOR = 'INSTRUCTOR', // Course creation/management
  USER = 'USER', // Regular user
}
```

#### Department Assignment

- [ ] Department dropdown (hierarchical)
- [ ] Multi-department assignment (if supported)
- [ ] Bulk department reassignment
- [ ] View users by department

#### User Status Management

- [ ] Activate/deactivate users
- [ ] Lock user account (security)
- [ ] Unlock user account
- [ ] Force password reset
- [ ] Revoke all sessions
- [ ] Delete user (with data retention options)

**Status Actions:**

- Activate
- Deactivate
- Lock (after failed attempts)
- Unlock
- Force Password Reset
- Delete (Soft/Hard)

### 3.2 Access Control

#### Permission Matrix UI

- [ ] Role-permission matrix table
- [ ] Visual permission grid
- [ ] Edit permissions per role (if custom roles supported)
- [ ] Permission categories (Users, Courses, Reports, etc.)
- [ ] Permission inheritance display

**Permission Categories:**

```typescript
interface Permissions {
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  courses: {
    /* ... */
  };
  reports: {
    /* ... */
  };
  tenants: {
    /* ... */
  };
  departments: {
    /* ... */
  };
  settings: {
    /* ... */
  };
}
```

#### Role-Based Navigation

- [ ] Dynamic menu based on user role
- [ ] Hide unauthorized routes
- [ ] Show/hide features based on permissions
- [ ] Graceful handling of unauthorized access

**Navigation Structure:**

```typescript
const navigation = {
  SUPER_ADMIN: ['Dashboard', 'Tenants', 'Analytics', 'Settings'],
  TENANT_ADMIN: ['Dashboard', 'Users', 'Courses', 'Reports', 'Settings'],
  MANAGER: ['Dashboard', 'Team', 'Reports'],
  INSTRUCTOR: ['Dashboard', 'My Courses', 'Students'],
  USER: ['Dashboard', 'My Learning', 'Certificates'],
};
```

#### Feature Access Enforcement

- [ ] Frontend route guards
- [ ] Component-level permission checks
- [ ] API-level authorization (backend)
- [ ] Graceful degradation for limited access

#### Audit Log Viewer

- [ ] Audit log table (paginated)
- [ ] Filter by user, action, resource, date range
- [ ] Search functionality
- [ ] Export audit logs
- [ ] Detailed event viewer
- [ ] IP address and user agent display

**Audit Log Columns:**

- Timestamp
- User
- Action
- Resource
- Resource ID
- IP Address
- Status

### 3.3 User Dashboard

#### Personalized Homepage

- [ ] Welcome message with user name
- [ ] Quick access cards
- [ ] Personalized recommendations
- [ ] Upcoming deadlines
- [ ] Recent activity feed

#### Quick Stats

- [ ] Courses enrolled count
- [ ] Courses in progress
- [ ] Courses completed
- [ ] Certificates earned
- [ ] Total learning hours
- [ ] Current risk score (if applicable)

**Stats Card Design:**

```typescript
interface UserStats {
  enrolledCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  certificates: number;
  learningHours: number;
  riskScore?: number;
}
```

#### Recent Activity Feed

- [ ] Activity timeline
- [ ] Activity types (course started, quiz completed, certificate earned)
- [ ] Timestamps
- [ ] Action links (continue course, view certificate)
- [ ] Load more / infinite scroll

#### Notifications Center

- [ ] Notification bell icon with badge
- [ ] Dropdown notification list
- [ ] Mark as read functionality
- [ ] Mark all as read
- [ ] Notification categories
- [ ] Link to full notifications page

### 3.4 Deliverables Checklist

- [ ] Complete user management system
- [ ] RBAC enforcement across all pages
- [ ] Bulk operations support (import, role change, delete)
- [ ] Comprehensive audit logging
- [ ] Responsive user dashboard
- [ ] Fast search and filtering (< 1 second)
- [ ] User onboarding flow
- [ ] User management documentation

### 3.5 API Endpoints

```typescript
// User Management
GET    /api/users
POST   /api/users
POST   /api/users/bulk-import
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
POST   /api/users/:id/reset-password
POST   /api/users/:id/lock
POST   /api/users/:id/unlock

// Audit Logs
GET    /api/audit-logs
GET    /api/audit-logs/:id
```

### 3.6 Success Metrics

- [ ] User creation time < 30 seconds
- [ ] Bulk import success rate > 98%
- [ ] Zero unauthorized access incidents
- [ ] Audit log completeness 100%
- [ ] User satisfaction with dashboard > 4.5/5

---

## Phase 4: Course Management System (Weeks 7-9)

### 4.1 Course Builder (Instructor/Admin)

#### Course Creation Wizard

- [ ] Multi-step course creation form
- [ ] Basic information step
  - [ ] Title (required)
  - [ ] Description (rich text)
  - [ ] Category dropdown
  - [ ] Difficulty selector (Beginner/Intermediate/Advanced/Expert)
  - [ ] Duration (in minutes)
  - [ ] Thumbnail upload with preview
  - [ ] Prerequisites multi-select
  - [ ] Tags input (create/select)
  - [ ] Passing score (percentage)
  - [ ] Compliance framework multi-select

**Course Form Schema:**

```typescript
interface CourseForm {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  thumbnail?: File | string;
  prerequisites: string[];
  tags: string[];
  passingScore: number;
  complianceFrameworks: ComplianceFramework[];
}
```

#### Module/Chapter Editor

- [ ] Module list with drag-and-drop reordering
- [ ] Add module button
- [ ] Module edit inline
- [ ] Module delete with confirmation
- [ ] Chapter nested list (drag-and-drop)
- [ ] Add chapter button
- [ ] Chapter edit form
  - [ ] Title
  - [ ] Content (rich text editor)
  - [ ] Video URL or upload
  - [ ] Duration
  - [ ] Required toggle
  - [ ] Order (automatic or manual)

**Module/Chapter Structure:**

```typescript
interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isRequired: boolean;
}
```

#### Rich Text Editor

- [ ] Integrate Tiptap or Lexical
- [ ] Bold, italic, underline
- [ ] Headings (H1-H6)
- [ ] Lists (ordered, unordered)
- [ ] Links
- [ ] Images
- [ ] Code blocks
- [ ] Tables
- [ ] Embeds (YouTube, etc.)

#### Video Upload

- [ ] Video file upload (drag-and-drop)
- [ ] Upload progress indicator
- [ ] Video preview
- [ ] Transcoding status display
- [ ] Video URL input (external hosting)
- [ ] Video metadata (duration, size)

#### SCORM Package Uploader

- [ ] SCORM file upload (.zip)
- [ ] SCORM version detection (1.2 or 2004)
- [ ] Manifest validation
- [ ] Extraction progress
- [ ] SCORM player integration

#### Quiz Builder

- [ ] Add quiz to course
- [ ] Quiz settings
  - [ ] Title
  - [ ] Description
  - [ ] Passing score
  - [ ] Time limit (optional)
  - [ ] Max attempts
  - [ ] Shuffle questions toggle
  - [ ] Show results toggle
- [ ] Add question button
- [ ] Question types:
  - [ ] Multiple Choice
  - [ ] True/False
  - [ ] Short Answer
  - [ ] Essay
- [ ] Question editor:
  - [ ] Question text (rich text)
  - [ ] Question type selector
  - [ ] Options (for multiple choice)
  - [ ] Correct answer
  - [ ] Points
  - [ ] Explanation (optional)
  - [ ] Order

**Quiz Schema:**

```typescript
interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  questions: Question[];
}

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  points: number;
  explanation?: string;
  order: number;
}
```

#### Course Preview Mode

- [ ] Preview button
- [ ] Full course preview (student view)
- [ ] Navigate through modules/chapters
- [ ] Test video playback
- [ ] Test quiz functionality
- [ ] Exit preview button

#### Version Control Interface

- [ ] Version history list
- [ ] Compare versions
- [ ] Restore previous version
- [ ] Version notes/changelog
- [ ] Auto-save drafts

#### Course Status Management

- [ ] Draft status (default for new courses)
- [ ] Publish button (with validation)
- [ ] Unpublish option
- [ ] Archive course
- [ ] Duplicate course
- [ ] Delete course (with confirmation)

**Status Workflow:**

```
Draft → Published → Archived
         ↓
      Unpublished (back to Draft)
```

### 4.2 Course Catalog (User View)

#### Browse Courses

- [ ] Grid view (card layout)
- [ ] List view (table layout)
- [ ] View toggle (grid/list)
- [ ] Course card:
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Category badge
  - [ ] Difficulty badge
  - [ ] Duration
  - [ ] Rating (if available)
  - [ ] Enrolled count
  - [ ] Enroll button

#### Filter & Search

- [ ] Category filter (multi-select)
- [ ] Difficulty filter (multi-select)
- [ ] Duration filter (range slider)
- [ ] Compliance framework filter
- [ ] Tags filter
- [ ] Search by title/description
- [ ] Sort options:
  - [ ] Newest
  - [ ] Most popular
  - [ ] Shortest duration
  - [ ] Longest duration
  - [ ] Alphabetical

#### Course Detail Page

- [ ] Course banner/thumbnail
- [ ] Course title
- [ ] Category and difficulty badges
- [ ] Description (formatted)
- [ ] Prerequisites section
- [ ] Syllabus/modules accordion
- [ ] Duration display
- [ ] Passing score
- [ ] Compliance frameworks
- [ ] Tags
- [ ] Enroll button
- [ ] Already enrolled indicator
- [ ] Progress indicator (if enrolled)
- [ ] Continue button (if in progress)

#### Learning Paths Display

- [ ] Learning paths list
- [ ] Path card:
  - [ ] Title
  - [ ] Description
  - [ ] Thumbnail
  - [ ] Courses count
  - [ ] Total duration
  - [ ] Required badge
  - [ ] Enroll button
- [ ] Path detail page
- [ ] Courses in path (ordered list)
- [ ] Path progress indicator

### 4.3 Course Player

#### Video Player

- [ ] Integrate Video.js or Plyr
- [ ] Play/pause controls
- [ ] Seek bar
- [ ] Volume control
- [ ] Fullscreen toggle
- [ ] Playback speed selector
- [ ] Quality selector (if applicable)
- [ ] Subtitles/captions (if available)
- [ ] Resume from last position
- [ ] Auto-advance to next chapter

#### Chapter Navigation

- [ ] Sidebar with module/chapter list
- [ ] Current chapter highlight
- [ ] Completed chapters checkmark
- [ ] Click to jump to chapter
- [ ] Previous/Next buttons
- [ ] Module expand/collapse

#### Progress Tracking

- [ ] Progress bar (overall course)
- [ ] Chapter completion tracking
- [ ] Auto-save progress
- [ ] Sync progress to backend
- [ ] Resume functionality

#### Bookmark Functionality

- [ ] Add bookmark button
- [ ] Bookmark list sidebar
- [ ] Jump to bookmark
- [ ] Delete bookmark
- [ ] Bookmark notes

#### Note-Taking Sidebar

- [ ] Notes tab
- [ ] Add note button
- [ ] Note editor (rich text)
- [ ] Timestamp notes (video position)
- [ ] Edit/delete notes
- [ ] Search notes

#### Certificate Download

- [ ] Show certificate button (after completion)
- [ ] Certificate preview
- [ ] Download certificate (PDF)
- [ ] Share certificate link
- [ ] Certificate verification page

### 4.4 Deliverables Checklist

- [ ] Full-featured course authoring tool
- [ ] Engaging course consumption experience
- [ ] SCORM compliance
- [ ] Video transcoding support
- [ ] Mobile-responsive course player
- [ ] Offline course viewing (PWA)
- [ ] Course analytics (time spent, completion rate)
- [ ] Instructor dashboard

### 4.5 API Endpoints

```typescript
// Course Management
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PATCH  /api/courses/:id
DELETE /api/courses/:id
POST   /api/courses/:id/publish
POST   /api/courses/:id/duplicate

// Modules & Chapters
POST   /api/courses/:courseId/modules
PATCH  /api/modules/:id
DELETE /api/modules/:id
POST   /api/modules/:moduleId/chapters
PATCH  /api/chapters/:id
DELETE /api/chapters/:id

// Enrollments
GET    /api/enrollments
POST   /api/enrollments
GET    /api/enrollments/:id
PATCH  /api/enrollments/:id/progress

// Quizzes
POST   /api/courses/:courseId/quizzes
GET    /api/quizzes/:id
PATCH  /api/quizzes/:id
DELETE /api/quizzes/:id
POST   /api/quizzes/:id/questions
```

### 4.6 Success Metrics

- [ ] Course creation time < 30 minutes
- [ ] Course player load time < 3 seconds
- [ ] Video playback success rate > 99%
- [ ] Mobile course completion rate > 70%
- [ ] Instructor satisfaction > 4.5/5

---

## Phase 5: Assessment & Quiz System (Week 10)

### 5.1 Quiz Taking Interface

#### Question Display

- [ ] Question counter (e.g., "Question 3 of 10")
- [ ] Question text (formatted)
- [ ] Question type indicator
- [ ] Multiple choice options (radio buttons)
- [ ] True/False options (radio buttons)
- [ ] Short answer text input
- [ ] Essay text area (rich text)
- [ ] Image support in questions
- [ ] Code syntax highlighting (if applicable)

**Question Components:**

```typescript
<MultipleChoiceQuestion question={question} />
<TrueFalseQuestion question={question} />
<ShortAnswerQuestion question={question} />
<EssayQuestion question={question} />
```

#### Timer Display

- [ ] Countdown timer (if quiz is timed)
- [ ] Timer warning (e.g., 5 minutes remaining)
- [ ] Auto-submit on time expiration
- [ ] Pause timer (if allowed)

#### Answer Tracking

- [ ] Save answer on change
- [ ] Visual indicator for answered questions
- [ ] Auto-save answers (every 30 seconds)
- [ ] Question navigation (numbered buttons)
- [ ] Flag question for review

#### Navigation

- [ ] Previous button
- [ ] Next button
- [ ] Question navigation grid
- [ ] Jump to question
- [ ] Review answers before submit
- [ ] Submit button

#### Submit Confirmation

- [ ] Submit quiz button
- [ ] Confirmation modal
  - [ ] "Are you sure?" message
  - [ ] Unanswered questions count
  - [ ] Cancel/Confirm buttons
- [ ] Prevent accidental submission

#### Review Answers

- [ ] Review mode (if enabled)
- [ ] Show correct/incorrect indicators
- [ ] Display correct answers
- [ ] Show explanations
- [ ] Points earned per question
- [ ] Return to course button

#### Score Display

- [ ] Total score (percentage and fraction)
- [ ] Pass/fail status
- [ ] Points breakdown
- [ ] Time taken
- [ ] Congratulations/Try again message
- [ ] Retake button (if attempts remaining)
- [ ] Continue to next module button

### 5.2 Quiz Management

#### Quiz Attempt History

- [ ] Attempt history table
- [ ] Columns:
  - [ ] Attempt number
  - [ ] Date/time
  - [ ] Score
  - [ ] Pass/fail status
  - [ ] Time taken
  - [ ] View details button
- [ ] Best score highlight
- [ ] Latest attempt indicator

#### Retry Logic

- [ ] Check attempts remaining
- [ ] Display attempts count (e.g., "2 of 3 attempts")
- [ ] Disable retake if max attempts reached
- [ ] Request more attempts button (for instructors)
- [ ] Reset quiz attempts (admin)

#### Grading Interface (Essay Questions)

- [ ] Pending grading queue
- [ ] Student answer display
- [ ] Points input field
- [ ] Feedback text area
- [ ] Save grade button
- [ ] Next submission button
- [ ] Grading rubric display (if available)

**Grading Component:**

```typescript
interface GradingProps {
  submission: QuizAttempt;
  question: Question;
  onGrade: (points: number, feedback: string) => void;
}
```

#### Quiz Analytics (Instructors)

- [ ] Average score
- [ ] Pass rate
- [ ] Question difficulty analysis
- [ ] Common wrong answers
- [ ] Time to complete (average)
- [ ] Attempt distribution chart

### 5.3 Learning Path Progress

#### Path Completion Tracking

- [ ] Learning path progress bar
- [ ] Courses completed count
- [ ] Required courses indicator
- [ ] Optional courses indicator
- [ ] Overall path percentage
- [ ] Estimated time to completion

**Path Progress Display:**

```typescript
interface PathProgress {
  pathId: string;
  totalCourses: number;
  completedCourses: number;
  requiredCourses: number;
  completedRequiredCourses: number;
  percentage: number;
}
```

#### Path Certificate Issuance

- [ ] Certificate eligibility check
- [ ] Generate path certificate
- [ ] Path certificate template (different from course certificate)
- [ ] Path certificate download
- [ ] Path certificate verification

### 5.4 Deliverables Checklist

- [ ] Robust assessment engine
- [ ] Fair attempt tracking
- [ ] Instant feedback mechanism
- [ ] Support for all question types
- [ ] Anti-cheating measures (timer, randomization)
- [ ] Mobile-friendly quiz interface
- [ ] Instructor grading tools
- [ ] Quiz analytics dashboard

### 5.5 API Endpoints

```typescript
// Quiz Taking
GET    /api/quizzes/:id/start
POST   /api/quizzes/:id/submit
GET    /api/quiz-attempts/:id
PATCH  /api/quiz-attempts/:id/answers

// Quiz Management
GET    /api/users/:userId/quiz-attempts
POST   /api/quiz-attempts/:id/grade

// Learning Paths
GET    /api/learning-paths
GET    /api/learning-paths/:id
GET    /api/learning-paths/:id/progress
```

### 5.6 Success Metrics

- [ ] Quiz completion rate > 80%
- [ ] Average time to complete quiz < 20 minutes
- [ ] Auto-save success rate > 99.9%
- [ ] Grading turnaround time < 24 hours
- [ ] Zero lost quiz submissions

---

## Phases 6-11 Summary

### Phase 6: Analytics & Risk Scoring (Weeks 11-12)

- User risk dashboard with score breakdown
- Admin analytics (executive dashboard, user progress, training effectiveness)
- Phishing simulation tracker
- Risk heatmaps and trend charts
- Actionable recommendations engine

### Phase 7: Notification System (Week 13)

- In-app notification center with real-time updates
- Notification preferences management
- Multi-channel notifications (email, SMS, push, in-app)
- Notification templates (admin)
- Device token management for push notifications

### Phase 8: Reporting & Compliance (Weeks 14-15)

- Report generator (multiple types and formats)
- Report scheduler (automated reports)
- Compliance tracking (framework coverage)
- Certificate management
- Audit trail viewer

### Phase 9: Integration & API Management (Week 16)

- API key dashboard (generation, revocation, usage)
- Webhook configuration and testing
- External integrations (HRIS, LMS, SSO, BI tools)
- Integration monitoring

### Phase 10: Advanced Features & Polish (Weeks 17-18)

- Gamification (badges, leaderboards, points)
- Advanced search (global, saved searches)
- Accessibility (WCAG 2.1 AA compliance)
- Performance optimization (code splitting, lazy loading)
- Mobile responsiveness and PWA
- Internationalization (i18n)

### Phase 11: Testing & Deployment (Week 19)

- Unit tests (Vitest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)
- Accessibility tests
- Performance testing
- CI/CD pipeline setup
- Docker containerization
- Deployment to production
- Documentation (user guides, admin manual, API docs)

---

## Key Architecture Patterns

### 1. Folder Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth routes
│   │   ├── (dashboard)/       # Protected routes
│   │   └── api/               # API routes (if needed)
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── shared/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature-specific components
│   ├── lib/
│   │   ├── api/               # API client & hooks
│   │   ├── auth/              # Auth utilities
│   │   ├── utils/             # Helper functions
│   │   └── validations/       # Zod schemas
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── constants/             # App constants
│   └── middleware.ts          # Next.js middleware
├── public/
│   ├── images/
│   └── fonts/
├── e2e/                       # E2E tests
├── tests/                     # Unit/integration tests
└── [config files]
```

### 2. Data Fetching Pattern (React Query)

```typescript
// hooks/useCourses.ts
export const useCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.courses.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.courses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
```

### 3. Form Handling Pattern

```typescript
// Using React Hook Form + Zod
const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
});

type FormData = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### 4. Role-Based Rendering

```typescript
// components/ProtectedRoute.tsx
<ProtectedRoute requiredRoles={['TENANT_ADMIN', 'SUPER_ADMIN']}>
  <TenantManagement />
</ProtectedRoute>

// Component-level
{hasPermission('courses.create') && <CreateCourseButton />}
```

### 5. Error Handling Pattern

```typescript
// lib/api/client.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      router.push('/auth/login');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    return Promise.reject(error);
  },
);
```

---

## Priority Features for MVP (Phases 1-5)

If launching quickly is critical, focus on:

1. **Phase 1**: Authentication (2 weeks)
2. **Phase 2**: Basic admin dashboard - core only (1 week)
3. **Phase 3**: User management - core only (1 week)
4. **Phase 4**: Course catalog & player - simplified (2 weeks)
5. **Phase 5**: Basic quiz system (1 week)

**Total MVP Timeline**: 7 weeks

Then iterate with:

- Analytics
- Notifications
- Advanced features

---

## Success Metrics to Track

### User Engagement

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Pages per session
- Return user rate

### Training Effectiveness

- Course completion rate
- Quiz pass rate
- Average quiz score
- Time to course completion
- Certificate issuance rate

### Risk Reduction

- Average risk score trend
- High-risk user count
- Phishing click rate reduction
- Security incident reduction

### System Performance

- Page load time (target: < 3 seconds)
- API response time (target: < 500ms)
- Error rate (target: < 1%)
- Uptime (target: > 99.9%)

### User Satisfaction

- Net Promoter Score (NPS)
- Feature adoption rate
- Support ticket volume
- User feedback scores

---

## Next Steps

1. Review and approve this phased plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish CI/CD pipeline early
5. Set up monitoring and analytics
6. Regular sprint reviews (weekly/bi-weekly)
7. User testing after each phase
8. Iterative improvements based on feedback

---

**Document Version**: 1.0
**Last Updated**: November 20, 2025
**Status**: Planning Phase
