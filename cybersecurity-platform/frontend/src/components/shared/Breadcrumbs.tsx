/**
 * Breadcrumbs Component
 * Navigation breadcrumbs for deep page hierarchies
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBreadcrumbs, navigationItems } from '@/constants/navigation';
import { useAuthStore } from '@/store/auth.store';
import { filterNavigationByRole } from '@/constants/navigation';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

/**
 * Breadcrumbs Component
 * Automatically generates breadcrumbs from navigation structure or accepts custom items
 */
export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Generate breadcrumbs from navigation structure if no custom items provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items;

    if (!user) return [];

    // Filter navigation by user role
    const filteredNav = filterNavigationByRole(navigationItems, user.role);

    // Get breadcrumbs from navigation structure
    return getBreadcrumbs(filteredNav, pathname);
  }, [items, pathname, user]);

  // Don't render if no items or only one item (current page)
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-sm', className)}>
      {/* Home Link */}
      {showHome && (
        <>
          <Link
            href="/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </>
      )}

      {/* Breadcrumb Items */}
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href}>
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Breadcrumbs Skeleton
 * Loading state for breadcrumbs
 */
export function BreadcrumbsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
    </div>
  );
}
