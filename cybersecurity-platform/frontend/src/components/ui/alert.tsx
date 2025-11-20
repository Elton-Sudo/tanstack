import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  onClose?: () => void;
}

export function Alert({
  variant = 'default',
  title,
  onClose,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        {
          'bg-background': variant === 'default',
          'bg-brand-green/10 border-brand-green/20': variant === 'success',
          'bg-brand-orange/10 border-brand-orange/20': variant === 'warning',
          'bg-brand-red/10 border-brand-red/20': variant === 'danger',
          'bg-brand-blue/10 border-brand-blue/20': variant === 'info',
        },
        className,
      )}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {title && <h5 className="mb-1 font-medium leading-none">{title}</h5>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
