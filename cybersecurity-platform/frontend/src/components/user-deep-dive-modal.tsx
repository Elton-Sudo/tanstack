'use client';

import { RiskScoreWithUser } from '@/types/analytics';
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Mail,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface UserDeepDiveModalProps {
  user: RiskScoreWithUser;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDeepDiveModal({ user, isOpen, onClose }: UserDeepDiveModalProps) {
  if (!isOpen) return null;

  // Prepare radar chart data
  const radarData = [
    { category: 'Phishing Awareness', score: user.phishingScore, fullMark: 100 },
    { category: 'Training Completion', score: user.trainingCompletionScore, fullMark: 100 },
    { category: 'Recent Training', score: user.timeSinceTrainingScore, fullMark: 100 },
    { category: 'Quiz Performance', score: user.quizPerformanceScore, fullMark: 100 },
    { category: 'Security Incidents', score: user.securityIncidentScore, fullMark: 100 },
    { category: 'Login Security', score: user.loginAnomalyScore, fullMark: 100 },
  ];

  // Component scores for pie chart
  const componentScores = [
    { name: 'Phishing', value: user.phishingScore, color: '#3B82F6' },
    { name: 'Training', value: user.trainingCompletionScore, color: '#10B981' },
    { name: 'Recency', value: user.timeSinceTrainingScore, color: '#F59E0B' },
    { name: 'Quiz', value: user.quizPerformanceScore, color: '#8B5CF6' },
    { name: 'Incidents', value: user.securityIncidentScore, color: '#EF4444' },
    { name: 'Login', value: user.loginAnomalyScore, color: '#6366F1' },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-brand-green';
    if (score >= 60) return 'text-brand-orange';
    return 'text-brand-red';
  };

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-brand-green/10 border-brand-green/20';
    if (score >= 60) return 'bg-brand-orange/10 border-brand-orange/20';
    return 'bg-brand-red/10 border-brand-red/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold text-lg">
                {user.user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.user.email}</p>
                {user.user.department && (
                  <p className="text-xs text-muted-foreground mt-0.5">{user.user.department}</p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overall Risk Score */}
          <div className={`rounded-lg border p-6 ${getRiskBg(user.overallScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Overall Risk Score</p>
                <p className={`text-5xl font-bold ${getRiskColor(user.overallScore)}`}>
                  {Math.round(user.overallScore)}
                </p>
                <p className="text-sm font-semibold mt-2">{user.riskLevel} RISK</p>
              </div>
              <div className="text-right">
                <Shield
                  className={`h-16 w-16 ${getRiskColor(user.overallScore)}`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Component Scores Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-brand-blue" />
                <span className="text-xs font-medium text-muted-foreground">Phishing</span>
              </div>
              <p className={`text-2xl font-bold ${getRiskColor(user.phishingScore)}`}>
                {Math.round(user.phishingScore)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-brand-green" />
                <span className="text-xs font-medium text-muted-foreground">Training</span>
              </div>
              <p className={`text-2xl font-bold ${getRiskColor(user.trainingCompletionScore)}`}>
                {Math.round(user.trainingCompletionScore)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-brand-orange" />
                <span className="text-xs font-medium text-muted-foreground">Recency</span>
              </div>
              <p className={`text-2xl font-bold ${getRiskColor(user.timeSinceTrainingScore)}`}>
                {Math.round(user.timeSinceTrainingScore)}
              </p>
            </div>
          </div>

          {/* Visualizations */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Profile Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="var(--brand-blue)"
                    fill="var(--brand-blue)"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={componentScores}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${Math.round(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {componentScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-orange" />
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {user.recommendations && user.recommendations.length > 0 ? (
                user.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="rounded-full bg-brand-blue/10 p-2">
                      {index % 2 === 0 ? (
                        <TrendingUp className="h-4 w-4 text-brand-blue" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-brand-green" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rec}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific recommendations at this time. Keep up the good work!
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-lg border bg-brand-blue text-white px-4 py-3 font-medium hover:bg-brand-blue/90 transition-colors">
              Assign Training
            </button>
            <button className="flex-1 rounded-lg border px-4 py-3 font-medium hover:bg-accent transition-colors">
              Send Phishing Test
            </button>
            <button className="flex-1 rounded-lg border px-4 py-3 font-medium hover:bg-accent transition-colors">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
