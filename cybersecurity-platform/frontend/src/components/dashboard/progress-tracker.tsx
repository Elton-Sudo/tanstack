import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressTracker({
  current,
  total,
  label,
  showPercentage = true,
  className,
}: ProgressTrackerProps) {
  const percentage = Math.round((current / total) * 100);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-brand-green';
    if (percentage >= 50) return 'bg-brand-orange';
    return 'bg-brand-red';
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">
            {current} / {total}
          </span>
          {showPercentage && (
            <span className="text-muted-foreground">({percentage}%)</span>
          )}
        </div>
      </div>
      <Progress
        value={current}
        max={total}
        indicatorClassName={getProgressColor(percentage)}
      />
    </div>
  );
}
