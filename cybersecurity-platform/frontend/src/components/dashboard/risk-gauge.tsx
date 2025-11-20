interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskGauge({ score, size = 'md', showLabel = true }: RiskGaugeProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'brand-green';
    if (score >= 60) return 'brand-orange';
    return 'brand-red';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const sizes = {
    sm: { gauge: 'h-24 w-24', text: 'text-xl', label: 'text-xs' },
    md: { gauge: 'h-32 w-32', text: 'text-3xl', label: 'text-sm' },
    lg: { gauge: 'h-40 w-40', text: 'text-4xl', label: 'text-base' },
  };

  const radius = size === 'sm' ? 44 : size === 'md' ? 56 : 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg className={`${sizes[size].gauge} transform -rotate-90`}>
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
            style={{ color: `var(--${getRiskColor(score)})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${sizes[size].text}`}>{score}</span>
          <span className={`text-muted-foreground ${sizes[size].label}`}>/ 100</span>
        </div>
      </div>
      {showLabel && (
        <p className={`mt-4 font-medium ${sizes[size].label}`}>
          {getRiskLevel(score)}
        </p>
      )}
    </div>
  );
}
