import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsGridProps {
  stats: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 3 }: StatsGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              {stat.icon && (
                <div
                  className="rounded-full p-3"
                  style={{
                    backgroundColor: stat.color
                      ? `var(--${stat.color})15`
                      : 'var(--brand-blue)15',
                  }}
                >
                  {stat.icon}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
