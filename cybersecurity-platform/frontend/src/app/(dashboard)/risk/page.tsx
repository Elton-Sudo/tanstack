'use client';

import { AlertTriangle, Shield, TrendingDown, TrendingUp, Users } from 'lucide-react';

export default function RiskPage() {
  // Mock data
  const overallRisk = 68;
  const riskCategories = [
    { name: 'Email Security', score: 72, trend: 'up', change: '+5' },
    { name: 'Password Practices', score: 85, trend: 'down', change: '-3' },
    { name: 'Data Handling', score: 65, trend: 'up', change: '+8' },
    { name: 'Device Security', score: 58, trend: 'up', change: '+12' },
  ];

  const highRiskUsers = [
    { name: 'John Doe', department: 'Sales', score: 45, issues: 3 },
    { name: 'Jane Smith', department: 'Marketing', score: 52, issues: 2 },
    { name: 'Bob Johnson', department: 'IT', score: 58, issues: 2 },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'brand-green';
    if (score >= 60) return 'brand-orange';
    return 'brand-red';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        <p className="text-muted-foreground">
          Monitor and manage cybersecurity risks across your organization
        </p>
      </div>

      {/* Overall Risk Score */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Risk Score</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(overallRisk / 100) * 351.858} 351.858`}
                  className={`text-${getRiskColor(overallRisk)}`}
                  style={{ color: `var(--${getRiskColor(overallRisk)})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{overallRisk}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 font-medium">{getRiskLevel(overallRisk)}</p>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Users</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="rounded-full bg-brand-red/10 p-3">
                <AlertTriangle className="h-6 w-6 text-brand-red" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protected Users</p>
                <p className="text-2xl font-bold">243</p>
              </div>
              <div className="rounded-full bg-brand-green/10 p-3">
                <Shield className="h-6 w-6 text-brand-green" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidents (30d)</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="rounded-full bg-brand-orange/10 p-3">
                <TrendingUp className="h-6 w-6 text-brand-orange" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold">+5%</p>
              </div>
              <div className="rounded-full bg-brand-blue/10 p-3">
                <TrendingDown className="h-6 w-6 text-brand-blue" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk by Category */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Risk by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {riskCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`flex items-center space-x-1 ${
                        category.trend === 'up' ? 'text-brand-green' : 'text-brand-red'
                      }`}
                    >
                      {category.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{category.change}</span>
                    </span>
                    <span className="font-bold">{category.score}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${category.score}%`,
                      backgroundColor: `var(--${getRiskColor(category.score)})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Users */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">High Risk Users</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {highRiskUsers.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="font-bold text-brand-red">{user.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Issues</p>
                    <p className="font-bold">{user.issues}</p>
                  </div>
                  <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
