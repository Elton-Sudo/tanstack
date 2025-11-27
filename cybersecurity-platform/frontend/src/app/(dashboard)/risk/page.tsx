'use client';

import { ServiceUnavailable } from '@/components/service-unavailable';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  AlertTriangle,
  Brain,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function RiskPage() {
  const { useTenantRiskStats, useHighRiskUsers, usePhishingTenantStats } = useAnalytics();

  const {
    data: riskStats,
    isLoading: riskLoading,
    isError: riskError,
    refetch: refetchRisk,
  } = useTenantRiskStats();

  const {
    data: highRiskUsers,
    isLoading: usersLoading,
    isError: usersError,
  } = useHighRiskUsers();

  const {
    data: phishingStats,
    isLoading: phishingLoading,
    isError: phishingError,
  } = usePhishingTenantStats();

  const isLoading = riskLoading || usersLoading || phishingLoading;
  const isError = riskError || usersError || phishingError;

  // Calculate risk distribution for pie chart
  const riskDistribution = useMemo(() => {
    if (!riskStats) return [];
    return [
      { name: 'Low Risk', value: riskStats.lowRiskUsers, color: 'var(--brand-green)' },
      { name: 'Medium Risk', value: riskStats.mediumRiskUsers, color: 'var(--brand-orange)' },
      { name: 'High Risk', value: riskStats.highRiskUsers, color: 'var(--brand-red)' },
      { name: 'Critical', value: riskStats.criticalRiskUsers, color: '#8B0000' },
    ];
  }, [riskStats]);

  // Prepare department risk data for heatmap
  const departmentRiskData = useMemo(() => {
    if (!riskStats?.departmentRiskScores) return [];
    return riskStats.departmentRiskScores.map((dept) => ({
      name: dept.departmentName,
      score: dept.averageRiskScore,
      users: dept.userCount,
      highRisk: dept.highRiskCount,
      critical: dept.criticalRiskCount,
    }));
  }, [riskStats]);

  // Risk trend data
  const trendData = useMemo(() => {
    if (!riskStats?.trendData) return [];
    return riskStats.trendData.map((item) => ({
      date: item.date,
      score: item.averageScore,
      highRisk: item.highRiskCount,
      critical: item.criticalRiskCount,
    }));
  }, [riskStats]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'brand-green';
    if (score >= 60) return 'brand-orange';
    return 'brand-red';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { text: 'Low Risk', icon: ShieldCheck };
    if (score >= 60) return { text: 'Medium Risk', icon: Shield };
    return { text: 'High Risk', icon: ShieldAlert };
  };

  const getDepartmentColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Orange
    if (score >= 40) return '#EF4444'; // Red
    return '#8B0000'; // Dark red for critical
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Risk Dashboard</h1>
          <p className="text-muted-foreground">Loading risk analytics...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Risk Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time cybersecurity risk monitoring and threat visualization
          </p>
        </div>
        <ServiceUnavailable service="Analytics" onRetry={() => refetchRisk()} />
      </div>
    );
  }

  const overallRisk = riskStats?.averageRiskScore || 0;
  const riskLevel = getRiskLevel(overallRisk);
  const RiskIcon = riskLevel.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">AI Risk Dashboard</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Real-time cybersecurity risk monitoring and threat visualization
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Overall Risk Score & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Overall Risk Score - Professional Design */}
        <div className="md:col-span-1 rounded-lg border bg-gradient-to-br from-card to-card/50 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Overall Risk Score
            </h3>
            <RiskIcon className="h-5 w-5" style={{ color: `var(--${getRiskColor(overallRisk)})` }} />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Circular progress */}
              <svg className="h-40 w-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(overallRisk / 100) * 439.8} 439.8`}
                  className="transition-all duration-1000 ease-out"
                  style={{ color: `var(--${getRiskColor(overallRisk)})` }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{Math.round(overallRisk)}</span>
                <span className="text-xs text-muted-foreground font-medium">/ 100</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="font-semibold text-lg">{riskLevel.text}</p>
            <p className="text-xs text-muted-foreground mt-1">Organization Security Posture</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Critical Risk Users</p>
                <p className="text-3xl font-bold text-brand-red mt-1">
                  {riskStats?.criticalRiskUsers || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
              </div>
              <div className="rounded-full bg-brand-red/10 p-4">
                <AlertTriangle className="h-8 w-8 text-brand-red" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">High Risk Users</p>
                <p className="text-3xl font-bold text-brand-orange mt-1">
                  {riskStats?.highRiskUsers || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Intervention needed</p>
              </div>
              <div className="rounded-full bg-brand-orange/10 p-4">
                <ShieldAlert className="h-8 w-8 text-brand-orange" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Protected Users</p>
                <p className="text-3xl font-bold text-brand-green mt-1">
                  {riskStats?.lowRiskUsers || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Excellent security posture</p>
              </div>
              <div className="rounded-full bg-brand-green/10 p-4">
                <ShieldCheck className="h-8 w-8 text-brand-green" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Phishing Click Rate</p>
                <p className="text-3xl font-bold text-brand-blue mt-1">
                  {phishingStats?.overallClickRate
                    ? `${(phishingStats.overallClickRate * 100).toFixed(1)}%`
                    : '0%'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {phishingStats?.totalSimulationsSent || 0} simulations sent
                </p>
              </div>
              <div className="rounded-full bg-brand-blue/10 p-4">
                <TrendingDown className="h-8 w-8 text-brand-blue" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution & Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Trend Over Time */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-green" />
            Risk Trend (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--brand-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--brand-blue)"
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Average Risk Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Heatmap */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-brand-blue" />
          Department Risk Heatmap
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentRiskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-card p-4 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Average Score: <span className="font-bold">{data.score.toFixed(1)}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Users: <span className="font-bold">{data.users}</span>
                      </p>
                      <p className="text-sm text-brand-red">
                        High Risk: <span className="font-bold">{data.highRisk}</span>
                      </p>
                      <p className="text-sm text-red-900">
                        Critical: <span className="font-bold">{data.critical}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="score" name="Risk Score" radius={[8, 8, 0, 0]}>
              {departmentRiskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDepartmentColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* High Risk Users Table */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-brand-red" />
            High Risk Users - Immediate Attention Required
          </h3>
        </div>
        <div className="p-6">
          {highRiskUsers && highRiskUsers.length > 0 ? (
            <div className="space-y-3">
              {highRiskUsers.slice(0, 10).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-orange/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-brand-red" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.user.email}</p>
                      {user.user.department && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.user.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                      <p className="text-2xl font-bold text-brand-red">
                        {Math.round(user.overallScore)}
                      </p>
                      <p className="text-xs font-medium text-brand-red">{user.riskLevel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Phishing</p>
                      <p className="text-lg font-semibold">{Math.round(user.phishingScore)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Training</p>
                      <p className="text-lg font-semibold">
                        {Math.round(user.trainingCompletionScore)}
                      </p>
                    </div>
                    <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShieldCheck className="h-16 w-16 text-brand-green mx-auto mb-4" />
              <p className="text-lg font-semibold">Excellent Security Posture!</p>
              <p className="text-sm text-muted-foreground mt-2">
                No high-risk users detected at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
