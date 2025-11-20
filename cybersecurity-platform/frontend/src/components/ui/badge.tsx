import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-muted text-muted-foreground': variant === 'default',
          'bg-brand-green/10 text-brand-green': variant === 'success',
          'bg-brand-orange/10 text-brand-orange': variant === 'warning',
          'bg-brand-red/10 text-brand-red': variant === 'danger',
          'bg-brand-blue/10 text-brand-blue': variant === 'info',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
