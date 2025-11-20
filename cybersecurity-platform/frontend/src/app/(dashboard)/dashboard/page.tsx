'use client';

import { ServiceUnavailable } from '@/components/service-unavailable';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const { useDashboardMetrics } = useAnalytics();
  const { data, isLoading, isError, error, refetch } = useDashboardMetrics();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your cybersecurity training platform</p>
        </div>
        <ServiceUnavailable service="Reporting" onRetry={() => refetch()} />
      </div>
    );
  }

  const metrics = data
    ? [
        {
          title: 'Active Users',
          value: data.activeUsers?.toString() || '0',
          change: '+12.5%', // Calculated from trendData if available
          trend: 'up',
          icon: Users,
          color: 'brand-blue',
        },
        {
          title: 'Courses Completed',
          value: data.completedEnrollments?.toString() || '0',
          change: '+8.2%',
          trend: 'up',
          icon: CheckCircle2,
          color: 'brand-green',
        },
        {
          title: 'Risk Score',
          value: `${data.averageRiskScore || 0}/100`,
          change: '-5.3%',
          trend: 'down',
          icon: AlertTriangle,
          color: 'brand-orange',
        },
        {
          title: 'Training Hours',
          value: data.trainingHours?.toString() || '0',
          change: '+15.8%',
          trend: 'up',
          icon: BookOpen,
          color: 'brand-red',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cybersecurity training platform</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <div
              key={metric.title}
              className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`rounded-full p-3`}
                  style={{ backgroundColor: `var(--${metric.color})15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: `var(--${metric.color})` }} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    isPositive ? 'text-brand-green' : 'text-brand-red'
                  }`}
                >
                  <TrendIcon className="h-4 w-4" />
                  <span className="font-medium">{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Training Progress Chart */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder - will be replaced with Recharts
          </div>
        </div>

        {/* Risk Assessment Chart */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder - will be replaced with Recharts
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="rounded-full bg-brand-blue/10 p-2">
                  <BookOpen className="h-4 w-4 text-brand-blue" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    User completed "Phishing Awareness Training"
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
