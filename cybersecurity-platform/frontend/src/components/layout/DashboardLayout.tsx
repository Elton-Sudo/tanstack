/**
 * Main Dashboard Layout Component
 * Provides the overall structure for all dashboard pages
 * Includes sidebar, navbar, and content area
 */

'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import React from 'react';
import Breadcrumbs, { type Breadcrumb } from './Breadcrumbs';
import Navbar from './Navbar';
import Sidebar from './sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

/**
 * DashboardLayout
 * Main layout wrapper for all authenticated dashboard pages
 * Features:
 * - Responsive sidebar (collapsible on desktop, drawer on mobile)
 * - Top navbar with search, notifications, user menu
 * - Breadcrumb navigation
 * - Page title and actions
 * - Smooth transitions
 */
export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}: DashboardLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          collapsed ? 'md:ml-16' : 'md:ml-64',
        )}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} className="mb-4" />
            )}

            {/* Page Header */}
            {(title || actions) && (
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  {title && (
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                  )}
                  {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}

            {/* Page Content */}
            <div className={cn('pb-8', className)}>{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
