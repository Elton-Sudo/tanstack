import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card elevation variant - controls shadow depth
   * @default 'default'
   */
  variant?: 'flat' | 'default' | 'elevated' | 'interactive';
  /**
   * Adds hover effect - only applies to interactive variant
   * @default false
   */
  hoverable?: boolean;
  /**
   * Accent border color on the left side
   */
  accentColor?: 'primary' | 'success' | 'warning' | 'error' | 'none';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, accentColor = 'none', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base styles
        'rounded-lg border bg-card text-card-foreground transition-all duration-200',

        // Elevation variants
        {
          'shadow-none': variant === 'flat',
          'shadow-sm': variant === 'default',
          'shadow-md': variant === 'elevated',
          'shadow-sm hover:shadow-lg cursor-pointer': variant === 'interactive',
        },

        // Hoverable effect
        {
          'hover:shadow-md hover:-translate-y-0.5': hoverable && variant !== 'interactive',
        },

        // Accent border colors
        {
          'border-l-4 border-l-brand-blue-500': accentColor === 'primary',
          'border-l-4 border-l-brand-green-500': accentColor === 'success',
          'border-l-4 border-l-brand-yellowGold-500': accentColor === 'warning',
          'border-l-4 border-l-brand-orangeRed-500': accentColor === 'error',
        },

        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-xl font-semibold leading-tight tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
