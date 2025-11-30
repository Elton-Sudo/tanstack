'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/visualizations';
import {
  Activity,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  expiredTenants: number;
  newTenantsLast30Days: number;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  averageUsersPerTenant: number;
  averageCoursesPerTenant: number;
}

interface RevenueStats {
  mrr: number;
  arr: number;
  currency: string;
  churnRate: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
}

interface PlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

export default function PlatformAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data - will be replaced with API calls
  const platformStats: PlatformStats = {
    totalTenants: 127,
    activeTenants: 98,
    trialTenants: 15,
    suspendedTenants: 8,
    expiredTenants: 6,
    newTenantsLast30Days: 23,
    totalUsers: 3420,
    totalCourses: 856,
    totalEnrollments: 12850,
    averageUsersPerTenant: 27,
    averageCoursesPerTenant: 7,
  };

  const revenueStats: RevenueStats = {
    mrr: 215850,
    arr: 2590200,
    currency: 'ZAR',
    churnRate: 3.5,
    activeSubscriptions: 98,
    trialSubscriptions: 15,
  };

  const planDistribution: PlanDistribution[] = [
    { plan: 'FREE', count: 12, percentage: 9.4 },
    { plan: 'TRIAL', count: 15, percentage: 11.8 },
    { plan: 'STARTER', count: 48, percentage: 37.8 },
    { plan: 'PROFESSIONAL', count: 38, percentage: 29.9 },
    { plan: 'ENTERPRISE', count: 14, percentage: 11.0 },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'new_tenant',
      message: 'New tenant registered: Acme Corp',
      timestamp: '2 minutes ago',
    },
    {
      id: 2,
      type: 'upgrade',
      message: 'TechStart upgraded to PROFESSIONAL',
      timestamp: '15 minutes ago',
    },
    {
      id: 3,
      type: 'suspension',
      message: 'GlobalTech suspended (payment failed)',
      timestamp: '1 hour ago',
    },
    {
      id: 4,
      type: 'new_tenant',
      message: 'New tenant registered: DataFlow Inc',
      timestamp: '2 hours ago',
    },
    {
      id: 5,
      type: 'downgrade',
      message: 'SmallBiz downgraded to STARTER',
      timestamp: '3 hours ago',
    },
  ];

  const upcomingExpirations = [
    {
      id: '1',
      tenantName: 'SecureNet Solutions',
      plan: 'PROFESSIONAL',
      expiresIn: '2 days',
      expiresAt: '2024-12-02',
    },
    {
      id: '2',
      tenantName: 'CyberGuard Inc',
      plan: 'ENTERPRISE',
      expiresIn: '5 days',
      expiresAt: '2024-12-05',
    },
    {
      id: '3',
      tenantName: 'DataShield Corp',
      plan: 'STARTER',
      expiresIn: '7 days',
      expiresAt: '2024-12-07',
    },
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'TRIAL':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor platform-wide metrics, revenue, and tenant activity
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? 'primary' : 'default'}
              badgeStyle={timeRange === range ? 'solid' : 'outline'}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
                  : range === '90d'
                    ? '90 Days'
                    : '1 Year'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/tenants">
          <MetricCard
            title="Total Tenants"
            value={platformStats.totalTenants}
            subtitle={`${platformStats.newTenantsLast30Days} new this month`}
            trend={{
              value: 18.2,
              isPositive: true,
              label: 'vs last month',
            }}
            icon={Building2}
            variant="primary"
            animate
          />
        </Link>
        <MetricCard
          title="Active Tenants"
          value={platformStats.activeTenants}
          subtitle={`${((platformStats.activeTenants / platformStats.totalTenants) * 100).toFixed(1)}% of total`}
          icon={Activity}
          variant="success"
          animate
        />
        <MetricCard
          title="Total Users"
          value={platformStats.totalUsers}
          subtitle={`Avg ${platformStats.averageUsersPerTenant} per tenant`}
          trend={{
            value: 12.5,
            isPositive: true,
            label: 'vs last month',
          }}
          icon={Users}
          variant="neutral"
          animate
        />
        <Link href="/admin/revenue">
          <MetricCard
            title="MRR"
            value={formatCurrency(revenueStats.mrr)}
            subtitle="Monthly Recurring Revenue"
            trend={{
              value: 8.3,
              isPositive: true,
              label: 'vs last month',
            }}
            icon={DollarSign}
            variant="success"
            animate
          />
        </Link>
      </div>

      {/* Revenue & Churn */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(revenueStats.mrr)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                  <span className="text-sm text-brand-green font-medium">+8.3%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Annual Recurring Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(revenueStats.arr)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                  <span className="text-sm text-brand-green font-medium">+8.3%</span>
                  <span className="text-sm text-muted-foreground">annualized</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Churn Rate</p>
                <p className="text-3xl font-bold">{revenueStats.churnRate}%</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingDown className="h-4 w-4 text-brand-green" />
                  <span className="text-sm text-brand-green font-medium">-1.2%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active</span>
                <span className="text-sm text-muted-foreground">
                  {revenueStats.activeSubscriptions}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-green rounded-full"
                  style={{
                    width: `${(revenueStats.activeSubscriptions / platformStats.totalTenants) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trial</span>
                <span className="text-sm text-muted-foreground">
                  {revenueStats.trialSubscriptions}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${(revenueStats.trialSubscriptions / platformStats.totalTenants) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Suspended</span>
                <span className="text-sm text-muted-foreground">
                  {platformStats.suspendedTenants}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${(platformStats.suspendedTenants / platformStats.totalTenants) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {planDistribution.map((item) => (
              <div key={item.plan} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className={getPlanColor(item.plan)}>{item.plan}</Badge>
                  </div>
                  <span className="text-muted-foreground">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-blue rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/admin/tenants">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'new_tenant' ? (
                      <Building2 className="h-4 w-4 text-brand-blue" />
                    ) : activity.type === 'upgrade' ? (
                      <TrendingUp className="h-4 w-4 text-brand-green" />
                    ) : activity.type === 'suspension' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Expirations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Upcoming Subscription Expirations
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tenants with subscriptions expiring in the next 7 days
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/tenants?filter=expiring">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Tenant Name</th>
                  <th className="pb-3 font-medium">Current Plan</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {upcomingExpirations.map((tenant) => (
                  <tr key={tenant.id} className="text-sm hover:bg-accent/50">
                    <td className="py-4 font-medium">{tenant.tenantName}</td>
                    <td className="py-4">
                      <Badge className={getPlanColor(tenant.plan)}>{tenant.plan}</Badge>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-yellow-600">{tenant.expiresIn}</p>
                        <p className="text-xs text-muted-foreground">{tenant.expiresAt}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <Button variant="outline" size="sm">
                        Send Reminder
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="bg-brand-blue hover:bg-brand-blue/90" asChild>
              <Link href="/admin/tenants/new">
                <Building2 className="mr-2 h-4 w-4" />
                Add Tenant
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/tenants">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Tenants
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/revenue">
                <DollarSign className="mr-2 h-4 w-4" />
                Revenue Reports
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/settings">
                <Activity className="mr-2 h-4 w-4" />
                Platform Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
