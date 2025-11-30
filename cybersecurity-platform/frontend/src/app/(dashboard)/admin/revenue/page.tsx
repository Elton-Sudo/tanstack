'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/visualizations';
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface RevenueStats {
  mrr: number;
  arr: number;
  currency: string;
  mrrGrowth: number;
  arrGrowth: number;
}

interface PlanRevenue {
  plan: string;
  tenantCount: number;
  monthlyRevenue: number;
  annualRevenue: number;
  percentageOfTotal: number;
}

interface RevenueByMonth {
  month: string;
  revenue: number;
  newRevenue: number;
  churn: number;
  growth: number;
}

export default function RevenueDashboardPage() {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('1y');

  // Mock data - will be replaced with API calls
  const revenueStats: RevenueStats = {
    mrr: 215850,
    arr: 2590200,
    currency: 'ZAR',
    mrrGrowth: 8.3,
    arrGrowth: 8.3,
  };

  const planRevenue: PlanRevenue[] = [
    {
      plan: 'STARTER',
      tenantCount: 48,
      monthlyRevenue: 23952,
      annualRevenue: 287424,
      percentageOfTotal: 11.1,
    },
    {
      plan: 'PROFESSIONAL',
      tenantCount: 38,
      monthlyRevenue: 75962,
      annualRevenue: 911544,
      percentageOfTotal: 35.2,
    },
    {
      plan: 'ENTERPRISE',
      tenantCount: 14,
      monthlyRevenue: 139986,
      annualRevenue: 1679832,
      percentageOfTotal: 64.9,
    },
  ];

  const revenueByMonth: RevenueByMonth[] = [
    {
      month: 'Jun 2024',
      revenue: 198500,
      newRevenue: 12500,
      churn: 2500,
      growth: 5.3,
    },
    {
      month: 'Jul 2024',
      revenue: 203200,
      newRevenue: 15200,
      churn: 1500,
      growth: 2.4,
    },
    {
      month: 'Aug 2024',
      revenue: 208900,
      newRevenue: 11700,
      churn: 3000,
      growth: 2.8,
    },
    {
      month: 'Sep 2024',
      revenue: 212400,
      newRevenue: 14500,
      churn: 1000,
      growth: 1.7,
    },
    {
      month: 'Oct 2024',
      revenue: 218650,
      newRevenue: 18250,
      churn: 2000,
      growth: 2.9,
    },
    {
      month: 'Nov 2024',
      revenue: 215850,
      newRevenue: 9200,
      churn: 4000,
      growth: -1.3,
    },
  ];

  const metrics = {
    averageRevenuePerTenant: 2202,
    totalActiveSubscriptions: 98,
    churnRate: 3.5,
    retentionRate: 96.5,
    lifetimeValue: 28460,
    paymentSuccessRate: 98.2,
  };

  const recentTransactions = [
    {
      id: '1',
      tenantName: 'Acme Corporation',
      amount: 1999,
      plan: 'PROFESSIONAL',
      status: 'PAID',
      date: '2024-11-28',
    },
    {
      id: '2',
      tenantName: 'Enterprise Systems Ltd',
      amount: 9999,
      plan: 'ENTERPRISE',
      status: 'PAID',
      date: '2024-11-27',
    },
    {
      id: '3',
      tenantName: 'TechStart Solutions',
      amount: 499,
      plan: 'STARTER',
      status: 'PAID',
      date: '2024-11-27',
    },
    {
      id: '4',
      tenantName: 'GlobalTech Inc',
      amount: 9999,
      plan: 'ENTERPRISE',
      status: 'FAILED',
      date: '2024-11-26',
    },
    {
      id: '5',
      tenantName: 'DataFlow Analytics',
      amount: 1999,
      plan: 'PROFESSIONAL',
      status: 'PENDING',
      date: '2024-11-26',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Track revenue metrics, subscriptions, and financial performance
          </p>
        </div>
        <div className="flex gap-2">
          {(['6m', '1y', 'all'] as const).map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? 'primary' : 'default'}
              badgeStyle={timeRange === range ? 'solid' : 'outline'}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === '6m' ? '6 Months' : range === '1y' ? '1 Year' : 'All Time'}
            </Badge>
          ))}
          <Button variant="outline" className="ml-2">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="MRR"
          value={formatCurrency(revenueStats.mrr)}
          subtitle="Monthly Recurring Revenue"
          trend={{
            value: revenueStats.mrrGrowth,
            isPositive: revenueStats.mrrGrowth > 0,
            label: 'vs last month',
          }}
          icon={DollarSign}
          variant="success"
          animate
        />
        <MetricCard
          title="ARR"
          value={formatCurrency(revenueStats.arr)}
          subtitle="Annual Recurring Revenue"
          trend={{
            value: revenueStats.arrGrowth,
            isPositive: revenueStats.arrGrowth > 0,
            label: 'annualized',
          }}
          icon={TrendingUp}
          variant="success"
          animate
        />
        <MetricCard
          title="Churn Rate"
          value={`${metrics.churnRate}%`}
          subtitle="Monthly customer churn"
          trend={{
            value: 1.2,
            isPositive: true,
            label: 'improvement',
          }}
          icon={TrendingDown}
          variant="warning"
          animate
        />
        <MetricCard
          title="Avg Revenue/Tenant"
          value={formatCurrency(metrics.averageRevenuePerTenant)}
          subtitle="Per active tenant"
          icon={CreditCard}
          variant="neutral"
          animate
        />
      </div>

      {/* Revenue Breakdown by Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Tenants</th>
                  <th className="pb-3 font-medium">Monthly Revenue</th>
                  <th className="pb-3 font-medium">Annual Revenue</th>
                  <th className="pb-3 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {planRevenue.map((item) => (
                  <tr key={item.plan} className="text-sm hover:bg-accent/50">
                    <td className="py-4">
                      <Badge className={getPlanColor(item.plan)}>{item.plan}</Badge>
                    </td>
                    <td className="py-4 font-medium">{item.tenantCount}</td>
                    <td className="py-4 font-semibold">{formatCurrency(item.monthlyRevenue)}</td>
                    <td className="py-4 text-muted-foreground">
                      {formatCurrency(item.annualRevenue)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{item.percentageOfTotal}%</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{ width: `${item.percentageOfTotal}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-accent/30">
                  <td className="py-4">Total</td>
                  <td className="py-4">{planRevenue.reduce((sum, p) => sum + p.tenantCount, 0)}</td>
                  <td className="py-4 text-brand-green">
                    {formatCurrency(planRevenue.reduce((sum, p) => sum + p.monthlyRevenue, 0))}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {formatCurrency(planRevenue.reduce((sum, p) => sum + p.annualRevenue, 0))}
                  </td>
                  <td className="py-4">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Month</th>
                  <th className="pb-3 font-medium">Total Revenue</th>
                  <th className="pb-3 font-medium">New Revenue</th>
                  <th className="pb-3 font-medium">Churn</th>
                  <th className="pb-3 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {revenueByMonth.map((item) => (
                  <tr key={item.month} className="text-sm hover:bg-accent/50">
                    <td className="py-4 font-medium">{item.month}</td>
                    <td className="py-4 font-semibold">{formatCurrency(item.revenue)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-brand-green" />
                        <span className="text-brand-green">{formatCurrency(item.newRevenue)}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">{formatCurrency(item.churn)}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {item.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-brand-green" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={item.growth >= 0 ? 'text-brand-green' : 'text-red-600'}>
                          {item.growth >= 0 ? '+' : ''}
                          {item.growth}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Active Subscriptions</span>
              <span className="text-lg font-semibold">{metrics.totalActiveSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Retention Rate</span>
              <span className="text-lg font-semibold text-brand-green">
                {metrics.retentionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
              <span className="text-lg font-semibold">{formatCurrency(metrics.lifetimeValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Success Rate</span>
              <span className="text-lg font-semibold text-brand-green">
                {metrics.paymentSuccessRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between pb-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.tenantName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPlanColor(transaction.plan)} badgeStyle="outline">
                        {transaction.plan}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{transaction.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(transaction.amount)}</p>
                    <Badge className={getStatusColor(transaction.status)} badgeStyle="solid">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
