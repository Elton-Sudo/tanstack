/**
 * Dashboard Home Page
 * Main landing page after user login with analytics and metrics
 * Redesigned with professional visualization components
 */

'use client';

import { DashboardLayout } from '@/components/layout';
import { ServiceUnavailable } from '@/components/service-unavailable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChartCard,
  BarChartCard,
  MetricCard,
  PieChartCard,
} from '@/components/visualizations';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const { useDashboardMetrics } = useAnalytics();
  const { data, isLoading, isError, refetch } = useDashboardMetrics();

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <DashboardLayout
        title="Dashboard"
        subtitle="Overview of your cybersecurity training platform"
      >
        <ServiceUnavailable service="Reporting" onRetry={() => refetch()} />
      </DashboardLayout>
    );
  }

  // Sample data for charts (in production, this would come from the API)
  const trainingProgressData = [
    { month: 'Jan', completed: 65, enrolled: 100 },
    { month: 'Feb', completed: 75, enrolled: 120 },
    { month: 'Mar', completed: 85, enrolled: 140 },
    { month: 'Apr', completed: 95, enrolled: 150 },
    { month: 'May', completed: 110, enrolled: 160 },
    { month: 'Jun', completed: 125, enrolled: 180 },
  ];

  const riskDistributionData = [
    { name: 'Low Risk', value: 45, color: '#8CB841' },
    { name: 'Medium Risk', value: 30, color: '#3B8EDE' },
    { name: 'High Risk', value: 20, color: '#F5C242' },
    { name: 'Critical', value: 5, color: '#E86A33' },
  ];

  const departmentData = [
    { department: 'IT', score: 85 },
    { department: 'HR', score: 72 },
    { department: 'Finance', score: 68 },
    { department: 'Sales', score: 78 },
    { department: 'Operations', score: 80 },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your cybersecurity training platform"
    >
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

      {/* Recent Activity */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'User completed "Phishing Awareness Training"',
                  time: '2 hours ago',
                  icon: CheckCircle2,
                  color: 'success',
                },
                {
                  action: 'New user enrolled in "Data Protection Course"',
                  time: '4 hours ago',
                  icon: Users,
                  color: 'primary',
                },
                {
                  action: 'Risk assessment completed for IT department',
                  time: '6 hours ago',
                  icon: AlertTriangle,
                  color: 'warning',
                },
                {
                  action: 'Monthly compliance report generated',
                  time: '1 day ago',
                  icon: BookOpen,
                  color: 'neutral',
                },
                {
                  action: 'System backup completed successfully',
                  time: '1 day ago',
                  icon: CheckCircle2,
                  color: 'success',
                },
              ].map((activity, i) => {
                const Icon = activity.icon;
                const colorClasses = {
                  success: 'bg-brand-green-100 text-brand-green-600 dark:bg-brand-green-950 dark:text-brand-green-400',
                  primary: 'bg-brand-blue-100 text-brand-blue-600 dark:bg-brand-blue-950 dark:text-brand-blue-400',
                  warning: 'bg-brand-yellowGold-100 text-brand-yellowGold-700 dark:bg-brand-yellowGold-950 dark:text-brand-yellowGold-400',
                  neutral: 'bg-muted text-muted-foreground',
                };

                return (
                  <div key={i} className="flex items-start space-x-4">
                    <div className={`rounded-lg p-2 ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
