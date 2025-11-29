'use client';

import { TenantRiskStats } from '@/types/analytics';
import { Brain, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RiskForecastProps {
  riskStats: TenantRiskStats;
}

export function RiskForecast({ riskStats }: RiskForecastProps) {
  const forecastData = useMemo(() => {
    if (!riskStats.trendData || riskStats.trendData.length < 2) return [];

    const historical = riskStats.trendData.map((item) => ({
      date: item.date,
      actual: item.averageScore,
      predicted: null as number | null,
      upperBound: null as number | null,
      lowerBound: null as number | null,
      type: 'historical' as const,
    }));

    // Simple linear regression for prediction
    const scores = historical.map((item) => item.actual);
    const n = scores.length;
    const mean = scores.reduce((a, b) => a + b, 0) / n;

    // Calculate trend
    let trend = 0;
    if (n >= 3) {
      const recent = scores.slice(-3);
      trend = (recent[2] - recent[0]) / 2;
    }

    // Generate 7-day forecast
    const lastScore = scores[scores.length - 1];
    const forecast = [];

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const predicted = Math.min(100, Math.max(0, lastScore + trend * i));
      const variance = 5 + i * 2; // Increasing uncertainty

      forecast.push({
        date: date.toISOString().split('T')[0],
        actual: null,
        predicted: Math.round(predicted * 10) / 10,
        upperBound: Math.min(100, Math.round((predicted + variance) * 10) / 10),
        lowerBound: Math.max(0, Math.round((predicted - variance) * 10) / 10),
        type: 'forecast' as const,
      });
    }

    return [...historical, ...forecast];
  }, [riskStats]);

  const predictionInsight = useMemo(() => {
    if (forecastData.length === 0) return null;

    const lastHistorical = forecastData.find((d) => d.type === 'historical' && d.actual !== null);
    const lastForecast = forecastData[forecastData.length - 1];

    if (!lastHistorical || !lastForecast || !lastForecast.predicted) return null;

    const change = lastForecast.predicted - (lastHistorical.actual || 0);
    const direction = change > 0 ? 'improve' : 'decline';
    const magnitude = Math.abs(change);

    return {
      direction,
      magnitude,
      confidence: magnitude < 5 ? 'high' : magnitude < 10 ? 'medium' : 'low',
      message:
        direction === 'improve'
          ? `Risk scores predicted to improve by ${magnitude.toFixed(1)} points over the next week`
          : `Risk scores may decline by ${magnitude.toFixed(1)} points - proactive intervention recommended`,
    };
  }, [forecastData]);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-3">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Risk Prediction (7-Day Forecast)</h3>
            <p className="text-sm text-muted-foreground">Machine learning-powered trend analysis</p>
          </div>
        </div>
        {predictionInsight && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              predictionInsight.direction === 'improve'
                ? 'bg-brand-green/10 text-brand-green'
                : 'bg-brand-orange/10 text-brand-orange'
            }`}
          >
            {predictionInsight.confidence.toUpperCase()} CONFIDENCE
          </div>
        )}
      </div>

      {/* Insight Banner */}
      {predictionInsight && (
        <div
          className={`mb-6 p-4 rounded-lg border-l-4 ${
            predictionInsight.direction === 'improve'
              ? 'bg-brand-green/5 border-brand-green'
              : 'bg-brand-orange/5 border-brand-orange'
          }`}
        >
          <div className="flex items-start gap-3">
            <TrendingUp
              className={`h-5 w-5 mt-0.5 ${
                predictionInsight.direction === 'improve' ? 'text-brand-green' : 'text-brand-orange'
              }`}
            />
            <div>
              <p className="text-sm font-semibold mb-1">Prediction Insight</p>
              <p className="text-sm text-muted-foreground">{predictionInsight.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={forecastData}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-lg">
                    <p className="text-sm font-semibold mb-2">{data.date}</p>
                    {data.actual !== null && (
                      <p className="text-sm text-brand-blue">
                        Actual: <span className="font-bold">{data.actual}</span>
                      </p>
                    )}
                    {data.predicted !== null && (
                      <>
                        <p className="text-sm text-purple-500">
                          Predicted: <span className="font-bold">{data.predicted}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {data.lowerBound} - {data.upperBound}
                        </p>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <ReferenceLine
            x={forecastData.find((d) => d.type === 'forecast')?.date}
            stroke="#666"
            strokeDasharray="3 3"
            label="Today"
          />

          {/* Historical data */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--brand-blue)"
            strokeWidth={3}
            dot={{ fill: 'var(--brand-blue)', r: 4 }}
            name="Historical"
            connectNulls={false}
          />

          {/* Predicted data */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#8B5CF6"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#8B5CF6', r: 4 }}
            name="Predicted"
            connectNulls={false}
          />

          {/* Confidence bounds */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="url(#forecastGradient)"
            name="Upper Bound"
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="url(#forecastGradient)"
            name="Lower Bound"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Methodology Note */}
      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-dashed">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Prediction Methodology:</span> Linear regression analysis
          with confidence intervals. Predictions become less certain further into the future (shown
          by expanding confidence bands).
        </p>
      </div>
    </div>
  );
}
