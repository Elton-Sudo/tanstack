/**
 * MobileNav Component
 * Bottom navigation for mobile devices
 * Provides quick access to key sections on mobile
 */

'use client';

import { cn } from '@/lib/utils';
import { Home, Users, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const defaultNavItems: MobileNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export interface MobileNavProps {
  /**
   * Navigation items to display
   * @default defaultNavItems
   */
  items?: MobileNavItem[];
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * MobileNav
 * Bottom navigation bar for mobile devices
 * Fixed at bottom of screen, hidden on desktop (md+)
 * Features:
 * - Active state highlighting
 * - Icon + label layout
 * - Smooth transitions
 * - Touch-optimized tap targets
 */
export default function MobileNav({ items = defaultNavItems, className }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'shadow-[0_-2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.3)]',
        className,
      )}
    >
      <div className="grid h-16 grid-cols-4 gap-1 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200',
                'hover:bg-muted/50 active:bg-muted',
                isActive ? 'text-brand-blue-600 dark:text-brand-blue-400' : 'text-muted-foreground',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
