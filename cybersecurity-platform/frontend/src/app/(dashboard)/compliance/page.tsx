'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AreaChartCard, BarChartCard, MetricCard, ProgressRing } from '@/components/visualizations';
import { AlertTriangle, CheckCircle2, FileText, Shield, TrendingUp } from 'lucide-react';

export default function CompliancePage() {
  // Mock data
  const frameworks = [
    {
      id: 1,
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      compliance: 85,
      status: 'compliant',
      requirements: 12,
      met: 10,
    },
    {
      id: 2,
      name: 'ISO 27001',
      description: 'Information Security Management',
      compliance: 72,
      status: 'in-progress',
      requirements: 15,
      met: 11,
    },
    {
      id: 3,
      name: 'SOC 2',
      description: 'Service Organization Control',
      compliance: 65,
      status: 'at-risk',
      requirements: 10,
      met: 7,
    },
  ];

  // Compliance trend data
  const complianceTrendData = [
    { month: 'Jan', gdpr: 75, iso27001: 65, soc2: 55 },
    { month: 'Feb', gdpr: 78, iso27001: 67, soc2: 58 },
    { month: 'Mar', gdpr: 80, iso27001: 68, soc2: 60 },
    { month: 'Apr', gdpr: 82, iso27001: 70, soc2: 62 },
    { month: 'May', gdpr: 84, iso27001: 71, soc2: 64 },
    { month: 'Jun', gdpr: 85, iso27001: 72, soc2: 65 },
  ];

  // Framework comparison data
  const frameworkComparisonData = frameworks.map((fw) => ({
    name: fw.name,
    compliance: fw.compliance,
    requirements: fw.requirements,
    met: fw.met,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'at-risk':
        return 'danger';
      default:
        return 'default';
    }
  };

  const totalFrameworks = frameworks.length;
  const compliantFrameworks = frameworks.filter((f) => f.status === 'compliant').length;
  const inProgressFrameworks = frameworks.filter((f) => f.status === 'in-progress').length;
  const atRiskFrameworks = frameworks.filter((f) => f.status === 'at-risk').length;
  const averageCompliance = Math.round(
    frameworks.reduce((sum, f) => sum + f.compliance, 0) / frameworks.length,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Overview</h1>
        <p className="text-muted-foreground">
          Track your organization's compliance with various security frameworks
        </p>
      </div>

      {/* Summary Metrics with new MetricCard components */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Compliance"
          value={`${averageCompliance}%`}
          subtitle="Average across all frameworks"
          trend={{ value: 5.2, isPositive: true, label: 'vs last month' }}
          icon={TrendingUp}
          variant="primary"
          animate
        />
        <MetricCard
          title="Compliant Frameworks"
          value={compliantFrameworks}
          subtitle={`${compliantFrameworks} of ${totalFrameworks} frameworks`}
          icon={CheckCircle2}
          variant="success"
          animate
        />
        <MetricCard
          title="In Progress"
          value={inProgressFrameworks}
          subtitle="Actively working on compliance"
          icon={AlertTriangle}
          variant="warning"
          animate
        />
        <MetricCard
          title="At Risk"
          value={atRiskFrameworks}
          subtitle="Require immediate attention"
          icon={Shield}
          variant="error"
          animate
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Trend Chart */}
        <AreaChartCard
          title="Compliance Trend"
          description="Progress over the last 6 months"
          data={complianceTrendData}
          xAxisKey="month"
          dataKeys={[
            { key: 'gdpr', name: 'GDPR', color: '#8CB841' },
            { key: 'iso27001', name: 'ISO 27001', color: '#3B8EDE' },
            { key: 'soc2', name: 'SOC 2', color: '#F5C242' },
          ]}
          height={300}
        />

        {/* Framework Comparison Chart */}
        <BarChartCard
          title="Framework Comparison"
          description="Requirements met vs total requirements"
          data={frameworkComparisonData}
          xAxisKey="name"
          dataKeys={[
            { key: 'met', name: 'Requirements Met', color: '#8CB841' },
            { key: 'requirements', name: 'Total Requirements', color: '#3B8EDE' },
          ]}
          height={300}
        />
      </div>

      {/* Frameworks Detail Cards */}
      <div className="space-y-4">
        {frameworks.map((framework) => (
          <Card key={framework.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-brand-blue/10 p-3">
                    <Shield className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{framework.name}</CardTitle>
                      <Badge variant={getStatusColor(framework.status) as any}>
                        {framework.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{framework.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressRing
                    progress={framework.compliance}
                    size={80}
                    strokeWidth={8}
                    showLabel
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-1">Requirements Met</p>
                  <p className="text-2xl font-bold">
                    {framework.met}/{framework.requirements}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
                  <p className="text-2xl font-bold">{framework.compliance}%</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-1">Pending Items</p>
                  <p className="text-2xl font-bold">{framework.requirements - framework.met}</p>
                </div>
              </div>
              <Progress value={framework.compliance} className="h-2" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Last updated: 2 days ago</span>
                </div>
                <button className="text-sm font-medium text-brand-blue hover:underline flex items-center gap-1">
                  View Details
                  <span>→</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
