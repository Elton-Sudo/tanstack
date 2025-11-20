import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ActivityItem {
  id: string | number;
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
}

export function ActivityFeed({ items, title = 'Recent Activity' }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;
            const iconColor = item.iconColor || 'brand-blue';

            return (
              <div key={item.id} className="flex items-start space-x-4">
                <div
                  className="rounded-full p-2 flex-shrink-0"
                  style={{ backgroundColor: `var(--${iconColor})15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: `var(--${iconColor})` }} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
