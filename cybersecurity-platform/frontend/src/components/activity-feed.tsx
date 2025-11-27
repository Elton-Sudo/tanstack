'use client';

import { PhishingTenantStats } from '@/types/analytics';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Mail,
  Shield,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityEvent {
  id: string;
  type: 'phishing_reported' | 'phishing_clicked' | 'risk_improved' | 'risk_degraded' | 'training_completed' | 'user_at_risk';
  user: string;
  department?: string;
  timestamp: Date;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ActivityFeedProps {
  phishingStats?: PhishingTenantStats;
  className?: string;
}

export function ActivityFeed({ phishingStats, className = '' }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [liveIndicator, setLiveIndicator] = useState(false);

  // Simulate real-time events (in production, this would come from WebSocket/SSE)
  useEffect(() => {
    const generateMockEvents = (): ActivityEvent[] => {
      const types = [
        'phishing_reported',
        'phishing_clicked',
        'risk_improved',
        'risk_degraded',
        'training_completed',
        'user_at_risk',
      ] as const;

      const users = [
        { name: 'Sarah Johnson', dept: 'Finance' },
        { name: 'Mike Chen', dept: 'IT' },
        { name: 'Emily Brown', dept: 'HR' },
        { name: 'David Lee', dept: 'Sales' },
        { name: 'Jessica Taylor', dept: 'Marketing' },
      ];

      const mockEvents: ActivityEvent[] = [];
      const now = new Date();

      for (let i = 0; i < 15; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // 15 min intervals

        let details = '';
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

        switch (type) {
          case 'phishing_reported':
            details = 'Correctly reported phishing simulation';
            severity = 'low';
            break;
          case 'phishing_clicked':
            details = 'Clicked link in phishing simulation';
            severity = 'high';
            break;
          case 'risk_improved':
            details = 'Risk score improved by 12 points';
            severity = 'low';
            break;
          case 'risk_degraded':
            details = 'Risk score decreased by 8 points';
            severity = 'medium';
            break;
          case 'training_completed':
            details = 'Completed "Phishing Awareness Training"';
            severity = 'low';
            break;
          case 'user_at_risk':
            details = 'Flagged as high-risk user';
            severity = 'critical';
            break;
        }

        mockEvents.push({
          id: `event-${i}`,
          type,
          user: user.name,
          department: user.dept,
          timestamp,
          details,
          severity,
        });
      }

      return mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setEvents(generateMockEvents());

    // Simulate live updates
    const interval = setInterval(() => {
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 500);

      // Occasionally add a new event
      if (Math.random() > 0.7) {
        setEvents((prev) => {
          const newEvents = generateMockEvents();
          return newEvents.slice(0, 15);
        });
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'phishing_reported':
        return <CheckCircle2 className="h-5 w-5 text-brand-green" />;
      case 'phishing_clicked':
        return <Mail className="h-5 w-5 text-brand-red" />;
      case 'risk_improved':
        return <TrendingUp className="h-5 w-5 text-brand-green" />;
      case 'risk_degraded':
        return <TrendingDown className="h-5 w-5 text-brand-orange" />;
      case 'training_completed':
        return <UserCheck className="h-5 w-5 text-brand-blue" />;
      case 'user_at_risk':
        return <UserX className="h-5 w-5 text-brand-red" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: ActivityEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-brand-red/50 bg-brand-red/5';
      case 'high':
        return 'border-l-brand-orange/50 bg-brand-orange/5';
      case 'medium':
        return 'border-l-yellow-500/50 bg-yellow-500/5';
      default:
        return 'border-l-brand-blue/50 bg-brand-blue/5';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`rounded-lg border bg-card ${className}`}>
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-blue/10 p-2">
              <Activity className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Live Security Activity</h3>
              <p className="text-sm text-muted-foreground">Real-time event monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full transition-all ${
                liveIndicator ? 'bg-brand-green scale-125' : 'bg-brand-green/50'
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground">LIVE</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`border-l-2 rounded-r-lg p-3 transition-all hover:shadow-md ${getSeverityColor(event.severity)} ${
                index === 0 && liveIndicator ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.user}</p>
                      {event.department && (
                        <p className="text-xs text-muted-foreground">{event.department}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getTimeAgo(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                  {event.severity === 'critical' && (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-brand-red" />
                      <span className="text-xs font-medium text-brand-red">
                        Requires immediate attention
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {phishingStats && (
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-4 w-4 text-brand-green" />
                <span className="text-xs text-muted-foreground">Reported</span>
              </div>
              <p className="text-lg font-bold text-brand-green">
                {((phishingStats.overallReportRate || 0) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center border-x">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="h-4 w-4 text-brand-red" />
                <span className="text-xs text-muted-foreground">Clicked</span>
              </div>
              <p className="text-lg font-bold text-brand-red">
                {((phishingStats.overallClickRate || 0) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-brand-blue" />
                <span className="text-xs text-muted-foreground">Improvement</span>
              </div>
              <p className="text-lg font-bold text-brand-blue">
                +{phishingStats.improvement || 0}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
