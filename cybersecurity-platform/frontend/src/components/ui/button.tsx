import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer relative',

          // Variant styles
          {
            // Primary (Brand Blue) - Main CTA
            'bg-brand-blue-500 text-white shadow-sm hover:bg-brand-blue-600 active:bg-brand-blue-700 focus-visible:ring-brand-blue-500/50':
              variant === 'primary' || variant === 'default',

            // Secondary - Muted alternative
            'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70 focus-visible:ring-ring':
              variant === 'secondary',

            // Success (Green) - Positive actions
            'bg-brand-green-500 text-white shadow-sm hover:bg-brand-green-600 active:bg-brand-green-700 focus-visible:ring-brand-green-500/50':
              variant === 'success',

            // Warning (Yellow Gold) - Cautionary actions
            'bg-brand-yellowGold-500 text-brand-grayText-900 shadow-sm hover:bg-brand-yellowGold-600 active:bg-brand-yellowGold-700 focus-visible:ring-brand-yellowGold-500/50':
              variant === 'warning',

            // Error/Destructive (Orange Red) - Dangerous actions
            'bg-brand-orangeRed-500 text-white shadow-sm hover:bg-brand-orangeRed-600 active:bg-brand-orangeRed-700 focus-visible:ring-brand-orangeRed-500/50':
              variant === 'error' || variant === 'destructive',

            // Outline - Bordered variant
            'border-2 border-brand-blue-500 text-brand-blue-600 bg-transparent hover:bg-brand-blue-50 active:bg-brand-blue-100 focus-visible:ring-brand-blue-500/50 dark:hover:bg-brand-blue-950 dark:text-brand-blue-400':
              variant === 'outline',

            // Ghost - Minimal variant
            'text-brand-grayText-700 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring dark:text-brand-grayText-300':
              variant === 'ghost',

            // Link - Text-only variant
            'text-brand-blue-600 underline-offset-4 hover:underline focus-visible:ring-brand-blue-500/50 dark:text-brand-blue-400':
              variant === 'link',
          },

          // Size styles
          {
            'h-7 px-2 text-xs rounded-md': size === 'xs',
            'h-8 px-3 text-sm rounded-md': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
            'h-12 px-8 text-lg': size === 'xl',
          },

          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
