/**
 * ProgressRing Component
 * Circular progress indicator with animated stroke
 * Perfect for completion percentages and goals
 */

'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface ProgressRingProps {
  /**
   * Progress percentage (0-100)
   */
  progress: number;
  /**
   * Size of the ring in pixels
   */
  size?: number;
  /**
   * Stroke width
   */
  strokeWidth?: number;
  /**
   * Color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /**
   * Show percentage label in center
   */
  showLabel?: boolean;
  /**
   * Custom label to display
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const colorVariants = {
  primary: {
    stroke: '#3B8EDE',
    text: 'text-brand-blue-600 dark:text-brand-blue-400',
  },
  success: {
    stroke: '#8CB841',
    text: 'text-brand-green-600 dark:text-brand-green-400',
  },
  warning: {
    stroke: '#F5C242',
    text: 'text-brand-yellowGold-700 dark:text-brand-yellowGold-400',
  },
  error: {
    stroke: '#E86A33',
    text: 'text-brand-orangeRed-600 dark:text-brand-orangeRed-400',
  },
} as const;

/**
 * ProgressRing
 * SVG-based circular progress indicator with smooth animation
 * Features:
 * - Animated stroke with transition
 * - Customizable size and stroke width
 * - Color variants
 * - Optional center label
 */
export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  label,
  className,
}: ProgressRingProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  const colors = colorVariants[variant];

  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-2xl font-bold', colors.text)}>
            {label || `${Math.round(normalizedProgress)}%`}
          </span>
        </div>
      )}
    </div>
  );
}
