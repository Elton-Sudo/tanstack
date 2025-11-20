# Frontend Quick Start Guide

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── layout.tsx       # Auth layout
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── layout.tsx       # Dashboard layout wrapper
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── courses/         # Course catalog
│   │   │   ├── my-courses/      # User enrollments
│   │   │   └── risk/            # Risk assessment
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Root page (redirects)
│   │   └── providers.tsx        # Global providers
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   └── courses/             # Course-specific components
│   ├── lib/                     # Utilities and helpers
│   ├── services/                # API services
│   ├── store/                   # State management
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🎨 Brand Colors

Use these brand colors throughout the application:

```tsx
// Tailwind classes
className="bg-brand-blue"     // #3FA9DD - Primary
className="bg-brand-green"    // #8DC63F - Success
className="bg-brand-orange"   // #F7B239 - Warning
className="bg-brand-red"      // #E55934 - Danger

// CSS variables
style={{ color: 'var(--brand-blue)' }}
```

## 🧩 Component Usage

### Layout Components

```tsx
import { DashboardLayout } from '@/components/layout';

export default function MyPage() {
  return (
    <DashboardLayout>
      {/* Your content */}
    </DashboardLayout>
  );
}
```

### UI Components

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Button variant="default" size="md">Click me</Button>

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

### Dashboard Components

```tsx
import { MetricCard, RiskGauge, ProgressTracker } from '@/components/dashboard';
import { Users } from 'lucide-react';

<MetricCard
  title="Active Users"
  value="2,543"
  change="+12.5%"
  trend="up"
  icon={Users}
  iconColor="brand-blue"
/>

<RiskGauge score={68} size="md" showLabel />

<ProgressTracker
  current={6}
  total={8}
  label="Course Progress"
  showPercentage
/>
```

### Course Components

```tsx
import { CourseCard } from '@/components/courses';

<CourseCard
  course={{
    id: 1,
    title: "Phishing Awareness Training",
    description: "Learn to identify and prevent phishing attacks",
    duration: "2 hours",
    enrolled: 245,
    rating: 4.8,
    level: "Beginner",
    category: "Email Security"
  }}
  onEnroll={(id) => console.log('Enroll:', id)}
/>
```

## 🎯 Page Routes

### Public Routes
- `/` - Home (redirects to `/dashboard`)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

### Protected Routes
- `/dashboard` - Main dashboard
- `/courses` - Course catalog
- `/my-courses` - User's enrolled courses
- `/risk` - Risk assessment dashboard
- `/compliance` - Compliance tracking (to be implemented)
- `/reports` - Reports (to be implemented)
- `/analytics` - Analytics (to be implemented)
- `/settings` - User settings (to be implemented)
- `/profile` - User profile (to be implemented)

### Admin Routes
- `/admin/users` - User management (to be implemented)
- `/admin/courses` - Course management (to be implemented)
- `/admin/settings` - Tenant settings (to be implemented)

## 🔧 Development Tips

### Adding a New Page

1. Create the page file in the appropriate route group:
```bash
# Protected page
touch src/app/(dashboard)/my-page/page.tsx

# Public page
touch src/app/(auth)/my-auth-page/page.tsx
```

2. Use the layout automatically:
```tsx
// src/app/(dashboard)/my-page/page.tsx
export default function MyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Page</h1>
      {/* Content */}
    </div>
  );
}
```

### Creating a Component

```tsx
// src/components/my-component.tsx
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
```

### Using Icons

```tsx
import { Users, BookOpen, AlertTriangle } from 'lucide-react';

<Users className="h-5 w-5 text-brand-blue" />
<BookOpen className="h-6 w-6" />
<AlertTriangle className="h-4 w-4 text-brand-red" />
```

### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>

<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🎨 Styling Guidelines

### Use Tailwind Utilities

```tsx
// Good
<div className="flex items-center space-x-4 p-6 rounded-lg border bg-card">

// Avoid inline styles when possible
<div style={{ padding: '24px' }}>
```

### Use the cn() Utility for Conditional Classes

```tsx
import { cn } from '@/lib/utils';

<button
  className={cn(
    'rounded-lg px-4 py-2',
    isActive ? 'bg-brand-blue text-white' : 'bg-muted'
  )}
>
```

### Consistent Spacing

```tsx
<div className="space-y-6">      // Vertical spacing
  <div className="space-y-4">    // Smaller vertical spacing
    <div className="flex space-x-2">  // Horizontal spacing
```

## 🔗 API Integration (Coming Soon)

API services are already set up in `src/services/`:
- `auth.service.ts` - Authentication
- `course.service.ts` - Courses
- `analytics.service.ts` - Analytics

Example usage:
```tsx
import { authService } from '@/services/auth.service';

const handleLogin = async () => {
  const response = await authService.login(email, password);
  // Handle response
};
```

## 🐛 Common Issues

### Module not found errors
```bash
npm install
```

### TypeScript errors
```bash
npm run type-check
```

### Port already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🎯 Next Steps

1. ✅ Basic structure is complete
2. 🔄 Connect to backend APIs
3. 🔄 Add remaining pages (compliance, reports, analytics)
4. 🔄 Implement data tables
5. 🔄 Add charts with Recharts
6. 🔄 Implement forms with React Hook Form
7. 🔄 Add modals/dialogs
8. 🔄 Set up testing

---

Happy coding! 🚀
