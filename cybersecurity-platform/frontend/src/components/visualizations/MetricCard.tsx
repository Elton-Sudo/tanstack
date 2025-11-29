/**
 * MetricCard Component
 * Professional metric display card with gradient backgrounds, animated counters, and trend indicators
 */

'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

export interface MetricCardProps {
  /**
   * Metric title
   */
  title: string;
  /**
   * Main metric value
   */
  value: string | number;
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  /**
   * Trend indicator
   */
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  /**
   * Icon to display
   */
  icon?: React.ElementType;
  /**
   * Color variant for gradient background
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  /**
   * Whether to animate the counter
   */
  animate?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const gradientVariants = {
  primary:
    'from-brand-blue-500/10 to-brand-blue-500/5 border-brand-blue-200 dark:border-brand-blue-800',
  success:
    'from-brand-green-500/10 to-brand-green-500/5 border-brand-green-200 dark:border-brand-green-800',
  warning:
    'from-brand-yellowGold-500/10 to-brand-yellowGold-500/5 border-brand-yellowGold-200 dark:border-brand-yellowGold-800',
  error:
    'from-brand-orangeRed-500/10 to-brand-orangeRed-500/5 border-brand-orangeRed-200 dark:border-brand-orangeRed-800',
  neutral: 'from-muted/50 to-muted/20 border-border',
} as const;

const iconVariants = {
  primary: 'text-brand-blue-600 bg-brand-blue-100 dark:text-brand-blue-400 dark:bg-brand-blue-950',
  success:
    'text-brand-green-600 bg-brand-green-100 dark:text-brand-green-400 dark:bg-brand-green-950',
  warning:
    'text-brand-yellowGold-700 bg-brand-yellowGold-100 dark:text-brand-yellowGold-400 dark:bg-brand-yellowGold-950',
  error:
    'text-brand-orangeRed-600 bg-brand-orangeRed-100 dark:text-brand-orangeRed-400 dark:bg-brand-orangeRed-950',
  neutral: 'text-muted-foreground bg-muted',
} as const;

/**
 * Custom hook for animated counter
 */
const useAnimatedCounter = (end: number, duration: number = 1000, enabled: boolean = true) => {
  const [count, setCount] = React.useState(enabled ? 0 : end);

  React.useEffect(() => {
    if (!enabled) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, enabled]);

  return count;
};

/**
 * MetricCard
 * Displays a metric with optional gradient background, icon, and trend indicator
 * Features:
 * - Gradient backgrounds based on variant
 * - Animated counter (optional)
 * - Trend indicator with percentage
 * - Icon support
 * - Responsive design
 * - Memoized for optimal performance
 */
const MetricCard = React.memo(function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'neutral',
  animate = true,
  className,
}: MetricCardProps) {
  const numericValue =
    typeof value === 'number' ? value : parseInt(value.toString().replace(/,/g, ''), 10);
  const animatedValue = useAnimatedCounter(
    isNaN(numericValue) ? 0 : numericValue,
    1000,
    animate && !isNaN(numericValue),
  );

  const displayValue = animate && !isNaN(numericValue) ? animatedValue.toLocaleString() : value;

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-gradient-to-br p-6 transition-all duration-200 hover:shadow-md animate-fade-in',
        gradientVariants[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{displayValue}</h3>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  trend.isPositive
                    ? 'bg-brand-green-100 text-brand-green-700 dark:bg-brand-green-950 dark:text-brand-green-400'
                    : 'bg-brand-orangeRed-100 text-brand-orangeRed-700 dark:bg-brand-orangeRed-950 dark:text-brand-orangeRed-400',
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend?.label && <p className="text-xs text-muted-foreground">{trend.label}</p>}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={cn('rounded-lg p-3', iconVariants[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
});

export default MetricCard;
