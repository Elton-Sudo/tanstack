'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/visualizations';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  GraduationCap,
  TrendingUp,
  Users,
  UserPlus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ActivityItem {
  id: string;
  type: 'user_enrolled' | 'course_completed' | 'certificate_earned' | 'user_added';
  user: string;
  details: string;
  timestamp: string;
}

interface UpcomingDeadline {
  id: string;
  courseName: string;
  dueDate: string;
  enrolledUsers: number;
  completedUsers: number;
  daysRemaining: number;
}

export default function TenantDashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data - will be replaced with API calls
  const tenantInfo = {
    organizationName: 'Acme Corporation',
    subscriptionPlan: 'PROFESSIONAL',
    subscriptionStatus: 'ACTIVE',
    expiryDate: '2025-12-31',
  };

  const metrics = {
    activeUsers: 187,
    totalUsers: 200,
    userLimit: 200,
    activeCourses: 12,
    totalEnrollments: 1245,
    avgCompletionRate: 78.5,
    certificatesEarned: 342,
    learningHours: 2847,
    storageUsed: 45.3, // GB
    storageLimit: 100, // GB
    apiCallsThisMonth: 7823,
    apiCallsLimit: 100000,
  };

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'certificate_earned',
      user: 'Sarah Johnson',
      details: 'Earned certificate for "Cybersecurity Fundamentals"',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'user_added',
      user: 'Michael Chen',
      details: 'Added as new team member (Engineering)',
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      type: 'course_completed',
      user: 'Emily Rodriguez',
      details: 'Completed "Phishing Detection & Prevention" with 95% score',
      timestamp: '5 hours ago',
    },
    {
      id: '4',
      type: 'user_enrolled',
      user: 'David Kim',
      details: 'Enrolled in "GDPR Compliance Training"',
      timestamp: '6 hours ago',
    },
    {
      id: '5',
      type: 'certificate_earned',
      user: 'Amanda Foster',
      details: 'Earned certificate for "Advanced Threat Detection"',
      timestamp: '8 hours ago',
    },
  ];

  const upcomingDeadlines: UpcomingDeadline[] = [
    {
      id: '1',
      courseName: 'Cybersecurity Fundamentals',
      dueDate: '2024-12-31',
      enrolledUsers: 142,
      completedUsers: 118,
      daysRemaining: 31,
    },
    {
      id: '2',
      courseName: 'Phishing Detection & Prevention',
      dueDate: '2024-12-15',
      enrolledUsers: 135,
      completedUsers: 102,
      daysRemaining: 15,
    },
    {
      id: '3',
      courseName: 'GDPR Compliance Training',
      dueDate: '2024-12-20',
      enrolledUsers: 45,
      completedUsers: 32,
      daysRemaining: 20,
    },
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'certificate_earned':
        return <Award className="h-4 w-4 text-brand-green" />;
      case 'course_completed':
        return <CheckCircle2 className="h-4 w-4 text-brand-blue" />;
      case 'user_enrolled':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'user_added':
        return <UserPlus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getDeadlineUrgency = (daysRemaining: number) => {
    if (daysRemaining <= 7) return 'error';
    if (daysRemaining <= 14) return 'warning';
    return 'neutral';
  };

  const usagePercentage = (used: number, limit: number) => ((used / limit) * 100).toFixed(1);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'STARTER':
        return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
      case 'PROFESSIONAL':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'ENTERPRISE':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Subscription Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Welcome back to {tenantInfo.organizationName}</p>
            <Badge className={getPlanColor(tenantInfo.subscriptionPlan)} badgeStyle="solid">
              {tenantInfo.subscriptionPlan}
            </Badge>
            <Badge
              variant={tenantInfo.subscriptionStatus === 'ACTIVE' ? 'success' : 'warning'}
              badgeStyle="outline"
            >
              {tenantInfo.subscriptionStatus}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? 'primary' : 'default'}
              badgeStyle={timeRange === range ? 'solid' : 'outline'}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          subtitle={`${metrics.totalUsers} total users`}
          trend={{
            value: 8.2,
            isPositive: true,
            label: 'vs last month',
          }}
          icon={Users}
          variant="primary"
          animate
        />
        <MetricCard
          title="Avg Completion"
          value={`${metrics.avgCompletionRate}%`}
          subtitle="Course completion rate"
          trend={{
            value: 5.3,
            isPositive: true,
            label: 'improvement',
          }}
          icon={TrendingUp}
          variant="success"
          animate
        />
        <MetricCard
          title="Certificates"
          value={metrics.certificatesEarned}
          subtitle="Total earned"
          icon={Award}
          variant="warning"
          animate
        />
        <MetricCard
          title="Learning Hours"
          value={metrics.learningHours}
          subtitle="Total team hours"
          icon={Clock}
          variant="neutral"
          animate
        />
      </div>

      {/* Subscription Usage & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscription Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Subscription Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Users */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-medium">
                  {metrics.activeUsers} / {metrics.userLimit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full transition-all"
                  style={{
                    width: `${usagePercentage(metrics.activeUsers, metrics.userLimit)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {usagePercentage(metrics.activeUsers, metrics.userLimit)}% of user limit
              </p>
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">
                  {metrics.storageUsed} GB / {metrics.storageLimit} GB
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{
                    width: `${usagePercentage(metrics.storageUsed, metrics.storageLimit)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {usagePercentage(metrics.storageUsed, metrics.storageLimit)}% of storage limit
              </p>
            </div>

            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Calls (This Month)</span>
                <span className="font-medium">
                  {metrics.apiCallsThisMonth.toLocaleString()} /{' '}
                  {metrics.apiCallsLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-green rounded-full transition-all"
                  style={{
                    width: `${usagePercentage(metrics.apiCallsThisMonth, metrics.apiCallsLimit)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {usagePercentage(metrics.apiCallsThisMonth, metrics.apiCallsLimit)}% of monthly
                limit
              </p>
            </div>

            <div className="pt-2 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings/subscription">View Subscription Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/manage/users">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/manage/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Assign Course
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/settings/branding">
                <Award className="mr-2 h-4 w-4" />
                Customize Branding
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/settings/roles">
                <Users className="mr-2 h-4 w-4" />
                Manage Roles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/manage/courses">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0"
              >
                <div
                  className={`p-2 rounded-lg ${
                    deadline.daysRemaining <= 7
                      ? 'bg-red-100 dark:bg-red-900/20'
                      : deadline.daysRemaining <= 14
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-blue-100 dark:bg-blue-900/20'
                  }`}
                >
                  <Calendar
                    className={`h-4 w-4 ${
                      deadline.daysRemaining <= 7
                        ? 'text-red-600'
                        : deadline.daysRemaining <= 14
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{deadline.courseName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={getDeadlineUrgency(deadline.daysRemaining) as any}
                      badgeStyle="solid"
                    >
                      {deadline.daysRemaining} days left
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {deadline.completedUsers}/{deadline.enrolledUsers} completed
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full"
                      style={{
                        width: `${((deadline.completedUsers / deadline.enrolledUsers) * 100).toFixed(0)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/activity">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0"
              >
                <div className="p-2 rounded-lg bg-accent">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Performance Overview
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/reports">View Detailed Reports</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-brand-blue">{metrics.activeCourses}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Courses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-purple-600">{metrics.totalEnrollments}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Enrollments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-brand-green">
                {metrics.avgCompletionRate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Avg Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
