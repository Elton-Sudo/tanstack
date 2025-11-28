import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the alert
   * @default 'default'
   */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  /**
   * Alert title
   */
  title?: string;
  /**
   * Custom icon to display (overrides default variant icon)
   */
  icon?: ReactNode;
  /**
   * Whether to show the default variant icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
}

const variantConfig = {
  default: {
    container: 'bg-background border-border',
    icon: Info,
    iconColor: 'text-muted-foreground',
    title: 'text-foreground',
    description: 'text-muted-foreground',
  },
  info: {
    container:
      'bg-brand-blue-50 border-brand-blue-200 dark:bg-brand-blue-950/30 dark:border-brand-blue-800',
    icon: Info,
    iconColor: 'text-brand-blue-600 dark:text-brand-blue-400',
    title: 'text-brand-blue-900 dark:text-brand-blue-200',
    description: 'text-brand-blue-800 dark:text-brand-blue-300',
  },
  success: {
    container:
      'bg-brand-green-50 border-brand-green-200 dark:bg-brand-green-950/30 dark:border-brand-green-800',
    icon: CheckCircle2,
    iconColor: 'text-brand-green-600 dark:text-brand-green-400',
    title: 'text-brand-green-900 dark:text-brand-green-200',
    description: 'text-brand-green-800 dark:text-brand-green-300',
  },
  warning: {
    container:
      'bg-brand-yellowGold-50 border-brand-yellowGold-200 dark:bg-brand-yellowGold-950/30 dark:border-brand-yellowGold-800',
    icon: AlertCircle,
    iconColor: 'text-brand-yellowGold-700 dark:text-brand-yellowGold-400',
    title: 'text-brand-yellowGold-900 dark:text-brand-yellowGold-200',
    description: 'text-brand-yellowGold-800 dark:text-brand-yellowGold-300',
  },
  error: {
    container:
      'bg-brand-orangeRed-50 border-brand-orangeRed-200 dark:bg-brand-orangeRed-950/30 dark:border-brand-orangeRed-800',
    icon: XCircle,
    iconColor: 'text-brand-orangeRed-600 dark:text-brand-orangeRed-400',
    title: 'text-brand-orangeRed-900 dark:text-brand-orangeRed-200',
    description: 'text-brand-orangeRed-800 dark:text-brand-orangeRed-300',
  },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = 'default', title, icon, showIcon = true, onClose, children, className, ...props },
    ref,
  ) => {
    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border p-4 shadow-sm transition-all',
          config.container,
          className,
        )}
        {...props}
      >
        <div className="flex gap-3">
          {/* Icon */}
          {showIcon && (
            <div className="flex-shrink-0">
              {icon || <IconComponent className={cn('h-5 w-5', config.iconColor)} />}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-1">
            {title && (
              <h5 className={cn('font-semibold leading-none tracking-tight', config.title)}>
                {title}
              </h5>
            )}
            <div className={cn('text-sm leading-relaxed', config.description)}>{children}</div>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10',
                config.iconColor,
              )}
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

Alert.displayName = 'Alert';
