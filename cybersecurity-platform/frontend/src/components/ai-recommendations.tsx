'use client';

import { TenantRiskStats } from '@/types/analytics';
import { Brain, Lightbulb, TrendingUp, Users, AlertCircle, Target } from 'lucide-react';
import { useMemo } from 'react';

interface AIRecommendationsProps {
  riskStats: TenantRiskStats;
  phishingClickRate: number;
}

export function AIRecommendations({ riskStats, phishingClickRate }: AIRecommendationsProps) {
  const recommendations = useMemo(() => {
    const insights = [];

    // High critical users
    if (riskStats.criticalRiskUsers > 0) {
      insights.push({
        id: 1,
        type: 'critical',
        icon: AlertCircle,
        title: 'Critical Risk Alert',
        description: `${riskStats.criticalRiskUsers} users require immediate intervention`,
        action: 'Schedule mandatory security training for critical risk users',
        impact: 'HIGH',
        priority: 1,
        confidence: 95,
      });
    }

    // Phishing click rate analysis
    if (phishingClickRate > 0.15) {
      insights.push({
        id: 2,
        type: 'warning',
        icon: Target,
        title: 'Elevated Phishing Vulnerability',
        description: `Click rate of ${(phishingClickRate * 100).toFixed(1)}% is above industry average (10%)`,
        action: 'Deploy advanced phishing awareness campaign',
        impact: 'HIGH',
        priority: 2,
        confidence: 88,
      });
    } else if (phishingClickRate > 0.1) {
      insights.push({
        id: 2,
        type: 'info',
        icon: Target,
        title: 'Moderate Phishing Awareness',
        description: `Click rate of ${(phishingClickRate * 100).toFixed(1)}% needs improvement`,
        action: 'Increase phishing simulation frequency',
        impact: 'MEDIUM',
        priority: 3,
        confidence: 82,
      });
    }

    // Department-specific insights
    const highRiskDepts = riskStats.departmentRiskScores.filter(
      (dept) => dept.averageRiskScore < 60,
    );
    if (highRiskDepts.length > 0) {
      insights.push({
        id: 3,
        type: 'warning',
        icon: Users,
        title: 'Department-Specific Training Needed',
        description: `${highRiskDepts.map((d) => d.departmentName).join(', ')} showing elevated risk`,
        action: 'Deploy targeted training modules for these departments',
        impact: 'MEDIUM',
        priority: 4,
        confidence: 90,
      });
    }

    // Positive trend
    if (riskStats.trendData && riskStats.trendData.length >= 2) {
      const latestScore = riskStats.trendData[riskStats.trendData.length - 1]?.averageScore || 0;
      const previousScore = riskStats.trendData[riskStats.trendData.length - 2]?.averageScore || 0;
      const improvement = latestScore - previousScore;

      if (improvement > 5) {
        insights.push({
          id: 4,
          type: 'success',
          icon: TrendingUp,
          title: 'Positive Security Trend',
          description: `Risk scores improved by ${improvement.toFixed(1)} points this month`,
          action: 'Continue current training programs and expand successful initiatives',
          impact: 'POSITIVE',
          priority: 5,
          confidence: 92,
        });
      }
    }

    // AI-powered pattern detection
    const totalUsers =
      riskStats.lowRiskUsers +
      riskStats.mediumRiskUsers +
      riskStats.highRiskUsers +
      riskStats.criticalRiskUsers;
    const highRiskPercentage =
      ((riskStats.highRiskUsers + riskStats.criticalRiskUsers) / totalUsers) * 100;

    if (highRiskPercentage > 25) {
      insights.push({
        id: 5,
        type: 'critical',
        icon: Brain,
        title: 'AI Pattern Alert: Organization-Wide Risk',
        description: `${highRiskPercentage.toFixed(1)}% of users are high/critical risk`,
        action: 'Launch organization-wide security awareness initiative',
        impact: 'HIGH',
        priority: 1,
        confidence: 94,
      });
    }

    // Gamification suggestion
    if (riskStats.lowRiskUsers > riskStats.highRiskUsers + riskStats.criticalRiskUsers) {
      insights.push({
        id: 6,
        type: 'info',
        icon: Lightbulb,
        title: 'Gamification Opportunity',
        description: 'Strong security culture detected - leverage peer competition',
        action: 'Implement department leaderboards and security champions program',
        impact: 'MEDIUM',
        priority: 6,
        confidence: 78,
      });
    }

    return insights.sort((a, b) => a.priority - b.priority);
  }, [riskStats, phishingClickRate]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-brand-red bg-brand-red/5';
      case 'warning':
        return 'border-l-brand-orange bg-brand-orange/5';
      case 'success':
        return 'border-l-brand-green bg-brand-green/5';
      default:
        return 'border-l-brand-blue bg-brand-blue/5';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      HIGH: 'bg-brand-red/10 text-brand-red',
      MEDIUM: 'bg-brand-orange/10 text-brand-orange',
      POSITIVE: 'bg-brand-green/10 text-brand-green',
    };
    return colors[impact as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/60 p-3">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
          <p className="text-sm text-muted-foreground">Smart insights based on pattern analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getTypeColor(rec.type)}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-full p-2 ${
                    rec.type === 'critical'
                      ? 'bg-brand-red/10'
                      : rec.type === 'warning'
                        ? 'bg-brand-orange/10'
                        : rec.type === 'success'
                          ? 'bg-brand-green/10'
                          : 'bg-brand-blue/10'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      rec.type === 'critical'
                        ? 'text-brand-red'
                        : rec.type === 'warning'
                          ? 'text-brand-orange'
                          : rec.type === 'success'
                            ? 'text-brand-green'
                            : 'text-brand-blue'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${getImpactBadge(rec.impact)}`}
                      >
                        {rec.impact}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded bg-muted/50 border border-dashed">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Recommended Action:
                    </p>
                    <p className="text-sm font-medium">{rec.action}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No immediate recommendations. Your security posture looks excellent!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
