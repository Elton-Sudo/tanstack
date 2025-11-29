/**
 * Dashboard Home Page
 * Main landing page after user login with analytics and metrics
 * Redesigned with professional visualization components
 */

'use client';

import { ActivityFeed } from '@/components/activity-feed';
import { ServiceUnavailable } from '@/components/service-unavailable';
import { AreaChartCard, BarChartCard, MetricCard, PieChartCard } from '@/components/visualizations';
import { useAnalytics } from '@/hooks/use-analytics';
import { AlertTriangle, BookOpen, CheckCircle2, Users } from 'lucide-react';

export default function DashboardPage() {
  const { useDashboardMetrics, useTenantRiskStats, usePhishingTenantStats } = useAnalytics();
  const { data, isLoading, isError, refetch } = useDashboardMetrics();
  const { data: riskStats } = useTenantRiskStats();
  const { data: phishingStats } = usePhishingTenantStats();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border bg-card" />
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

  // Transform API data for charts
  const trainingProgressData =
    data?.trendData?.months?.map((month) => ({
      month: month.month,
      completed: month.completions,
      enrolled: month.enrollments,
    })) || [];

  const riskDistributionData = riskStats
    ? [
        { name: 'Low Risk', value: riskStats.lowRiskUsers, color: '#8CB841' },
        { name: 'Medium Risk', value: riskStats.mediumRiskUsers, color: '#3B8EDE' },
        { name: 'High Risk', value: riskStats.highRiskUsers, color: '#F5C242' },
        { name: 'Critical', value: riskStats.criticalRiskUsers, color: '#E86A33' },
      ]
    : [];

  const departmentData =
    data?.departmentMetrics?.map((dept) => ({
      department: dept.departmentName,
      score: Math.round(dept.completionRate),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cybersecurity training platform</p>
      </div>

      {/* Hero Metrics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Users"
          value={data?.activeUsers || 0}
          subtitle="Currently active in platform"
          trend={{ value: 12.5, isPositive: true, label: 'vs last month' }}
          icon={Users}
          variant="primary"
          animate
        />
        <MetricCard
          title="Courses Completed"
          value={data?.completedEnrollments || 0}
          subtitle="Total completions this month"
          trend={{ value: 8.2, isPositive: true, label: 'vs last month' }}
          icon={CheckCircle2}
          variant="success"
          animate
        />
        <MetricCard
          title="Average Risk Score"
          value={data?.averageRiskScore || 0}
          subtitle="Platform-wide risk level"
          trend={{ value: 5.3, isPositive: false, label: 'improvement' }}
          icon={AlertTriangle}
          variant="warning"
          animate
        />
        <MetricCard
          title="Training Hours"
          value={data?.trainingHours || 0}
          subtitle="Total hours completed"
          trend={{ value: 15.8, isPositive: true, label: 'vs last month' }}
          icon={BookOpen}
          variant="neutral"
          animate
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Training Progress Chart */}
        <AreaChartCard
          title="Training Progress"
          description="Enrollments and completions over time"
          data={trainingProgressData}
          xAxisKey="month"
          dataKeys={[
            { key: 'enrolled', name: 'Enrolled', color: '#3B8EDE' },
            { key: 'completed', name: 'Completed', color: '#8CB841' },
          ]}
          height={300}
        />

        {/* Risk Distribution Chart */}
        <PieChartCard
          title="Risk Distribution"
          description="User risk levels across platform"
          data={riskDistributionData}
          height={300}
        />
      </div>

      {/* Department Performance */}
      <div className="mt-6">
        <BarChartCard
          title="Department Performance"
          description="Average completion scores by department"
          data={departmentData}
          xAxisKey="department"
          dataKeys={[{ key: 'score', name: 'Completion Score', color: '#3B8EDE' }]}
          height={300}
        />
      </div>

      {/* Live Security Activity */}
      <div className="mt-6">
        <ActivityFeed phishingStats={phishingStats} />
      </div>
    </div>
  );
}
