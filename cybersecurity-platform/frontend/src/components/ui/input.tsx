import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Size variant of the input
   * @default 'md'
   */
  inputSize?: 'sm' | 'md' | 'lg';
  /**
   * State variant of the input
   * @default 'default'
   */
  variant?: 'default' | 'error' | 'success';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize = 'md', variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex w-full rounded-lg border bg-background transition-all duration-200',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',

          // Size variants
          {
            'h-8 px-2.5 py-1.5 text-xs': inputSize === 'sm',
            'h-10 px-3 py-2 text-sm': inputSize === 'md',
            'h-12 px-4 py-3 text-base': inputSize === 'lg',
          },

          // State variants
          {
            // Default state
            'border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500/50 focus-visible:ring-offset-2 focus-visible:border-brand-blue-500':
              variant === 'default',

            // Error state
            'border-brand-orangeRed-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orangeRed-500/50 focus-visible:ring-offset-2 focus-visible:border-brand-orangeRed-600 bg-brand-orangeRed-50/50 dark:bg-brand-orangeRed-950/20':
              variant === 'error',

            // Success state
            'border-brand-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500/50 focus-visible:ring-offset-2 focus-visible:border-brand-green-600 bg-brand-green-50/50 dark:bg-brand-green-950/20':
              variant === 'success',
          },

          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
