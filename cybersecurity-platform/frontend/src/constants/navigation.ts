/**
 * Navigation Configuration
 * Defines all navigation menu items with role-based access control
 */

import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ClipboardCheck,
  DollarSign,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  children?: NavigationItem[];
  requiredRole?: string[];
  description?: string;
}

/**
 * Main navigation menu structure
 * Items are filtered based on user role
 */
export const navigationItems: NavigationItem[] = [
  // Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Overview and quick stats',
  },

  // Learning Section (Hidden from SUPER_ADMIN)
  {
    id: 'learning',
    label: 'Learning',
    icon: BookOpen,
    href: '#',
    description: 'Courses and learning paths',
    requiredRole: ['USER', 'MANAGER', 'INSTRUCTOR', 'TENANT_ADMIN'],
    children: [
      {
        id: 'courses',
        label: 'All Courses',
        icon: BookOpen,
        href: '/courses',
        description: 'Browse course catalog',
      },
      {
        id: 'my-courses',
        label: 'My Courses',
        icon: GraduationCap,
        href: '/my-courses',
        description: 'Your enrolled courses',
      },
      {
        id: 'learning-paths',
        label: 'Learning Paths',
        icon: FileText,
        href: '/learning-paths',
        description: 'Structured learning journeys',
      },
    ],
  },

  // Assessments (Hidden from SUPER_ADMIN)
  {
    id: 'assessments',
    label: 'Assessments',
    icon: ClipboardCheck,
    href: '/assessments',
    description: 'Tests and quizzes',
    requiredRole: ['USER', 'MANAGER', 'INSTRUCTOR', 'TENANT_ADMIN'],
  },

  // Certificates (Hidden from SUPER_ADMIN)
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    href: '/certificates',
    description: 'Your earned certificates',
    requiredRole: ['USER', 'MANAGER', 'INSTRUCTOR', 'TENANT_ADMIN'],
  },

  // Compliance
  {
    id: 'compliance',
    label: 'Compliance',
    icon: Shield,
    href: '/compliance',
    description: 'Compliance tracking',
  },

  // Risk Management
  {
    id: 'risk',
    label: 'Risk',
    icon: Shield,
    href: '/risk',
    description: 'Risk assessment',
  },

  // Reports (Admin/Manager only)
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    href: '/reports',
    description: 'Analytics and reports',
    requiredRole: ['TENANT_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    children: [
      {
        id: 'reports-overview',
        label: 'Overview',
        icon: BarChart3,
        href: '/reports',
      },
      {
        id: 'reports-builder',
        label: 'Report Builder',
        icon: FileText,
        href: '/reports/builder',
      },
    ],
  },

  // Team Management (Tenant Admin/Manager only)
  {
    id: 'manage',
    label: 'Team Management',
    icon: Users,
    href: '#',
    description: 'Manage your team and resources',
    requiredRole: ['TENANT_ADMIN', 'MANAGER'],
    children: [
      {
        id: 'manage-dashboard',
        label: 'Team Dashboard',
        icon: LayoutDashboard,
        href: '/manage',
        description: 'Team overview and metrics',
      },
      {
        id: 'manage-users',
        label: 'User Management',
        icon: Users,
        href: '/manage/users',
        description: 'Manage team members',
      },
      {
        id: 'manage-courses',
        label: 'Course Management',
        icon: BookOpen,
        href: '/manage/courses',
        description: 'Manage and assign courses',
      },
      {
        id: 'manage-branding',
        label: 'Branding',
        icon: Palette,
        href: '/settings/branding',
        description: 'Customize appearance',
        requiredRole: ['TENANT_ADMIN'],
      },
      {
        id: 'manage-roles',
        label: 'Roles & Permissions',
        icon: UserCog,
        href: '/settings/roles',
        description: 'Manage user roles',
        requiredRole: ['TENANT_ADMIN'],
      },
    ],
  },

  // Users (Admin only)
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/users',
    description: 'User management',
    requiredRole: ['TENANT_ADMIN', 'SUPER_ADMIN'],
  },

  // Super Admin Section
  {
    id: 'admin',
    label: 'Administration',
    icon: Shield,
    href: '#',
    description: 'Platform administration',
    requiredRole: ['SUPER_ADMIN'],
    children: [
      {
        id: 'admin-platform',
        label: 'Platform Analytics',
        icon: Activity,
        href: '/admin/platform',
        description: 'Platform-wide analytics',
      },
      {
        id: 'admin-tenants',
        label: 'Tenant Management',
        icon: Building2,
        href: '/admin/tenants',
        description: 'Manage all tenants',
      },
      {
        id: 'admin-revenue',
        label: 'Revenue Analytics',
        icon: DollarSign,
        href: '/admin/revenue',
        description: 'Financial metrics',
      },
      {
        id: 'admin-users',
        label: 'User Management',
        icon: Users,
        href: '/admin/users',
        description: 'Manage all users',
      },
      {
        id: 'admin-certificates',
        label: 'Certificate Templates',
        icon: Award,
        href: '/admin/certificate-templates',
        description: 'Manage certificate templates',
      },
    ],
  },

  // Notifications
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '/notifications',
    description: 'Notification center',
  },

  // Settings
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Account settings',
  },
];

/**
 * Filter navigation items based on user role
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  userRole: string,
): NavigationItem[] {
  return items
    .filter((item) => {
      // If no required role, show to all
      if (!item.requiredRole || item.requiredRole.length === 0) {
        return true;
      }
      // Check if user has required role
      return item.requiredRole.includes(userRole);
    })
    .map((item) => ({
      ...item,
      // Recursively filter children
      children: item.children ? filterNavigationByRole(item.children, userRole) : undefined,
    }));
}

/**
 * Get navigation item by path
 */
export function getNavigationItemByPath(
  items: NavigationItem[],
  path: string,
): NavigationItem | undefined {
  for (const item of items) {
    if (item.href === path) {
      return item;
    }
    if (item.children) {
      const found = getNavigationItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Get breadcrumbs for current path
 */
export interface Breadcrumb {
  label: string;
  href: string;
}

export function getBreadcrumbs(
  items: NavigationItem[],
  path: string,
  accumulated: Breadcrumb[] = [],
): Breadcrumb[] {
  for (const item of items) {
    if (item.href === path) {
      return [...accumulated, { label: item.label, href: item.href }];
    }
    if (item.children) {
      const result = getBreadcrumbs(item.children, path, [
        ...accumulated,
        { label: item.label, href: item.href },
      ]);
      if (result.length > accumulated.length) {
        return result;
      }
    }
  }
  return accumulated;
}
