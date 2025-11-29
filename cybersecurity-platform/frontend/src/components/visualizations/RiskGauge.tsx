/**
 * RiskGauge Component
 * Enhanced semi-circular gauge for risk scores
 * Features gradient fills and smooth animations
 */

'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface RiskGaugeProps {
  /**
   * Risk score (0-100)
   */
  score: number;
  /**
   * Size of the gauge in pixels
   */
  size?: number;
  /**
   * Show label below gauge
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Get risk level and color based on score
 */
const getRiskLevel = (score: number) => {
  if (score >= 80) return { level: 'Critical', color: '#E86A33', gradient: ['#E86A33', '#C4460D'] };
  if (score >= 60) return { level: 'High', color: '#F5C242', gradient: ['#F5C242', '#E3AF24'] };
  if (score >= 40) return { level: 'Medium', color: '#3B8EDE', gradient: ['#3B8EDE', '#2D7ACC'] };
  if (score >= 20) return { level: 'Low', color: '#8CB841', gradient: ['#8CB841', '#74A034'] };
  return { level: 'Very Low', color: '#8CB841', gradient: ['#8CB841', '#74A034'] };
};

/**
 * RiskGauge
 * Semi-circular gauge visualization for risk scores
 * Features:
 * - Gradient background track
 * - Animated progress arc
 * - Dynamic color based on risk level
 * - Center score display
 */
export default function RiskGauge({
  score,
  size = 200,
  showLabel = true,
  label,
  className,
}: RiskGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const riskData = getRiskLevel(normalizedScore);
  const rotation = -90 + (normalizedScore / 100) * 180;

  const center = size / 2;
  const radius = (size * 0.8) / 2;
  const strokeWidth = size * 0.1;

  // Create arc path for semi-circle
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          <defs>
            <linearGradient id={`riskGradient-${normalizedScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={riskData.gradient[0]} stopOpacity="1" />
              <stop offset="100%" stopColor={riskData.gradient[1]} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={createArc(0, 180)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted opacity-20"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d={createArc(0, (normalizedScore / 100) * 180)}
            fill="none"
            stroke={`url(#riskGradient-${normalizedScore})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'all 0.6s ease-in-out',
            }}
          />
        </svg>

        {/* Center score display */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{ bottom: '10px' }}
        >
          <div className="text-4xl font-bold" style={{ color: riskData.color }}>
            {Math.round(normalizedScore)}
          </div>
          <div className="text-xs font-medium text-muted-foreground">Risk Score</div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-center">
          <div
            className="text-sm font-semibold"
            style={{ color: riskData.color }}
          >
            {label || riskData.level}
          </div>
        </div>
      )}
    </div>
  );
}
