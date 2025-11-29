import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Color variant of the badge
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Size variant of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Style variant of the badge
   * @default 'soft'
   */
  badgeStyle?: 'solid' | 'soft' | 'outline';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = 'default', size = 'md', badgeStyle = 'soft', className, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-full transition-colors',

          // Size variants
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-0.5 text-xs': size === 'md',
            'px-3 py-1 text-sm': size === 'lg',
          },

          // Style and color combinations
          {
            // Default variant
            'bg-muted text-muted-foreground': variant === 'default' && badgeStyle === 'soft',
            'bg-brand-grayText-500 text-white': variant === 'default' && badgeStyle === 'solid',
            'border border-muted-foreground/30 text-muted-foreground bg-transparent':
              variant === 'default' && badgeStyle === 'outline',

            // Primary & Info (Blue) variant - info is the same as primary
            'bg-brand-blue-100 text-brand-blue-700 dark:bg-brand-blue-950 dark:text-brand-blue-300':
              (variant === 'primary' || variant === 'info') && badgeStyle === 'soft',
            'bg-brand-blue-500 text-white':
              (variant === 'primary' || variant === 'info') && badgeStyle === 'solid',
            'border border-brand-blue-500 text-brand-blue-600 bg-transparent dark:text-brand-blue-400':
              (variant === 'primary' || variant === 'info') && badgeStyle === 'outline',

            // Secondary variant
            'bg-secondary text-secondary-foreground':
              variant === 'secondary' && badgeStyle === 'soft',
            'bg-brand-grayText-600 text-white': variant === 'secondary' && badgeStyle === 'solid',
            'border border-brand-grayText-400 text-brand-grayText-700 bg-transparent dark:text-brand-grayText-300':
              variant === 'secondary' && badgeStyle === 'outline',

            // Success (Green) variant
            'bg-brand-green-100 text-brand-green-700 dark:bg-brand-green-950 dark:text-brand-green-300':
              variant === 'success' && badgeStyle === 'soft',
            'bg-brand-green-500 text-white': variant === 'success' && badgeStyle === 'solid',
            'border border-brand-green-500 text-brand-green-600 bg-transparent dark:text-brand-green-400':
              variant === 'success' && badgeStyle === 'outline',

            // Warning (Yellow Gold) variant
            'bg-brand-yellowGold-100 text-brand-yellowGold-800 dark:bg-brand-yellowGold-950 dark:text-brand-yellowGold-400':
              variant === 'warning' && badgeStyle === 'soft',
            'bg-brand-yellowGold-500 text-brand-grayText-900':
              variant === 'warning' && badgeStyle === 'solid',
            'border border-brand-yellowGold-500 text-brand-yellowGold-700 bg-transparent dark:text-brand-yellowGold-400':
              variant === 'warning' && badgeStyle === 'outline',

            // Error (Orange Red) variant
            'bg-brand-orangeRed-100 text-brand-orangeRed-700 dark:bg-brand-orangeRed-950 dark:text-brand-orangeRed-300':
              variant === 'error' && badgeStyle === 'soft',
            'bg-brand-orangeRed-500 text-white': variant === 'error' && badgeStyle === 'solid',
            'border border-brand-orangeRed-500 text-brand-orangeRed-600 bg-transparent dark:text-brand-orangeRed-400':
              variant === 'error' && badgeStyle === 'outline',
          },

          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
