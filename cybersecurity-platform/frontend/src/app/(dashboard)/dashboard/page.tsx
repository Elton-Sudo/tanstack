/**
 * Dashboard Home Page
 * Role-aware dashboard showing different content based on user role
 * - USER: Personal learning dashboard
 * - TENANT_ADMIN/MANAGER/SUPER_ADMIN: Platform analytics dashboard
 */

'use client';

import { ActivityFeed } from '@/components/activity-feed';
import { ServiceUnavailable } from '@/components/service-unavailable';
import {
  EmployeeDashboardSkeleton,
  TenantAdminDashboardSkeleton,
  SuperAdminDashboardSkeleton,
} from '@/components/skeletons/DashboardSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChartCard, BarChartCard, MetricCard, PieChartCard } from '@/components/visualizations';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuthStore } from '@/store/auth.store';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// Employee/Learner Dashboard Component
function EmployeeDashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  // Mock data - will be replaced with API calls
  const userData = {
    name: `${user.firstName} ${user.lastName}`,
    role: user.position || 'Team Member',
    department: user.department || 'General',
    points: 2850,
    rank: 12,
    totalUsers: 187,
    level: 8,
    nextLevelPoints: 3000,
  };

  const stats = {
    coursesInProgress: 3,
    coursesCompleted: 12,
    certificatesEarned: 8,
    learningHours: 47.5,
    currentStreak: 7,
    averageScore: 87.3,
    completionRate: 82.5,
  };

  const coursesInProgress = [
    {
      id: '1',
      title: 'Advanced Threat Detection',
      category: 'Advanced Security',
      progress: 67,
      totalLessons: 12,
      completedLessons: 8,
      lastAccessedLesson: 'Behavioral Analysis Techniques',
      estimatedTimeRemaining: 45,
      deadline: '2024-12-15',
    },
    {
      id: '2',
      title: 'GDPR Compliance Training',
      category: 'Compliance',
      progress: 45,
      totalLessons: 8,
      completedLessons: 4,
      lastAccessedLesson: 'Data Protection Principles',
      estimatedTimeRemaining: 60,
      deadline: '2024-12-20',
    },
    {
      id: '3',
      title: 'Incident Response Basics',
      category: 'Security Fundamentals',
      progress: 25,
      totalLessons: 10,
      completedLessons: 3,
      lastAccessedLesson: 'Identifying Security Incidents',
      estimatedTimeRemaining: 90,
    },
  ];

  const recentAchievements = [
    {
      id: '1',
      title: 'Quick Learner',
      description: 'Complete 3 courses in one month',
      icon: '⚡',
      earnedAt: '2 days ago',
      rarity: 'rare' as const,
    },
    {
      id: '2',
      title: 'Perfect Score',
      description: 'Score 100% on an assessment',
      icon: '🎯',
      earnedAt: '5 days ago',
      rarity: 'epic' as const,
    },
    {
      id: '3',
      title: 'Week Warrior',
      description: 'Learn every day for 7 days straight',
      icon: '🔥',
      earnedAt: '1 week ago',
      rarity: 'rare' as const,
    },
  ];

  const recommendedCourses = [
    {
      id: '4',
      title: 'Security Leadership',
      description: 'Building and leading effective security teams',
      duration: 5,
      difficulty: 'advanced' as const,
      enrolledCount: 12,
    },
    {
      id: '5',
      title: 'Cloud Security Essentials',
      description: 'Secure cloud infrastructure and applications',
      duration: 3.5,
      difficulty: 'intermediate' as const,
      enrolledCount: 45,
    },
  ];

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const getRarityColor = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'rare':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'epic':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const upcomingDeadlines = coursesInProgress
    .filter((course) => course.deadline)
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>{userData.role}</span>
            <span>•</span>
            <span>{userData.department}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-foreground">
                Rank #{userData.rank} of {userData.totalUsers}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{userData.points.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {userData.nextLevelPoints - userData.points} points to Level {userData.level + 1}
          </p>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden w-48">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{
                width: `${((userData.points % 500) / 500) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="In Progress"
          value={stats.coursesInProgress}
          subtitle="Active courses"
          icon={BookOpen}
          variant="primary"
          animate
        />
        <MetricCard
          title="Completed"
          value={stats.coursesCompleted}
          subtitle="Courses finished"
          trend={{
            value: 3,
            isPositive: true,
            label: 'this month',
          }}
          icon={Target}
          variant="success"
          animate
        />
        <MetricCard
          title="Certificates"
          value={stats.certificatesEarned}
          subtitle="Earned certificates"
          icon={Award}
          variant="warning"
          animate
        />
        <MetricCard
          title="Learning Hours"
          value={stats.learningHours.toFixed(1)}
          subtitle={`${stats.currentStreak} day streak 🔥`}
          icon={Clock}
          variant="neutral"
          animate
        />
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Continue Learning</h2>
          <Button variant="ghost" asChild>
            <Link href="/my-courses">
              View All Courses
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coursesInProgress.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="default" badgeStyle="outline">
                    {course.category}
                  </Badge>
                  {course.deadline && (
                    <Badge
                      variant={getDaysUntilDeadline(course.deadline) <= 7 ? 'error' : 'warning'}
                      badgeStyle="solid"
                    >
                      {getDaysUntilDeadline(course.deadline)} days left
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {course.completedLessons} of {course.totalLessons} lessons
                    </span>
                    <span>{course.estimatedTimeRemaining} min remaining</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-3">Last accessed:</p>
                  <p className="text-sm font-medium mb-3 line-clamp-1">
                    {course.lastAccessedLesson}
                  </p>
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90" asChild>
                    <Link href={`/courses/${course.id}/player`}>
                      <Play className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements & Upcoming Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/achievements">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{achievement.title}</p>
                    <Badge className={getRarityColor(achievement.rarity)} badgeStyle="solid">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground">Earned {achievement.earnedAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((course) => {
                const daysLeft = course.deadline ? getDaysUntilDeadline(course.deadline) : 0;
                return (
                  <div
                    key={course.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        daysLeft <= 7
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : 'bg-yellow-100 dark:bg-yellow-900/20'
                      }`}
                    >
                      <Calendar
                        className={`h-4 w-4 ${daysLeft <= 7 ? 'text-red-600' : 'text-yellow-600'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">{course.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={daysLeft <= 7 ? 'error' : 'warning'} badgeStyle="solid">
                          {daysLeft} days left
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {course.progress}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <Button variant="ghost" asChild>
            <Link href="/courses">
              Browse All Courses
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(course.difficulty)} badgeStyle="outline">
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration} hours</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {course.enrolledCount} enrolled
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>
                      View Course
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-brand-blue">{stats.averageScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">Average Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-brand-green">{stats.completionRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <p className="text-3xl font-bold text-yellow-500">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground mt-1">Day Learning Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tenant Admin/Manager Dashboard Component
function TenantAdminDashboard() {
  const { useDashboardMetrics, useTenantRiskStats, usePhishingTenantStats } = useAnalytics();
  const { data, isLoading, isError, refetch } = useDashboardMetrics();
  const { data: riskStats } = useTenantRiskStats();
  const { data: phishingStats } = usePhishingTenantStats();

  if (isLoading) {
    return <TenantAdminDashboardSkeleton />;
  }

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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cybersecurity training platform</p>
      </div>

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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

        <PieChartCard
          title="Risk Distribution"
          description="User risk levels across platform"
          data={riskDistributionData}
          height={300}
        />
      </div>

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

      <div className="mt-6">
        <ActivityFeed phishingStats={phishingStats} />
      </div>
    </div>
  );
}

// Super Admin Dashboard Component
function SuperAdminDashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  // Mock data for super admin - will be replaced with real API calls
  const platformStats = {
    activeTenants: 12,
    totalUsers: 2450,
    monthlyRevenue: 48750,
    platformHealth: 98.5,
  };

  const tenantGrowthData = [
    { month: 'Jan', tenants: 8, revenue: 32000 },
    { month: 'Feb', tenants: 9, revenue: 36000 },
    { month: 'Mar', tenants: 10, revenue: 40000 },
    { month: 'Apr', tenants: 10, revenue: 40000 },
    { month: 'May', tenants: 11, revenue: 44000 },
    { month: 'Jun', tenants: 12, revenue: 48750 },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'tenant',
      message: 'New tenant "Acme Corp" created',
      timestamp: '10 minutes ago',
    },
    {
      id: '2',
      type: 'revenue',
      message: 'Subscription payment received from TechStart Inc',
      timestamp: '1 hour ago',
    },
    {
      id: '3',
      type: 'alert',
      message: 'Platform uptime restored to 99.9%',
      timestamp: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Administration</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.firstName} {user.lastName} • Multi-tenant oversight and management
        </p>
      </div>

      {/* Key Platform Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Tenants"
          value={platformStats.activeTenants}
          subtitle="Organizations on platform"
          trend={{ value: 20, isPositive: true, label: 'vs last month' }}
          icon={Building2}
          variant="primary"
          animate
        />
        <MetricCard
          title="Total Users"
          value={platformStats.totalUsers.toLocaleString()}
          subtitle="Across all tenants"
          trend={{ value: 15.5, isPositive: true, label: 'vs last month' }}
          icon={Users}
          variant="success"
          animate
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${(platformStats.monthlyRevenue / 1000).toFixed(1)}K`}
          subtitle="MRR this month"
          trend={{ value: 12.8, isPositive: true, label: 'vs last month' }}
          icon={DollarSign}
          variant="warning"
          animate
        />
        <MetricCard
          title="Platform Health"
          value={`${platformStats.platformHealth}%`}
          subtitle="System uptime"
          icon={CheckCircle2}
          variant="success"
          animate
        />
      </div>

      {/* Growth Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AreaChartCard
          title="Platform Growth"
          description="Tenant growth over time"
          data={tenantGrowthData}
          xAxisKey="month"
          dataKeys={[{ key: 'tenants', name: 'Tenants', color: '#3B8EDE' }]}
          height={300}
        />

        <AreaChartCard
          title="Revenue Growth"
          description="Monthly recurring revenue"
          data={tenantGrowthData}
          xAxisKey="month"
          dataKeys={[{ key: 'revenue', name: 'Revenue ($)', color: '#8CB841' }]}
          height={300}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-brand-blue hover:bg-brand-blue/90" asChild>
              <Link href="/admin/tenants">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Tenants
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/revenue">
                <DollarSign className="mr-2 h-4 w-4" />
                Revenue Analytics
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/certificate-templates">
                <Award className="mr-2 h-4 w-4" />
                Certificate Templates
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard - Role-aware
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  // Loading state - show appropriate skeleton based on likely role
  if (!user) {
    return <TenantAdminDashboardSkeleton />;
  }

  // Show employee dashboard for USER role
  if (user.role === 'USER') {
    return <EmployeeDashboard />;
  }

  // Show super admin dashboard for SUPER_ADMIN
  if (user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  // Show tenant admin dashboard for TENANT_ADMIN, MANAGER, INSTRUCTOR
  return <TenantAdminDashboard />;
}
