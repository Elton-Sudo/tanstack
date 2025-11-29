'use client';

import { ActivityFeed } from '@/components/activity-feed';
import { AIRecommendations } from '@/components/ai-recommendations';
import { RiskForecast } from '@/components/risk-forecast';
import { ServiceUnavailable } from '@/components/service-unavailable';
import { UserDeepDiveModal } from '@/components/user-deep-dive-modal';
import {
  AreaChartCard,
  BarChartCard,
  MetricCard,
  PieChartCard,
  RiskGauge,
} from '@/components/visualizations';
import { useAnalytics } from '@/hooks/use-analytics';
import { RiskScoreWithUser } from '@/types/analytics';
import {
  AlertTriangle,
  Brain,
  Download,
  FileText,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function RiskPage() {
  const { useTenantRiskStats, useHighRiskUsers, usePhishingTenantStats } = useAnalytics();
  const [selectedUser, setSelectedUser] = useState<RiskScoreWithUser | null>(null);

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
      { name: 'Low Risk', value: riskStats.lowRiskUsers, color: '#8CB841' },
      { name: 'Medium Risk', value: riskStats.mediumRiskUsers, color: '#F5C242' },
      { name: 'High Risk', value: riskStats.highRiskUsers, color: '#E86A33' },
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


  const handleExportPDF = () => {
    alert('PDF export functionality - would generate comprehensive risk report');
    // In production, this would call an API to generate PDF
  };

  const handleExportExcel = () => {
    alert('Excel export functionality - would export risk data to spreadsheet');
    // In production, this would call an API to export to Excel
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 hover:bg-accent transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export Excel</span>
          </button>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
        </div>
      </div>

      {/* Overall Risk Score & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Overall Risk Score - RiskGauge Component */}
        <div className="md:col-span-1">
          <RiskGauge
            score={overallRisk}
            title="Overall Risk Score"
            subtitle="Organization Security Posture"
            size={240}
          />
        </div>

        {/* Quick Stats Grid - MetricCard Components */}
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Critical Risk Users"
            value={riskStats?.criticalRiskUsers || 0}
            subtitle="Immediate action required"
            icon={AlertTriangle}
            variant="error"
            animate
          />

          <MetricCard
            title="High Risk Users"
            value={riskStats?.highRiskUsers || 0}
            subtitle="Intervention needed"
            icon={ShieldAlert}
            variant="warning"
            animate
          />

          <MetricCard
            title="Protected Users"
            value={riskStats?.lowRiskUsers || 0}
            subtitle="Excellent security posture"
            icon={ShieldCheck}
            variant="success"
            animate
          />

          <MetricCard
            title="Phishing Click Rate"
            value={
              phishingStats?.overallClickRate
                ? `${(phishingStats.overallClickRate * 100).toFixed(1)}%`
                : '0%'
            }
            subtitle={`${phishingStats?.totalSimulationsSent || 0} simulations sent`}
            icon={TrendingDown}
            variant="primary"
            animate
          />
        </div>
      </div>

      {/* AI Recommendations */}
      {riskStats && (
        <AIRecommendations
          riskStats={riskStats}
          phishingClickRate={phishingStats?.overallClickRate || 0}
        />
      )}

      {/* Predictive Forecast */}
      {riskStats && <RiskForecast riskStats={riskStats} />}

      {/* Risk Distribution & Live Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <PieChartCard
          title="Risk Distribution"
          description="User risk levels across platform"
          data={riskDistribution}
          height={300}
        />

        {/* Risk Trend Over Time */}
        <AreaChartCard
          title="Risk Trend (30 Days)"
          description="Average risk score over time"
          data={trendData}
          xAxisKey="date"
          dataKeys={[{ key: 'score', name: 'Average Risk Score', color: '#3B8EDE' }]}
          height={300}
        />
      </div>

      {/* Department Heatmap & Live Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Heatmap */}
        <BarChartCard
          title="Department Risk Heatmap"
          description="Average risk scores by department"
          data={departmentRiskData}
          xAxisKey="name"
          dataKeys={[{ key: 'score', name: 'Risk Score', color: '#3B8EDE' }]}
          height={300}
        />

        {/* Live Activity Feed */}
        <ActivityFeed phishingStats={phishingStats} />
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
                        <p className="text-xs text-muted-foreground mt-1">{user.user.department}</p>
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
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-brand-blue hover:text-white transition-colors"
                    >
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

      {/* User Deep Dive Modal */}
      {selectedUser && (
        <UserDeepDiveModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
