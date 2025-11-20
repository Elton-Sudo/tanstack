import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = 'brand-blue',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="rounded-full p-3"
          style={{ backgroundColor: `var(--${iconColor})15` }}
        >
          <Icon className="h-5 w-5" style={{ color: `var(--${iconColor})` }} />
        </div>
        {change && (
          <div
            className={cn('flex items-center space-x-1 text-sm font-medium', {
              'text-brand-green': trend === 'up',
              'text-brand-red': trend === 'down',
            })}
          >
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
