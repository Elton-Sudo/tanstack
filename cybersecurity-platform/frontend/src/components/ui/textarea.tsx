import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Size variant of the textarea
   * @default 'md'
   */
  textareaSize?: 'sm' | 'md' | 'lg';
  /**
   * State variant of the textarea
   * @default 'default'
   */
  variant?: 'default' | 'error' | 'success';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaSize = 'md', variant = 'default', ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          'flex min-h-[80px] w-full rounded-lg border bg-background transition-all duration-200',
          'ring-offset-background',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          'resize-none',

          // Size variants
          {
            'px-2.5 py-1.5 text-xs': textareaSize === 'sm',
            'px-3 py-2 text-sm': textareaSize === 'md',
            'px-4 py-3 text-base': textareaSize === 'lg',
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

Textarea.displayName = 'Textarea';

export { Textarea };
