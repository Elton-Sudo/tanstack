'use client';

import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Shield,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Courses',
    href: '/my-courses',
    icon: BookOpen,
  },
  {
    name: 'Course Catalog',
    href: '/courses',
    icon: GraduationCap,
  },
  {
    name: 'Risk Assessment',
    href: '/risk',
    icon: AlertTriangle,
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
];

const adminNavigation = [
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Admin Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 transform border-r bg-background transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex h-16 items-center justify-between px-4 lg:hidden">
            <span className="font-bold">Menu</span>
            <button onClick={onClose} className="rounded-md p-2 hover:bg-accent">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-blue text-white'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin section */}
            <div className="mt-8 pt-8 border-t">
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-blue text-white'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-brand-blue" />
                <div className="h-2 w-2 rounded-full bg-brand-green" />
                <div className="h-2 w-2 rounded-full bg-brand-orange" />
                <div className="h-2 w-2 rounded-full bg-brand-red" />
              </div>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
