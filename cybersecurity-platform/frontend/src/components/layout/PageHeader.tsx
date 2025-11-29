/**
 * PageHeader Component
 * Reusable header component for pages
 * Provides consistent page structure with title, subtitle, actions, breadcrumbs, and tabs
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React from 'react';
import Breadcrumbs, { type Breadcrumb } from './Breadcrumbs';

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  /**
   * Action buttons or elements to display in the header
   */
  actions?: React.ReactNode;
  /**
   * Breadcrumb navigation items
   */
  breadcrumbs?: Breadcrumb[];
  /**
   * Optional badge to display next to the title
   */
  badge?: {
    label: string;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  };
  /**
   * Optional tabs to display below the header
   */
  tabs?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PageHeader
 * Displays page title, subtitle, breadcrumbs, badge, actions, and optional tabs
 * Responsive design with stacked layout on mobile, row layout on desktop
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  badge,
  tabs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {badge && (
              <Badge variant={badge.variant || 'default'} size="md">
                {badge.label}
              </Badge>
            )}
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Actions */}
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {/* Tabs */}
      {tabs && <div className="border-b">{tabs}</div>}
    </div>
  );
}
