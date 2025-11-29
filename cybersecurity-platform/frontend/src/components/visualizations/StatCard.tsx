/**
 * StatCard Component
 * Compact metric card for secondary metrics
 * Simpler alternative to MetricCard for dashboard grids
 */

'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

export interface StatCardProps {
  /**
   * Stat label
   */
  label: string;
  /**
   * Stat value
   */
  value: string | number;
  /**
   * Optional icon
   */
  icon?: React.ElementType;
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /**
   * Additional CSS classes
   */
  className?: string;
}

const colorVariants = {
  default: 'text-foreground',
  primary: 'text-brand-blue-600 dark:text-brand-blue-400',
  success: 'text-brand-green-600 dark:text-brand-green-400',
  warning: 'text-brand-yellowGold-700 dark:text-brand-yellowGold-400',
  error: 'text-brand-orangeRed-600 dark:text-brand-orangeRed-400',
} as const;

/**
 * StatCard
 * Displays a compact stat with optional icon
 * Perfect for dashboard grids with multiple metrics
 */
export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-4 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={cn('text-2xl font-bold', colorVariants[variant])}>{value}</p>
        </div>
        {Icon && (
          <div className="rounded-full bg-muted p-2">
            <Icon className={cn('h-4 w-4', colorVariants[variant])} />
          </div>
        )}
      </div>
    </Card>
  );
}
