/**
 * AreaChartCard Component
 * Card wrapper for Recharts AreaChart with gradient fills
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  axisConfig,
  cartesianGridConfig,
  getColorByIndex,
  tooltipConfig,
} from '@/lib/chart-config';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface AreaChartCardProps {
  /**
   * Chart title
   */
  title: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Chart data
   */
  data: Array<Record<string, any>>;
  /**
   * X-axis data key
   */
  xAxisKey: string;
  /**
   * Y-axis data keys (supports multiple areas)
   */
  dataKeys: Array<{ key: string; name: string; color?: string }>;
  /**
   * Chart height in pixels
   */
  height?: number;
  /**
   * Show grid lines
   */
  showGrid?: boolean;
  /**
   * Additional actions in header
   */
  actions?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AreaChartCard
 * Professional area chart wrapped in a card with gradient fills
 * Features:
 * - Multi-series support
 * - Gradient fills
 * - Consistent brand colors
 * - Responsive design
 * - Custom tooltips
 */
export default function AreaChartCard({
  title,
  description,
  data,
  xAxisKey,
  dataKeys,
  height = 300,
  showGrid = true,
  actions,
  className,
}: AreaChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              {dataKeys.map((item, index) => {
                const color = item.color || getColorByIndex(index);
                return (
                  <linearGradient
                    key={item.key}
                    id={`gradient-${item.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
            </defs>
            {showGrid && <CartesianGrid {...cartesianGridConfig} />}
            <XAxis dataKey={xAxisKey} {...axisConfig} />
            <YAxis {...axisConfig} />
            <Tooltip {...tooltipConfig} contentStyle={tooltipConfig.contentStyle} />
            {dataKeys.map((item, index) => {
              const color = item.color || getColorByIndex(index);
              return (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${item.key})`}
                  animationDuration={750}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
